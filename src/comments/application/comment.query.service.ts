import {
    CommentListRequestPayload
} from "../routers/request-payloads/comment-list-request.payload";
import {
    CommentListPaginatedOutput
} from "./output/comment-list-paginated.output";
import {CommentOutput} from "./output/comment.output";
import {
    PostsRepository,
    postsRepository
} from "../../posts/repositoriesPosts/posts.repository";
import {
    CommentQueryRepository
} from "../repositoriesComments/comment.query.repository";


class CommentQueryService {
    private commentQueryRepository: CommentQueryRepository;
    private postsRepository: PostsRepository;

    constructor() {
        this.commentQueryRepository = new CommentQueryRepository();
        this.postsRepository = new PostsRepository();

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

export const commentQueryService = new CommentQueryService();