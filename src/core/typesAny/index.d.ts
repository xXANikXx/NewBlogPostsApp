import { IdType } from "./id";

declare global {
    namespace Express {
        export interface Request {
            user: IdType | undefined;
        }
    }
}

// а IdType должен содержать и id, и login:
export type IdType = {
    id: string;
    login: string;
};
