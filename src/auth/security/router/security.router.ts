import {Router} from "express";
import {
    inputValidationResultMiddleware
} from "../../../core/middlewares/input-validation-result.middleware";
import {container} from "../../../composition.root";
import {SecurityController} from "./security-controller/security-controller";
import {
    RefreshTokenGuard
} from "../../adapters/middlewares/refresh-token.guard";



export const securityRouter = Router();

const controller = container.get(SecurityController);
const refreshTokenGuard = container.get(RefreshTokenGuard);


securityRouter
.get('/devices',  refreshTokenGuard.handle.bind(refreshTokenGuard), inputValidationResultMiddleware, controller.getDevicesHandler.bind(controller))
.delete('/devices',  refreshTokenGuard.handle.bind(refreshTokenGuard), inputValidationResultMiddleware, controller.terminateOtherSessionsHandler.bind(controller))
.delete('/devices/:deviceId',  refreshTokenGuard.handle.bind(refreshTokenGuard), inputValidationResultMiddleware, controller.terminateSessionByDeviceIdHandler.bind(controller))