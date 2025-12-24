// import { Request, Response } from 'express';
// import {HttpStatus} from "../../../../core/typesAny/http-statuses";
// import {securityService} from "../../../../composition.root";
//
//
// export async function getDevicesHandler(req: Request, res: Response) {
//     const userId = req.userId;
//
//     if (!userId) {
//         return res.sendStatus(HttpStatus.Unauthorized);
//     }
//
//     try {
//         const devices = await securityService.findAllSession(userId);
//         return res.status(HttpStatus.Ok).send(devices);
//     } catch (error) {
//         console.error('[getDevicesHandler] Error fetching sessions:', error);
//         return res.sendStatus(HttpStatus.InternalServerError);
//     }
// }