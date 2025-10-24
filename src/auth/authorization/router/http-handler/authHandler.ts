import {Request, Response} from "express";
import {authService} from "../../service/auth.service";
import {HttpStatus} from "../../../../core/typesAny/http-statuses";
import {LoginRequestPayload} from "../request-payload/auth-request-payload";
import {matchedData} from "express-validator";
import {errorHandler} from "../../../../core/errors/errors.handler";
import {ResultStatus} from "../../../../common/result/resultCode";

export async function loginHandler(req: Request, res: Response) {
    try {
        const data = matchedData(req) as LoginRequestPayload;
        const result = await authService.loginUser(data.loginOrEmail, data.password);

        if (result.status !== ResultStatus.Success) {
            return res.status(HttpStatus.Unauthorized).send();
        }
        const accessToken = result.data!.accessToken;
        return res.status(HttpStatus.Ok).send({accessToken}); // 204
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}