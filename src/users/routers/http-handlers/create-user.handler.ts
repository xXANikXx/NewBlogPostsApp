import {Request, Response} from "express";
import {CreateUserRequestPayload} from "../request-payloads/create-user-request.payload";
import {usersService} from "../../application/users.service";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {userQueryService} from "../../application/user.query.service";
import {errorHandler} from "../../../core/errors/errors.handler";

export async function createUserHandler(
    req: Request<{}, {}, CreateUserRequestPayload>,
    res: Response,
) {
    try {
        const newUserId = await usersService.create(req.body);

        const createdUser = await userQueryService.findByIdOrFail(newUserId);

        res.status(HttpStatus.Created).send(createdUser);

    } catch (e: unknown) {
        errorHandler(e, res);
    }
}