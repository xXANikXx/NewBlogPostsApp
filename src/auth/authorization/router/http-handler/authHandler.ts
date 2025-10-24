import {Request, Response} from "express";
import {authService} from "../../service/auth.service";
import {HttpStatus} from "../../../../core/typesAny/http-statuses";
import {LoginRequestPayload} from "../request-payload/auth-request-payload";
import {matchedData} from "express-validator";
import {errorHandler} from "../../../../core/errors/errors.handler";

export async function loginHandler(req: Request, res: Response) {
    try {
        const data = matchedData(req) as LoginRequestPayload;
        const accessToken = await authService.loginUser(data.loginOrEmail, data.password);

        if (!accessToken) {
            return res.status(HttpStatus.Unauthorized).send(); // 401
        }

        return res.status(HttpStatus.NoContent).send({ accessToken }); // 204
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}