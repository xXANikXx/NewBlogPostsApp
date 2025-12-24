// import {
//     CreateCommentsByPostRequestPayload
// } from "../request-payloads/create-comment-request.payload";
// import {Request, Response} from "express";
// import {
//     CreateCommentsByPostCommand
// } from "../../application/command-handlers/comment-command";
// import {HttpStatus} from "../../../core/typesAny/http-statuses";
// import {errorHandler} from "../../../core/errors/errors.handler";
//
//
// export async function createCommentsByPostHandler(
//     req: Request<{id: string}, {}, CreateCommentsByPostRequestPayload>,
//     res: Response,
// ) {
//     try {
//         if (!req.user) return res.sendStatus(HttpStatus.Unauthorized);
//
//         const postId = req.params.id;
//
//         const command: CreateCommentsByPostCommand = {
//             postId,
//             content: req.body.content,
//             userId: req.user.id,
//             userLogin: req.user.login,
//         };
//
//         const createCommentId = await this.commentsService.createCommentsByPost(command);
//
//         const commentOutput = await this.commentQueryService.findByIdOrFail(createCommentId)
//
//         res.status(HttpStatus.Created).send(commentOutput);
//     } catch(e: unknown) {
//         errorHandler(e, res);
//     }
// }