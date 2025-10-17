import {
    passwordHasher
} from "../../../core/infrastructure/crypto/password-hasher";
import {authRepository} from "../repository/auth.repository";

export class AuthService {
    async login(loginOrEmail: string, password: string): Promise<boolean> {
        const user = await authRepository.findByLoginOrEmail(loginOrEmail);

        if (!user) return false; // нет пользователя → 401

        const isValid = await passwordHasher.checkPassword(password,user.passwordHash);
        return isValid; // true → 204, false → 401
    }
}

export const authService = new AuthService();
