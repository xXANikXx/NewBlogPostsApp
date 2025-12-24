// import { Request, Response } from 'express';
// import {HttpStatus} from "../../../../core/typesAny/http-statuses";
// import {securityService} from "../../../../composition.root";
//
//
// export async function terminateSessionByDeviceIdHandler(req: Request, res: Response) {
//     const userId = req.userId;
//     const targetDeviceId = req.params.deviceId;
//
//     // Здесь можно добавить валидацию UUID/ID для targetDeviceId, если нужно
//
//     if (!userId) {
//         return res.sendStatus(HttpStatus.Unauthorized);
//     }
//
//
//
//     const result = await securityService.terminateSessionByDeviceId(userId, targetDeviceId);
//
//     switch (result.status) {
//         case 'Success':
//             return res.sendStatus(HttpStatus.NoContent);
//         case 'NotFound':
//             return res.sendStatus(HttpStatus.NotFound);
//         case 'InternalServerError':
//             return res.sendStatus(HttpStatus.InternalServerError);
//         default:
//             return res.sendStatus(HttpStatus.Forbidden);
//     }
// }