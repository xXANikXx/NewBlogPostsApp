import {
    RepositoryNotFoundError
} from "../../core/errors/repository-not-found.error";
import {injectable} from "inversify";
import {UserDocument, UserModel} from "../domain/user.entity";

@injectable()
export class UsersRepository {
    async findByIdOrFail(id: string): Promise<UserDocument> {
        const user = await UserModel.findById(id);
        if (!user) {
            throw new RepositoryNotFoundError('User not exists');
        }
        return user;
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
        const found = await UserModel.findOne({
            $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
        });

        return found;
    }

    async save(user: UserDocument): Promise<UserDocument> {

        return user.save();
    }

    async delete(id: string): Promise<void> {
        const deleteResult = await UserModel.deleteOne({_id: id});

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('User not exists');
        }
        return;
    }

    async doesExistByLoginOrEmail(
        login: string,
        email: string
    ): Promise<boolean> {
        const user = await UserModel.findOne({
            $or: [{ email }, { login }],
        });
        return !!user;
    }

    async findByRecoveryCode(recoveryCode: string): Promise<UserDocument | null> {
        const userDocument = await UserModel.findOne({
            "passwordRecovery.recoveryCode": recoveryCode,
        });

        if (!userDocument) {
            return null;
        }

        return userDocument;
    }


}