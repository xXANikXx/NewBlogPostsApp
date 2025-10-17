import {BlogListPaginatedOutput} from "./output/blog-list-paginated.output";
import {BlogOutput} from "./output/blog.output";
import {BlogQueryRepository} from "../repositoriesBlogs/blog.query.repository";
import {
    BlogListRequsetPayload
} from "../routers/request-payloads/blos-list-request.payload";

class BlogQueryService {
    private blogQueryRepository: BlogQueryRepository;
    constructor() {
        this.blogQueryRepository = new BlogQueryRepository();
    }
    async findMany(
        queryDto: BlogListRequsetPayload
    ): Promise<BlogListPaginatedOutput> {
        return this.blogQueryRepository.findMany(queryDto);
    }

    async findByIdOrFail(id: string): Promise<BlogOutput> {
        return this.blogQueryRepository.findByIdOrFail(id);
    }
}

export const blogsQueryService = new BlogQueryService();