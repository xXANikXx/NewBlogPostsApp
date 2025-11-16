
import {PostListPaginatedOutput} from "./output/post-list-paginated.output";
import {PostOutput} from "./output/post.output";
import {
    PostListRequestPayload
} from "../routers/request-payloads/post-list-request.payload";
import {BlogsRepository} from "../../blogs/repositoriesBlogs/blogs.repository";
import {blogsRepository, postsQueryRepository} from "../../composition.root";
import {PostsQueryRepository} from "../repositoriesPosts/post.query.repository";

export class PostsQueryService {
    constructor(postsQueryRepository: PostsQueryRepository,
                blogsRepository: BlogsRepository) {
    }

    async findMany(
        queryDto: PostListRequestPayload,
    ): Promise<PostListPaginatedOutput> {
        return postsQueryRepository.findMany(queryDto);
    }

    async findPostsByBlog(
        queryDto: PostListRequestPayload,
        blogId: string,
    ): Promise<PostListPaginatedOutput>{
        await blogsRepository.findByIdOrFail(blogId);
        return postsQueryRepository.findPostsByBlog(queryDto, blogId);
    }

    async findByIdOrFail(id: string): Promise<PostOutput> {
        return postsQueryRepository.findByIdOrFail(id);
    }

}