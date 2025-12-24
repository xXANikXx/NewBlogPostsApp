// import {ObjectId,WithId} from "mongodb";
// import {ClassFieldsOnly} from "../../core/typesAny/fields-only";
// import {PostDomainDto} from "./post-domain-dto";
// import {UpdatePostDomainDto} from "./update-post-domain-dto";
//
// export class Post {
//     _id?: ObjectId;
//     title: string;
//     shortDescription: string;
//     content: string;
//     blogId: string;
//     blogName: string;
//     createdAt: string;
//
//     private constructor(dto: ClassFieldsOnly<Post>) {
//         this.title = dto.title;
//         this.shortDescription = dto.shortDescription;
//         this.content = dto.content;
//         this.blogId = dto.blogId;
//         this.blogName = dto.blogName;
//         this.createdAt = dto.createdAt;
//         if (dto._id) this._id = dto._id;
//     }
//
//     static create(dto: PostDomainDto) {
//         return new Post({
//             title: dto.title,
//             shortDescription: dto.shortDescription,
//             content: dto.content,
//             blogId: dto.blogId,
//             blogName: dto.blogName,
//             createdAt: new Date().toISOString(),
//         });
//     }
//
//     update(dto: UpdatePostDomainDto) {
//         this.title = dto.title;
//         this.shortDescription = dto.shortDescription;
//         this.content = dto.content;
//         this.blogId = dto.blogId;
//     }
//
//     static reconstitute(dto: ClassFieldsOnly<Post>): WithId<Post> {
//         const instance = new Post(dto);
//         return instance as WithId<Post>;
//     }
// }
