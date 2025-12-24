import {
    CommentListRequestPayload
} from "../routers/request-payloads/comment-list-request.payload";
import {
    CommentListPaginatedOutput
} from "./output/comment-list-paginated.output";
import {CommentOutput} from "./output/comment.output";
import {
    PostsRepository,
} from "../../posts/repositoriesPosts/posts.repository";
import {
    CommentQueryRepository
} from "../repositoriesComments/comment.query.repository";
import {inject, injectable} from "inversify";
import {LikeRepository} from "../../likes/repositories/like-repository";
import {EntityType, LikeStatus} from "../../likes/domain/like-entity";

@injectable()
export class CommentQueryService {

    constructor( @inject(CommentQueryRepository) private commentQueryRepository: CommentQueryRepository,
   @inject(PostsRepository) private postsRepository: PostsRepository,
                 @inject(LikeRepository) private likeRepository: LikeRepository) {
    }

    async findByIdOrFail(id: string, userId?: string): Promise<CommentOutput> {
        const comment = await this.commentQueryRepository.findByIdOrFail(id);

        const likesCount = await this.likeRepository.countLikes(comment.id, EntityType.Comment);
        const dislikesCount = await this.likeRepository.countDislikes(comment.id, EntityType.Comment);
        const myStatus = userId
            ? await this.likeRepository.getMyStatus(userId, comment.id, EntityType.Comment)
            : LikeStatus.None;

        return {
            ...comment,
            likesInfo: {
                likesCount,
                dislikesCount,
                myStatus
            }
        };
    }

    async findCommentsByPost(
        queryDto: CommentListRequestPayload,
        postId: string,
    ): Promise<CommentListPaginatedOutput>{
        await this.postsRepository.findByIdOrFail(postId);
        return this.commentQueryRepository.findCommentsByPost(queryDto, postId);
    }
}
