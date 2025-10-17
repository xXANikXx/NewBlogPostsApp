import {UserListQuery} from "../application/query-handlers/user-list.query";
import {
    UserListPaginatedOutput
} from "../application/output/user-list-paginated.output";
import {blogCollection, userCollection} from "../../db/mongo.db";
import {
    mapToUserListPaginatedOutput
} from "../application/mappers/map-to-user-list-paginated-output";
import {UserOutput} from "../application/output/user.output";
import {ObjectId} from "mongodb";
import {
    RepositoryNotFoundError
} from "../../core/errors/repository-not-found.error";
import {mapToUserOutput} from "../application/mappers/map-to-user-list-output";


export class UserQueryRepository {
    async findMany(
        queryDto: UserListQuery,
    ): Promise<UserListPaginatedOutput> {
        const{
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchUserLoginTerm,
            searchUserEmailTerm,
        } = queryDto;

        const skip = (pageNumber - 1) * pageSize;

        const filter: any = {};

        if (searchUserLoginTerm) {
            filter.login = { $regex: searchUserLoginTerm, $options: 'i' };
        }

        if (searchUserEmailTerm) {
            filter.email = { $regex: searchUserEmailTerm, $options: 'i' };
        }

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortDirection === 'asc' ? 1 : -1,
        };

        // 3️⃣ Запрос в Mongo
        const [items, totalCount] = await Promise.all([
            userCollection
                .find(filter)
                .sort({[sortBy]: sortDirection})
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            userCollection.countDocuments(filter)
        ])

        return mapToUserListPaginatedOutput(items, {
            pageNumber,
            pageSize,
            totalCount,
        })
    }


    async findByIdOrFail(id: string): Promise<UserOutput> {
        const user = await userCollection.findOne({_id:new ObjectId(id)});
    if (!user) {
        throw new RepositoryNotFoundError('User not found');
    }

    return mapToUserOutput(user);
    }

}