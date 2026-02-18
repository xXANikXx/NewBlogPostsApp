import {UserListPaginatedOutput} from "./output/user-list-paginated.output";
import {UserOutput} from "./output/user.output";
import {
    UserListRequestPayload
} from "../routers/request-payloads/user-list-request.payload";
import {UserQueryRepository} from "../repositoriesUsers/user.query.repository";
import {inject, injectable} from "inversify";
import {Result} from "../../common/result/result.type";
import {ResultStatus} from "../../common/result/resultCode";


@injectable()
export class UserQueryService {


    constructor( @inject(UserQueryRepository)   private userQueryRepository: UserQueryRepository
) {
    }
        async findMany(queryDto: UserListRequestPayload
        ): Promise<UserListPaginatedOutput> {
            return this.userQueryRepository.findMany(queryDto);
        }

    async findByIdOrFail(id: string): Promise<Result<UserOutput | null>> {
        const user = await this.userQueryRepository.findByIdOrFail(id);

        if (!user) {
            return {
                status: ResultStatus.NotFound, // Используем специальный статус
                errorMessage: 'User not found',
                data: null,
                extensions: []
            };
        }

        return {
            status: ResultStatus.Success,
            data: user, // Здесь наш UserOutput
            extensions: []
        };
    }
    }
