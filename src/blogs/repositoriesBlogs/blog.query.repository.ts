import {
    BlogListPaginatedOutput
} from "../application/output/blog-list-paginated.output";
import {BlogListQuery} from "../application/query-handlers/blog-list.query";
import {BlogOutput} from "../application/output/blog.output";
import {
    RepositoryNotFoundError
} from "../../core/errors/repository-not-found.error";
import {mapToBlogOutput} from "../application/mappers/map-to-blog-output.utill";
import {
    mapToBlogListPaginatedOutput
} from "../application/mappers/map-to-blog-list-paginated-output";
import {
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE, DEFAULT_SORT_BY
} from "../../core/middlewares/query-pagination-sorting.validation-middleware";
import {BlogModel} from "../domain/blog.entity";


export class BlogQueryRepository {
    async findMany(
        queryDto: BlogListQuery,
    ): Promise<BlogListPaginatedOutput> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchNameTerm,
        } = queryDto;


        const pageNumberNum = Number(pageNumber) || DEFAULT_PAGE_NUMBER;
        const pageSizeNum = Number(pageSize) || DEFAULT_PAGE_SIZE;
        const sortByField = sortBy || DEFAULT_SORT_BY;
        const sortDir = sortDirection === 'asc' ? 1 : -1;

        const skip = (pageNumberNum - 1) * pageSizeNum;

        const filter = queryDto.searchNameTerm
            ? { name: { $regex: queryDto.searchNameTerm, $options: 'i' } }
            : {};

       const [items, totalCount] = await Promise.all([
           BlogModel
               .find(filter)
               .sort({[sortByField]: sortDir})
               .skip(skip)
           .limit(pageSizeNum),
           BlogModel.countDocuments(filter)
       ])

        return mapToBlogListPaginatedOutput(items, {
            pageNumber: pageNumberNum,
            pageSize: pageSizeNum,
            totalCount,
        });
    }

    async findByIdOrFail(id: string): Promise<BlogOutput> {
        const blog = await BlogModel.findById(id);

        if (!blog) {
            throw new RepositoryNotFoundError('Blog not exist');
        }

        return mapToBlogOutput(blog);
    }
}
