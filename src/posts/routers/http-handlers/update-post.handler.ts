import { Request, Response } from "express";
import { HttpStatus } from "../../../core/typesAny/http-statuses";
import {UpdatePostRequestPayload} from "../request-payloads/update-post-request.payload";
import {errorHandler} from "../../../core/errors/errors.handler";
import {postsService} from "../../../composition.root";

export async function updatePostHandler(
    req: Request<{ id: string }, {}, UpdatePostRequestPayload>,
    res: Response
) {
    try{
        const id = req.params.id;

        await postsService.update({
            id: req.params.id,
            ...req.body,
        })

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorHandler(e,res);
    }
}
