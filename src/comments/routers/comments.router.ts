import {Router} from "express";
import {
    idValidation
} from "../../core/middlewares/params-id.validation-middleware";
import {
    inputValidationResultMiddleware
} from "../../core/middlewares/input-validation-result.middleware";

import {
    AccessTokenGuard,} from "../../auth/adapters/middlewares/access.token.guard";
import {commentInputDtoValidation} from "./comment.input-dto.validation";
import {container} from "../../composition.root";
import {CommentsController} from "./comments-controller/comments-controller";
import {LikeController} from "../../likes/router/like-controller";
import {likeStatusValidation} from "../../likes/router/validation/validation";


export const commentRouter = Router({});

const controller = container.get(CommentsController);
const accessTokenGuard = container.get(AccessTokenGuard);
const likeController = container.get(LikeController);

commentRouter
    .get("/:id", idValidation, inputValidationResultMiddleware, controller.getCommentHandler.bind(controller))
    .put("/:id", accessTokenGuard.handle.bind(accessTokenGuard), idValidation, commentInputDtoValidation, inputValidationResultMiddleware, controller.updateCommentHandler.bind(controller))
    .delete("/:id", accessTokenGuard.handle.bind(accessTokenGuard), idValidation, inputValidationResultMiddleware, controller.deleteCommentHandler.bind(controller))
    .put("/:id/like-status", accessTokenGuard.handle.bind(accessTokenGuard), idValidation, likeStatusValidation, inputValidationResultMiddleware, likeController.likeHandler.bind(likeController)  )
