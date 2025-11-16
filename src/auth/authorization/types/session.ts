import {WithId} from "mongodb";

export type SessionDto = {
    userId: string;
    iat: Date;
    expiresAt: Date;
    deviceId: string;
    ip: string;
    title: string;
}

export type SessionDocument = WithId<SessionDto>;