import {BlogsRepository} from "../../blogs/repositoriesBlogs/blogs.repository";
import {
    CreatePostByBlogCommand,
    CreatePostCommand,
    UpdatePostCommand
} from "./command-handlers/post-command";
import {PostsRepository} from "../repositoriesPosts/posts.repository";
import {inject, injectable} from "inversify";
import {PostModel} from "../domain/posts.entity";
import {PostsQueryRepository} from "../repositoriesPosts/post.query.repository";


@injectable()
export class PostsService {

    constructor(@inject(PostsRepository) private postsRepository: PostsRepository,
    @inject(BlogsRepository) private blogsRepository: BlogsRepository,
                @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,) {
    }

    async create(dto: CreatePostCommand): Promise<string> {
        const blog = await this.blogsRepository.findByIdOrFail(dto.blogId);

        const newPost = new PostModel({
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blog._id.toString(),
            blogName: blog.name,
            createdAt: new Date().toISOString()
        })

        const createdPost = await this.postsRepository.save(newPost);

        return createdPost._id!.toString();
    }

    async createPostByBlog(dto: CreatePostByBlogCommand): Promise<string> {
        const blog = await this.blogsRepository.findByIdOrFail(dto.blogId);

        const newPost = new PostModel({
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blog._id.toString(),
            blogName: blog.name,
            createdAt: new Date().toISOString(),
        });

        const createdPostByBlog = await this.postsRepository.save(newPost);

        return createdPostByBlog._id!.toString();
    }


    async update(command: UpdatePostCommand): Promise<void> {
        const {id, title, shortDescription, content, blogId} = command;

        const post = await this.postsRepository.findByIdOrFail(id);
        post.title = title;
        post.shortDescription = shortDescription;
        post.content = content;
        post.blogId = blogId;

        await this.postsRepository.save(post);

        return;
    }

    async delete(id:string): Promise<void> {
        await this.postsRepository.delete(id);
        return;
    }

}