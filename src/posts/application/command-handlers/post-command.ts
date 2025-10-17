export type CreatePostCommand = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
};

export type UpdatePostCommand = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
};

export type CreatePostByBlogCommand = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
};
