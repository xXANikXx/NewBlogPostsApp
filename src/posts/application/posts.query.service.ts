
import {PostListPaginatedOutput} from "./output/post-list-paginated.output";
import {PostOutput} from "./output/post.output";
import {
    PostsQueryRepository
} from "../repositoriesPosts/post.query.repository";
import {
    PostListRequestPayload
} from "../routers/request-payloads/post-list-request.payload";
import {blogsRepository} from "../../blogs/repositoriesBlogs/blogs.repository";

class PostsQueryService {
    private postsQueryRepository: PostsQueryRepository;
    constructor() {
        this.postsQueryRepository = new PostsQueryRepository();
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
        await blogsRepository.findByIdOrFail(blogId);
        return this.postsQueryRepository.findPostsByBlog(queryDto, blogId);
    }

    async findByIdOrFail(id: string): Promise<PostOutput> {
        return this.postsQueryRepository.findByIdOrFail(id);
    }

}

export const postsQueryService = new PostsQueryService();