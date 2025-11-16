import { Request, Response } from 'express';
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import { errorHandler } from "../../../core/errors/errors.handler";
import {
    CreateBlogRequestPayload
} from "../request-payloads/create-blog-request.payload";
import {blogsQueryService, blogsService} from "../../../composition.root";

export async function createBlogHandler(
    req: Request<{}, {}, CreateBlogRequestPayload>,
    res: Response,
) {

    try {
        const createdBlogId = await blogsService.create(req.body);

       const blogOutput =
           await blogsQueryService.findByIdOrFail(createdBlogId)

        res.status(HttpStatus.Created).send(blogOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}