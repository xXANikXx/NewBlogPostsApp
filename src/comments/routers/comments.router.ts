import {Router} from "express";
import {
    idValidation
} from "../../core/middlewares/params-id.validation-middleware";
import {
    inputValidationResultMiddleware
} from "../../core/middlewares/input-validation-result.middleware";
import {getCommentHandler} from "./http-handlers/get-comment.handler";
import {
    accessTokenGuard
} from "../../auth/adapters/middlewares/access.token.guard";
import {updateCommentHandler} from "./http-handlers/update-comment.handler";
import {deleteCommentHandler} from "./http-handlers/delete-comment.handler";
import {
    paginationAndSortingValidation
} from "../../core/middlewares/query-pagination-sorting.validation-middleware";
import {CommentSortField} from "./request-payloads/comment-sort-field";
import {
    getCommentsByPostHandler
} from "./http-handlers/get-comments-post.handler";
import {commentInputDtoValidation} from "./comment.input-dto.validation";
import {
    createCommentsByPostHandler
} from "./http-handlers/create-comments-post.handler";


export const commentRouter = Router({});

commentRouter
    .get("/:id", idValidation, inputValidationResultMiddleware, getCommentHandler)
    .put("/:id", accessTokenGuard, idValidation, commentInputDtoValidation, inputValidationResultMiddleware, updateCommentHandler)
.delete("/:id", accessTokenGuard, idValidation, inputValidationResultMiddleware,deleteCommentHandler)
