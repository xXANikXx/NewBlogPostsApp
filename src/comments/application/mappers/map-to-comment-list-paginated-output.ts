import {
    CommentListPaginatedOutput
} from "../output/comment-list-paginated.output";
import {CommentOutput} from "../output/comment.output";


export function mapToCommentListPaginatedOutput(
    items: CommentOutput[], // Принимаем уже готовые CommentOutput (с лайками)
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): CommentListPaginatedOutput {
    return {
        pagesCount: meta.pageSize > 0 ? Math.ceil(meta.totalCount / meta.pageSize) : 0,
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: items
    };
}