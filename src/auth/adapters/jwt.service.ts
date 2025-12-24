import jwt from 'jsonwebtoken';
import {appConfig} from "../../common/config/config";
import {injectable} from "inversify";

@injectable()
export class JwtService {
    async createToken(userId: string): Promise<string> {
        console.log('createToken params:', { userId, secret: appConfig.AC_SECRET, time: appConfig.AC_TIME });

        console.log('createToken params:', {
            userId,
            secret: appConfig.AC_SECRET,
            time: appConfig.AC_TIME,
            timeAsNumber: Number(appConfig.AC_TIME)
        });
        return jwt.sign({ userId }, appConfig.AC_SECRET, {
            expiresIn: +appConfig.AC_TIME,
        });
    }

    async createRefreshToken(userId: string, deviceId: string): Promise<string> {
        console.log('createRefreshToken params:', { userId, deviceId, secret: appConfig.RT_SECRET, time: appConfig.RT_TIME });

        console.log('createToken params:', {
            userId,
            deviceId,
            secret: appConfig.RT_SECRET,
            time: appConfig.RT_TIME,
            timeAsNumber: Number(appConfig.RT_TIME)
        });

        return jwt.sign({ userId, deviceId }, appConfig.RT_SECRET, {
            expiresIn: +appConfig.RT_TIME,
        });
    }


    async decodeToken(token: string): Promise<any> {
        try {
            return jwt.decode(token);
        } catch (e: unknown) {
            console.error("Can't decode token", e);
            return null;
        }
    }

    async verifyToken(token: string): Promise<{ userId: string; userLogin: string } | null> {
        try {
            return jwt.verify(token, appConfig.AC_SECRET) as { userId: string; userLogin:string };
        } catch (error) {
            console.error("Token verify some error");
            return null;
        }
    }

    async verifyRefreshToken(token: string): Promise<{ userId: string; userLogin: string, deviceId: string, iat: number; } | null> {
        try {
            // Верифицируем с помощью RT_SECRET
            return jwt.verify(token, appConfig.RT_SECRET) as { userId: string; userLogin:string, deviceId: string, iat: number; };
        } catch (error) {
            console.error("Refresh Token verify error");
            return null;
        }
    }
}

