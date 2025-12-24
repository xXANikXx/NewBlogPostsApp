import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {PostDomainDto} from "./post-domain-dto";


export type PostDocument = HydratedDocument<PostDomainDto>;
export type PostModelType = Model<PostDocument>;

export const PostSchema = new mongoose.Schema({
    title: {type: String, required: true, minLength: 1},
    shortDescription: {type: String, required: true, minLength: 1},
    content: {type: String, required: true, minLength: 1},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
})

export const PostModel = model<PostDomainDto, PostModelType>('posts', PostSchema);