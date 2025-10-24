import {ClassFieldsOnly} from "../../core/typesAny/fields-only";
import {ObjectId, WithId} from "mongodb";
import {CommentDomainDto} from "./comment-domain.dto";

export class Comment{
_id?: ObjectId;
content: string;
commentatorInfo: {
    userId: string;
    userLogin: string;
}
    createdAt: string;


private constructor(dto: ClassFieldsOnly<Comment>) {
    this.content = dto.content;
    this.commentatorInfo = dto.commentatorInfo;
    this.createdAt = dto.createdAt;

    if(dto._id) {
        this._id = dto._id;
    }
}

static create (dto: CommentDomainDto) {
    return new Comment({
        content: dto.content,
        commentatorInfo: dto.commentatorInfo,
        createdAt: dto.createdAt,
    })
}

update (dto: {content: string}) {
    this.content = dto.content;
}

static reconstitute(dto : ClassFieldsOnly<Comment>): WithId<Comment> {
    const instance = new Comment(dto);

    return instance as WithId<Comment>;
}

}