import {
    CreateCommentsByPostCommand,
    UpdateCommentCommand
} from "./command-handlers/comment-command";
import {
    PostsRepository,
    postsRepository
} from "../../posts/repositoriesPosts/posts.repository";
import {Comment} from "../domain/comment";
import {CommentsRepository} from "../repositoriesComments/comment.repository";
import {ForbiddenError} from "../../core/errors/forbidden.Error";
import {ObjectId} from "mongodb";

export class CommentsService {
    private commentsRepository: CommentsRepository;
    private postsRepository: PostsRepository;

    constructor() {
        this.commentsRepository = new CommentsRepository();
        this.postsRepository = new PostsRepository();
    }


    async update(command: UpdateCommentCommand): Promise<void> {
        const {id, userId, content} = command;

        const comment = await this.commentsRepository.findByIdOrFail(id);

        if (comment.commentatorInfo.userId !== userId) {
            throw new ForbiddenError('You can edit only your own comment');
        }

        comment.update({content});

        await this.commentsRepository.save(comment);

        return;
    }

    async delete(id:string,  userId: string): Promise<void> {
        const comment = await this.commentsRepository.findByIdOrFail(id);

        if (comment.commentatorInfo.userId !== userId) {
            throw new ForbiddenError('You can edit only your own comment');
        }

        await this.commentsRepository.delete(id);
    }

    async createCommentsByPost(dto: CreateCommentsByPostCommand): Promise<string> {
        const post = await this.postsRepository.findByIdOrFail(dto.postId)

        const newComment = Comment.create({
            content: dto.content,
            commentatorInfo: {
                userId: dto.userId,
                userLogin: dto.userLogin,
            },
            createdAt: new Date().toISOString(),
        })

        const createdCommentsByBlog = await this.commentsRepository.save(
            newComment, new ObjectId(dto.postId));

        return createdCommentsByBlog._id!.toString();
    }
}

export const commentsService = new CommentsService();