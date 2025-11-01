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


export const authRouter = Router();

console.log('⚡️ Auth Router Initialized! Testing for /registration path...');

authRouter
    .post("/login", authInputValidation, inputValidationResultMiddleware, loginHandler)

    .post("/TEST-REGISTRATION-404", (req, res) => res.send('TEST OK'))

    .post("/registration", authInputVal, inputValidationResultMiddleware, postAuthRegistration)
    .post("/registration-confirmation", inputValidationResultMiddleware, postRegistrationConfirmHandler)
    .post("/registration-email-resending", inputValidationResultMiddleware, postRegistrationEmailResendingHandler)
    .get("/me", accessTokenGuard, getAuthMeHandler)
