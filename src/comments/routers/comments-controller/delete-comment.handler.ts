// import {HttpStatus} from "../../../core/typesAny/http-statuses";
// import {errorHandler} from "../../../core/errors/errors.handler";
// import {Request, Response} from "express";
// import {commentsService} from "../../../composition.root";
//
// export async function deleteCommentHandler(
//     req: Request<{id: string}>,
//     res: Response,
// ) {
//     try {
//         const id = req.params.id;
//
//         await this.commentsService.delete(id, req.user!.id);
//
//         res.sendStatus(HttpStatus.NoContent);
//     } catch (e: unknown) {
//         errorHandler(e, res);
//     }
// }