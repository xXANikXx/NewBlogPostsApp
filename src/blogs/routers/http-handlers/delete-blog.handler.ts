import { Request, Response } from "express";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import {errorHandler} from "../../../core/errors/errors.handler";
import {blogsService} from "../../application/blogs.service";


export async function deleteBlogHandler(req: Request<{id: string}>,
                                        res: Response,) {

    try {
        const id = req.params.id;

        await blogsService.delete(id);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}