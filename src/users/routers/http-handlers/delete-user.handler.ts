import {Request, Response} from "express";
import {usersService} from "../../application/users.service";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {errorHandler} from "../../../core/errors/errors.handler";


export async function deleteUserHandler(req: Request<{id:string}>,
res: Response,) {
    try {
        const id = req.params.id;;
        await usersService.delete(id);

        res.sendStatus(HttpStatus.NoContent);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}