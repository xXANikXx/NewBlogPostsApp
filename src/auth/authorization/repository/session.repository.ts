import {
    SessionDocument,
    SessionDto,
    SessionModel
} from "../domain/session.entity";
import {injectable} from "inversify";


@injectable()
export class SessionRepository {
    async save(session: SessionDocument) {
        await session.save();
    }

    async create(dto: SessionDto): Promise<SessionDocument> {
        const session = new SessionModel(dto);
        await session.save();
        return session;
    }

    async findSession(userId: string, deviceId: string): Promise<SessionDocument | null> {
        return SessionModel.findOne({
            userId: userId,
            deviceId: deviceId
        });
    }

    async findByDeviceId(deviceId: string): Promise<SessionDocument | null> {
        return await SessionModel.findOne({ deviceId });
    }


    async findAllByUserId(userId: string): Promise<SessionDocument[]> {
        return SessionModel
            .find({userId: userId})
    }

    async deleteAllExcept(userId: string, deviceId: string): Promise<number> {
        const filter = {
            userId: userId,
            deviceId: { $ne: deviceId } // $ne (Not Equal) - Не равно текущему deviceId
        };
        const deleteResult = await SessionModel.deleteMany(filter);

        console.log(`Deleted ${deleteResult.deletedCount} sessions for user ${userId}, except device ${deviceId}`);

        return deleteResult.deletedCount;
    }

    async deleteByDeviceId(deviceId: string, userId: string): Promise<boolean> {
        const deleteResult = await SessionModel.deleteOne({
            deviceId: deviceId,
            userId: userId // Убеждаемся, что сессия принадлежит пользователю
        });

        const wasDeleted = deleteResult.deletedCount === 1;

        if (wasDeleted) {
            console.log(`Successfully deleted session for device: ${deviceId}`);
        } else {
            console.log(`Session with deviceId ${deviceId} not found or access denied.`);
        }

        return wasDeleted;
    }

}