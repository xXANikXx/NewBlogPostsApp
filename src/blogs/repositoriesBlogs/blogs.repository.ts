import { ObjectId, WithId } from "mongodb";
import { blogCollection } from "../../db/mongo.db";
import { Blog } from "../domain/blog";
import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";


export class BlogsRepository {
    async findByIdOrFail(id: string): Promise<WithId<Blog>> {
        const res = await blogCollection.findOne({_id: new ObjectId(id)});
        if (!res) {
            throw new RepositoryNotFoundError('Blog not exist');
        }
        return Blog.reconstitute(res);
    }

    async save(blog: Blog): Promise<Blog> {
        if (!blog._id) {
            const insertResult = await blogCollection.insertOne(blog);

            blog._id = insertResult.insertedId;

            return blog;
        } else {
            const {_id, ...dtoToUpdate} = blog;

            const updateResult = await blogCollection.updateOne(
                {
                    _id
                },
                {
                    $set: {
                        ...dtoToUpdate,
                    },
                },
            );

            if (updateResult.matchedCount < 1) {
                throw new RepositoryNotFoundError('Blog not exist');
            }
            return blog;
        }
    }

    async delete(id: string): Promise<void> {
        const deleteResult = await blogCollection.deleteOne({_id: new ObjectId(id)});


        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Blog not exist');
        }

        return;
    }

}

export const blogsRepository = new BlogsRepository();
