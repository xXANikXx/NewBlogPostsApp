import {Request, Response} from "express";
import {authService} from "../../service/auth.service";
import {HttpStatus} from "../../../../core/typesAny/http-statuses";
import {LoginRequestPayload} from "../request-payload/auth-request-payload";
import {matchedData} from "express-validator";
import {errorHandler} from "../../../../core/errors/errors.handler";
import {ResultStatus} from "../../../../common/result/resultCode";
import {
    resultCodeToHttpException
} from "../../../../common/result/resultCodeToHttpException";

export async function loginHandler(req: Request, res: Response) {
    try {
        const data = matchedData(req) as LoginRequestPayload;

        const result = await authService.loginUser(data.loginOrEmail, data.password);

        if (result.status !== ResultStatus.Success) {
            return res.status(resultCodeToHttpException(result.status)).send(result.extensions);
        }
        const accessToken = result.data!.accessToken;


        return res.status(HttpStatus.Ok).send({ accessToken: result.data!.accessToken });

    } catch (e: unknown) {
        errorHandler(e, res);
    }
}