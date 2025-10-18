import { Router, Request, Response } from 'express';
import { HttpStatus } from "../../core/typesAny/http-statuses"
import {
    blogCollection,
    postCollection,
    userCollection
} from "../../db/mongo.db";


export const testingRouter = Router({});

testingRouter.delete('/all-data', async (_req: Request, res: Response) => {
    //truncate db
    await Promise.all([
        blogCollection.deleteMany(),
        postCollection.deleteMany(),
        userCollection.deleteMany(),
    ]);
    res.sendStatus(HttpStatus.NoContent);
});
