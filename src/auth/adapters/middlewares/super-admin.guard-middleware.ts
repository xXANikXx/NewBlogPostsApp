import { NextFunction, Request, Response } from 'express';
import {HttpStatus} from "../../../core/typesAny/http-statuses";

export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'qwerty';

export const superAdminGuardMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
)=> {
    const authorization = req.headers['authorization'] as string;


    if (!authorization) {
        res.sendStatus(HttpStatus.Unauthorized)
        return;
    }

    const [authType, token] = authorization.split(' ');

    if(authType !== 'Basic') {
        res.sendStatus(HttpStatus.Unauthorized);
        return;
    }

    const credentials = Buffer.from(token, 'base64').toString('utf-8');

    const [username, password] = credentials.split(':');

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        res.sendStatus(HttpStatus.Unauthorized);
        return;
    }

    next(); // Успешная авторизация, продолжаем

}