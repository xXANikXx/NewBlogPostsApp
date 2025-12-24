// import {Request, Response} from 'express';
// import {
//     CreateUserCommand
// } from "../../../../users/application/command-handlers/user-commands";
// import {ResultStatus} from "../../../../common/result/resultCode";
// import {HttpStatus} from "../../../../core/typesAny/http-statuses";
// import {errorHandler} from "../../../../core/errors/errors.handler";
// import {authService} from "../../../../composition.root";
//
//
//
// export async function postAuthRegistration(req: Request<CreateUserCommand>, res: Response) {
//     try {
//         const { login, email, password } = req.body;
//
//         const result = await authService.registerUser(login, password, email);
//
//         if (result.status === ResultStatus.BadRequest) {
//             return res.status(HttpStatus.BadRequest).send({
//                 errorsMessages: result.extensions,
//             });
//         }
//
//         return res.sendStatus(HttpStatus.NoContent); // успешная регистрация
//     } catch (e) {
//         errorHandler(e, res);
//     }
// }
