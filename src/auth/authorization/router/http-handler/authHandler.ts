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

        // 1. Получаем объект Result, содержащий { status: Success, data: { accessToken: '...' } }
        const result = await authService.loginUser(data.loginOrEmail, data.password);

        // 2. Обработка неуспешного входа (Wrong credentials, Unauthorized)
        if (result.status !== ResultStatus.Success) {
            return res.status(HttpStatus.Unauthorized).send({
                errorsMessages: [
                    { message: 'Unauthorized', field: 'loginOrEmail' },
                ],
            });
        }
        // 3. Извлечение токена (строка)
        const accessToken = result.data!.accessToken;

        // 4. Отправка ответа (200 OK с телом)
        // Swagger: status 200; content: { "accessToken": "string" }
        return res.status(HttpStatus.Ok).send({ accessToken });

    } catch (e: unknown) {
        // Ловит необработанные исключения (такие как сбой при res.send)
        errorHandler(e, res);
    }
}