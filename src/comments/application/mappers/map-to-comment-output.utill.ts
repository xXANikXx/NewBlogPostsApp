import {CommentOutput} from "../output/comment.output";
import {CommentDocument} from "../../domain/comment.entity";
import {
    LikeStatus
} from "../../../likes/domain/like-entity";


export function mapToCommentOutput(
    comment: CommentDocument,
    likesInfo: { likesCount: number; dislikesCount: number; myStatus: LikeStatus }
): CommentOutput {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin,
        },
        createdAt: comment.createdAt.toISOString(),
        likesInfo: likesInfo,
    };
}