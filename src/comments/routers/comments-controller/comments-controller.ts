import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {CommentsService} from "../../application/comments.service";
import {CommentQueryService} from "../../application/comment.query.service";
import {
    CreateCommentsByPostRequestPayload
} from "../request-payloads/create-comment-request.payload";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {
    CreateCommentsByPostCommand
} from "../../application/command-handlers/comment-command";
import {errorHandler} from "../../../core/errors/errors.handler";
import {
    CommentListRequestPayload
} from "../request-payloads/comment-list-request.payload";
import {
    UpdateCommentRequestPayload
} from "../request-payloads/update-comment-request.payload";
import {ResultStatus} from "../../../common/result/resultCode";
import {
    resultCodeToHttpException
} from "../../../common/result/resultCodeToHttpException";




@injectable()
export class CommentsController {
    constructor(@inject(CommentsService) private commentsService: CommentsService,
                @inject(CommentQueryService) private commentQueryService: CommentQueryService,) {}


    public async createCommentsByPostHandler(
        req: Request<{id: string}, {}, CreateCommentsByPostRequestPayload>,
        res: Response,
    ) {
        if (!req.user) return res.sendStatus(HttpStatus.Unauthorized);

        const command: CreateCommentsByPostCommand = {
            postId: req.params.id,
            content: req.body.content,
            userId: req.user.id,
            userLogin: req.user.login,
        };

        const createResult = await this.commentsService.createCommentsByPost(command);

        if (createResult.status !== ResultStatus.Success || !createResult.data) {
            return res.status(resultCodeToHttpException(createResult.status)).send({
                errorsMessages: createResult.extensions
            });
        }

        const commentResult = await this.commentQueryService.findByIdOrFail(createResult.data, req.user.id);

        if (commentResult.status !== ResultStatus.Success) {
            return res.status(resultCodeToHttpException(commentResult.status)).send({
                errorsMessages: commentResult.extensions
            });
        }
        res.status(HttpStatus.Created).send(commentResult.data);
    }

    public async deleteCommentHandler(
        req: Request<{id: string}>,
        res: Response,
    ) {
        try {
            const id = req.params.id;

            await this.commentsService.delete(id, req.user!.id);

            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }

    public async getCommentHandler(req: Request<{id: string}>,
                                   res: Response,) {
        const result = await this.commentQueryService.findByIdOrFail(req.params.id, req.user?.id);
        if (result.status !== ResultStatus.Success) {
            return res.status(resultCodeToHttpException(result.status)).send({
                errorsMessages: result.extensions
            });
        }
        res.status(HttpStatus.Ok).send(result.data);

    }

    public async getCommentsByPostHandler(
        req: Request<{id:string}, {}, {}, CommentListRequestPayload>,
        res: Response,
    ) {
        const result = await this.commentQueryService.findCommentsByPost(
            req.query,
            req.params.id,
            req.user?.id
        );

        if (result.status !== ResultStatus.Success) {
            return res.status(resultCodeToHttpException(result.status)).send({
                errorsMessages: result.extensions
            });
        }
        res.status(HttpStatus.Ok).send(result.data);
    }

    public async updateCommentHandler(
        req: Request<{id: string}, {}, UpdateCommentRequestPayload>,
        res: Response) {
        try {
            if (!req.user) return res.sendStatus(HttpStatus.Unauthorized);

            await this.commentsService.update({
                id: req.params.id,
                content: req.body.content,
                userId: req.user.id,
            });

            res.sendStatus(HttpStatus.NoContent);
        } catch(e: unknown) {
            errorHandler(e, res);
        }
    }

}