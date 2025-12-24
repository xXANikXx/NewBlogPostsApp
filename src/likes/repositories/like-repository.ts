import {injectable} from "inversify";
import {
    EntityType,
    LikeDocument,
    LikeModel,
    LikeStatus
} from "../domain/like-entity";


@injectable()
export class LikeRepository {

    async findLikeStatus(userId: string, entityId: string, entityType: EntityType): Promise<LikeDocument | null> {

        return LikeModel.findOne({ userId, entityId, entityType });

    }

    async save(like: LikeDocument): Promise<LikeDocument> {
        return await like.save();
    }

    async delete(userId: string, entityId: string, entityType:EntityType): Promise<void> {
        await LikeModel.deleteOne({userId, entityId, entityType});

    }

    async countLikes(entityId: string, entityType:EntityType): Promise<number> {
        const count = await LikeModel.countDocuments({
            entityId,
            entityType,
            status: LikeStatus.Like,
        })

        return count;
    }

    async countDislikes(entityId: string, entityType:EntityType): Promise<number> {
        const count = await LikeModel.countDocuments({
            entityId,
            entityType,
            status: LikeStatus.Dislike,
        })

        return count;
    }


    async getMyStatus(userId: string, entityId: string, entityType:EntityType): Promise<LikeStatus> {
        const like = await this.findLikeStatus(userId, entityId, entityType);

        return like? like.status : LikeStatus.None;
    }

}