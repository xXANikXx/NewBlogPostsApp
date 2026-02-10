import {injectable, inject} from "inversify";
import { Request, Response } from "express";
import {PostsService} from "../../application/posts.service";
import {PostsQueryService} from "../../application/posts.query.service";
import {
    CreatePostRequestPayload
} from "../request-payloads/create-post-request.payload";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {errorHandler} from "../../../core/errors/errors.handler";
import {
    PostListRequestPayload
} from "../request-payloads/post-list-request.payload";
import {
    setDefaultSortAndPaginationIfNotExist
} from "../../../core/helpers/set-default-sort-and-pagination";
import {
    UpdatePostRequestPayload
} from "../request-payloads/update-post-request.payload";
import {ResultStatus} from "../../../common/result/resultCode";
import {
    resultCodeToHttpException
} from "../../../common/result/resultCodeToHttpException";


@injectable()
export class PostsController {
    constructor(@inject(PostsService) private postsService: PostsService,
                @inject(PostsQueryService) private postsQueryService: PostsQueryService) {
    }

    public async createPostHandler(
        req: Request<{}, {}, CreatePostRequestPayload>,
        res: Response,
    ) {
        try {

            const createPostId = await this.postsService.create(req.body);

            const result = await this.postsQueryService.findByIdOrFail(createPostId)

            if (result.status !== ResultStatus.Success) {
                return res.status(resultCodeToHttpException(result.status)).send({
                    errorsMessages: result.extensions
                });
            }

            res.status(HttpStatus.Created).send(result.data);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }

    public async deletePost(req: Request<{ id: string }>,
                            res: Response) {
        try {
            const id = req.params.id;

            await this.postsService.delete(id)
            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }

    public async getPostListHandler(
        req: Request<{}, {}, {}, PostListRequestPayload>,
        res: Response,
    ){
        const userId = req.user?.id;
        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

        // Передаем userId, чтобы каждый пост в списке имел корректный LikeStatus
        const postListOutput = await this.postsQueryService.findMany(queryInput, userId);

        res.status(HttpStatus.Ok).send(postListOutput);
    }

    public async getPostHandler(req: Request<{ id: string }>, res: Response) {
        const id = req.params.id;
        const userId = req.user?.id;

        const result = await this.postsQueryService.findByIdOrFail(id, userId);

        if (result.status !== ResultStatus.Success) {
            return res.status(resultCodeToHttpException(result.status)).send({
                errorsMessages: result.extensions
            });
        }

        res.status(HttpStatus.Ok).send(result.data);
    }


    public async updatePostHandler(
        req: Request<{ id: string }, {}, UpdatePostRequestPayload>,
        res: Response
    ) {
        try{
            await this.postsService.update({
                id: req.params.id,
                ...req.body,
            })

            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorHandler(e,res);
        }
    }


}

