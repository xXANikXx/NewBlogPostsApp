import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {SecurityService} from "../../service/security.service";
import {HttpStatus} from "../../../../core/typesAny/http-statuses";





@injectable()
export class SecurityController {

    constructor(@inject(SecurityService) private securityService: SecurityService) {}

    public async terminateOtherSessionsHandler(req: Request, res: Response) {
        const userId = req.userId;
        const currentDeviceId = req.deviceId;


        if (!userId || !currentDeviceId) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        await this.securityService.terminateAllOtherSessions(userId, currentDeviceId);

        return res.sendStatus(HttpStatus.NoContent);

    }

    public async terminateSessionByDeviceIdHandler(req: Request, res: Response) {
        const userId = req.userId;
        const targetDeviceId = req.params.deviceId;

        // Здесь можно добавить валидацию UUID/ID для targetDeviceId, если нужно

        if (!userId) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }



        const result = await this.securityService.terminateSessionByDeviceId(userId, targetDeviceId);

        switch (result.status) {
            case 'Success':
                return res.sendStatus(HttpStatus.NoContent);
            case 'NotFound':
                return res.sendStatus(HttpStatus.NotFound);
            case 'InternalServerError':
                return res.sendStatus(HttpStatus.InternalServerError);
            default:
                return res.sendStatus(HttpStatus.Forbidden);
        }
    }

   public async getDevicesHandler(req: Request, res: Response) {
        const userId = req.userId;

        if (!userId) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        try {
            const devices = await this.securityService.findAllSession(userId);
            return res.status(HttpStatus.Ok).send(devices);
        } catch (error) {
            console.error('[getDevicesHandler] Error fetching sessions:', error);
            return res.sendStatus(HttpStatus.InternalServerError);
        }
    }
}