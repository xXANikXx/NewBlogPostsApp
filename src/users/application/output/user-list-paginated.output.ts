import {UserOutput} from "./user.output";

export type UserListPaginatedOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserOutput[];
};