import {BlogsRepository} from "./blogs/repositoriesBlogs/blogs.repository";
import {
    BlogQueryRepository
} from "./blogs/repositoriesBlogs/blog.query.repository";
import {
    PostsRepository,
} from "./posts/repositoriesPosts/posts.repository";
import {
    PostsQueryRepository
} from "./posts/repositoriesPosts/post.query.repository";
import {
    CommentsRepository
} from "./comments/repositoriesComments/comment.repository";
import {
    CommentQueryRepository
} from "./comments/repositoriesComments/comment.query.repository";
import {UsersRepository} from "./users/repositoriesUsers/users.repository";
import {
    UserQueryRepository
} from "./users/repositoriesUsers/user.query.repository";
import {BcryptService} from "./auth/adapters/crypto/password-hasher";
import {
    SessionRepository
} from "./auth/authorization/repository/session.repository";
import {NodemailerService} from "./auth/adapters/nodemailer.service";
import {JwtService} from "./auth/adapters/jwt.service";
import {
    RequestLogRepository
} from "./auth/authorization/rateLimit/repository/request-log.repository";
import {Container} from "inversify";
import {SecurityService} from "./auth/security/service/security.service";
import {BlogQueryService} from "./blogs/application/blog.query.service";
import {BlogsService} from "./blogs/application/blogs.service";
import {
    CommentQueryService
} from "./comments/application/comment.query.service";
import {CommentsService} from "./comments/application/comments.service";
import {PostsQueryService} from "./posts/application/posts.query.service";
import {PostsService} from "./posts/application/posts.service";
import {UserQueryService} from "./users/application/user.query.service";
import {UsersService} from "./users/application/users.service";
import {AuthService} from "./auth/authorization/service/auth.service";
import {LimitService} from "./auth/authorization/rateLimit/service/service";
import {
    AuthController
} from "./auth/authorization/router/controller/auth-controller";
import {
    SecurityController
} from "./auth/security/router/security-controller/security-controller";
import {
    BlogsController
} from "./blogs/routers/blogs-controller/blogs-controller";
import {
    CommentsController
} from "./comments/routers/comments-controller/comments-controller";
import {
    PostsController
} from "./posts/routers/posts-controller/posts-controller";
import {
    UsersController
} from "./users/routers/users-controller/users-controller";
import {
    RefreshTokenGuard
} from "./auth/adapters/middlewares/refresh-token.guard";
import {
    RateLimitMiddleware
} from "./auth/adapters/middlewares/rate-limit.middleware";
import {AccessTokenGuard} from "./auth/adapters/middlewares/access.token.guard";
import {LikeRepository} from "./likes/repositories/like-repository";
import {LikeService} from "./likes/application/like-service";
import {LikeController} from "./likes/router/like-controller";


export const container = new Container();

container.bind(RefreshTokenGuard).to(RefreshTokenGuard);
container.bind(RateLimitMiddleware).to(RateLimitMiddleware);
container.bind(AccessTokenGuard).to(AccessTokenGuard);


container.bind(NodemailerService).to(NodemailerService);
container.bind(JwtService).to(JwtService);
container.bind(BcryptService).to(BcryptService);
container.bind(RequestLogRepository).to(RequestLogRepository);
container.bind(SessionRepository).to(SessionRepository);
container.bind(LimitService).to(LimitService);

container.bind(BlogQueryRepository).to(BlogQueryRepository);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentQueryRepository).to(CommentQueryRepository);
container.bind(UsersRepository).to(UsersRepository);
container.bind(UserQueryRepository).to(UserQueryRepository);
container.bind(LikeRepository).to(LikeRepository);

container.bind(AuthService).to(AuthService);
container.bind(SecurityService).to(SecurityService);
container.bind(BlogQueryService).to(BlogQueryService);
container.bind(BlogsService).to(BlogsService);
container.bind(CommentQueryService).to(CommentQueryService);
container.bind(CommentsService).to(CommentsService);
container.bind(PostsQueryService).to(PostsQueryService);
container.bind(PostsService).to(PostsService);
container.bind(UserQueryService).to(UserQueryService);
container.bind(UsersService).to(UsersService);
container.bind(LikeService).to(LikeService);

container.bind(AuthController).to(AuthController);
container.bind(SecurityController).to(SecurityController);
container.bind(BlogsController).to(BlogsController);
container.bind(CommentsController).to(CommentsController);
container.bind(PostsController).to(PostsController);
container.bind(UsersController).to(UsersController);
container.bind(LikeController).to(LikeController);