import { Request, Response } from "express";
import {LikeService} from "../application/like-service";
import {inject, injectable} from "inversify";
import {EntityType, LikeStatus} from "../domain/like-entity";
import {BadReq} from "../../core/errors/login-email.error";
import {HttpStatus} from "../../core/typesAny/http-statuses";


@injectable()

export class LikeController {
    constructor(@inject(LikeService) private likeService: LikeService) {}

    public async likeHandler(
        req: Request<{ commentId: string }, {}, { likeStatus: LikeStatus }>,
        res: Response
    ) {
        const commentId = req.params.commentId;
        const likeStatus = req.body.likeStatus;
        const userId = req.user?.id;

        if (!userId) {
            return res.sendStatus(HttpStatus.Unauthorized);
        }

        if (!Object.values(LikeStatus).includes(likeStatus)) {
            throw new BadReq('likeStatus', `Invalid value: ${likeStatus}`);
        }

        await this.likeService.changeLikeStatus(userId, commentId, EntityType.Comment, likeStatus);

        res.sendStatus(HttpStatus.NoContent);
    }


}

