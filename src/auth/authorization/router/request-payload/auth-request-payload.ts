export type LoginRequestPayload = {
    loginOrEmail: string;
    password: string;
};

export type AuthMePayload = {
    email: string;
    login: string;
    userId: string;
}