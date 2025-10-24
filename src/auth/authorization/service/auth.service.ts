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
        const result = await this.checkUserCredentials(loginOrEmail, password);
        if (result.status !== ResultStatus.Success)
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: 'Unauthorized',
                extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
                data: null,
            };

        const accessToken = await jwtService.createToken(result.data!._id.toString(), result.data!.login);

        return {
            status: ResultStatus.Success,
            data: { accessToken },
            extensions: [],
        };
    },

    async checkUserCredentials(
        loginOrEmail: string,
        password: string,
    ): Promise<Result<WithId<UserDomainDto> | null>> {
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user)
            return {
                status: ResultStatus.NotFound,
                data: null,
                errorMessage: 'Not Found',
                extensions: [{ field: 'loginOrEmail', message: 'Not Found' }],
            };

        const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);
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
