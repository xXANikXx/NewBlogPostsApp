import {
    PostListPaginatedOutput
} from "../application/output/post-list-paginated.output";
import {
    mapToPostListPaginatedOutput
} from "../application/mappers/map-to-post-list-paginated-output";
import {PostOutput} from "../application/output/post.output";
import {
    RepositoryNotFoundError
} from "../../core/errors/repository-not-found.error";
import {
    mapToPostOutputUtil
} from "../application/mappers/map-to-post-output.utill";
import {
    PostListRequestPayload
} from "../routers/request-payloads/post-list-request.payload";
import {
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE, DEFAULT_SORT_BY
} from "../../core/middlewares/query-pagination-sorting.validation-middleware";
import {injectable} from "inversify";
import {PostModel} from "../domain/posts.entity";

@injectable()
export class PostsQueryRepository {

    async findMany(
        queryDto: PostListRequestPayload,
    ): Promise<PostListPaginatedOutput> {
        const pageNumberNum = Number(queryDto.pageNumber) || DEFAULT_PAGE_NUMBER;
        const pageSizeNum = Number(queryDto.pageSize) || DEFAULT_PAGE_SIZE;
        const sortByField = queryDto.sortBy || DEFAULT_SORT_BY;
        const sortDir = queryDto.sortDirection === 'asc' ? 1 : -1;

        const skip = (pageNumberNum - 1) * pageSizeNum;
        const filter = {};


        const [items, totalCount] = await Promise.all([
            PostModel
                .find(filter)
                .sort({[sortByField]: sortDir })
                .skip(skip)
                .limit(pageSizeNum),
            PostModel.countDocuments(filter),
        ]);
        return mapToPostListPaginatedOutput(items, {
            pageNumber: pageNumberNum,
            pageSize: pageSizeNum,
            totalCount,
        });
    }

    async findPostsByBlog(
        queryDto: PostListRequestPayload,
        blogId: string,
    ): Promise<PostListPaginatedOutput> {

        const pageNumberNum = Number(queryDto.pageNumber) || DEFAULT_PAGE_NUMBER;
        const pageSizeNum = Number(queryDto.pageSize) || DEFAULT_PAGE_SIZE;
        const sortBy = queryDto.sortBy || DEFAULT_SORT_BY;
        const sortDirection = queryDto.sortDirection === 'asc' ? 1 : -1;

        const filter = { blogId };
        const skip = (pageNumberNum - 1) * pageSizeNum;

        const [items, totalCount] = await Promise.all([
            PostModel
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSizeNum),
            PostModel.countDocuments(filter),
        ]);
        return mapToPostListPaginatedOutput(items, {
            pageNumber: pageNumberNum,
            pageSize: pageSizeNum,
            totalCount,
        });
    }

        async findByIdOrFail(id:string): Promise<PostOutput>{
        const post = await PostModel.findById(id);

        if(!post) {
            throw new RepositoryNotFoundError('Post not exist');
        }
        return mapToPostOutputUtil(post);
        }

    }
