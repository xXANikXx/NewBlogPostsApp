import {ObjectId, WithId} from "mongodb";
import {ClassFieldsOnly} from "../../core/typesAny/fields-only";
import {UserDomainDto} from "./user-domain.dto";

export class User{
    _id?: ObjectId;
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;

    private constructor(dto: ClassFieldsOnly<User>) {
        this.login = dto.login;
        this.email = dto.email;
        this.passwordHash = dto.passwordHash;
        this.createdAt = dto.createdAt;

        if(dto._id) {
            this._id = dto._id;
        }
    }

    static create (dto: UserDomainDto) {
        return new User({
            login: dto.login,
            email: dto.email,
            passwordHash: dto.passwordHash,
            createdAt: dto.createdAt,
        })
    }

    static reconstitute(dto: ClassFieldsOnly<User>):WithId<User> {
        const instance = new User(dto);

        return instance as WithId<User>;
    }
}