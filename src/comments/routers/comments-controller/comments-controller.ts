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




@injectable()
export class CommentsController {
    constructor(@inject(CommentsService) private commentsService: CommentsService,
                @inject(CommentQueryService) private commentQueryService: CommentQueryService) {}


    public async createCommentsByPostHandler(
        req: Request<{id: string}, {}, CreateCommentsByPostRequestPayload>,
        res: Response,
    ) {
        try {
            if (!req.user) return res.sendStatus(HttpStatus.Unauthorized);

            const postId = req.params.id;

            const command: CreateCommentsByPostCommand = {
                postId,
                content: req.body.content,
                userId: req.user.id,
                userLogin: req.user.login,
            };

            const createCommentId = await this.commentsService.createCommentsByPost(command);

            const commentOutput = await this.commentQueryService.findByIdOrFail(createCommentId)

            res.status(HttpStatus.Created).send(commentOutput);
        } catch(e: unknown) {
            errorHandler(e, res);
        }
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
        try {
            const id = req.params.id;

            const commentOutput = await this.commentQueryService.findByIdOrFail(id);

            res.status(HttpStatus.Ok).send(commentOutput);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }

    public async getCommentsByPostHandler(
        req: Request<{id:string}, {}, {}, CommentListRequestPayload>,
        res: Response,
    ) {
        try {
            const postId = req.params.id;

            const queryInput = req.query;

            const commentListOutput = await this.commentQueryService.findCommentsByPost(
                queryInput,
                postId,
            )

            res.status(HttpStatus.Ok).send(commentListOutput);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
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