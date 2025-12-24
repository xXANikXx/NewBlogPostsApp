import {UserListPaginatedOutput} from "../output/user-list-paginated.output";
import {UserDocument} from "../../domain/user.entity";


export function mapToUserListPaginatedOutput(
    user: UserDocument[],
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