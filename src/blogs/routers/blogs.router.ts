import { Router } from "express";
import {
    paginationAndSortingValidation
} from "../../core/middlewares/query-pagination-sorting.validation-middleware";
import {BlogSortField} from "./request-payloads/blog-soft-field";
import {
    inputValidationResultMiddleware
} from "../../core/middlewares/input-validation-result.middleware";
import {getBlogListHandler} from "./http-handlers/get-blog.handler";
import {
    idValidation
} from "../../core/middlewares/params-id.validation-middleware";
import {getBlogHandler} from "./http-handlers/get-blog-list.handler";
import {
    superAdminGuardMiddleware
} from "../../auth/adapters/middlewares/super-admin.guard-middleware";
import {blogInputDtoValidation} from "./blog.input-dto.validation";
import {createBlogHandler} from "./http-handlers/create-blog.handler";
import {updateBlogHandler} from "./http-handlers/update-blog.handler";
import {deleteBlogHandler} from "./http-handlers/delete-blog.handler";
import {POSTS_PATH} from "../../core/paths/paths";
import {PostSortField} from "../../posts/routers/request-payloads/post-soft-field";
import {getBlogPostListHandler} from "./http-handlers/get-blog-post-list.handler";
import {
    createPostByBlogValidation
} from "../../posts/routers/post.input-dto.validation";
import {createPostByBlogHandler} from "./http-handlers/post-blog-post-list.handler";


export const blogsRouter = Router({});

blogsRouter
    .get("/", paginationAndSortingValidation(BlogSortField), inputValidationResultMiddleware, getBlogListHandler)

    .get('/:id', idValidation, inputValidationResultMiddleware, getBlogHandler)

    .post('/', superAdminGuardMiddleware, blogInputDtoValidation, inputValidationResultMiddleware, createBlogHandler)

    .put('/:id', superAdminGuardMiddleware, idValidation, blogInputDtoValidation, inputValidationResultMiddleware, updateBlogHandler)

    .delete('/:id', superAdminGuardMiddleware, idValidation, inputValidationResultMiddleware, deleteBlogHandler)

    .get(`/:id${POSTS_PATH}`, idValidation, paginationAndSortingValidation(PostSortField), inputValidationResultMiddleware, getBlogPostListHandler)

    .post(`/:id${POSTS_PATH}`, superAdminGuardMiddleware, idValidation, createPostByBlogValidation, inputValidationResultMiddleware, createPostByBlogHandler)