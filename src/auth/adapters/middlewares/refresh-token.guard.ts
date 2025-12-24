import { Request, Response, NextFunction } from "express";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {JwtService} from "../jwt.service";
import {inject, injectable} from "inversify";
import {
    SessionRepository
} from "../../authorization/repository/session.repository";


@injectable()
export class RefreshTokenGuard {

    constructor(@inject(JwtService) private jwtService: JwtService,
                @inject(SessionRepository) private sessionRepository: SessionRepository) {}

    public handle = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;


    if (!refreshToken) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }


    const payload = await this.jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
        return res.sendStatus(HttpStatus.Unauthorized); // 2. Истёк/Невалидная сигнатура -> 401
    }

    const {userId, deviceId, iat } = payload;


const session = await this.sessionRepository.findSession(userId, deviceId)

        if(!session){

            return res.sendStatus(HttpStatus.Unauthorized);
        }


    const tokenIat = new Date(iat * 1000);
    const sessionIat = new Date(session.iat);


    if (tokenIat.getTime() !== sessionIat.getTime() ) {


        return res.sendStatus(HttpStatus.Unauthorized);
    }

    req.userId = userId;
    req.deviceId = deviceId;
    req.refreshToken = refreshToken;


    next();

} }