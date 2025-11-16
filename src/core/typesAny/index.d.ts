import { IdType } from "./id";

declare global {
    namespace Express {
        export interface Request {
            user: IdType | undefined;

            userId: string;
            deviceId: string;

            refreshToken?: string;
        }
    }
}


export type IdType = {
    id: string;
    login: string;
};

