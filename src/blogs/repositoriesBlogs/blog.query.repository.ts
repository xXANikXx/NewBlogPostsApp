import {
    BlogListPaginatedOutput
} from "../application/output/blog-list-paginated.output";
import { ObjectId } from 'mongodb';
import {BlogListQuery} from "../application/query-handlers/blog-list.query";
import {BlogOutput} from "../application/output/blog.output";
import {
    RepositoryNotFoundError
} from "../../core/errors/repository-not-found.error";
import {mapToBlogOutput} from "../application/mappers/map-to-blog-output.utill";
import {blogCollection} from "../../db/mongo.db";
import {
    mapToBlogListPaginatedOutput
} from "../application/mappers/map-to-blog-list-paginated-output";


export class BlogQueryRepository {
    async findMany(
        queryDto: BlogListQuery,
    ): Promise<BlogListPaginatedOutput> {
        const {
            pageNumber,
            pageSize,
            sortBy,
            sortDirection,
            searchBlogNameTerm,
        } = queryDto;

        // 1️⃣ Пагинация и фильтр
        const skip = (pageNumber - 1) * pageSize;

        const filter = searchBlogNameTerm
            ? { name: { $regex: searchBlogNameTerm, $options: 'i' } }
            : {};

        // 2️⃣ Сортировка
        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortDirection === 'asc' ? 1 : -1,
        };

        // 3️⃣ Запрос в Mongo
       const [items, totalCount] = await Promise.all([
           blogCollection
               .find(filter)
               .sort({[sortBy]: sortDirection})
               .skip(skip)
           .limit(pageSize)
               .toArray(),
           blogCollection.countDocuments(filter)
       ])

        // 4️⃣ Формирование результата
        return mapToBlogListPaginatedOutput(items, {
            pageNumber,
            pageSize,
            totalCount,
        });
    }

    async findByIdOrFail(id: string): Promise<BlogOutput> {
        const blog = await blogCollection.findOne({ _id: new ObjectId(id) });

        if (!blog) {
            throw new RepositoryNotFoundError('Blog not exist');
        }

        return mapToBlogOutput(blog);
    }
}