import {
    CommentListRequestPayload
} from "../routers/request-payloads/comment-list-request.payload";
import {
    CommentListPaginatedOutput
} from "../application/output/comment-list-paginated.output";
import {
    DEFAULT_PAGE_NUMBER,
    DEFAULT_PAGE_SIZE, DEFAULT_SORT_BY
} from "../../core/middlewares/query-pagination-sorting.validation-middleware";
import {
    mapToCommentListPaginatedOutput
} from "../application/mappers/map-to-comment-list-paginated-output";
import {CommentOutput} from "../application/output/comment.output";
import {
    mapToCommentOutput
} from "../application/mappers/map-to-comment-output.utill";
import {CommentModel} from "../domain/comment.entity";
import {inject, injectable} from "inversify";
import {LikeRepository} from "../../likes/repositories/like-repository";
import {
    EntityType,
    LikeModel,
    LikeStatus
} from "../../likes/domain/like-entity";

@injectable()
export class CommentQueryRepository {
    constructor(
        @inject(LikeRepository) private likeRepository: LikeRepository
    ) {}

    async findCommentsByPost(
        queryDto: CommentListRequestPayload,
        postId: string,
        userId?: string,
    ): Promise<CommentListPaginatedOutput> {

        const pageNumberNum = Number(queryDto.pageNumber) || DEFAULT_PAGE_NUMBER;
        const pageSizeNum = Number(queryDto.pageSize) || DEFAULT_PAGE_SIZE;
        const sortBy = queryDto.sortBy || DEFAULT_SORT_BY;
        const sortDirection = queryDto.sortDirection === 'asc' ? 1 : -1;

        const filter = { postId: postId };
        const skip = (pageNumberNum - 1) * pageSizeNum;

        const [items, totalCount] = await Promise.all([
            CommentModel
                .find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(pageSizeNum),
            CommentModel.countDocuments(filter),
        ]);

        const commentIds = items.map(c => c._id.toString());

        // 2. Агрегация: Считаем лайки и дизлайки для всех ID разом
        const stats = await LikeModel.aggregate([
            { $match: { entityId: { $in: commentIds }, entityType: EntityType.Comment } },
            { $group: {
                    _id: "$entityId",
                    likesCount: { $sum: { $cond: [{ $eq: ["$status", LikeStatus.Like] }, 1, 0] } },
                    dislikesCount: { $sum: { $cond: [{ $eq: ["$status", LikeStatus.Dislike] }, 1, 0] } }
                }}
        ]);

        // 3. Получаем статусы текущего пользователя (если он залогинен)
        const userLikes = userId
            ? await LikeModel.find({ userId, entityId: { $in: commentIds }, entityType: EntityType.Comment }).lean()
            : [];

        // Создаем словари через reduce для мгновенного поиска O(1)
        const statsMap = stats.reduce((acc, s) => {
            acc[s._id] = s;
            return acc;
        }, {} as Record<string, any>);

        const userStatusMap = userLikes.reduce((acc, ul) => {
            acc[ul.entityId] = ul.status;
            return acc;
        }, {} as Record<string, string>);

        // Финальная сборка массива без N+1 запросов
        const mappedItems: CommentOutput[] = items.map(comment => {
            const id = comment._id.toString();
            const s = statsMap[id];

            return mapToCommentOutput(comment, {
                likesCount: s?.likesCount || 0,
                dislikesCount: s?.dislikesCount || 0,
                myStatus: (userStatusMap[id] as LikeStatus) || LikeStatus.None
            });
        });

        return mapToCommentListPaginatedOutput(mappedItems, {
            pageNumber: pageNumberNum,
            pageSize: pageSizeNum,
            totalCount,
        });
    }

    async findByIdOrFail(id: string, userId?: string): Promise<CommentOutput | null> {
        const comment = await CommentModel.findById(id);

        if (!comment) {
            return null; // Возвращаем null, чтобы Service мог упаковать это в Result.NotFound
        }

        const [likesCount, dislikesCount, myStatus] = await Promise.all([
            this.likeRepository.countLikes(id, EntityType.Comment),
            this.likeRepository.countDislikes(id, EntityType.Comment),
            userId
                ? this.likeRepository.getMyStatus(userId, id, EntityType.Comment)
                : LikeStatus.None
        ]);

        return mapToCommentOutput(comment, { likesCount, dislikesCount, myStatus });
    }
}