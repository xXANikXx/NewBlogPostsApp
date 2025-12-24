import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import {AuthService} from "../../service/auth.service";
import {
    UsersRepository
} from "../../../../users/repositoriesUsers/users.repository";
import {matchedData} from "express-validator";
import {LoginRequestPayload} from "../request-payload/auth-request-payload";
import {ResultStatus} from "../../../../common/result/resultCode";
import {HttpStatus} from "../../../../core/typesAny/http-statuses";
import {appConfig} from "../../../../common/config/config";
import {errorHandler} from "../../../../core/errors/errors.handler";
import {
    CreateUserCommand
} from "../../../../users/application/command-handlers/user-commands";


@injectable()
export class AuthController {
    constructor(@inject(AuthService) private authService: AuthService,
                @inject(UsersRepository) private usersRepository: UsersRepository) {}

    private readonly REFRESH_TOKEN_COOKIE_NAME = 'refreshToken'

    public async loginHandler(req: Request, res: Response) {
        try {
            const data = matchedData(req) as LoginRequestPayload;
            const ip: string = req.ip ?? '0.0.0.0';
            const userAgent = req.headers['user-agent'] || 'Unknown Device';
            const title = userAgent.split('(')[1]?.split(')')[0] || 'Unknown Device';
            const result = await this.authService.loginUser(data.loginOrEmail, data.password, ip, title);

            if (result.status !== ResultStatus.Success || !result.data) {
                return res.status(HttpStatus.Unauthorized).json({
                    errorsMessages: result.extensions
                });        }
            const { accessToken, refreshToken } = result.data;


            res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
                httpOnly: true, // Защита от XSS
                secure: true,   // Отправка только по HTTPS
                maxAge: Number(appConfig.RT_TIME) * 1000, // 20 секунд = 20000 мс
            });


            return res.status(HttpStatus.Ok).json({ accessToken });
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }

    public async getAuthMeHandler(req: Request, res: Response) {
        if (!req.user) return res.sendStatus(401);

        const user = await this.usersRepository.findByIdOrFail(req.user.id);
        console.log('Found user:', user);
        if (!user) return res.sendStatus(404);

        return res.status(200).send({
            email: user.email,
            login: user.login,
            userId: user._id!.toString(),
        });
    }

    public async postAuthRegistration(req: Request<CreateUserCommand>, res: Response) {
        try {
            const { login, email, password } = req.body;

            const result = await this.authService.registerUser(login, password, email);

            if (result.status === ResultStatus.BadRequest) {
                return res.status(HttpStatus.BadRequest).send({
                    errorsMessages: result.extensions,
                });
            }

            return res.sendStatus(HttpStatus.NoContent); // успешная регистрация
        } catch (e) {
            errorHandler(e, res);
        }
    }


    public async logoutHandler(req: Request, res: Response) {
        const userId = req.userId!;
        const deviceId = req.deviceId!;

        if (!userId || !deviceId) {
            // Если RT отсутствует, сессия не может быть завершена -> 401
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        await this.authService.logout(userId, deviceId);

        res.clearCookie(this.REFRESH_TOKEN_COOKIE_NAME, {
            httpOnly: true,
            secure: true,
        });

        return res.sendStatus(HttpStatus.NoContent);
    }

   public async refreshTokenHandler(req: Request, res: Response)  {

        const oldRefreshToken = req.refreshToken;

        if (!oldRefreshToken) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        const result = await this.authService.refreshToken(oldRefreshToken);

        if (result.status !== ResultStatus.Success) {
            // Если RT не прошел верификацию или не найден в Whitelist, это 401
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        const { accessToken, refreshToken: newRefreshToken } = result.data!;

        res.cookie(this.REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: Number(appConfig.RT_TIME) * 1000,
        });

        return res.status(HttpStatus.Ok).json({ accessToken });

    }

    public async postRegistrationConfirmHandler(req: Request, res: Response) {
        try {
            const { code } = req.body;

            const result = await this.authService.confirmEmail(code);

            if (result.status === ResultStatus.BadRequest) {
                return res.status(HttpStatus.BadRequest).send({
                    errorsMessages: result.extensions,
                });
            }

            return res.sendStatus(HttpStatus.NoContent);
        } catch (e) {
            errorHandler(e, res);
        }
    }

    public async postRegistrationEmailResendingHandler(req: Request, res: Response) {
        try {
            const { email } = req.body;

            const result = await this.authService.resendEmail(email);

            if (result.status === ResultStatus.BadRequest) {
                return res.status(HttpStatus.BadRequest).send({
                    errorsMessages: result.extensions,
                });
            }

            return res.sendStatus(HttpStatus.NoContent);
        } catch (e) {
            errorHandler(e, res);
        }
    }

    public async postPasswordRecoveryHandler(req: Request, res: Response) {
        try {
            const { email } = req.body;


            await this.authService.passwordRecovery(email);

            return res.sendStatus(HttpStatus.NoContent);
        } catch (e) {
            errorHandler(e, res);
        }
    }

    public async postNewPasswordHandler(req: Request, res: Response) {
        try {
            const { newPassword, recoveryCode } = req.body;

            const result = await this.authService.setNewPassword(newPassword, recoveryCode);

            if (result.status === ResultStatus.BadRequest) {
                return res.status(HttpStatus.BadRequest).send({
                    errorsMessages: result.extensions,
                });
            }

            return res.sendStatus(HttpStatus.NoContent);
        } catch (e) {
            errorHandler(e, res);
        }
    }
}