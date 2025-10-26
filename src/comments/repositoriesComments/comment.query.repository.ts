import {
    CommentListRequestPayload
} from "../routers/request-payloads/comment-list-request.payload";
import {
    CommentListPaginatedOutput
} from "../application/output/comment-list-paginated.output";
import {
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE, DEFAULT_SORT_BY
} from "../../core/middlewares/query-pagination-sorting.validation-middleware";
import {commentCollection, postCollection} from "../../db/mongo.db";
import {
    mapToCommentListPaginatedOutput
} from "../application/mappers/map-to-comment-list-paginated-output";
import {CommentOutput} from "../application/output/comment.output";
import {ObjectId} from "mongodb";
import {
    RepositoryNotFoundError
} from "../../core/errors/repository-not-found.error";
import {
    mapToCommentOutput
} from "../application/mappers/map-to-comment-output.utill";


export class CommentQueryRepository {
    async findCommentsByPost(
        queryDto: CommentListRequestPayload,
        postId: string,
    ): Promise<CommentListPaginatedOutput> {

        const pageNumberNum = Number(queryDto.pageNumber) || DEFAULT_PAGE_NUMBER;
        const pageSizeNum = Number(queryDto.pageSize) || DEFAULT_PAGE_SIZE;
        const sortBy = queryDto.sortBy || DEFAULT_SORT_BY;
        const sortDirection = queryDto.sortDirection === 'asc' ? 1 : -1;

        const filter = { postId: new ObjectId(postId) };
        const skip = (pageNumberNum - 1) * pageSizeNum;

        const [items, totalCount] = await Promise.all([
            commentCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSizeNum)
                .toArray(),
            commentCollection.countDocuments(filter),
        ]);

        return mapToCommentListPaginatedOutput(items, {
            pageNumber: pageNumberNum,
            pageSize: pageSizeNum,
            totalCount,
        });
    }

    async findByIdOrFail(id: string): Promise<CommentOutput>{
        const comment = await commentCollection.findOne({_id: new ObjectId(id)});

        if (!comment) {
            throw new RepositoryNotFoundError('Comment not found');
        }
        return mapToCommentOutput(comment);
    }
}