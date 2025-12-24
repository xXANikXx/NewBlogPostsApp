import {  WithId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import {injectable} from "inversify";
import {PostDocument, PostModel} from "../domain/posts.entity";

@injectable()
export class PostsRepository{
    async findByIdOrFail(id: string): Promise<PostDocument> {
        const post = await PostModel.findById(id);

        if (!post) {
            throw new RepositoryNotFoundError('Post not exist');
        }
        return post;
    }

    async save(post: PostDocument): Promise<PostDocument> {
       return post.save();
        }


    async delete(id: string): Promise<void> {
        const deleteResult = await PostModel.deleteOne({_id: id});


        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Post not exist');
        }
    }

}

