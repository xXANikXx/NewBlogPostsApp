import { RepositoryNotFoundError } from "../../core/errors/repository-not-found.error";
import {BlogDocument, BlogModel} from "../domain/blog.entity";


export class BlogsRepository {

    async findByIdOrFail(id: string): Promise<BlogDocument> {
        const blog = await BlogModel.findById(id);
        if (!blog) {
            throw new RepositoryNotFoundError('Blog not exist');
        }
        return blog;
    }

    async save(blog: BlogDocument): Promise<BlogDocument> {
            return await blog.save();
        }

    async delete(id: string): Promise<void> {
        const deleteResult = await BlogModel.deleteOne({_id: id});


        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError('Blog not exist');
        }

        return;
    }

}
