// import { Request, Response } from 'express';
// import {HttpStatus} from "../../../../core/typesAny/http-statuses";
// import {securityService} from "../../../../composition.root";
//
//
// export async function terminateOtherSessionsHandler(req: Request, res: Response) {
//     const userId = req.userId;
//     const currentDeviceId = req.deviceId;
//
//
//     if (!userId || !currentDeviceId) {
//         return res.sendStatus(HttpStatus.Unauthorized);
//     }
//
//     await securityService.terminateAllOtherSessions(userId, currentDeviceId);
//
//     return res.sendStatus(HttpStatus.NoContent);
//
// }