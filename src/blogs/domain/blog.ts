import {ObjectId, WithId} from "mongodb";
import {BlogDomainDto} from "./blog-domain.dto";
import {ClassFieldsOnly} from "../../core/typesAny/fields-only";

export class Blog{
    _id?: ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;


    private constructor(dto: ClassFieldsOnly<Blog>) {
        this.name = dto.name;
        this.description = dto.description;
        this.websiteUrl = dto.websiteUrl;
        this.createdAt = dto.createdAt;
        this.isMembership = dto.isMembership;

        if(dto._id) {
            this._id = dto._id;
        }
    }

    static create (dto: BlogDomainDto) {
        return new Blog({
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
            createdAt: dto.createdAt,
            isMembership: dto.isMembership,
        });
    }

    update (dto: { name: string; description: string; websiteUrl: string }) {
        this.name = dto.name;
        this.description = dto.description;
        this.websiteUrl = dto.websiteUrl;
    }

    static reconstitute(dto: ClassFieldsOnly<Blog>): WithId<Blog> {
        const instance = new Blog(dto);

        return instance as WithId<Blog>;
    }
};