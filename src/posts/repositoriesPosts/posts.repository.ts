import { ObjectId, WithId } from "mongodb";
import {postCollection} from "../../db/mongo.db";
import { Post } from "../domain/post";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";


export class PostsRepository{
    async findByIdOrFail(id: string): Promise<WithId<Post>> {
        const res = await postCollection.findOne({_id: new ObjectId(id)});

        if (!res) {
            throw new RepositoryNotFoundError('Post not exist');
        }
        return Post.reconstitute(res);
    }

    async save(post: Post): Promise<Post> {
        if (!post._id) {
            const insertResult = await postCollection.insertOne(post);

            post._id = insertResult.insertedId;

            return post;
        } else {
            const {_id, ...dtoToUpdate} = post;

            const updateResult = await postCollection.updateOne(
                {
                    _id,
            },
                {
                    $set: dtoToUpdate,
                },
            );

            if (updateResult.matchedCount < 1){
                throw new RepositoryNotFoundError('Post not found');
            }

            return post;
        }
    }

    async delete(id: string): Promise<void> {
        const deleteResult = await postCollection.deleteOne({_id: new ObjectId(id)});


        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Post not exist');
        }

        return;
    }

}

