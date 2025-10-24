import express, { Express } from "express";
import {
    AUTH_PATH,
    BLOGS_PATH, COMMENTS_PATH,
    POSTS_PATH,
    TESTING_PATH,
    USERS_PATH
} from "./core/paths/paths";
import {testingRouter} from "./testing/routers/testing.router";
import {blogsRouter} from "./blogs/routers/blogs.router";
import {postsRouter} from "./posts/routers/posts.router";
import {usersRouter} from "./users/routers/users.router";
import {authRouter} from "./auth/authorization/router/auth.router";
import {commentRouter} from "./comments/routers/comments.router";



export const setupApp = async (app: Express) => {
    app.use(express.json());

    app.get("/", (_req, res) => {
        res.status(200).send('Hello World!');
    });

    app.use(AUTH_PATH, authRouter);

    app.use(BLOGS_PATH, blogsRouter);

    app.use(POSTS_PATH, postsRouter);

    app.use(USERS_PATH, usersRouter);

    app.use(COMMENTS_PATH, commentRouter);

    app.use(TESTING_PATH, testingRouter);

    return app;
}