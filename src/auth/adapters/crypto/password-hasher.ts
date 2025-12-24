import bcrypt from 'bcryptjs'
import {injectable} from "inversify";

@injectable()
export class BcryptService {
    async generateHash(password: string):Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async checkPassword(password: string, hash: string):Promise<boolean> {
        return bcrypt.compare(password, hash);

    }
}

