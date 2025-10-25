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
        console.log('🔹 loginHandler input:', data);

        const result = await authService.loginUser(data.loginOrEmail, data.password);
        console.log('🔹 authService result:', result);

        if (result.status !== ResultStatus.Success || !result.data) {
            console.log('❌ Login failed result:', result);
            console.log('matchedData result:', data);

            return res.sendStatus(HttpStatus.Unauthorized);
        }
        const { accessToken } = result.data;
        console.log('✅ Access token generated:', accessToken);


        return res
            .status(HttpStatus.Ok)
            .send({ accessToken });
    } catch (e) {
        console.log('🔥 ERROR in loginHandler:', e);
        return res.status(500).json({
            errorsMessages: [{ message: 'Internal server error', field: '' }],
        });
    }
}