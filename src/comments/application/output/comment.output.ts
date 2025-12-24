import {LikeStatus} from "../../../likes/domain/like-entity";

export type CommentOutput = {
    id: string;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    createdAt: string;
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LikeStatus;
    };
}