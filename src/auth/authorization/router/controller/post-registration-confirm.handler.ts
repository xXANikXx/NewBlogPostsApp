// import {Request, Response} from 'express';
// import {ResultStatus} from "../../../../common/result/resultCode";
// import {HttpStatus} from "../../../../core/typesAny/http-statuses";
// import {errorHandler} from "../../../../core/errors/errors.handler";
// import {authService} from "../../../../composition.root";
//
//
// export async function postRegistrationConfirmHandler(req: Request, res: Response) {
//     try {
//         const { code } = req.body;
//
//         const result = await authService.confirmEmail(code);
//
//         if (result.status === ResultStatus.BadRequest) {
//             return res.status(HttpStatus.BadRequest).send({
//                 errorsMessages: result.extensions,
//             });
//         }
//
//         return res.sendStatus(HttpStatus.NoContent);
//     } catch (e) {
//         errorHandler(e, res);
//     }
// }