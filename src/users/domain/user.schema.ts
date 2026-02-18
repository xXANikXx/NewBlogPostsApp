import mongoose, {HydratedDocument, model, Model} from "mongoose";
import {EmailConfirmationType} from "./email-confirmation.type";
import {PasswordRecoveryType} from "./password-recovery.type";
import {randomUUID} from "crypto";
import {add} from "date-fns/add";


type User = {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    emailConfirmation: EmailConfirmationType;
    passwordRecovery: PasswordRecoveryType;
}

interface UserMethods {
    updateConfirmationCode(): void,
    confirmEmail(code: string): void,
}

interface UserStatics {
    createUserByRegistration(login: string, email: string, passwordHash: string): UserDocument;
    createUserByAdmin(login: string, email: string, passwordHash: string): UserDocument;
}

type UserModelType = Model<User, {}, UserMethods> & UserStatics;
export type UserDocument = HydratedDocument<User, UserMethods>;

export const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
    confirmationCode: { type: String, required: true },
    expirationDate: { type: Date, required: true },
    isConfirmed: { type: Boolean, required: true },
});

export const PasswordRecoverySchema = new mongoose.Schema<PasswordRecoveryType>({
    recoveryCode: { type: String, default: null },
    expirationDate: { type: Date, default: null, required: false },
});

export const UserSchema = new mongoose.Schema<User>({
    login: { type: String, required: true, unique: true, minlength: 3, maxlength: 100 },
    email: { type: String, required: true, unique: true, minlength: 3, maxlength: 100 },
    passwordHash: { type: String, required: true },
    createdAt: { type: String, required: true },

    // Вложение схем
    emailConfirmation: { type: EmailConfirmationSchema, required: true },
    passwordRecovery: { type: PasswordRecoverySchema, required: true },
});

class UserEntity {
    private constructor(
        public login: string,
        public email: string,
        public passwordHash: string,
        public createdAt: string,
        public emailConfirmation: EmailConfirmationType,
        public passwordRecovery: PasswordRecoveryType,
    ) {}

    static createUserByRegistration(
    login: string,
    email: string,
    passwordHash: string
): UserDocument {
    // Вся логика генерации кодов и дат инкапсулирована здесь
    return new UserModel({
        login,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            confirmationCode: randomUUID(),
            expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
            isConfirmed: false,
        },
        passwordRecovery: {
            recoveryCode: null,
            expirationDate: null,
        },
    });
}

    static createUserByAdmin(login: string, email: string, passwordHash: string): UserDocument {
    return new UserModel({
        login,
        email,
        passwordHash,
        createdAt: new Date().toISOString(),
        emailConfirmation: {
            confirmationCode: randomUUID(), // Можно оставить для уникальности поля
            expirationDate: new Date(),    // Для админа срок не важен
            isConfirmed: true,             // ГЛАВНОЕ ОТЛИЧИЕ: сразу true
        },
        passwordRecovery: {
            recoveryCode: null,
            expirationDate: null
        }
    });
}

    updateConfirmationCode(){
if (this.emailConfirmation.isConfirmed) {
    throw new Error('Email already confirmed'); // Или свой класс DomainError
}
this.emailConfirmation.confirmationCode = randomUUID();
this.emailConfirmation.expirationDate = add(new Date(), { hours: 1, minutes: 30 })
}

    confirmEmail(code: string): void {
    // Валидация формата (защита от мусора)
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(code);
    if (!isUuid) {
    throw new Error('Incorrect code format');
}

// 1. Правило: Нельзя подтвердить уже подтвержденный email
if (this.emailConfirmation.isConfirmed) {
    throw new Error('Email already confirmed');
}

// 2. Правило: Коды должны совпадать
if (this.emailConfirmation.confirmationCode !== code) {
    throw new Error('Invalid confirmation code');
}

// 3. Правило: Срок жизни кода не должен истечь
if (new Date() > this.emailConfirmation.expirationDate) {
    throw new Error('Confirmation code expired');
}

// Все проверки пройдены — меняем состояние
this.emailConfirmation.isConfirmed = true;
}
}



UserSchema.loadClass(UserEntity);

export const UserModel = model<User, UserModelType>('users', UserSchema);