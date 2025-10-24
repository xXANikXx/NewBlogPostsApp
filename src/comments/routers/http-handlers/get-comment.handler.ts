import {commentQueryService} from "../../application/comment.query.service";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {errorHandler} from "../../../core/errors/errors.handler";
import { Request, Response } from 'express';


export async function getCommentHandler(req: Request<{id: string}>,
                                        res: Response,) {
    try {
        const id = req.params.id;

        const commentOutput = await commentQueryService.findByIdOrFail(id);

        res.status(HttpStatus.Ok).send(commentOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}