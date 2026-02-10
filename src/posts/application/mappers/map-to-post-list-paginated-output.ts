import {PostListPaginatedOutput} from "../output/post-list-paginated.output";
import {PostOutput} from "../output/post.output";

export function mapToPostListPaginatedOutput(
    items: PostOutput[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): PostListPaginatedOutput {
    return {
        pagesCount: Math.ceil(meta.totalCount / meta.pageSize),
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: items,
    };
};