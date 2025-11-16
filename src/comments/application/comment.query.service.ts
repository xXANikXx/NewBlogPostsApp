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
import {commentQueryRepository, postsRepository} from "../../composition.root";


export class CommentQueryService {

    constructor(  private commentQueryRepository: CommentQueryRepository,
    private postsRepository: PostsRepository) {
    }

    async findByIdOrFail(id: string): Promise<CommentOutput> {
        return this.commentQueryRepository.findByIdOrFail(id);
    }

    async findCommentsByPost(
        queryDto: CommentListRequestPayload,
        postId: string,
    ): Promise<CommentListPaginatedOutput>{
        await this.postsRepository.findByIdOrFail(postId);
        return this.commentQueryRepository.findCommentsByPost(queryDto, postId);
    }
}
