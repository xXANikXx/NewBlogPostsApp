import {authInputValidation} from "./auth.input-dto.validation";
import {Router} from "express";
import {
    inputValidationResultMiddleware
} from "../../../core/middlewares/input-validation-result.middleware";
import {loginHandler} from "./http-handler/authHandler";

export const authRouter = Router();

authRouter.post(
    "/login",
    authInputValidation,
    inputValidationResultMiddleware,
    loginHandler
);