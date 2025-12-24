
import {PostListPaginatedOutput} from "./output/post-list-paginated.output";
import {PostOutput} from "./output/post.output";
import {
    PostListRequestPayload
} from "../routers/request-payloads/post-list-request.payload";
import {injectable, inject} from "inversify";
import {PostsRepository} from "../repositoriesPosts/posts.repository";
import {BlogsRepository} from "../../blogs/repositoriesBlogs/blogs.repository";
import {PostsQueryRepository} from "../repositoriesPosts/post.query.repository";


@injectable()
export class PostsQueryService {
    constructor(@inject(PostsRepository) private postsQueryRepository: PostsQueryRepository,
                @inject(BlogsRepository) private blogsRepository: BlogsRepository) {
    }

    async findMany(
        queryDto: PostListRequestPayload,
    ): Promise<PostListPaginatedOutput> {
        return this.postsQueryRepository.findMany(queryDto);
    }

    async findPostsByBlog(
        queryDto: PostListRequestPayload,
        blogId: string,
    ): Promise<PostListPaginatedOutput>{
        await this.blogsRepository.findByIdOrFail(blogId);
        return this.postsQueryRepository.findPostsByBlog(queryDto, blogId);
    }

    async findByIdOrFail(id: string): Promise<PostOutput> {
        return this.postsQueryRepository.findByIdOrFail(id);
    }

}