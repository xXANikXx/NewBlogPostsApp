import { Request, Response } from "express";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import { CreatePostRequestPayload } from "../request-payloads/create-post-request.payload";
import { errorHandler } from "../../../core/errors/errors.handler";
import {postsQueryService} from "../../application/posts.query.service";
import {postsService} from "../../application/posts.service";


export async function createPostHandler(
    req: Request<{}, {}, CreatePostRequestPayload>,
    res: Response,
) {
    try {

        const createPostId = await postsService.create(req.body);

        const postOutput = await postsQueryService.findByIdOrFail(createPostId)

        res.status(HttpStatus.Created).send(postOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}