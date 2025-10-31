import {CreateUserCommand} from "./command-handlers/user-commands";
import {User} from "../domain/user";
import {UsersRepository} from "../repositoriesUsers/users.repository";
import {UserQueryRepository} from "../repositoriesUsers/user.query.repository";
import {LoginEmailError} from "../../core/errors/login-email.error";
import {bcryptService} from "../../auth/adapters/crypto/password-hasher";


export class UsersService {
    private usersRepository: UsersRepository;
    private userQueryRepository: UserQueryRepository;
    constructor() {
        this.usersRepository = new UsersRepository()
        this.userQueryRepository = new UserQueryRepository();
    }

    async create(command: CreateUserCommand): Promise<string> {
        const { login, email, password } = command;

        // 1️⃣ Проверяем, есть ли уже пользователь с таким email
        const existingByEmail = await this.usersRepository.findByLoginOrEmail(email);
        if (existingByEmail) {
            throw new LoginEmailError('email', 'email should be unique');
        }

        // 2️⃣ Проверяем, есть ли уже пользователь с таким логином
        const existingByLogin = await this.usersRepository.findByLoginOrEmail(login);
        if (existingByLogin) {
            throw new LoginEmailError('login', 'login should be unique');
        }

        // 3️⃣ Хешируем пароль
        const passwordHash = await bcryptService.generateHash(password);

        // 4️⃣ Создаём пользователя через фабричный метод
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

export const usersService = new UsersService();