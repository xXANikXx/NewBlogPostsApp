import mongoose, {HydratedDocument, model, Model} from "mongoose";

export type RequestLogDto = {
    IP: string;
    URL: string;
    date: Date;
    count: number;
}
export type RateLimitDocument = HydratedDocument<RequestLogDto>;
export type RequestLogModel = Model<RateLimitDocument>


export const RequestLogSchema = new mongoose.Schema<RequestLogDto>({
    IP: { type: String, required: true },
    URL: { type: String, required: true },
    date: { type: Date, required: true },
    count: { type: Number, required: true },
})

RequestLogSchema.index({ date: 1 }, { expireAfterSeconds: 10 });

export const RateLimitModel = model<RequestLogDto, RequestLogModel>('rateLimits', RequestLogSchema);