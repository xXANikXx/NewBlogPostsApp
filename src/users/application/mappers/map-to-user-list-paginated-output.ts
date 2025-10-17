import {WithId} from "mongodb";
import {User} from "../../domain/user";
import {UserListPaginatedOutput} from "../output/user-list-paginated.output";


export function mapToUserListPaginatedOutput(
    user: WithId<User>[],
meta: { pageNumber: number; pageSize: number; totalCount: number }
): UserListPaginatedOutput {

    const pagesCount =
        (meta.pageSize > 0)
            ? Math.ceil(meta.totalCount / meta.pageSize)
            : 0;

    return {
        pagesCount: pagesCount,
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: user.map(user => ({
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        }))
    };
}