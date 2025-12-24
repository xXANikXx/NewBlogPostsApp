// import {HttpStatus} from "../../../core/typesAny/http-statuses";
// import {errorHandler} from "../../../core/errors/errors.handler";
// import { Request, Response } from 'express';
// import {commentQueryService} from "../../../composition.root";
//
//
// export async function getCommentHandler(req: Request<{id: string}>,
//                                         res: Response,) {
//     try {
//         const id = req.params.id;
//
//         const commentOutput = await this.commentQueryService.findByIdOrFail(id);
//
//         res.status(HttpStatus.Ok).send(commentOutput);
//     } catch (e: unknown) {
//         errorHandler(e, res);
//     }
// }