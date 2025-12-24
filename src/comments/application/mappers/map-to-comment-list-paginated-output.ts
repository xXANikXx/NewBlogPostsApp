import {
    CommentListPaginatedOutput
} from "../output/comment-list-paginated.output";
import {CommentDocument} from "../../domain/comment.entity";
import {
    EntityType,
    LikeModel,
    LikeStatus
} from "../../../likes/domain/like-entity";


export async function mapToCommentListPaginatedOutput(
    comments: CommentDocument[],
    meta: { pageNumber: number; pageSize: number; totalCount: number },
userId?: string
): Promise<CommentListPaginatedOutput> {
    const pagesCount =
        (meta.pageSize > 0)
            ? Math.ceil(meta.totalCount / meta.pageSize)
            : 0;


    const items = await Promise.all(
        comments.map(async (comment) => {
            const commentId = comment._id.toString();


            const likesCount = await LikeModel.countDocuments({
                entityId: commentId,
                entityType: EntityType.Comment,
                status: LikeStatus.Like
            });
            const dislikesCount = await LikeModel.countDocuments({
                entityId:  commentId,
                entityType: EntityType.Comment,
                status: LikeStatus.Dislike
            });
            const myStatus = userId
                ? (await LikeModel.findOne({ entityId: commentId, entityType: EntityType.Comment, userId }))?.status ?? LikeStatus.None
                : LikeStatus.None;

            return {
                id: comment._id.toString(),
                content: comment.content,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId,
                    userLogin: comment.commentatorInfo.userLogin,
                },
                createdAt: comment.createdAt.toISOString(),
                likesInfo: {
                    likesCount,
                    dislikesCount,
                    myStatus
                }
            };
        })
    );

    return {
        pagesCount,
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items
    };
}