import {CreateUserCommand} from "./command-handlers/user-commands";
import {UsersRepository} from "../repositoriesUsers/users.repository";
import {
    BcryptService,
} from "../../auth/adapters/crypto/password-hasher";
import {inject, injectable} from "inversify";
import {UserModel} from "../domain/user.schema";
import {Result} from "../../common/result/result.type";
import {ResultStatus} from "../../common/result/resultCode";

@injectable()
export class UsersService {

    constructor( @inject(UsersRepository) private usersRepository: UsersRepository,
                 @inject(BcryptService) private bcryptService: BcryptService) {

    }

    async create(command: CreateUserCommand): Promise<Result<string | null>> {
    const { login, email, password } = command;

    // 1. Проверки на уникальность (Email)
    const existingByEmail = await this.usersRepository.findByLoginOrEmail(email);
    if (existingByEmail) {
        return {
            status: ResultStatus.BadRequest,
            errorMessage: 'User already exists',
            data: null,
            extensions: [{ field: 'email', message: 'Email already registered' }],
        };
    }

    // 2. Проверки на уникальность (Login)
    const existingByLogin = await this.usersRepository.findByLoginOrEmail(login);
    if (existingByLogin) {
        return {
            status: ResultStatus.BadRequest,
            errorMessage: 'User already exists',
            data: null,
            extensions: [{ field: 'login', message: 'Login already taken' }],
        };
    }

    // 3. Подготовка данных
    const passwordHash = await this.bcryptService.generateHash(password);

    // 4. Создание через фабрику сущности
    const newUser = UserModel.createUserByAdmin(login, email, passwordHash);

    // 5. Сохранение
    await this.usersRepository.save(newUser);

    return {
        status: ResultStatus.Success,
        data: newUser._id.toString(), // Возвращаем ID созданного юзера
        extensions: [],
    };
}

    // async create(command: CreateUserCommand): Promise<string> {
    //     const { login, email, password } = command;
    //
    //     // Проверяем, есть ли уже пользователь с таким email
    //     const existingByEmail = await this.usersRepository.findByLoginOrEmail(email);
    //     if (existingByEmail) {
    //         throw new LoginEmailError('email', 'email should be unique');
    //     }
    //
    //     // Проверяем, есть ли уже пользователь с таким логином
    //     const existingByLogin = await this.usersRepository.findByLoginOrEmail(login);
    //     if (existingByLogin) {
    //         throw new LoginEmailError('login', 'login should be unique');
    //     }
    //
    //     // Хешируем пароль
    //     const passwordHash = await this.bcryptService.generateHash(password);
    //
    //     const newUser = new UserModel({
    //         login,
    //         email,
    //         passwordHash,
    //         createdAt: new Date().toISOString(),
    //         emailConfirmation: {
    //             confirmationCode: randomUUID(),
    //             isConfirmed: false,
    //             expirationDate: new Date(),
    //         },
    //         passwordRecovery: {
    //         },
    //     });
    //
    //     const createdUser = await this.usersRepository.save(newUser);
    //     return createdUser._id!.toString();
    // }

    async delete(id: string): Promise<void> {
        await this.usersRepository.delete(id);
        return;
    }
}

