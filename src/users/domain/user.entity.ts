import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {UserDomainDto} from "./user-domain.dto";
import {EmailConfirmationType} from "./email-confirmation.type";
import {PasswordRecoveryType} from "./password-recovery.type";


export type UserDocument = HydratedDocument<UserDomainDto>;
export type UserModelType = Model<UserDocument>;


export const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
});

export const PasswordRecoverySchema = new mongoose.Schema<PasswordRecoveryType>({
    recoveryCode: { type: String, default: null },
    expirationDate: { type: Date, default: null, required: false },
});

export const UserSchema = new mongoose.Schema<UserDomainDto>({
    login: { type: String, required: true, unique: true, minlength: 3, maxlength: 100 },
    email: { type: String, required: true, unique: true, minlength: 3, maxlength: 100 },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true }, // Используем Date

    // Вложение схем
    emailConfirmation: { type: EmailConfirmationSchema, required: true },
    passwordRecovery: { type: PasswordRecoverySchema, required: true },
});

export const UserModel = model<UserDomainDto, UserModelType>('users', UserSchema);