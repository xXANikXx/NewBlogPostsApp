import { Request, Response, NextFunction } from "express";
import {HttpStatus} from "../../../core/typesAny/http-statuses";
import {inject, injectable} from "inversify";
import {JwtService} from "../jwt.service";
import {
    UsersRepository
} from "../../../users/repositoriesUsers/users.repository";

@injectable()
export class AccessTokenGuard {

    constructor(@inject(JwtService) private jwtService: JwtService,
                @inject(UsersRepository) private usersRepository: UsersRepository) {}

    public handle = async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        console.log('Authorization header:', authHeader);


        if (!authHeader) return res.sendStatus(HttpStatus.Unauthorized);

        console.log('Raw authHeader:', JSON.stringify(authHeader));

        const [authType, token] = authHeader.trim().split(' ');
        console.log('AuthType:', authType, 'Token:', token);


        if (authType !== 'Bearer' || !token) return res.sendStatus(HttpStatus.Unauthorized);

        const payload = await this.jwtService.verifyToken(token);
        console.log('Decoded payload:', payload);


        if (!payload) return res.sendStatus(HttpStatus.Unauthorized);

        const user = await this.usersRepository.findByIdOrFail(payload.userId);
        if (!user) return res.sendStatus(401);

        req.user = {
            id: user._id.toString(),
            login: user.login // Теперь логин точно не undefined
        };

        // const {userId, userLogin} = payload;
        // req.user = {id: userId, login: userLogin};

        next();
    };
}