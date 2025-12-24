// import {Request, Response} from "express";
// import {HttpStatus} from "../../../../core/typesAny/http-statuses";
// import {LoginRequestPayload} from "../request-payload/auth-request-payload";
// import {matchedData} from "express-validator";
// import {errorHandler} from "../../../../core/errors/errors.handler";
// import {ResultStatus} from "../../../../common/result/resultCode";
// import {appConfig} from "../../../../common/config/config";
//
// const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
//
// export async function loginHandler(req: Request, res: Response) {
//     try {
//         const data = matchedData(req) as LoginRequestPayload;
//
//         const ip: string = req.ip ?? '0.0.0.0';
//
//         const userAgent = req.headers['user-agent'] || 'Unknown Device';
//
//         const title = userAgent.split('(')[1]?.split(')')[0] || 'Unknown Device';
//
//         const result = await this.authService.loginUser(data.loginOrEmail, data.password, ip, title);
//
//         if (result.status !== ResultStatus.Success || !result.data) {
//
//             return res.status(HttpStatus.Unauthorized).json({
//                 errorsMessages: result.extensions
//             });        }
//
//         const { accessToken, refreshToken } = result.data;
//
//
//         res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
//             httpOnly: true, // Защита от XSS
//             secure: true,   // Отправка только по HTTPS
//             maxAge: Number(appConfig.RT_TIME) * 1000, // 20 секунд = 20000 мс
//         });
//
//
//         return res.status(HttpStatus.Ok).json({ accessToken });
//     } catch (e: unknown) {
//        errorHandler(e, res);
//     }
// }