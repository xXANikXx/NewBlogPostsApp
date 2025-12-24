// import { Request, Response } from "express";
// import { errorHandler } from "../../../core/errors/errors.handler";
// import { HttpStatus } from "../../../core/typesAny/http-statuses";
// import {postsQueryService} from "../../../composition.root";
//
// export async function getPostHandler(req: Request, res: Response) {
//     try {
//         const id = req.params.id;
//
//
//         const postOutput = await this.postsQueryService.findByIdOrFail(id);
//
//         res.status(HttpStatus.Ok).send(postOutput);
//     } catch (e: unknown) {
//         errorHandler(e, res);
//     }
// }