// import { Request, Response } from 'express';
// import {
//     UpdateCommentRequestPayload
// } from "../request-payloads/update-comment-request.payload";
// import {HttpStatus} from "../../../core/typesAny/http-statuses";
// import {errorHandler} from "../../../core/errors/errors.handler";
// import {commentsService} from "../../../composition.root";
//
//
//
// export async function updateCommentHandler(
//     req: Request<{id: string}, {}, UpdateCommentRequestPayload>,
//     res: Response) {
//     try {
//         if (!req.user) return res.sendStatus(HttpStatus.Unauthorized);
//
//         await this.commentsService.update({
//             id: req.params.id,
//             content: req.body.content,
//             userId: req.user.id,
//         });
//
//         res.sendStatus(HttpStatus.NoContent);
//     } catch(e: unknown) {
//         errorHandler(e, res);
//     }
// }