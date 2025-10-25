import {Request, Response} from "express";
import {authService} from "../../service/auth.service";
import {HttpStatus} from "../../../../core/typesAny/http-statuses";
import {LoginRequestPayload} from "../request-payload/auth-request-payload";
import {matchedData} from "express-validator";
import {errorHandler} from "../../../../core/errors/errors.handler";

// auth.handler.ts (УПРОЩЕННАЯ ВЕРСИЯ)

export async function loginHandler(req: Request, res: Response) {
    try {
        const data = matchedData(req) as LoginRequestPayload;

        // 1. Вызов сервиса. Если что-то не так, сервис бросит исключение,
        // которое перейдет в блок catch.
        const { accessToken } = await authService.loginUser(data.loginOrEmail, data.password);

        // 2. Успешный ответ
        return res.status(HttpStatus.Ok).json({ accessToken });

    } catch (e: unknown) {
        // 3. Обработка всех брошенных ошибок
        errorHandler(e, res);
    }
}