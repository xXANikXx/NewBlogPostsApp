import { Router, Request, Response } from 'express';
import { HttpStatus } from "../../core/typesAny/http-statuses"
import {
    RateLimitModel
} from "../../auth/authorization/rateLimit/req.log.entity.ts/request_log.dto";
import {CommentModel} from "../../comments/domain/comment.entity";
import {SessionModel} from "../../auth/authorization/domain/session.entity";
import {BlogModel} from "../../blogs/domain/blog.entity";
import {PostModel} from "../../posts/domain/posts.entity";
import {UserModel} from "../../users/domain/user.entity";



export const testingRouter = Router({});

testingRouter.delete('/all-data', async (_req: Request, res: Response) => {
    //truncate db
    await Promise.all([
        SessionModel.deleteMany(),
        BlogModel.deleteMany(),
        PostModel.deleteMany(),
        UserModel.deleteMany(),
        CommentModel.deleteMany(),
        RateLimitModel.deleteMany(),
    ]);
    res.sendStatus(HttpStatus.NoContent);
});
