import {ObjectId, WithId} from "mongodb";
import {commentCollection} from "../../db/mongo.db";
import {
    RepositoryNotFoundError
} from "../../core/errors/repository-not-found.error";
import {Comment} from "../domain/comment";

export class CommentsRepository{
    async findByIdOrFail(id: string): Promise<WithId<Comment>> {
        const res = await commentCollection.findOne({_id: new ObjectId(id)})

        if (!res) {
            throw new RepositoryNotFoundError('Comment not found');
        }
        return Comment.reconstitute(res);
    }

    async save(comment: Comment, postId?: ObjectId): Promise<Comment> {
        if (!comment._id) {
            const insertResult = await commentCollection.insertOne(comment);

            comment._id = insertResult.insertedId;

            return comment;
        } else {

            const {_id, ...dtoToUpdate} = comment;

            const updateResult = await commentCollection.updateOne(
                {
                    _id,
                },
                {
                    $set: dtoToUpdate,
                },
            );

            if (updateResult.matchedCount < 1) {
                throw new RepositoryNotFoundError('Comment not found for update');
            }
        }

        return comment;
    }

    async delete(id: string): Promise<void> {
        const deleteResult = await commentCollection.deleteOne({_id: new ObjectId(id)});

        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Comment not found');
        }
        return;
    }

}

export const commentsRepository = new CommentsRepository();