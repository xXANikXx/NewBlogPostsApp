import { Request, Response } from "express";
import {LikeService} from "../application/like-service";
import {inject, injectable} from "inversify";
import {EntityType, LikeStatus} from "../domain/like-entity";
import {BadReq} from "../../core/errors/login-email.error";
import {HttpStatus} from "../../core/typesAny/http-statuses";
import {errorHandler} from "../../core/errors/errors.handler";


@injectable()

export class LikeController {
    constructor(@inject(LikeService) private likeService: LikeService) {}

    public async commentLikeHandler(
        req: Request<{ id: string }, {}, { likeStatus: LikeStatus }>,
        res: Response
    ) {
        try {
            const commentId = req.params.id;
            const { likeStatus } = req.body;
            const { id: userId, login: userLogin } = req.user!;

            await this.likeService.changeLikeStatus(
                userId,
                userLogin,
                commentId,
                EntityType.Comment, // <-- Разница здесь
                likeStatus
            );

            res.sendStatus(HttpStatus.NoContent);
        } catch (e) {
            errorHandler(e, res);
        }
    }

    // Метод для постов
    public async postLikeHandler(
        req: Request<{ id: string }, {}, { likeStatus: LikeStatus }>,
        res: Response
    ) {
        try {
            const postId = req.params.id;
            const { likeStatus } = req.body;
            const { id: userId, login: userLogin } = req.user!;

            await this.likeService.changeLikeStatus(
                userId,
                userLogin,
                postId,
                EntityType.Post, // <-- И здесь
                likeStatus
            );

            res.sendStatus(HttpStatus.NoContent);
        } catch (e) {
            errorHandler(e, res);
        }
    }
}

