import {
    CreateBlogCommand,
    UpdateBlogCommand
} from "./command-handlers/blog-commands";
import {BlogsRepository} from "../repositoriesBlogs/blogs.repository";
import {PostsRepository} from "../../posts/repositoriesPosts/posts.repository";
import {inject, injectable} from "inversify";
import {BlogModel} from "../domain/blog.entity";

@injectable()
export class BlogsService {

    constructor(@inject(BlogsRepository) private blogsRepository: BlogsRepository,
    @inject(PostsRepository) private postsRepository: PostsRepository) {

    }

    async create(command: CreateBlogCommand): Promise<string> {
        const newBlog = new BlogModel({
            ...command,
            createdAt: new Date(),
            isMembership: false,
        });

        const createBlog = await this.blogsRepository.save(newBlog);
        return createBlog._id!.toString();
    }


    async update(command: UpdateBlogCommand): Promise<void> {
        const { id, name, description, websiteUrl } = command;

        const blog = await this.blogsRepository.findByIdOrFail(id);

        blog.name = name;
        blog.description = description;
        blog.websiteUrl = websiteUrl;

        await this.blogsRepository.save(blog);
    }


    async delete(id: string): Promise<void> {
        await this.blogsRepository.delete(id);
        return;
    }
}
