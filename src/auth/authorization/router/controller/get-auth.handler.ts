// import {Request, Response} from 'express';
// import {usersRepository} from "../../../../composition.root";
//
//
//
// export async function getAuthMeHandler(req: Request, res: Response) {
//     if (!req.user) return res.sendStatus(401);
//
//     const user = await usersRepository.findByIdOrFail(req.user.id);
//     console.log('Found user:', user);
//     if (!user) return res.sendStatus(404);
//
//     return res.status(200).send({
//         email: user.email,
//         login: user.login,
//         userId: user._id!.toString(),
//     });
// }