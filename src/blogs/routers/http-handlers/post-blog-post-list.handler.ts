import { Request, Response } from "express";
import { errorHandler } from "../../../core/errors/errors.handler";

import { HttpStatus } from "../../../core/typesAny/http-statuses";
import {postsService} from "../../../posts/application/posts.service";
import {
    postsQueryService
} from "../../../posts/application/posts.query.service";
import {
    CreatePostByBlogRequestPayload
} from "../../../posts/routers/request-payloads/create-post-blog-request.payload";
import {
    CreatePostByBlogCommand
} from "../../../posts/application/command-handlers/post-command";


export async function createPostByBlogHandler(
    req: Request<{ id: string }, {}, CreatePostByBlogRequestPayload>,
    res: Response,
) {
    try {
        const blogId = req.params.id;

        const command: CreatePostByBlogCommand = {
            ...req.body,
            blogId,
        };
        const createPostId = await postsService.createPostByBlog(command);

        const postOutput = await postsQueryService.findByIdOrFail(createPostId)


        res.status(HttpStatus.Created).send(postOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}