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
            const insertResult = await userCollection.insertOne(user);

            user._id = insertResult.insertedId;
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
}

export const usersRepository = new UsersRepository();