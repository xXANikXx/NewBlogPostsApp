import {BlogOutput} from "../output/blog.output";
import {BlogDocument} from "../../domain/blog.entity";

export function mapToBlogOutput(blog: BlogDocument): BlogOutput {
    return {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt.toISOString(),
        isMembership: blog.isMembership,
    };
}
