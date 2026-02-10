import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import {JwtService} from "../jwt.service";


@injectable()
export class NoneStatusGuard {
    constructor(@inject(JwtService) private jwtService: JwtService) {}

    async handle(req: Request<any, any, any, any>, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization;

        // eсли заголовка нет, просто идем дальше
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next();
        }

        const token = authHeader.split(' ')[1];
        const payload = await this.jwtService.verifyToken(token);

        // eсли токен валидный, прикрепляем пользователя к запросу
        if (payload) {
            req.user = { id: payload.userId, login: payload.userLogin };
        }

        next();
    };
}