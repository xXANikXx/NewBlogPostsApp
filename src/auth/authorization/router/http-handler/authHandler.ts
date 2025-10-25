import {Request, Response} from "express";
import {authService} from "../../service/auth.service";
import {HttpStatus} from "../../../../core/typesAny/http-statuses";
import {LoginRequestPayload} from "../request-payload/auth-request-payload";
import {matchedData} from "express-validator";
import {errorHandler} from "../../../../core/errors/errors.handler";
import {ResultStatus} from "../../../../common/result/resultCode";

export const loginHandler = async (req: Request, res: Response) => {
    const { loginOrEmail, password } = req.body;
    console.log('🔹 loginHandler input:', req.body);

    try {
        const result = await authService.loginUser(loginOrEmail, password);
        console.log('🔹 authService result:', result);

        if (result.status !== 'Success') {
            return res.status(401).send({
                errorsMessages: result.extensions,
            });
        }

        // 👇 ВАЖНО: отправляем ТОЛЬКО токен в формате text/plain
        return res
            .status(HttpStatus.Ok)
            .type('text/plain')
            .send({ accessToken: result.data!.accessToken });
    } catch (error) {
        console.error('❌ loginHandler error:', error);
        return res.status(500).send({
            errorsMessages: [{ message: 'Internal server error', field: '' }],
        });
    }
};