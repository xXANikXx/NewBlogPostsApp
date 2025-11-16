import {Request, Response, NextFunction} from "express";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {limitService} from "../../../composition.root";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const IP = req.ip ?? '0.0.0.0';
    const URL = req.originalUrl;


    const isLimitExceeded = await limitService.checkAndIncrement(IP, URL);
    if (isLimitExceeded) return res.sendStatus(HttpStatus.TooManyRequests);

    next();
}