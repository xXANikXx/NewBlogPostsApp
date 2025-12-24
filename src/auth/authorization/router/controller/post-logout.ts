// import { Request, Response } from "express";
// import {HttpStatus} from "../../../../core/typesAny/http-statuses";
// import {authService} from "../../../../composition.root";
//
//
// const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
//
// export async function logoutHandler(req: Request, res: Response) {
//     const userId = req.userId!;
//     const deviceId = req.deviceId!;
//
//     if (!userId || !deviceId) {
//         // Если RT отсутствует, сессия не может быть завершена -> 401
//         return res.sendStatus(HttpStatus.Unauthorized);
//     }
//
//     await authService.logout(userId, deviceId);
//
//     res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
//         httpOnly: true,
//         secure: true,
//     });
//
//     return res.sendStatus(HttpStatus.NoContent);
// }