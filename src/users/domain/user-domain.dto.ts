import {EmailConfirmationType} from "./email-confirmation.type";

export type UserDomainDto = {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    emailConfirmation: EmailConfirmationType;
}