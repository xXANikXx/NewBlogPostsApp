import {LikeStatus} from "../../domain/like-entity";
import {body} from "express-validator";

export const likeStatusValidation = body('likeStatus')
    .exists().withMessage('likeStatus is required')
    .isIn(Object.values(LikeStatus))
    .withMessage(`likeStatus must be one of: ${Object.values(LikeStatus).join(', ')}`);