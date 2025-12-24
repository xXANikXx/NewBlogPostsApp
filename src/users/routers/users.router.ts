import {Router} from 'express';
import {
    paginationAndSortingValidation
} from "../../core/middlewares/query-pagination-sorting.validation-middleware";
import {UserSortField} from "./request-payloads/user-soft-field";
import {
    inputValidationResultMiddleware
} from "../../core/middlewares/input-validation-result.middleware";
import {
    superAdminGuardMiddleware
} from "../../auth/adapters/middlewares/super-admin.guard-middleware";
import {userInputValidation} from "./user.input-dto.validation";
import {
    idValidation
} from "../../core/middlewares/params-id.validation-middleware";
import {container} from "../../composition.root";
import {UsersController} from "./users-controller/users-controller";


export const usersRouter = Router({});

const controller = container.get(UsersController);

usersRouter
.get("/", paginationAndSortingValidation(UserSortField), inputValidationResultMiddleware, controller.getUserHandler.bind(controller))

.post("/", superAdminGuardMiddleware, userInputValidation, inputValidationResultMiddleware, controller.createUserHandler.bind(controller))

.delete("/:id", superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, controller.deleteUserHandler.bind(controller))