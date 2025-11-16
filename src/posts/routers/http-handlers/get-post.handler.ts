import { Request, Response } from "express";
import { errorHandler } from "../../../core/errors/errors.handler";
import {
    setDefaultSortAndPaginationIfNotExist
} from "../../../core/helpers/set-default-sort-and-pagination";

import { HttpStatus } from "../../../core/typesAny/http-statuses";
import {
    PostListRequestPayload
} from "../request-payloads/post-list-request.payload";
import {postsQueryService} from "../../../composition.root";


export async function getPostListHandler(
    req: Request<{}, {}, {}, PostListRequestPayload>,
    res: Response,
) {
    try {

        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

    const postListOutput = await postsQueryService.findMany(queryInput);

        res.status(HttpStatus.Ok).send(postListOutput);

    } catch (e: unknown) {
        errorHandler(e, res);
    }
}