// import {Request, Response} from "express";
// import {HttpStatus} from "../../../core/typesAny/http-statuses";
// import {errorHandler} from "../../../core/errors/errors.handler";
// import {usersService} from "../../../composition.root";
//
//
// export async function deleteUserHandler(req: Request<{id:string}>,
// res: Response,) {
//     try {
//         const id = req.params.id;;
//         await this.usersService.delete(id);
//
//         res.sendStatus(HttpStatus.NoContent);
//     } catch (e: unknown) {
//         errorHandler(e, res);
//     }
// }