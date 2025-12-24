import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {BlogDomainDto} from "./blog-domain.dto";

export type BlogDocument = HydratedDocument<BlogDomainDto>;
export type BlogModelType = Model<BlogDocument>;

export const BlogSchema = new mongoose.Schema<BlogDomainDto>({
    name: {type: String, required: true, minlength: 1, maxlength: 200},
    description: {type: String, required: true, minlength: 1, maxlength: 200},
    websiteUrl: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, required: true},
    isMembership: {type: Boolean, default: false, required: true},
})

export const BlogModel = model<BlogDomainDto, BlogModelType>('blogs', BlogSchema);