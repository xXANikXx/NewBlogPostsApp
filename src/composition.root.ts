import {BlogsService} from "./blogs/application/blogs.service";
import {BlogsRepository} from "./blogs/repositoriesBlogs/blogs.repository";
import {
    BlogQueryRepository
} from "./blogs/repositoriesBlogs/blog.query.repository";
import {
    PostsRepository,
} from "./posts/repositoriesPosts/posts.repository";
import {BlogQueryService} from "./blogs/application/blog.query.service";
import {
    PostsQueryRepository
} from "./posts/repositoriesPosts/post.query.repository";
import {PostsService} from "./posts/application/posts.service";
import {PostsQueryService} from "./posts/application/posts.query.service";
import {
    CommentsRepository
} from "./comments/repositoriesComments/comment.repository";
import {
    CommentQueryRepository
} from "./comments/repositoriesComments/comment.query.repository";
import {CommentsService} from "./comments/application/comments.service";
import {
    CommentQueryService
} from "./comments/application/comment.query.service";
import {UserQueryService} from "./users/application/user.query.service";
import {UsersRepository} from "./users/repositoriesUsers/users.repository";
import {
    UserQueryRepository
} from "./users/repositoriesUsers/user.query.repository";
import {UsersService} from "./users/application/users.service";
import {BcryptService} from "./auth/adapters/crypto/password-hasher";
import {
    SessionRepository
} from "./auth/authorization/repository/session.repository";
import {SecurityService} from "./auth/security/service/security.service";
import {NodemailerService} from "./auth/adapters/nodemailer.service";
import {JwtService} from "./auth/adapters/jwt.service";
import {AuthService} from "./auth/authorization/service/auth.service";
import {
    RequestLogRepository
} from "./auth/authorization/rateLimit/repository/request-log.repository";
import {LimitService} from "./auth/authorization/rateLimit/service/service";

export const nodemailerService = new NodemailerService();
export const jwtService = new JwtService();
export const bcryptService = new BcryptService();
export const requestLogRepository = new RequestLogRepository();
export const sessionRepository = new SessionRepository();


export const blogQueryRepository = new BlogQueryRepository();
export const blogsRepository = new BlogsRepository();

export const postsRepository = new PostsRepository();
export const postsQueryRepository = new PostsQueryRepository();

export const commentsRepository = new CommentsRepository();
export const commentQueryRepository = new CommentQueryRepository();

export const usersRepository = new UsersRepository();
export const userQueryRepository = new UserQueryRepository();



export const authService = new AuthService(nodemailerService, jwtService, bcryptService, sessionRepository, usersRepository, userQueryRepository)
export const securityService = new SecurityService(sessionRepository);
export const limitService = new LimitService(requestLogRepository);


export const blogsQueryService = new BlogQueryService(blogQueryRepository)
export const blogsService = new BlogsService(blogsRepository, postsRepository);

export const postsService = new PostsService(postsRepository, blogsRepository,);
export const postsQueryService = new PostsQueryService(postsQueryRepository, blogsRepository);

export const commentsService = new CommentsService(commentsRepository, postsRepository);
export const commentQueryService = new CommentQueryService(commentQueryRepository, postsRepository);

export const usersService = new UsersService(usersRepository, bcryptService);
export const userQueryService = new UserQueryService(userQueryRepository);