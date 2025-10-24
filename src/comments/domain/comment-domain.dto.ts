export type CommentDomainDto = {
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    },
    createdAt: string;
}