import {
    bcryptService
} from "../../adapters/crypto/password-hasher";
import {jwtService} from "../../adapters/jwt.service";
import {UserDomainDto} from "../../../users/domain/user-domain.dto";
import {Result} from "../../../common/result/result.type";
import {ResultStatus} from "../../../common/result/resultCode";
import {WithId} from "mongodb";
import {usersRepository} from "../../../users/repositoriesUsers/users.repository";

async function checkUserCredentials(
    loginOrEmail: string,
    password: string,
): Promise<Result<WithId<UserDomainDto> | null>> {
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
}

export const authService = {
    async loginUser(
        loginOrEmail: string,
        password: string,
    ): Promise<Result<{ accessToken: string } | null>> {
        // теперь вызываем отдельную функцию
        const result = await checkUserCredentials(loginOrEmail, password);

        if (result.status !== ResultStatus.Success)
            return {
                status: ResultStatus.Unauthorized,
                errorMessage: 'Unauthorized',
                extensions: [{ field: 'loginOrEmail', message: 'Wrong credentials' }],
                data: null,
            };

        console.log('LOG 3: Creating token for ID/Login:', result.data!._id, result.data!.login);

        const accessToken = await jwtService.createToken(result.data!._id.toString(), result.data!.login);

        console.log('LOG 4: Token created.');

        return {
            status: ResultStatus.Success,
            data: { accessToken },
            extensions: [],
        };
    },
};
