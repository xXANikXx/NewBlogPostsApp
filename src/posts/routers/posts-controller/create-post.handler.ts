// import { Request, Response } from "express";
// import { HttpStatus } from "../../../core/typesAny/http-statuses";
// import { CreatePostRequestPayload } from "../request-payloads/create-post-request.payload";
// import { errorHandler } from "../../../core/errors/errors.handler";
// import {postsQueryService, postsService} from "../../../composition.root";
//
//
// export async function createPostHandler(
//     req: Request<{}, {}, CreatePostRequestPayload>,
//     res: Response,
// ) {
//     try {
//
//         const createPostId = await this.postsService.create(req.body);
//
//         const postOutput = await this.postsQueryService.findByIdOrFail(createPostId)
//
//         res.status(HttpStatus.Created).send(postOutput);
//     } catch (e: unknown) {
//         errorHandler(e, res);
//     }
// }