import { PaginationAndSorting } from "../typesAny/pagination-and-sorting";
import {
    paginationAndSortingDefault
} from "../middlewares/query-pagination-sorting.validation-middleware";


export function setDefaultSortAndPaginationIfNotExist<P = string>(
    query: Partial<PaginationAndSorting<P>>,
): PaginationAndSorting<P> {
    return {
        ...paginationAndSortingDefault,
        ...query,
        sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
    };
}