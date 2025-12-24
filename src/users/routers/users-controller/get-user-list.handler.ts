// import {Request, Response} from "express";
// import {
//     setDefaultSortAndPaginationIfNotExist
// } from "../../../core/helpers/set-default-sort-and-pagination";
// import {HttpStatus} from "../../../core/typesAny/http-statuses";
// import {errorHandler} from "../../../core/errors/errors.handler";
// import {
//     UserListRequestPayload
// } from "../request-payloads/user-list-request.payload";
// import {userQueryService} from "../../../composition.root";
//
//
// export async function getUserHandler(
//     req: Request<{}, {}, {}, UserListRequestPayload>,
//     res: Response
// ) {
//     try {
//         const queryInput = setDefaultSortAndPaginationIfNotExist(req.query);
//         const userListOutput = await this.userQueryService.findMany(queryInput);
//         res.status(HttpStatus.Ok).send(userListOutput);
//     } catch (e: unknown) {
//         errorHandler(e, res);
//     }
// }
