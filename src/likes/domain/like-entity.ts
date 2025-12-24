import mongoose, {HydratedDocument, Model, model} from "mongoose";

export enum LikeStatus {
    Like = 'Like',
    Dislike = 'Dislike',
    None = 'None'
}

export enum EntityType {
    Comment = 'Comment',
    Post = 'Post'
}

export type LikeDto = {
    entityId: string;        //айди сущности
    entityType: EntityType; //тип сущности, делаю для большего контроля
    userId: string;
    status: LikeStatus;
    addedAt: Date;
}

export const LikesInfoSchema = new mongoose.Schema({
    likesCount: { type: Number, default: 0 },
    dislikesCount: { type: Number, default: 0 },
    myStatus: { type: String, enum: Object.values(LikeStatus), default: LikeStatus.None },
});

export type LikeDocument = HydratedDocument<LikeDto>;
export type LikeModelType = Model<LikeDocument>;

export const LikeSchema = new mongoose.Schema({
    entityId: {type: String, required: true},
    entityType: { type: String, enum: Object.values(EntityType), required: true },
    userId: {type: String, required: true},
    status: {type: String, enum: Object.values(LikeStatus), required: true},
    addedAt: {type: Date, required: true, default: Date.now},
})

LikeSchema.index({ entityId: 1, entityType: 1, userId: 1 }, { unique: true });

export const LikeModel = model<LikeDto, LikeModelType>('likes', LikeSchema)
