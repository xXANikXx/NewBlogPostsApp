import {PostOutput} from "../output/post.output";
import {PostDocument} from "../../domain/posts.entity";


export function mapToPostOutputUtil(post: PostDocument): PostOutput {
    return {
        id: post._id.toString(),
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
    }
}