import {
    CreateCommentsByPostCommand,
    UpdateCommentCommand
} from "./command-handlers/comment-command";
import {
    PostsRepository,
} from "../../posts/repositoriesPosts/posts.repository";
import {CommentsRepository} from "../repositoriesComments/comment.repository";
import {ForbiddenError} from "../../core/errors/forbidden.Error";
import {inject, injectable} from "inversify";
import {CommentModel} from "../domain/comment.entity";

@injectable()
export class CommentsService {


    constructor(@inject(CommentsRepository) private commentsRepository: CommentsRepository,
   @inject(PostsRepository) private postsRepository: PostsRepository) {

    }


    async update(command: UpdateCommentCommand): Promise<void> {
        const {id, userId, content} = command;

        const comment = await this.commentsRepository.findByIdOrFail(id);

        if (comment.commentatorInfo.userId !== userId) {
            throw new ForbiddenError('You can edit only your own comment');
        }

        comment.content = content;

        await this.commentsRepository.save(comment);
    }

    async delete(id:string,  userId: string): Promise<void> {
        const comment = await this.commentsRepository.findByIdOrFail(id);

        if (comment.commentatorInfo.userId !== userId) {
            throw new ForbiddenError('You can edit only your own comment');
        }

        await this.commentsRepository.delete(id);
    }

    async createCommentsByPost(dto: CreateCommentsByPostCommand): Promise<string> {
    await this.postsRepository.findByIdOrFail(dto.postId)

        const newComment = new CommentModel({
            content: dto.content,
            commentatorInfo: {
                userId: dto.userId,
                userLogin: dto.userLogin,
            },
            createdAt: new Date().toISOString(),
            postId: dto.postId,
        })

        const createdCommentsByBlog = await this.commentsRepository.save(newComment);

        return createdCommentsByBlog._id!.toString();
    }
}