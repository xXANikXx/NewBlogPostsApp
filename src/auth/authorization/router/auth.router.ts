import {authInputValidation} from "./auth.input-dto.validation";
import {Router} from "express";
import {
    inputValidationResultMiddleware
} from "../../../core/middlewares/input-validation-result.middleware";
import {loginHandler} from "./http-handler/authHandler";
import {accessTokenGuard} from "../../adapters/middlewares/access.token.guard";
import {getAuthMeHandler} from "./http-handler/get-auth.handler";
import {postAuthRegistration} from "./http-handler/post-auth-registration";
import {
    postRegistrationConfirmHandler
} from "./http-handler/post-registration-confirm.handler";
import {
    postRegistrationEmailResendingHandler
} from "./http-handler/post-registration-email-resending.handler";
import {authInputVal} from "./auth.input.validation";
import {refreshTokenHandler} from "./http-handler/post-refresh-token";
import {
    refreshTokenGuard
} from "../../adapters/middlewares/refresh-token.guard";
import {logoutHandler} from "./http-handler/post-logout";
import {
    rateLimitMiddleware
} from "../../adapters/middlewares/rate-limit.middleware";


export const authRouter = Router();


authRouter
    .post("/login", authInputValidation,rateLimitMiddleware, inputValidationResultMiddleware ,loginHandler)

    .post('/refresh-token', refreshTokenGuard, refreshTokenHandler)
    .post('/logout', refreshTokenGuard, logoutHandler)

    .post("/registration", rateLimitMiddleware,authInputVal,inputValidationResultMiddleware, postAuthRegistration)
    .post("/registration-confirmation",rateLimitMiddleware, inputValidationResultMiddleware, postRegistrationConfirmHandler)
    .post("/registration-email-resending", rateLimitMiddleware,inputValidationResultMiddleware, postRegistrationEmailResendingHandler)
    .get("/me", rateLimitMiddleware,accessTokenGuard, getAuthMeHandler)


