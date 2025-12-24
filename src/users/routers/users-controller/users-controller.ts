import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {UsersService} from "../../application/users.service";
import {UserQueryService} from "../../application/user.query.service";
import {
    CreateUserRequestPayload
} from "../request-payloads/create-user-request.payload";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {errorHandler} from "../../../core/errors/errors.handler";
import {
    UserListRequestPayload
} from "../request-payloads/user-list-request.payload";
import {
    setDefaultSortAndPaginationIfNotExist
} from "../../../core/helpers/set-default-sort-and-pagination";



@injectable()
export class UsersController {
    constructor(@inject(UsersService) private usersService: UsersService,
                @inject(UserQueryService) private userQueryService: UserQueryService) {}

    public async createUserHandler(
        req: Request<{}, {}, CreateUserRequestPayload>,
        res: Response,
    ) {
        try {
            const newUserId = await this.usersService.create(req.body);

            const createdUser = await this.userQueryService.findByIdOrFail(newUserId);

            res.status(HttpStatus.Created).send(createdUser);

        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }

    public async  deleteUserHandler(req: Request<{id:string}>,
                                    res: Response,) {
        try {
            const id = req.params.id;;
            await this.usersService.delete(id);

            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }

    public async getUserHandler(
        req: Request<{}, {}, {}, UserListRequestPayload>,
        res: Response
    ) {
        try {
            const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
            const userListOutput = await this.userQueryService.findMany(queryInput);
            res.status(HttpStatus.Ok).send(userListOutput);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }

}
