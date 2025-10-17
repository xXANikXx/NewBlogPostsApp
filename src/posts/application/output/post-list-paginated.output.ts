import {PostOutput} from "./post.output";

export type PostListPaginatedOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: PostOutput[];
}