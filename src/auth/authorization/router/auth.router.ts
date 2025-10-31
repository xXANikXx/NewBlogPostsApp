import {authInputValidation} from "./auth.input-dto.validation";
import {Router} from "express";
import {
    inputValidationResultMiddleware
} from "../../../core/middlewares/input-validation-result.middleware";
import {loginHandler} from "./http-handler/authHandler";
import {accessTokenGuard} from "../../adapters/middlewares/access.token.guard";
import {getAuthMeHandler} from "./http-handler/get - auth.handler";
import {
    userInputValidation
} from "../../../users/routers/user.input-dto.validation";
import {postAuthRegistration} from "./http-handler/post-auth-registration";
import {
    postRegistrationConfirmHandler
} from "./http-handler/post-registration-confirm.handler";
import {
    postRegistrationEmailResendingHandler
} from "./http-handler/post-registration-email-resending.handler";

export const authRouter = Router();

authRouter
    .post(
    "/login",
    authInputValidation,
    inputValidationResultMiddleware,
    loginHandler
)
    .get("/me", accessTokenGuard, getAuthMeHandler)
    .post("/registration", userInputValidation, inputValidationResultMiddleware, postAuthRegistration)
    .post("/registration-confirmation", inputValidationResultMiddleware, postRegistrationConfirmHandler)
    .post("/registration-email-resending", inputValidationResultMiddleware, postRegistrationEmailResendingHandler)
