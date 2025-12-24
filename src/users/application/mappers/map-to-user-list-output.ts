import {UserOutput} from "../output/user.output";
import {UserDocument} from "../../domain/user.entity";


export function mapToUserOutput(user: UserDocument): UserOutput {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    }
}