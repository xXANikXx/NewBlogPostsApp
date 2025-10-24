import {CommentOutput} from "../output/comment.output";
import {WithId} from "mongodb";
import {Comment} from "../../domain/comment";

export function mapToCommentOutput (comment: WithId<Comment>): CommentOutput {
    return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
            userId: comment.commentatorInfo.userId,
            userLogin: comment.commentatorInfo.userLogin
        },
        createdAt: comment.createdAt,
    }
}