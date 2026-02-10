import {LikeStatus} from "../../../likes/domain/like-entity";

export type PostOutput = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    extendedLikesInfo: { // Добавляем это поле
        likesCount: number;
        dislikesCount: number;
        myStatus: LikeStatus;
        newestLikes: Array<{
            addedAt: string;
            userId: string;
            login: string;
        }>;
}
};

