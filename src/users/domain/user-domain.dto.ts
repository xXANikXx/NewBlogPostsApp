import {EmailConfirmationType} from "./email-confirmation.type";
import {PasswordRecoveryType} from "./password-recovery.type";

export type UserDomainDto = {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    emailConfirmation: EmailConfirmationType;
    passwordRecovery: PasswordRecoveryType;
}