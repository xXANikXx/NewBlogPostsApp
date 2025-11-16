import {CreateUserCommand} from "./command-handlers/user-commands";
import {User} from "../domain/user";
import {UsersRepository} from "../repositoriesUsers/users.repository";
import {LoginEmailError} from "../../core/errors/login-email.error";
import {
    BcryptService,
} from "../../auth/adapters/crypto/password-hasher";


export class UsersService {

    constructor(  private usersRepository: UsersRepository,
                  private bcryptService: BcryptService) {

    }

    async create(command: CreateUserCommand): Promise<string> {
        const { login, email, password } = command;

        // Проверяем, есть ли уже пользователь с таким email
        const existingByEmail = await this.usersRepository.findByLoginOrEmail(email);
        if (existingByEmail) {
            throw new LoginEmailError('email', 'email should be unique');
        }

        // Проверяем, есть ли уже пользователь с таким логином
        const existingByLogin = await this.usersRepository.findByLoginOrEmail(login);
        if (existingByLogin) {
            throw new LoginEmailError('login', 'login should be unique');
        }

        // Хешируем пароль
        const passwordHash = await this.bcryptService.generateHash(password);

        //Создаём пользователя через фабричный метод
        const newUser = User.create({
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString(),
            emailConfirmation: {
                confirmationCode: '',
                isConfirmed: false,
                expirationDate: new Date(),
            },
        });

        const createdUser = await this.usersRepository.save(newUser);
        return createdUser._id!.toString();
    }

    async delete(id: string): Promise<void> {
        await this.usersRepository.delete(id);
        return;
    }
}

