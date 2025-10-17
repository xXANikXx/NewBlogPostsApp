import {
    PaginationAndSorting
} from "../../../core/typesAny/pagination-and-sorting";
import {PostSortField} from "../../routers/request-payloads/post-soft-field";

export type PostListQuery = PaginationAndSorting<PostSortField>;