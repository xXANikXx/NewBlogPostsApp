import {BlogListPaginatedOutput} from "./output/blog-list-paginated.output";
import {BlogOutput} from "./output/blog.output";
import {BlogQueryRepository} from "../repositoriesBlogs/blog.query.repository";
import {
    BlogListRequsetPayload
} from "../routers/request-payloads/blos-list-request.payload";

export class BlogQueryService {
    constructor( private blogQueryRepository: BlogQueryRepository) {
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
