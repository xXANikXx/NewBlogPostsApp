import {Request, Response} from "express";
import {HttpStatus} from "../../../../core/typesAny/http-statuses";
import {ResultStatus} from "../../../../common/result/resultCode";
import {appConfig} from "../../../../common/config/config";
import {authService} from "../../../../composition.root";


const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export async function refreshTokenHandler(req: Request, res: Response)  {

    const oldRefreshToken = req.refreshToken;

    if (!oldRefreshToken) {
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const result = await authService.refreshToken(oldRefreshToken);

    if (result.status !== ResultStatus.Success) {
        // Если RT не прошел верификацию или не найден в Whitelist, это 401
        return res.sendStatus(HttpStatus.Unauthorized);
    }

    const { accessToken, refreshToken: newRefreshToken } = result.data!;

    res.cookie(REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: Number(appConfig.RT_TIME) * 1000,
    });

    return res.status(HttpStatus.Ok).json({ accessToken });

}