import {bcryptService} from "../../adapters/crypto/password-hasher";
import {jwtService} from "../../adapters/jwt.service";
import {UserDomainDto} from "../../../users/domain/user-domain.dto";
import {Result} from "../../../common/result/result.type";
import {ResultStatus} from "../../../common/result/resultCode";
import {WithId} from "mongodb";
import {
    usersRepository
} from "../../../users/repositoriesUsers/users.repository";
import {User} from "../../../users/domain/user";
import {nodemailerService} from "../../adapters/nodemailer.service";
import {emailExamples} from "../../adapters/emailExamples";
import {randomUUID} from "crypto";
import {add} from 'date-fns/add';
import {userQueryRepository} from "../../../users/repositoriesUsers/user.query.repository";

export const authService = {
    async loginUser(
        loginOrEmail: string,
        password: string,
    ): Promise<Result<{ accessToken: string } | null>> {
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

            console.log('LOG 3: Creating token for ID/Login:', result.data!._id, result.data!.login);

            // ⚠️ Вот здесь, если что-то не так с секретом или временем, будет падать jwt.sign()
            const accessToken = await jwtService.createToken(
                result.data!._id.toString(),
                result.data!.login
            );

            console.log('LOG 4: Token created:', accessToken);

            return {
                status: ResultStatus.Success,
                data: { accessToken },
                extensions: [],
            };
        } catch (e) {
            console.log('ERROR in loginUser:', e);
            throw e; // важно — не проглатываем ошибку, чтобы её поймал loginHandler
        }
    },

    async checkUserCredentials(
        loginOrEmail: string,
        password: string,
    ): Promise<Result<WithId<UserDomainDto> | null>> {
        console.log('[authService] checkUserCredentials called');

        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        console.log('LOG 1: User found?', !!user);
        console.log('LOG 1.1: Password Hash:', user ? user.passwordHash : 'N/A');

        if (!user)
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
            };

        const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);
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
    },

    async registerUser(
        login: string,
        password: string,
        email: string,
    ): Promise<Result<null>> {
        const loginExists = await userQueryRepository.findByLogin(login);
        if (loginExists) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'User already exists',
                data: null,
                extensions: [{ field: 'login', message: 'Login already taken' }],
            };
        }

        const emailExists = await userQueryRepository.findByEmail(email);
        if (emailExists) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'User already exists',
                data: null,
                extensions: [{ field: 'email', message: 'Email already registered' }],
            };
        }



        //проверить существует ли уже юзер с таким логином или почтой и если да - не регистрировать

        const passwordHash = await bcryptService.generateHash(password)//создать хэш пароля

        const newUser = User.create({ // сформировать dto юзера
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {    // доп поля необходимые для подтверждения
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 30,
                }),
                isConfirmed: false
            }
        });

      await usersRepository.save(newUser);

        //отправку сообщения лучше обернуть в try-catch, чтобы при ошибке(например отвалиться отправка) приложение не падало
        try {
            await nodemailerService.sendEmail(//отправить сообщение на почту юзера с кодом подтверждения
                newUser.email,
                newUser.emailConfirmation.confirmationCode,
                emailExamples.registrationEmail);

        } catch (e: unknown) {
            console.error('Send email error', e); //залогировать ошибку при отправке сообщения
        }
        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
    },

    async confirmEmail(code: string): Promise<Result<any>> {

        const isUuid = new RegExp(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
        ).test(code);

        if (!isUuid) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Bad Request',
                data: null,
                extensions: [{ field: 'code', message: 'Incorrect code' }],
            };
        }

        const user = await userQueryRepository.findByConfirmationCode(code);
        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Bad Request',
                data: null,
                extensions: [{ field: 'code', message: 'Incorrect or expired code' }],
            };
        }
        // Проверяем, что email ещё не подтверждён
        if (user.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Bad Request',
                data: null,
                extensions: [{ field: 'code', message: 'Email already confirmed' }],
            };
        }

        user.emailConfirmation.isConfirmed = true;
        await usersRepository.save(user);

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
    },

    async resendEmail(email: string): Promise<Result<any>> {
        const user = await usersRepository.findByLoginOrEmail(email);

        if (!user) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Bad Request',
                data: null,
                extensions: [
                    { field: 'email', message: 'User not found' },
                ],
            }
        }

        if (user.emailConfirmation.isConfirmed) {
            return {
                status: ResultStatus.BadRequest,
                errorMessage: 'Bad Request',
                data: null,
                extensions: [
                    { field: 'email', message: 'Email already confirmed' }]
            }
        }

        user.emailConfirmation.confirmationCode = randomUUID();
        user.emailConfirmation.expirationDate = add(new Date(), { hours: 1, minutes: 30 });

        await usersRepository.save(user);

        try {
            await nodemailerService.sendEmail(
                user.email,
                user.emailConfirmation.confirmationCode,
                emailExamples.registrationEmail
            );
        } catch (e) {
            console.error('Send email error', e);
        }

        return {
            status: ResultStatus.Success,
            data: null,
            extensions: [],
        };
    }
};
