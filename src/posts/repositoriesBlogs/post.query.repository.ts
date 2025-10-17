import {
    PostListPaginatedOutput
} from "../application/output/post-list-paginated.output";
import {
    mapToPostListPaginatedOutput
} from "../application/mappers/map-to-post-list-paginated-output";
import {postCollection} from "../../db/mongo.db";
import {PostOutput} from "../application/output/post.output";
import {ObjectId} from "mongodb";
import {
    RepositoryNotFoundError
} from "../../core/errors/repository-not-found.error";
import {
    mapToPostOutputUtil
} from "../application/mappers/map-to-post-output.utill";
import {
    PostListRequestPayload
} from "../routers/request-payloads/post-list-request.payload";


export class PostsQueryRepository {
    async findMany(
        queryDto: PostListRequestPayload,
    ): Promise<PostListPaginatedOutput> {
        const {pageNumber, pageSize, sortBy, sortDirection } = queryDto;
        const filter = {};
        const skip = (pageNumber - 1) * pageSize;

        const [items, totalCount] = await Promise.all([
            postCollection
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSize)
                .toArray(),
            postCollection.countDocuments(filter),
        ]);
        return mapToPostListPaginatedOutput(items, {
            pageNumber,
            pageSize,
            totalCount,
        });
    }

    async findPostsByBlog(
        queryDto: PostListRequestPayload,
        blogId: string,
    ): Promise<PostListPaginatedOutput> {
        const {pageNumber, pageSize, sortBy, sortDirection} = queryDto;

        const pageNumberNum = Number(pageNumber) || 1;
        const pageSizeNum = Number(pageSize) || 10;


        const filter = {'blogId': blogId};
        const skip = (pageNumberNum - 1) * pageSizeNum;

        const [items, totalCount] = await Promise.all([
            postCollection
                .find(filter)
                .sort({[sortBy]: sortDirection})
                .skip(skip)
                .limit(pageSizeNum)
                .toArray(),
            postCollection.countDocuments(filter),
        ]);
        return mapToPostListPaginatedOutput(items, {
            pageNumber: pageNumberNum,
            pageSize: pageSizeNum,
            totalCount,
        });
    }

        async findByIdOrFail(id:string): Promise<PostOutput>{
        const post = await postCollection.findOne({_id: new ObjectId(id)});

        if(!post) {
            throw new RepositoryNotFoundError('Post not exist');
        }
        return mapToPostOutputUtil(post);
        }

    }