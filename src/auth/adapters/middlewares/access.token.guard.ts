import { Request, Response, NextFunction } from "express";
import {jwtService} from "../jwt.service";
import {IdType} from "../../../core/typesAny/id";
import {HttpStatus} from "../../../core/typesAny/http-statuses";

export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization header:', authHeader); // 👈 добавь


    if (!authHeader) return res.sendStatus(HttpStatus.Unauthorized);

    console.log('Raw authHeader:', JSON.stringify(authHeader));

    const [authType, token] = authHeader.trim().split(' ');
    console.log('AuthType:', authType, 'Token:', token); // 👈 добавь


    if (authType !== 'Bearer' || !token) return res.sendStatus(HttpStatus.Unauthorized);

    const payload = await jwtService.verifyToken(token);
    console.log('Decoded payload:', payload); // 👈 добавь


    if (!payload) return res.sendStatus(HttpStatus.Unauthorized);

    const { userId, userLogin } = payload;
    req.user = { id: userId, login: userLogin }; // <--- ключевой момент

    next();
};

