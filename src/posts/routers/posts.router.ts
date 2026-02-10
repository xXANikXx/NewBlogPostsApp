import { Router } from "express";
import {
    paginationAndSortingValidation
} from "../../core/middlewares/query-pagination-sorting.validation-middleware";
import {PostSortField} from "./request-payloads/post-soft-field";
import {
    inputValidationResultMiddleware
} from "../../core/middlewares/input-validation-result.middleware";
import {
    idValidation
} from "../../core/middlewares/params-id.validation-middleware";
import {
    superAdminGuardMiddleware
} from "../../auth/adapters/middlewares/super-admin.guard-middleware";
import {postInputDtoValidation} from "./post.input-dto.validation";
import {COMMENTS_PATH} from "../../core/paths/paths";
import {
    CommentSortField
} from "../../comments/routers/request-payloads/comment-sort-field";
import {
    commentInputDtoValidation
} from "../../comments/routers/comment.input-dto.validation";
import {container} from "../../composition.root";
import {PostsController} from "./posts-controller/posts-controller";
import {
    CommentsController
} from "../../comments/routers/comments-controller/comments-controller";
import {
    AccessTokenGuard
} from "../../auth/adapters/middlewares/access.token.guard";
import {
    NoneStatusGuard
} from "../../auth/adapters/middlewares/none-status.guard";
import {likeStatusValidation} from "../../likes/router/validation/validation";
import {LikeController} from "../../likes/router/like-controller";

export const postsRouter = Router({});

const controller = container.get(PostsController);
const controllerComments = container.get(CommentsController);
const accessTokenGuard = container.get(AccessTokenGuard);
const noneStatusGuard = container.get(NoneStatusGuard);
const likeController = container.get(LikeController);


postsRouter
    .get('/',  noneStatusGuard.handle.bind(noneStatusGuard) ,paginationAndSortingValidation(PostSortField), inputValidationResultMiddleware, controller.getPostListHandler.bind(controller))

    .get('/:id', noneStatusGuard.handle.bind(noneStatusGuard), idValidation, inputValidationResultMiddleware, controller.getPostHandler.bind(controller))

    .post('/', superAdminGuardMiddleware, postInputDtoValidation, inputValidationResultMiddleware, controller.createPostHandler.bind(controller))

    .put('/:id', superAdminGuardMiddleware, idValidation, postInputDtoValidation, inputValidationResultMiddleware, controller.updatePostHandler.bind(controller))

    .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, controller.deletePost.bind(controller))

    .get(`/:id${COMMENTS_PATH}`, noneStatusGuard.handle.bind(noneStatusGuard), idValidation, paginationAndSortingValidation(CommentSortField), inputValidationResultMiddleware, controllerComments.getCommentsByPostHandler.bind(controllerComments))

    .post(`/:id${COMMENTS_PATH}`, accessTokenGuard.handle.bind(accessTokenGuard), idValidation, commentInputDtoValidation,inputValidationResultMiddleware, controllerComments.createCommentsByPostHandler.bind(controllerComments))

    .put("/:id/like-status", accessTokenGuard.handle.bind(accessTokenGuard), idValidation, likeStatusValidation, inputValidationResultMiddleware, likeController.postLikeHandler.bind(likeController)  )
