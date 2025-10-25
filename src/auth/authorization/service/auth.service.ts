import {
    bcryptService
} from "../../adapters/crypto/password-hasher";
import {jwtService} from "../../adapters/jwt.service";
import {UserDomainDto} from "../../../users/domain/user-domain.dto";
import {Result} from "../../../common/result/result.type";
import {ResultStatus} from "../../../common/result/resultCode";
import {WithId} from "mongodb";
import {usersRepository} from "../../../users/repositoriesUsers/users.repository";
import {LoginEmailError} from "../../../core/errors/login-email.error";

export const authService = {
    async loginUser(
        loginOrEmail: string,
        password: string,
    ): Promise<{ accessToken: string }> { // 👈 Тип возврата - только УСПЕХ

        // 1. Проверяем данные и получаем пользователя
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

        if (!user) {
            // 🚨 Бросаем ошибку, которую ловит errorHandler как 401
            throw new LoginEmailError('loginOrEmail', 'Wrong credentials');
        }

        const isPassCorrect = await bcryptService.checkPassword(password, user.passwordHash);

        if (!isPassCorrect) {
            // 🚨 Бросаем ошибку, которую ловит errorHandler как 400 или 401
            throw new LoginEmailError('password', 'Wrong password');
        }

        // 2. Создаём токен
        const accessToken = await jwtService.createToken(user._id.toString(), user.login);

        // 3. Возвращаем только успешный результат
        return { accessToken };
    },
};
