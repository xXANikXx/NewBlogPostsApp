import {Result} from "../../../common/result/result.type";
import {ResultStatus} from "../../../common/result/resultCode";
import {emailExamples} from "../../adapters/emailExamples";
import {randomUUID} from "crypto";
import {add} from 'date-fns/add';
import {addSeconds} from "date-fns/addSeconds";
import {appConfig} from "../../../common/config/config";

import {NodemailerService} from "../../adapters/nodemailer.service";
import {JwtService} from "../../adapters/jwt.service";
import {SessionRepository} from "../repository/session.repository";
import {
    UsersRepository
} from "../../../users/repositoriesUsers/users.repository";
import {
    UserQueryRepository
} from "../../../users/repositoriesUsers/user.query.repository";
import {BcryptService} from "../../adapters/crypto/password-hasher";
import {inject, injectable} from "inversify";
import {UserDocument, UserModel} from "../../../users/domain/user.schema";

@injectable()
export class AuthService {


    constructor(@inject(NodemailerService) private nodemailerService: NodemailerService,
                @inject(JwtService) private jwtService: JwtService,
                @inject(BcryptService) private bcryptService: BcryptService,
                @inject(SessionRepository) private sessionRepository: SessionRepository,
                @inject(UsersRepository) private usersRepository: UsersRepository,
                @inject(UserQueryRepository) private userQueryRepository: UserQueryRepository) {}

    async loginUser(
        loginOrEmail: string,
        password: string,
        ip: string,
        title: string,
    ): Promise<Result<{ accessToken: string, refreshToken: string } | null>> {
        try {
            console.log('[authService] loginUser called with:', { loginOrEmail });

            const result = await this.checkUserCredentials(loginOrEmail, password);
            console.log('🔹 checkUserCredentials result:', result);

            if (result.status !== ResultStatus.Success) {
                console.log('Invalid credentials, returning 401');
                return {
                    status: ResultStatus.Unauthorized,
                    errorMessage: 'Unauthorized',
                    extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
                    data: null,
                };
            }

            const userId = result.data!._id.toString();

            const deviceId = randomUUID();

            const accessToken = await this.jwtService.createToken(
                userId,
            );

            const refreshToken = await this.jwtService.createRefreshToken(
                userId, deviceId
            );

            const rtExpirationDate = addSeconds(new Date(), Number(appConfig.RT_TIME));

            const tokenCreationTimeInSeconds = Math.floor(Date.now() / 1000);
            const correctIatDate = new Date(tokenCreationTimeInSeconds * 1000);

            await this.sessionRepository.create({
                userId,
                expiresAt: rtExpirationDate,
                    iat: correctIatDate,
                deviceId,
                ip,
                title,
            });

            return {
                status: ResultStatus.Success,
                data: { accessToken, refreshToken },
                extensions: [],
            };


        } catch (e) {
            console.log('ERROR in loginUser:', e);
            throw e; // важно — не проглатываем ошибку, чтобы её поймал loginHandler
        }
    }

    async checkUserCredentials(
        loginOrEmail: string,
        password: string,
    ): Promise<Result<UserDocument | null>> {
        console.log('[authService] checkUserCredentials called');

        const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);
        console.log('LOG 1: User found?', !!user);
        console.log('LOG 1.1: Password Hash:', user ? user.passwordHash : 'N/A');

