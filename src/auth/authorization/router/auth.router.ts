import {authInputValidation} from "./auth.input-dto.validation";
import {Router} from "express";
import {
    inputValidationResultMiddleware
} from "../../../core/middlewares/input-validation-result.middleware";
import {loginHandler} from "./http-handler/authHandler";
import {accessTokenGuard} from "../../adapters/middlewares/access.token.guard";
import {getAuthMeHandler} from "./http-handler/get - auth.handler";

export const authRouter = Router();

authRouter
    .post(
    "/login",
    authInputValidation,
    inputValidationResultMiddleware,
    loginHandler
)
    .get("/me", accessTokenGuard, getAuthMeHandler)

