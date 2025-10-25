import {authInputValidation} from "./auth.input-dto.validation";
import {Request, Response, Router} from "express";
import {
    inputValidationResultMiddleware
} from "../../../core/middlewares/input-validation-result.middleware";
// import {loginHandler} from "./http-handler/authHandler";
import {accessTokenGuard} from "../../adapters/middlewares/access.token.guard";
import {getAuthMeHandler} from "./http-handler/get - auth.handler";
import {matchedData} from "express-validator";
import {LoginRequestPayload} from "./request-payload/auth-request-payload";
import {authService} from "../service/auth.service";
import {ResultStatus} from "../../../common/result/resultCode";
import {
    resultCodeToHttpException
} from "../../../common/result/resultCodeToHttpException";
import {HttpStatus} from "../../../core/typesAny/http-statuses";

export const authRouter = Router();

authRouter
    .post(
    "/login",
    authInputValidation,
    inputValidationResultMiddleware,
        async (req: Request<LoginRequestPayload>, res: Response) => {

    const {loginOrEmail, password} = req.body;

    const result = await authService.loginUser(loginOrEmail, password);

    if (result.status !== ResultStatus.Success) {
        return res.status(resultCodeToHttpException(result.status)).send(result.extensions);
    }


    return res.status(HttpStatus.Ok).send({accessToken: result.data!.accessToken});
}
                );


                authRouter.get("/me", accessTokenGuard, getAuthMeHandler);

