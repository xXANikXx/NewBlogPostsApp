import {Router} from "express";
import {
    refreshTokenGuard
} from "../../adapters/middlewares/refresh-token.guard";
import {
    inputValidationResultMiddleware
} from "../../../core/middlewares/input-validation-result.middleware";
import {getDevicesHandler} from "./http-handler/get-securitydevices.handler";
import {
    terminateOtherSessionsHandler
} from "./http-handler/delete-securitydevices.handler";
import {
    terminateSessionByDeviceIdHandler
} from "./http-handler/delete-securitydevices-id.handler";




export const securityRouter = Router();

securityRouter
.get('/devices', refreshTokenGuard, inputValidationResultMiddleware, getDevicesHandler)
.delete('/devices', refreshTokenGuard, inputValidationResultMiddleware, terminateOtherSessionsHandler)
.delete('/devices/:deviceId', refreshTokenGuard, inputValidationResultMiddleware, terminateSessionByDeviceIdHandler)