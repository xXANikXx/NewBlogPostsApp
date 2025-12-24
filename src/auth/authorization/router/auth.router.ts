import {authInputValidation} from "./auth.input-dto.validation";
import {Router} from "express";
import {
    inputValidationResultMiddleware
} from "../../../core/middlewares/input-validation-result.middleware";
import {
    AccessTokenGuard,
} from "../../adapters/middlewares/access.token.guard";
import {
    RateLimitMiddleware,
} from "../../adapters/middlewares/rate-limit.middleware";
import {AuthController} from "./controller/auth-controller";
import {container} from "../../../composition.root";
import {
    authInputVal,
    emailValidator,
    passwordValidator
} from "./auth.input.validation";
import {
    RefreshTokenGuard
} from "../../adapters/middlewares/refresh-token.guard";


export const authRouter = Router();

const controller = container.get(AuthController);
const refreshTokenGuard = container.get(RefreshTokenGuard);
const accessTokenGuard = container.get(AccessTokenGuard);
const rateLimitMiddleware = container.get(RateLimitMiddleware);


authRouter
    .post("/login", authInputValidation, rateLimitMiddleware.handle.bind(rateLimitMiddleware), inputValidationResultMiddleware ,controller.loginHandler.bind(controller))

    .post('/refresh-token',  refreshTokenGuard.handle.bind(refreshTokenGuard), controller.refreshTokenHandler.bind(controller))
    .post('/logout',  refreshTokenGuard.handle.bind(refreshTokenGuard), controller.logoutHandler.bind(controller))

    .post("/registration", rateLimitMiddleware.handle.bind(rateLimitMiddleware),authInputVal,inputValidationResultMiddleware, controller.postAuthRegistration.bind(controller))
    .post("/registration-confirmation",rateLimitMiddleware.handle.bind(rateLimitMiddleware), inputValidationResultMiddleware, controller.postRegistrationConfirmHandler.bind(controller))
    .post("/registration-email-resending", rateLimitMiddleware.handle.bind(rateLimitMiddleware),inputValidationResultMiddleware, controller.postRegistrationEmailResendingHandler.bind(controller))
    .get("/me", rateLimitMiddleware.handle.bind(rateLimitMiddleware), accessTokenGuard.handle.bind(accessTokenGuard), controller.getAuthMeHandler.bind(controller))

    .post("/password-recovery", rateLimitMiddleware.handle.bind(rateLimitMiddleware), emailValidator, inputValidationResultMiddleware, controller.postPasswordRecoveryHandler.bind(controller))
    .post("/new-password", rateLimitMiddleware.handle.bind(rateLimitMiddleware), passwordValidator, inputValidationResultMiddleware, controller.postNewPasswordHandler.bind(controller))