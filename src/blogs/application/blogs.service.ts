import {Blog} from "../domain/blog";
import {
    CreateBlogCommand,
    UpdateBlogCommand
} from "./command-handlers/blog-commands";
import {BlogsRepository} from "../repositoriesBlogs/blogs.repository";
import {PostsRepository} from "../../posts/repositoriesPosts/posts.repository";


export class BlogsService {

    constructor(private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository) {

    }

    async create(command: CreateBlogCommand): Promise<string> {
        const newBlog = Blog.create({
            ...command,
            createdAt: new Date().toISOString(),
            isMembership: false,
        });

        const createBlog = await this.blogsRepository.save(newBlog);
        return createBlog._id!.toString();
    }


    async update(command: UpdateBlogCommand): Promise<void> {
        const {id, ...blogDomainDto} = command;

        const blog = await this.blogsRepository.findByIdOrFail(id);

        blog.update(blogDomainDto);

        await this.blogsRepository.save(blog);

        return;
    }


    async delete(id: string): Promise<void> {
        await this.blogsRepository.delete(id);
        return;
    }
}
