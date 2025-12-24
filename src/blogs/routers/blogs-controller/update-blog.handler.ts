// import { Request, Response } from 'express';
// import {HttpStatus} from "../../../core/typesAny/http-statuses";
// import {UpdateBlogRequestPayload} from "../request-payloads/update-blog-request.payload";
// import {errorHandler} from "../../../core/errors/errors.handler";
// import {blogsService} from "../../../composition.root";
//
// export async function updateBlogHandler(
//     req: Request<{ id: string }, {}, UpdateBlogRequestPayload>,
//     res: Response,
// ) {
//     try {
//         const id = req.params.id;
//
//         await this.blogsService.update({
//             id,
//             ...req.body,
//         });
//
//         res.sendStatus(HttpStatus.NoContent);
//     } catch (e: unknown) {
//         errorHandler(e, res);
//     }
// }
