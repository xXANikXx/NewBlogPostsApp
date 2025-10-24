import { Request, Response, NextFunction } from "express";
import {jwtService} from "../jwt.service";
import {IdType} from "../../../core/typesAny/id";
import {HttpStatus} from "../../../core/typesAny/http-statuses";

export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(HttpStatus.Unauthorized);

    const [authType, token] = authHeader.split(' ');
    if (authType !== 'Bearer' || !token) return res.sendStatus(HttpStatus.Unauthorized);

    const payload = await jwtService.verifyToken(token);
    if (!payload) return res.sendStatus(HttpStatus.Unauthorized);

    const { userId, userLogin } = payload;
    req.user = { id: userId, login: userLogin }; // <--- ключевой момент

    next();
};

