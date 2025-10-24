import {Router} from 'express';
import {
    paginationAndSortingValidation
} from "../../core/middlewares/query-pagination-sorting.validation-middleware";
import {UserSortField} from "./request-payloads/user-soft-field";
import {
    inputValidationResultMiddleware
} from "../../core/middlewares/input-validation-result.middleware";
import {getUserHandler} from "./http-handlers/get-user-list.handler";
import {
    superAdminGuardMiddleware
} from "../../auth/adapters/middlewares/super-admin.guard-middleware";
import {userInputValidation} from "./user.input-dto.validation";
import {createUserHandler} from "./http-handlers/create-user.handler";
import {deleteUserHandler} from "./http-handlers/delete-user.handler";
import {
    idValidation
} from "../../core/middlewares/params-id.validation-middleware";


export const usersRouter = Router({});

usersRouter
.get("/", paginationAndSortingValidation(UserSortField), inputValidationResultMiddleware, getUserHandler)

.post("/", superAdminGuardMiddleware, userInputValidation, inputValidationResultMiddleware, createUserHandler)

.delete("/:id", superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deleteUserHandler)