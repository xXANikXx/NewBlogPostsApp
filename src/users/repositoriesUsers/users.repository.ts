import {User} from "../domain/user";
import {userCollection} from "../../db/mongo.db";
import {ObjectId, WithId} from "mongodb";
import {
    RepositoryNotFoundError
} from "../../core/errors/repository-not-found.error";
import {UserDomainDto} from "../domain/user-domain.dto";


export class UsersRepository {
    async findByIdOrFail(id: string): Promise<User> {
        const res = await userCollection.findOne({_id: new ObjectId(id)});
        if (!res) {
            throw new RepositoryNotFoundError('User not exists');
        }
        return User.reconstitute(res);
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<UserDomainDto> | null> {
        const found = await userCollection.findOne({
            $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
        });

        return found ? User.reconstitute(found) : null;
    }

    async save(user: User): Promise<User> {
        if (!user._id) {
            // ... (логика INSERT)
        } else {
            // 1. Деструктуризация:
            // Создаем переменную _id, которая содержит ID,
            // и объект dtoToUpdate, который содержит ВСЕ ОСТАЛЬНЫЕ поля сущности User.
            const { _id, ...dtoToUpdate } = user;

            // 2. Обновление:
            // Используем _id для поиска, и dtoToUpdate для $set.
            await userCollection.updateOne(
                { _id },
                { $set: dtoToUpdate } // dtoToUpdate — это объект, который мы ищем
            );
        }
        return user;
    }

    async delete(id: string): Promise<void> {
        const deleteResult = await userCollection.deleteOne({_id: new ObjectId(id)});

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('User not exists');
        }
        return;
    }

    async doesExistByLoginOrEmail(
        login: string,
        email: string
    ): Promise<boolean> {
        const user = await userCollection.findOne({
            $or: [{ email }, { login }],
        });
        return !!user;
    }


}

export const usersRepository = new UsersRepository();