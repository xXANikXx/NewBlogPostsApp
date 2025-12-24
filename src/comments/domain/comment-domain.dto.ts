import {LikeStatus} from "../../likes/domain/like-entity";

export type LikesInfo = {
    likesCount: number;
    dislikesCount: number;
    myStatus: LikeStatus;
};

export type CommentDomainDto = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    },
    createdAt: Date;
    postId: string;
    likesInfo: LikesInfo;
}