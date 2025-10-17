import { Request, Response } from "express";
import { errorHandler } from "../../../core/errors/errors.handler";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import {postsQueryService} from "../../application/posts.query.service";

export async function getPostHandler(req: Request, res: Response) {
    try {
        const id = req.params.id;


        const postOutput = await postsQueryService.findByIdOrFail(id);

        res.status(HttpStatus.Ok).send(postOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}