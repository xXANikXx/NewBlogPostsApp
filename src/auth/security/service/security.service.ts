import {DeviceViewModel} from "../types/devices-view-model";

import {
    mapSessionToDeviceViewModel
} from "./mappers/map-to-securitysession-output";
import {ResultStatus} from "../../../common/result/resultCode";
import {Result} from "../../../common/result/result.type";
import {
    SessionRepository
} from "../../authorization/repository/session.repository";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityService {

    constructor(@inject(SessionRepository) private sessionRepository: SessionRepository) {

    }

    async findAllSession(userId: string): Promise<DeviceViewModel[]> {
        const sessions = await this.sessionRepository.findAllByUserId(userId);

        return sessions.map(mapSessionToDeviceViewModel)
    }


    async terminateAllOtherSessions(userId: string, currentDeviceId: string): Promise<Result<null>> {
        const deletedCount = await this.sessionRepository.deleteAllExcept(userId, currentDeviceId);

        console.log(`Terminated ${deletedCount} sessions for user ${userId}.`);

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
    }

    async terminateSessionByDeviceId(userId: string, targetDeviceId: string): Promise<Result<null>> {
        const session = await this.sessionRepository.findByDeviceId(targetDeviceId);
        if (!session) {
            return {status: ResultStatus.NotFound, data: null, errorMessage: 'Session not found',extensions: []}
        }

        if (session.userId !== userId) {
            return { status: ResultStatus.Forbidden, data: null, errorMessage: 'This is not your device',extensions: []}; // ⬅️ Возвращаем новый статус
        }

        const isDeleted = await this.sessionRepository.deleteByDeviceId(targetDeviceId, userId);

        if (isDeleted) {
            return { status: ResultStatus.Success, data: null, extensions: [] };
        }

        return { status: ResultStatus.InternalServerError, data: null, errorMessage: 'Deletion failed',extensions: [] };
    }
}