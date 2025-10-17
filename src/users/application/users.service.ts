import {CreateUserCommand} from "./command-handlers/user-commands";
import {User} from "../domain/user";
import {UsersRepository} from "../repositoriesUsers/users.repository";
import {UserQueryRepository} from "../repositoriesUsers/user.query.repository";
import {
    RepositoryNotFoundError
} from "../../core/errors/repository-not-found.error";
import {userCollection} from "../../db/mongo.db";
import {LoginEmailError} from "../../core/errors/login-email.error";
import {passwordHasher} from "../../core/infrastructure/crypto/password-hasher";


export class UsersService {
    private usersRepository: UsersRepository;
    private userQueryRepository: UserQueryRepository;
    constructor() {
        this.usersRepository = new UsersRepository()
        this.userQueryRepository = new UserQueryRepository();
    }

    async create(command: CreateUserCommand): Promise<string> {
        const existingUser = await this.usersRepository.findByLoginOrEmail(
            command.login,
            command.email
        );

        if (existingUser) {
            if (existingUser.email === command.email) {
                throw new LoginEmailError('email', 'email should be unique');
            }
            if (existingUser.login === command.login) {
                throw new LoginEmailError('login', 'login should be unique');
            }
        }

        const passwordHash = await passwordHasher.generateHash(command.password);

        // 3️⃣ Создаём пользователя
        const newUser = User.create({
            login: command.login,
            email: command.email,
            passwordHash,
            createdAt: new Date().toISOString(),
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