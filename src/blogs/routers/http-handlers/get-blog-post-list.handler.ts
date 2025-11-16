import { Request, Response } from "express";
import { errorHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import {
    PostListRequestPayload
} from "../../../posts/routers/request-payloads/post-list-request.payload";
import {postsQueryService} from "../../../composition.root";

export async function getBlogPostListHandler(
    req: Request<{ id: string }, {}, {}, PostListRequestPayload>,
    res: Response,
) {
    try {
        const blogId = req.params.id;

        const queryInput = req.query;

        const postListOutput = await postsQueryService.findPostsByBlog(
            queryInput,
            blogId,
        )

        res.status(HttpStatus.Ok).send(postListOutput);
    } catch (e: unknown) {

        errorHandler(e, res);
    }
}