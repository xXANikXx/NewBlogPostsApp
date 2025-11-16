import { Router, Request, Response } from 'express';
import { HttpStatus } from "../../core/typesAny/http-statuses"
import {
    blogCollection, commentCollection,
    postCollection, rateLimitCollection, sessionCollection,
    userCollection
} from "../../db/mongo.db";


export const testingRouter = Router({});

testingRouter.delete('/all-data', async (_req: Request, res: Response) => {
    //truncate db
    await Promise.all([
        sessionCollection.deleteMany(),
        blogCollection.deleteMany(),
        postCollection.deleteMany(),
        userCollection.deleteMany(),
        commentCollection.deleteMany(),
        rateLimitCollection.deleteMany(),
    ]);
    res.sendStatus(HttpStatus.NoContent);
});
