import {
    PaginationAndSorting
} from "../../../core/typesAny/pagination-and-sorting";
import {UserSortField} from "../../routers/request-payloads/user-soft-field";


export type UserListQuery = PaginationAndSorting<UserSortField> &
    Partial<{
    searchLoginTerm: string;
    searchEmailTerm: string;
    }>