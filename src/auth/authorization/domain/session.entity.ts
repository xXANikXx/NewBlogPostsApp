import * as mongoose from "mongoose";
import {HydratedDocument, model, Model} from "mongoose";

export type SessionDto = {
    userId: string;
    iat: Date;
    expiresAt: Date;
    deviceId: string;
    ip: string;
    title: string;
}

export type SessionDocument = HydratedDocument<SessionDto>;
export type SessionModelType = Model<SessionDocument>



export const SessionSchema = new mongoose.Schema<SessionDto>({
    userId: { type: String, required: true },
    iat: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    title: { type: String, required: true, minlength: 1, maxlength: 200 }
});

SessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


export const SessionModel = model<SessionDto, SessionModelType>('sessions', SessionSchema);

