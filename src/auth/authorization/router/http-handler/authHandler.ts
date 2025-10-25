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

export async function loginHandler(req: Request<LoginRequestPayload>, res: Response) {

        const { loginOrEmail, password } = req.body;

        const result = await authService.loginUser(loginOrEmail, password);


        if (result.status !== ResultStatus.Success) {
            return res.status(resultCodeToHttpException(result.status)).send(result.extensions);
        }

        console.log('RESULT.DATA:', result.data);

        console.log('FINAL RESPONSE:', { accessToken: result.data?.accessToken });

        return res.status(HttpStatus.Ok).send({ accessToken: result.data!.accessToken });

}