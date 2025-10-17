import {Request, Response} from "express";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {errorHandler} from "../../../core/errors/errors.handler";
import {postsService} from "../../application/posts.service";

export async function deletePost(req: Request<{id: string}>,
                                 res: Response) {
    try {
        const id = req.params.id;

        await postsService.delete(id)
        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorHandler(e,res);
    }
}