        if (!user)
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
            };

        const isPassCorrect = await this.bcryptService.checkPassword(password, user.passwordHash);
        console.log('LOG 2: Password correct?', isPassCorrect);

        if (!isPassCorrect)
            return {
                status: ResultStatus.BadRequest,
                data: null,
                errorMessage: 'Bad Request',
                extensions: [{ field: 'password', message: 'Wrong password' }],
            };

        return {
            status: ResultStatus.Success,
            data: user,
            extensions: [],
        };
    }


    async refreshToken(oldRefreshToken: string): Promise<Result<{ accessToken: string, refreshToken: string } | null>> {
        console.log('[authService] refreshTokens called with old RT:', oldRefreshToken.substring(0, 10) + '...');

        const payload = await this.jwtService.verifyRefreshToken(oldRefreshToken);

        if (!payload) {
            console.log('RT verification failed (invalid signature or expired)');
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: 'Refresh token is expired or invalid',
                extensions: [],
                data: null,
            };
        }

        const { userId, deviceId } = payload;

        const activeSession = await this.sessionRepository.findSession(userId, deviceId);

        if (!activeSession) {
            console.log('RT not found in Whitelist (session already revoked or not exist)');
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: 'Refresh token session not found',
                extensions: [],
                data: null,
            };
        }

        await this.sessionRepository.deleteByDeviceId(deviceId, userId);
        console.log('Old RT successfully revoked (deleted from Whitelist)');


        const newAccessToken = await this.jwtService.createToken(userId);
        const newRefreshToken = await this.jwtService.createRefreshToken(userId, deviceId);

        const rtExpirationDate = addSeconds(new Date(), Number(appConfig.RT_TIME));
        const tokenCreationTimeInSeconds = Math.floor(Date.now() / 1000);
        const correctIatDate = new Date(tokenCreationTimeInSeconds * 1000);

        console.log('--- [AUTH SERVICE LOG] ---');
        console.log(`RT Secret used: ${appConfig.RT_SECRET.substring(0, 5)}...`); // Проверяем секрет
        console.log(`Generated deviceId: ${deviceId}`);
        console.log(`iat being saved (Date): ${new Date()}`); // Проверяем, что сохраняется Date
        console.log('--------------------------');


        await this.sessionRepository.create({
            userId: userId,
            expiresAt: rtExpirationDate,
            iat: correctIatDate,
            deviceId: deviceId,
            ip: activeSession.ip,
            title: activeSession.title,
        });

        console.log('New RT saved to Whitelist. Tokens ready for response.');

        return {
            status: ResultStatus.Success,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            },
            extensions: [],
        };
    }

    // async registerUser(
    //     login: string,
    //     password: string,
    //     email: string,
    // ): Promise<Result<null>> {
    //
    //     console.log(' [registerUser] START with:', { login, email });
    //
    //     const loginExists = await this.userQueryRepository.findByLogin(login);
    //     if (loginExists) {
    //
    //         console.log(' [registerUser] Login already taken:', login);
    //
    //         return {
    //             status: ResultStatus.BadRequest,
    //             errorMessage: 'User already exists',
    //             data: null,
    //             extensions: [{ field: 'login', message: 'Login already taken' }],
    //         };
    //     }
    //
    //     const emailExists = await this.userQueryRepository.findByEmail(email);
    //     if (emailExists) {
    //
    //         console.log('[registerUser] Email already registered:', email);
    //
    //         return {
    //             status: ResultStatus.BadRequest,
    //             errorMessage: 'User already exists',
    //             data: null,
    //             extensions: [{ field: 'email', message: 'Email already registered' }],
    //         };
    //     }
    //
    //
    //
    //     //проверить существует ли уже юзер с таким логином или почтой и если да - не регистрировать
    //
    //     const passwordHash = await this.bcryptService.generateHash(password)//создать хэш пароля
    //
    //     console.log('[registerUser] Password hashed successfully');
    //
    //
    //     const newUser = new UserModel({ // сформировать dto юзера
    //         login,
    //         email,
    //         passwordHash,
    //         createdAt: new Date().toISOString(),
    //         emailConfirmation: {    // доп поля необходимые для подтверждения
    //             confirmationCode: randomUUID(),
    //             expirationDate: add(new Date(), {
    //                 hours: 1,
    //                 minutes: 30,
    //             }),
    //             isConfirmed: false
    //         },
    //         passwordRecovery: {
    //             recoveryCode: null,
    //             expirationDate: null,
    //         },
    //     });
    //
    //
    //     console.log('[registerUser] newUser before save:', JSON.stringify(newUser, null, 2));
    //
    //
    //     await this.usersRepository.save(newUser);
    //
    //
    //     console.log('[registerUser] user saved successfully with confirmationCode:',
    //         newUser.emailConfirmation.confirmationCode
    //     );
    //
    //     //отправку сообщения лучше обернуть в try-catch, чтобы при ошибке(например отвалиться отправка) приложение не падало
    //     try {
    //
    //         console.log('[registerUser] Sending email to:', newUser.email);
    //
    //
    //         await this.nodemailerService.sendEmail(//отправить сообщение на почту юзера с кодом подтверждения
    //             newUser.email,
    //             newUser.emailConfirmation.confirmationCode,
    //             emailExamples.registrationEmail);
    //
    //         console.log('[registerUser] Email sent successfully');
    //
    //
    //     } catch (e: unknown) {
    //         console.error('Send email error', e); //залогировать ошибку при отправке сообщения
    //     }
    //     return {
    //         status: ResultStatus.Success,
    //         data: null,
    //         extensions: [],
    //     };
    // }

    async registerUser(
    login: string,
    password: string,
    email: string,
): Promise<Result<null>> {
    // 1. Проверки на уникальность (оставляем как есть)
    const loginExists = await this.userQueryRepository.findByLogin(login);
    if (loginExists) {
        return {
            status: ResultStatus.BadRequest,
            errorMessage: 'User already exists',
            data: null,
            extensions: [{ field: 'login', message: 'Login already taken' }],
        };
    }

    const emailExists = await this.userQueryRepository.findByEmail(email);
    if (emailExists) {
        return {
            status: ResultStatus.BadRequest,
            errorMessage: 'User already exists',
            data: null,
            extensions: [{ field: 'email', message: 'Email already registered' }],
        };
    }

    // 2. Хеширование
    const passwordHash = await this.bcryptService.generateHash(password);

    // 3. Вызов доменной фабрики
    // Мы просто передаем чистые данные, сущность сама знает, что с ними делать
    const newUser = UserModel.createUserByRegistration(login, email, passwordHash);

    // 4. Сохранение (Active Record стиль)
    await this.usersRepository.save(newUser);

    // 5. Отправка Email (остается без изменений)
    try {
        await this.nodemailerService.sendEmail(
            newUser.email,
            newUser.emailConfirmation.confirmationCode,
            emailExamples.registrationEmail
        );
    } catch (e: unknown) {
        console.error('Send email error', e);
    }

    return {
        status: ResultStatus.Success,
        data: null,
        extensions: [],
    };
}

    // async confirmEmail(code: string): Promise<Result<any>> {
    //
    //     const isUuid = new RegExp(
    //         /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    //     ).test(code);
    //
    //     if (!isUuid) {
    //         return {
    //             status: ResultStatus.BadRequest,
    //             errorMessage: 'Bad Request',
    //             data: null,
    //             extensions: [{ field: 'code', message: 'Incorrect code' }],
    //         };
    //     }
    //
    //     const user = await this.userQueryRepository.findByConfirmationCode(code);
    //     if (!user) {
    //         return {
    //             status: ResultStatus.BadRequest,
    //             errorMessage: 'Bad Request',
    //             data: null,
    //             extensions: [{ field: 'code', message: 'Incorrect or expired code' }],
    //         };
    //     }
    //     // Проверяем, что email ещё не подтверждён
    //     if (user.emailConfirmation.isConfirmed) {
    //         return {
    //             status: ResultStatus.BadRequest,
    //             errorMessage: 'Bad Request',
    //             data: null,
    //             extensions: [{ field: 'code', message: 'Email already confirmed' }],
    //         };
    //     }
    //
    //     user.emailConfirmation.isConfirmed = true;
    //     await this.usersRepository.save(user);
    //
    //     return {
    //         status: ResultStatus.Success,
    //         data: null,
    //         extensions: [],
    //     };
    // }

     async confirmEmail(code: string): Promise<Result<any>> {

        const user = await this.userQueryRepository.findByConfirmationCode(code);
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Bad Request',
                data: null,
                extensions: [{ field: 'code', message: 'Incorrect or expired code' }],
            };
        }
         try{
        user.confirmEmail(code);
        await this.usersRepository.save(user);

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
        } catch (e: any) {
        return {
            status: ResultStatus.BadRequest,
            errorMessage: 'Bad Request',
            data: null,
            extensions: [{ field: 'code', message: e.message }],
        };
        }
    }


