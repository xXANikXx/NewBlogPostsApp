// import { Request, Response } from 'express';
// import { HttpStatus } from "../../../core/typesAny/http-statuses";
// import {
//     CommentListRequestPayload
// } from "../request-payloads/comment-list-request.payload";
// import {errorHandler} from "../../../core/errors/errors.handler";
// import {commentQueryService} from "../../../composition.root";
//
//
// export async function getCommentsByPostHandler(
//     req: Request<{id:string}, {}, {}, CommentListRequestPayload>,
//     res: Response,
// ) {
//     try {
//         const postId = req.params.id;
//
//         const queryInput = req.query;
//
//         const commentListOutput = await this.commentQueryService.findCommentsByPost(
//             queryInput,
//             postId,
//         )
//
//         res.status(HttpStatus.Ok).send(commentListOutput);
//     } catch (e: unknown) {
//         errorHandler(e, res);
//     }
// }