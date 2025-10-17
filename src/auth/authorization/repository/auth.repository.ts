import {userCollection} from "../../../db/mongo.db";
import {User} from "../../../users/domain/user";

export class AuthRepository {
    async findByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
        const user = await userCollection.findOne({
            $or: [{ login: loginOrEmail }, { email: loginOrEmail }]
        });
        return user ? User.reconstitute(user) : null;
    }
}

export const authRepository = new AuthRepository();
