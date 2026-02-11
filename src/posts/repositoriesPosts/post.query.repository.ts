import {
    PostListPaginatedOutput
} from "../application/output/post-list-paginated.output";
import {
    mapToPostListPaginatedOutput
} from "../application/mappers/map-to-post-list-paginated-output";
import {PostOutput} from "../application/output/post.output";
import {
    PostListRequestPayload
} from "../routers/request-payloads/post-list-request.payload";
import {
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE, DEFAULT_SORT_BY
} from "../../core/middlewares/query-pagination-sorting.validation-middleware";
import { injectable} from "inversify";
import { PostModel} from "../domain/posts.entity";
import {
    EntityType,
    LikeModel,
    LikeStatus
} from "../../likes/domain/like-entity";
import {mapToPostOutputUtil} from "../application/mappers/map-to-post-output.utill";
import {
    RepositoryNotFoundError
} from "../../core/errors/repository-not-found.error";

@injectable()
export class PostsQueryRepository {
    constructor(
        // @inject(LikeRepository) private likeRepository: LikeRepository
    ) {}
    private async getPostsExtendedInfo(postIds: string[], userId?: string) {
        // 1. Агрегация для счетчиков и самых новых лайков
        const stats = await LikeModel.aggregate([
            { $match: { entityId: { $in: postIds }, entityType: EntityType.Post } },
            { $sort: { addedAt: -1 } }, // Сначала новые
            { $group: {
                    _id: "$entityId",
                    likesCount: { $sum: { $cond: [{ $eq: ["$status", LikeStatus.Like] }, 1, 0] } },
                    dislikesCount: { $sum: { $cond: [{ $eq: ["$status", LikeStatus.Dislike] }, 1, 0] } },
                    // Добавляем status сюда! Без него фильтр в $project не сработает
                    allLikes: { $push: {
                            userId: "$userId",
                            userLogin: "$userLogin",
                            addedAt: "$addedAt",
                            status: "$status"
                        } }
                }},
            { $project: {
                    likesCount: 1,
                    dislikesCount: 1,
                    newestLikes: {
                        $slice: [
                            {
                                $filter: {
                                    input: "$allLikes",
                                    as: "l",
                                    cond: { $eq: ["$$l.status", LikeStatus.Like] }
                                }
                            },
                            3
                        ]
                    }
                }}
        ]);

        // 2. Запрос на статусы текущего пользователя (если он есть)
        const userStatuses = userId
            ? await LikeModel.find({ userId, entityId: { $in: postIds }, entityType: EntityType.Post }).lean()
            : [];

        // Превращаем в Map для быстрого доступа
        return {
            statsMap: new Map(stats.map(s => [s._id.toString(), s])),
            statusMap: new Map(userStatuses.map(us => [us.entityId.toString(), us.status]))
        };
    }

    // Новый вспомогательный метод
    private async preparePostsWithLikes(dbItems: any[], userId?: string): Promise<PostOutput[]> {
        const postIds = dbItems.map(p => p._id.toString());
        const { statsMap, statusMap } = await this.getPostsExtendedInfo(postIds, userId);

        return dbItems.map(post => {
            const id = post._id.toString();
            const stats = statsMap.get(id);

            return mapToPostOutputUtil(post, {
                likesCount: stats?.likesCount || 0,
                dislikesCount: stats?.dislikesCount || 0,
                myStatus: statusMap.get(id) || LikeStatus.None,
                newestLikes: stats?.newestLikes || []
            });
        });
    }

    async findMany(
        queryDto: PostListRequestPayload,
        userId?: string
    ): Promise<PostListPaginatedOutput> {
        const pageNumberNum = Number(queryDto.pageNumber) || DEFAULT_PAGE_NUMBER;
        const pageSizeNum = Number(queryDto.pageSize) || DEFAULT_PAGE_SIZE;
        const sortByField = queryDto.sortBy || DEFAULT_SORT_BY;
        const sortDir = queryDto.sortDirection === 'asc' ? 1 : -1;

        const skip = (pageNumberNum - 1) * pageSizeNum;

        const [dbItems, totalCount] = await Promise.all([
            PostModel.find({}).sort({[sortByField]: sortDir }).skip(skip).limit(pageSizeNum),
            PostModel.countDocuments({}),
        ]);

        const items = await this.preparePostsWithLikes(dbItems, userId);

        return mapToPostListPaginatedOutput(items, {
            pageNumber: pageNumberNum,
            pageSize: pageSizeNum,
            totalCount,
        });
    }

    async findPostsByBlog(
        queryDto: PostListRequestPayload,
        blogId: string,
        userId?: string,
    ): Promise<PostListPaginatedOutput> {

        const pageNumberNum = Number(queryDto.pageNumber) || DEFAULT_PAGE_NUMBER;
        const pageSizeNum = Number(queryDto.pageSize) || DEFAULT_PAGE_SIZE;
        const sortBy = queryDto.sortBy || DEFAULT_SORT_BY;
        const sortDirection = queryDto.sortDirection === 'asc' ? 1 : -1;

        const filter = { blogId };
        const skip = (pageNumberNum - 1) * pageSizeNum;

        const [dbItems, totalCount] = await Promise.all([
            PostModel.find(filter).sort({ [sortBy]: sortDirection }).skip(skip).limit(pageSizeNum),
            PostModel.countDocuments(filter),
        ]);

        const items = await this.preparePostsWithLikes(dbItems, userId);

        return mapToPostListPaginatedOutput(items, {
            pageNumber: pageNumberNum,
            pageSize: pageSizeNum,
            totalCount,
        });
    }

        async findByIdOrFail(id: string, userId?: string): Promise<PostOutput> {
            const post = await PostModel.findById(id);
            if (!post) {
                throw new RepositoryNotFoundError('Post not exist');
            }

            const [enrichedPost] = await this.preparePostsWithLikes([post], userId);
            return enrichedPost;
        }
}
