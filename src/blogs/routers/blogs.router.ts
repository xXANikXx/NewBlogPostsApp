import { Router } from "express";
import {
    paginationAndSortingValidation
} from "../../core/middlewares/query-pagination-sorting.validation-middleware";
import {BlogSortField} from "./request-payloads/blog-soft-field";
import {
    inputValidationResultMiddleware
} from "../../core/middlewares/input-validation-result.middleware";
import {
    superAdminGuardMiddleware
} from "../../auth/adapters/middlewares/super-admin.guard-middleware";
import {blogInputDtoValidation} from "./blog.input-dto.validation";

import {POSTS_PATH} from "../../core/paths/paths";
import {PostSortField} from "../../posts/routers/request-payloads/post-soft-field";
import {
    createPostByBlogValidation
} from "../../posts/routers/post.input-dto.validation";
import {BlogsController} from "./blogs-controller/blogs-controller";
import {container} from "../../composition.root";
import {
    idValidation
} from "../../core/middlewares/params-id.validation-middleware";
import {
    NoneStatusGuard
} from "../../auth/adapters/middlewares/none-status.guard";



export const blogsRouter = Router({});

const controller = container.get(BlogsController);
const noneStatusGuard = container.get(NoneStatusGuard);


blogsRouter
    .get("/", paginationAndSortingValidation(BlogSortField), inputValidationResultMiddleware, controller.getBlogListHandler.bind(controller))

    .get('/:id', noneStatusGuard.handle.bind(noneStatusGuard), idValidation, inputValidationResultMiddleware, controller.getBlogHandler.bind(controller))

    .post('/', superAdminGuardMiddleware, blogInputDtoValidation, inputValidationResultMiddleware, controller.createBlogHandler.bind(controller))

    .put('/:id', superAdminGuardMiddleware, idValidation, blogInputDtoValidation, inputValidationResultMiddleware, controller.updateBlogHandler.bind(controller))

    .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, controller.deleteBlogHandler.bind(controller))

    .get(`/:id${POSTS_PATH}`, noneStatusGuard.handle.bind(noneStatusGuard),idValidation, paginationAndSortingValidation(PostSortField), inputValidationResultMiddleware, controller.getBlogPostListHandler.bind(controller))

    .post(`/:id${POSTS_PATH}`, noneStatusGuard.handle.bind(noneStatusGuard),superAdminGuardMiddleware, idValidation, createPostByBlogValidation, inputValidationResultMiddleware, controller.createPostByBlogHandler.bind(controller))