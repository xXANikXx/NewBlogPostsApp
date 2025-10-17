import { Request, Response } from 'express';
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import { errorHandler } from "../../../core/errors/errors.handler";
import {blogsQueryService} from "../../application/blog.query.service";

export async function getBlogHandler(req: Request<{ id: string }>, res: Response,) {
    try {
        const id = req.params.id;

        const blogOutput = await blogsQueryService.findByIdOrFail(id);

        res.status(HttpStatus.Ok).send(blogOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}