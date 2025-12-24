import {
    RepositoryNotFoundError
} from "../../core/errors/repository-not-found.error";
import {CommentDocument, CommentModel} from "../domain/comment.entity";

export class CommentsRepository{

    async findByIdOrFail(id: string): Promise<CommentDocument> {
        const comment = await CommentModel.findById(id);
        if (!comment) {
            throw new RepositoryNotFoundError('Comment not found');
        }
        return comment;
    }

    async save(comment: CommentDocument): Promise<CommentDocument> {

        return comment.save();
    }

    async delete(id: string): Promise<void> {
        const deleteResult = await CommentModel.deleteOne({_id: id});

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Comment not found');
        }
    }

}
