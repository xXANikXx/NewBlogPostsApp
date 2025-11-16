import {sessionCollection} from "../../../db/mongo.db";
import {SessionDocument, SessionDto} from "../types/session";



export class SessionRepository {
    async save(session: SessionDto): Promise<void> {
        await sessionCollection.insertOne(session);

        console.log(`Saved new RT for user: ${session.userId}, device: ${session.deviceId}`);
    }

    async findSession(userId: string, deviceId: string): Promise<SessionDocument | null> {
        return sessionCollection.findOne({
            userId: userId,
            deviceId: deviceId
        });
    }

    async findByDeviceId(deviceId: string): Promise<SessionDto | null> {
        return await sessionCollection.findOne({ deviceId });
    }


    async findAllByUserId(userId: string): Promise<SessionDocument[]> {
        return sessionCollection
            .find({userId: userId})
            .toArray();
    }

    async deleteAllExcept(userId: string, deviceId: string): Promise<number> {
        const filter = {
            userId: userId,
            deviceId: { $ne: deviceId } // $ne (Not Equal) - Не равно текущему deviceId
        };
        const deleteResult = await sessionCollection.deleteMany(filter);

        console.log(`Deleted ${deleteResult.deletedCount} sessions for user ${userId}, except device ${deviceId}`);

        return deleteResult.deletedCount;
    }

    async deleteByDeviceId(deviceId: string, userId: string): Promise<boolean> {
        const deleteResult = await sessionCollection.deleteOne({
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