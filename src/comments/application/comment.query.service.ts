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
import {Result} from "../../common/result/result.type";
import {ResultStatus} from "../../common/result/resultCode";

@injectable()
export class CommentQueryService {

    constructor( @inject(CommentQueryRepository) private commentQueryRepository: CommentQueryRepository,
   @inject(PostsRepository) private postsRepository: PostsRepository,
                 @inject(LikeRepository) private likeRepository: LikeRepository) {
    }

    async findByIdOrFail(id: string, userId?: string): Promise<Result<CommentOutput>> {
        const comment = await this.commentQueryRepository.findByIdOrFail(id, userId);
        if (!comment) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{ field: 'id', message: 'Comment not found' }],
                data: null
            };
        }
        return { status: ResultStatus.Success,
            extensions: [],
            data: comment
        };
    }

    async findCommentsByPost(
        queryDto: CommentListRequestPayload,
        postId: string,
        userId?: string,
    ): Promise<Result<CommentListPaginatedOutput>>{
        await this.postsRepository.findByIdOrFail(postId);

        const data = await this.commentQueryRepository.findCommentsByPost(queryDto, postId, userId);

        return {
            status: ResultStatus.Success,
            extensions: [],
            data: data
        };
    }
}
