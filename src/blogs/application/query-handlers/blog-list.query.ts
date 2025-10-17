import {
    PaginationAndSorting
} from "../../../core/typesAny/pagination-and-sorting";
import { BlogSortField } from "../../routers/request-payloads/blog-soft-field";



export type BlogListQuery = PaginationAndSorting<BlogSortField> &
    Partial<{
        searchBlogNameTerm: string;
    }>