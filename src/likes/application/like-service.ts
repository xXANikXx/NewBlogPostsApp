import {injectable} from "inversify";
import {LikeRepository} from "../repositories/like-repository";
import {inject} from "inversify";
import {PostsRepository} from "../../posts/repositoriesPosts/posts.repository";
import {
    CommentsRepository
} from "../../comments/repositoriesComments/comment.repository";
import {EntityType, LikeModel, LikeStatus} from "../domain/like-entity";


@injectable()

export class LikeService {
    constructor(@inject(LikeRepository) private likeRepository: LikeRepository,
                @inject(PostsRepository) private postsRepository: PostsRepository,
                @inject(CommentsRepository) private commentsRepository: CommentsRepository) {}


    async changeLikeStatus(
        userId: string,
        userLogin: string,
        entityId: string,
        entityType: EntityType,
        newStatus: LikeStatus
    ): Promise<void> {

        if (entityType === EntityType.Post) {
            // Если пост не найден, findByIdOrFail выбросит ошибку,
            await this.postsRepository.findByIdOrFail(entityId);
        } else {
            await this.commentsRepository.findByIdOrFail(entityId);
        }

        const existingLike = await this.likeRepository.findLikeStatus(userId, entityId, entityType);

        //если статуса нет, то создаём новый
        if (!existingLike) {
            if (newStatus === LikeStatus.None) {
                return;
            }

            const newLike = new LikeModel({
                userId,
                userLogin,
                entityId,
                entityType,
                status: newStatus,
                addedAt: new Date(),
            });

            await this.likeRepository.save(newLike);
            return;

        }


        //понятие идемпотентность, если статусы одинаковые, ничего не меняем
            if (existingLike.status === newStatus) {
                return;
            }


            // если пришёл none, то удаляем like/dislike
            if (newStatus ===  LikeStatus.None) {
                await this.likeRepository.delete(userId, entityId, entityType);
            return;
            }


            //обновляем, если пришёл лайк, а у нас дизлайк, на дизлайк и т.д
        existingLike.status = newStatus;
        existingLike.userLogin = userLogin;
        existingLike.addedAt = new Date();
        await this.likeRepository.save(existingLike);


    }

}