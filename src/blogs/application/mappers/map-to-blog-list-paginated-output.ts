import {BlogListPaginatedOutput} from "../output/blog-list-paginated.output";
import {BlogDocument} from "../../domain/blog.entity";


export function mapToBlogListPaginatedOutput(
    blogs: BlogDocument[],
    meta: { pageNumber: number; pageSize: number; totalCount: number }
): BlogListPaginatedOutput {

    // console.log('🔍 PAGINATION META:', meta);

    const pagesCount =
        (meta.pageSize > 0)
            ? Math.ceil(meta.totalCount / meta.pageSize)
            : 0;

    return {
        pagesCount: pagesCount,
        page: meta.pageNumber,
        pageSize: meta.pageSize,
        totalCount: meta.totalCount,
        items: blogs.map(blog => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt.toISOString(),
            isMembership: blog.isMembership,
        })),
    };
}