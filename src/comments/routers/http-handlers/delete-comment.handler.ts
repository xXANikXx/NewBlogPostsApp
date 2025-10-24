import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {errorHandler} from "../../../core/errors/errors.handler";
import {commentsService} from "../../application/comments.service";
import {Request, Response} from "express";

export async function deleteCommentHandler(
    req: Request<{id: string}>,
    res: Response,
) {
    try {
        const id = req.params.id;

        await commentsService.delete(id, req.user!.id);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}