import {PostOutput} from "../output/post.output";
import {PostDocument} from "../../domain/posts.entity";
import {LikeStatus} from "../../../likes/domain/like-entity";


export function mapToPostOutputUtil(
    post: PostDocument,
    likesInfo: {
        likesCount: number;
        dislikesCount: number;
        myStatus: LikeStatus;
        newestLikes: any[]
    }
    ): PostOutput {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
            likesCount: likesInfo.likesCount,
            dislikesCount: likesInfo.dislikesCount,
            myStatus: likesInfo.myStatus,
            newestLikes: likesInfo.newestLikes.map(l => ({
                addedAt: l.addedAt.toISOString(),
                userId: l.userId,
                login: l.userLogin
            }))
    }
}; }