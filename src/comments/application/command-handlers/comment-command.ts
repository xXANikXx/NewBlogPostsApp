export type UpdateCommentCommand = {
    id: string;
    content: string;
    userId: string
}

export type CreateCommentsByPostCommand = {
    postId: string; // из path параметра
    content: string; // из тела запроса
    userId: string; // берётся из авторизованного пользователя
    userLogin: string; // берётся тоже из пользователя
};
