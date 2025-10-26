import {
    bcryptService
} from "../../adapters/crypto/password-hasher";
import {jwtService} from "../../adapters/jwt.service";
import {UserDomainDto} from "../../../users/domain/user-domain.dto";
import {Result} from "../../../common/result/result.type";
import {ResultStatus} from "../../../common/result/resultCode";
import {WithId} from "mongodb";
import {usersRepository} from "../../../users/repositoriesUsers/users.repository";

export const authService = {
    async loginUser(
        loginOrEmail: string,
        password: string,
    ): Promise<Result<{ accessToken: string } | null>> {
        try {
            console.log('🟢 [authService] loginUser called with:', { loginOrEmail });

            const result = await this.checkUserCredentials(loginOrEmail, password);
            console.log('🔹 checkUserCredentials result:', result);

            if (result.status !== ResultStatus.Success) {
                console.log('❌ Invalid credentials, returning 401');
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

            console.log('✅ LOG 4: Token created:', accessToken);

            return {
                status: ResultStatus.Success,
                data: { accessToken },
                extensions: [],
            };
        } catch (e) {
            console.log('🔥 ERROR in loginUser:', e);
            throw e; // важно — не проглатываем ошибку, чтобы её поймал loginHandler
        }
    },

    async checkUserCredentials(
        loginOrEmail: string,
        password: string,
    ): Promise<Result<WithId<UserDomainDto> | null>> {
        console.log('🟢 [authService] checkUserCredentials called');

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
};
