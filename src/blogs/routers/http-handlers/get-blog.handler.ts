import { Request, Response } from "express";
import { errorHandler } from "../../../core/errors/errors.handler";

import { HttpStatus } from "../../../core/typesAny/http-statuses";
import {
    BlogListRequsetPayload
} from "../request-payloads/blos-list-request.payload";
import {
    setDefaultSortAndPaginationIfNotExist
} from "../../../core/helpers/set-default-sort-and-pagination";
import {blogsQueryService} from "../../application/blog.query.service";


export async function getBlogListHandler(
    req: Request<{}, {}, {}, BlogListRequsetPayload>,
    res: Response,) {
    try {
        const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);

        const blogListOutput = await blogsQueryService.findMany(queryInput)

        res.status(HttpStatus.Ok).send(blogListOutput);
    } catch (e: unknown) {
        errorHandler(e, res);
    }
}