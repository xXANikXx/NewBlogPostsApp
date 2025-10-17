
export type CreateBlogCommand = {
    name: string;
    description: string;
    websiteUrl: string;
};

export type UpdateBlogCommand = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
};
