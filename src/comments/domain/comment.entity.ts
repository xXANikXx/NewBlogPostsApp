import {CommentDomainDto} from "./comment-domain.dto";
import mongoose, {HydratedDocument, model, Model} from "mongoose";
import { LikesInfoSchema} from "../../likes/domain/like-entity";

export type CommentDocument = HydratedDocument<CommentDomainDto>;
export type CommentModelType = Model<CommentDocument>;



export const CommentatorSchema = new mongoose.Schema({
    userId: {type: String, required: true},
    userLogin: {type: String, required: true},
})

export const CommentSchema = new mongoose.Schema<CommentDomainDto>({
    content: {type: String, required: true, minlength: 1, maxlength: 300},
    commentatorInfo: {type: CommentatorSchema, required: true},
    createdAt: {type: Date, default: Date.now},
    postId: {type: String, required: true},
    likesInfo: { type: LikesInfoSchema, default: () => ({}) } //default: () => ({}) для фелотных значении
})

export const CommentModel = model< CommentDomainDto, CommentModelType>('comments', CommentSchema);