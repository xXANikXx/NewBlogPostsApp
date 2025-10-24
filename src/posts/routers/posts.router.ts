import { Router } from "express";
import {
    paginationAndSortingValidation
} from "../../core/middlewares/query-pagination-sorting.validation-middleware";
import {PostSortField} from "./request-payloads/post-soft-field";
import {
    inputValidationResultMiddleware
} from "../../core/middlewares/input-validation-result.middleware";
import {getPostListHandler} from "./http-handlers/get-post.handler";
import {
    idValidation
} from "../../core/middlewares/params-id.validation-middleware";
import {getPostHandler} from "./http-handlers/get-post-list.handler";
import {
    superAdminGuardMiddleware
} from "../../auth/adapters/middlewares/super-admin.guard-middleware";
import {postInputDtoValidation} from "./post.input-dto.validation";
import {createPostHandler} from "./http-handlers/create-post.handler";
import {updatePostHandler} from "./http-handlers/update-post.handler";
import {deletePost} from "./http-handlers/delete-post.handler";

export const postsRouter = Router({});

postsRouter
    .get('/', paginationAndSortingValidation(PostSortField), inputValidationResultMiddleware, getPostListHandler)

    .get('/:id', idValidation, inputValidationResultMiddleware, getPostHandler)

    .post('/', superAdminGuardMiddleware, postInputDtoValidation, inputValidationResultMiddleware, createPostHandler)

    .put('/:id', superAdminGuardMiddleware, idValidation, postInputDtoValidation, inputValidationResultMiddleware, updatePostHandler)

    .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deletePost);