//     async resendEmail(email: string): Promise<Result<any>> {
//         const userData = await this.usersRepository.findByLoginOrEmail(email);
//
//         if (!userData) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 errorMessage: 'Bad Request',
//                 data: null,
//                 extensions: [
//                     { field: 'email', message: 'User not found' },
//                 ],
//             }
//         }
//
// const user = userData;
//
//         if (user.emailConfirmation.isConfirmed) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 errorMessage: 'Bad Request',
//                 data: null,
//                 extensions: [
//                     { field: 'email', message: 'Email already confirmed' }]
//             }
//         }
//
//         user.emailConfirmation.confirmationCode = randomUUID();
//         user.emailConfirmation.expirationDate = add(new Date(), { hours: 1, minutes: 30 });
//
//         await this.usersRepository.save(user);
//
//         try {
//             await this.nodemailerService.sendEmail(
//                 user.email,
//                 user.emailConfirmation.confirmationCode,
//                 emailExamples.registrationEmail
//             );
//         } catch (e) {
//             console.error('Send email error', e);
//         }
//
//         return {
//             status: ResultStatus.Success,
//             data: null,
//             extensions: [],
//         };
//     }

    async resendEmail(email: string): Promise<Result<any>> {
    const user = await this.usersRepository.findByLoginOrEmail(email);

    if (!user) {
        return {
            status: ResultStatus.BadRequest,
            errorMessage: 'Bad Request',
            data: null,
            extensions: [{ field: 'email', message: 'User not found' }],
        };
    }

    try {
        // Просим сущность обновить код. Если что-то не так, она "выбросит" ошибку.
        user.updateConfirmationCode();

        // Если дошли сюда, значит ошибок не было — сохраняем изменения
        await this.usersRepository.save(user);

        // Отправляем письмо
        await this.nodemailerService.sendEmail(
            user.email,
            user.emailConfirmation.confirmationCode,
            emailExamples.registrationEmail
        );

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
    } catch (e: any) {
        // Ловим ошибку "Email already confirmed" из сущности
        return {
            status: ResultStatus.BadRequest,
            errorMessage: 'Bad Request',
            data: null,
            extensions: [{ field: 'email', message: e.message }],
        };
    }
}

    async logout(userId: string, deviceId: string): Promise<Result<null>> {
        const isDeleted = await this.sessionRepository.deleteByDeviceId(deviceId, userId);

        if (isDeleted) {
            console.log('Session successfully revoked/deleted from Whitelist.');
        } else {
            console.log('RT was not found in Whitelist (already expired or revoked).');
        }

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
    }

    async passwordRecovery(email: string): Promise<Result<null>> {
        console.log('[passwordRecovery] called for email:', email);

        const userData = await this.usersRepository.findByLoginOrEmail(email);
        if (!userData) {
            console.log('[passwordRecovery] User not found, returning 204 success anyway.');
            return {
                status: ResultStatus.Success,
                data: null,
                extensions: [],
            }
        }

        const user = userData;

        const recoveryCode = randomUUID();
        const expirationDate = add(new Date(), {
            hours: 1,
        });

        user.passwordRecovery.recoveryCode = recoveryCode;
        user.passwordRecovery.expirationDate = expirationDate;

        await this.usersRepository.save(user);

        console.log('[passwordRecovery] User updated, sending email with code:', recoveryCode);

        try {
            await this.nodemailerService.sendEmail(
                user.email,
                recoveryCode,
                emailExamples.passwordRecoveryEmail
            );
        } catch (e: unknown) {
            console.error('Send password recovery email error', e);
        }

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
    }

    async setNewPassword(newPassword: string, recoveryCode: string) : Promise<Result<null>> {
        console.log('[setNewPassword] called with code:', recoveryCode.substring(0, 10) + '...');

        const userData = await this.usersRepository.findByRecoveryCode(recoveryCode);

        const codeIsInvalid = !userData ||
            !userData.passwordRecovery ||
            userData.passwordRecovery.recoveryCode !== recoveryCode ||
            !userData.passwordRecovery.expirationDate ||
            new Date() > userData.passwordRecovery.expirationDate;

        if (codeIsInvalid) {
            console.log('[setNewPassword] Code is invalid or expired.');
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Recovery code is incorrect or expired',
                data: null,
                extensions: [{ field: 'recoveryCode', message: 'Recovery code is incorrect or expired' }],
            };
        }

        const user = userData;

        const newPasswordHash = await this.bcryptService.generateHash(newPassword);

        user.passwordHash = newPasswordHash;
        user.passwordRecovery.recoveryCode = null;
        user.passwordRecovery.expirationDate = null;
        await this.usersRepository.save(user);

        console.log('[setNewPassword] Password updated successfully for user:', user.email);

        return {
            status: ResultStatus.Success, // Вернет 204 в контроллере
            data: null,
            extensions: [],
        };
    }

}

