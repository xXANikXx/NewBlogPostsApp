
import {PostListPaginatedOutput} from "./output/post-list-paginated.output";
import {PostOutput} from "./output/post.output";
import {
    PostListRequestPayload
} from "../routers/request-payloads/post-list-request.payload";
import {injectable, inject} from "inversify";
import {BlogsRepository} from "../../blogs/repositoriesBlogs/blogs.repository";
import {PostsQueryRepository} from "../repositoriesPosts/post.query.repository";
import {ResultStatus} from "../../common/result/resultCode";
import {Result} from "../../common/result/result.type";


@injectable()
export class PostsQueryService {
    constructor(@inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
                @inject(BlogsRepository) private blogsRepository: BlogsRepository) {
    }

    async findMany(
        queryDto: PostListRequestPayload,
        userId?: string
    ): Promise<PostListPaginatedOutput> {
        return this.postsQueryRepository.findMany(queryDto, userId);
    }

    async findPostsByBlog(
        queryDto: PostListRequestPayload,
        blogId: string,
        userId?: string,
    ): Promise<PostListPaginatedOutput>{
        await this.blogsRepository.findByIdOrFail(blogId);
        return this.postsQueryRepository.findPostsByBlog(queryDto, blogId,  userId);
    }

    async findByIdOrFail(id: string, userId?: string): Promise<Result<PostOutput>> {
        try {
            const post = await this.postsQueryRepository.findByIdOrFail(id, userId);

            // Теперь объект соответствует типу Result
            return {
                status: ResultStatus.Success,
                extensions: [],
                data: post
            };
        } catch (e) {
            return {
                status: ResultStatus.NotFound,
                extensions: [{ field: 'id', message: 'Post not found' }],
                data: null
            };
        }
    }

}