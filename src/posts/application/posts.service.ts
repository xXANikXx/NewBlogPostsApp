import { Post } from "../domain/post";
import {BlogsRepository} from "../../blogs/repositoriesBlogs/blogs.repository";
import {
    CreatePostByBlogCommand,
    CreatePostCommand,
    UpdatePostCommand
} from "./command-handlers/post-command";
import {PostsRepository} from "../repositoriesPosts/posts.repository";



class PostsService {
    private postsRepository: PostsRepository;
    private blogsRepository: BlogsRepository;
    constructor() {
        this.blogsRepository = new BlogsRepository();
        this.postsRepository = new PostsRepository();
    }

    async create(dto: CreatePostCommand): Promise<string> {
        const blog = await this.blogsRepository.findByIdOrFail(dto.blogId);

        const newPost = Post.create({
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

        const newPost = Post.create({
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
        const {id, ...postDomainDto} = command;

        const post = await this.postsRepository.findByIdOrFail(id);
        post.update(postDomainDto);

        await this.postsRepository.save(post);

        return;
    }

    async delete(id:string): Promise<void> {
        await this.postsRepository.delete(id);
        return;
    }
}

export const postsService = new PostsService()
