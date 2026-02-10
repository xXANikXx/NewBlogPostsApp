import {inject, injectable} from "inversify";
import {BlogsService} from "../../application/blogs.service";
import {PostsService} from "../../../posts/application/posts.service";
import {BlogQueryService} from "../../application/blog.query.service";
import {
    PostsQueryService
} from "../../../posts/application/posts.query.service";
import {Request, Response} from "express";
import {
    CreateBlogRequestPayload
} from "../request-payloads/create-blog-request.payload";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {errorHandler} from "../../../core/errors/errors.handler";
import {
    BlogListRequsetPayload
} from "../request-payloads/blos-list-request.payload";
import {
    setDefaultSortAndPaginationIfNotExist
} from "../../../core/helpers/set-default-sort-and-pagination";
import {
    PostListRequestPayload
} from "../../../posts/routers/request-payloads/post-list-request.payload";
import {
    CreatePostByBlogRequestPayload
} from "../../../posts/routers/request-payloads/create-post-blog-request.payload";
import {
    CreatePostByBlogCommand
} from "../../../posts/application/command-handlers/post-command";
import {
    UpdateBlogRequestPayload
} from "../request-payloads/update-blog-request.payload";


@injectable()
export class BlogsController {
    constructor(@inject(BlogsService) private blogsService: BlogsService,
                @inject(PostsService) private postsService: PostsService,
                @inject(BlogQueryService) private blogsQueryService: BlogQueryService,
                @inject(PostsQueryService) private postsQueryService: PostsQueryService) {
    }

    public async createBlogHandler(
        req: Request<{}, {}, CreateBlogRequestPayload>,
        res: Response,
    ) {

        try {
            const createdBlogId = await this.blogsService.create(req.body);

            const blogOutput =
                await this.blogsQueryService.findByIdOrFail(createdBlogId)

            res.status(HttpStatus.Created).send(blogOutput);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }

   public async deleteBlogHandler(req: Request<{id: string}>,
                                     res: Response,) {

        try {
            const id = req.params.id;

            await this.blogsService.delete(id);

            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }

   public async getBlogListHandler(
        req: Request<{}, {}, {}, BlogListRequsetPayload>,
        res: Response,) {
        try {
            const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

            const blogListOutput = await this.blogsQueryService.findMany(queryInput)

            res.status(HttpStatus.Ok).send(blogListOutput);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }


   public async getBlogHandler(req: Request<{ id: string }>, res: Response,) {
        try {
            const id = req.params.id;

            const blogOutput = await this.blogsQueryService.findByIdOrFail(id);

            res.status(HttpStatus.Ok).send(blogOutput);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }

    public async getBlogPostListHandler(
        req: Request<{ id: string }, {}, {}, PostListRequestPayload>,
        res: Response,
    ) {
        try {
            const blogId = req.params.id;

            const queryInput = req.query;

            const userId = req.user?.id;

            const postListOutput = await this.postsQueryService.findPostsByBlog(
                queryInput,
                blogId,
                userId
            )

            res.status(HttpStatus.Ok).send(postListOutput);
        } catch (e: unknown) {

            errorHandler(e, res);
        }
    }

    public async createPostByBlogHandler(
        req: Request<{ id: string }, {}, CreatePostByBlogRequestPayload>,
        res: Response,
    ) {
        try {
            const blogId = req.params.id;

            const command: CreatePostByBlogCommand = {
                ...req.body,
                blogId,
            };
            const createPostId = await this.postsService.createPostByBlog(command);

            const postOutput = await this.postsQueryService.findByIdOrFail(createPostId)


            res.status(HttpStatus.Created).send(postOutput.data);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }


    public async updateBlogHandler(
        req: Request<{ id: string }, {}, UpdateBlogRequestPayload>,
        res: Response,
    ) {
        try {
            const id = req.params.id;

            await this.blogsService.update({
                id,
                ...req.body,
            });

            res.sendStatus(HttpStatus.NoContent);
        } catch (e: unknown) {
            errorHandler(e, res);
        }
    }

}