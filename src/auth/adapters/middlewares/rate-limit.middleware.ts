import {Request, Response, NextFunction} from "express";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {LimitService} from "../../authorization/rateLimit/service/service";
import {inject, injectable} from "inversify";

@injectable()
export class RateLimitMiddleware {

    constructor(@inject(LimitService) private limitService: LimitService) {}

    public handle = async (req: Request, res: Response, next: NextFunction) => {
        const IP = req.ip ?? '0.0.0.0';
        const URL = req.originalUrl;


        const isLimitExceeded = await this.limitService.checkAndIncrement(IP, URL);
        if (isLimitExceeded) return res.sendStatus(HttpStatus.TooManyRequests);

        next();
    }
}