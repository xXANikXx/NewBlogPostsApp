// import {ObjectId, WithId} from "mongodb";
// import {ClassFieldsOnly} from "../../core/typesAny/fields-only";
// import {UserDomainDto} from "./user-domain.dto";
// import {EmailConfirmationType} from "./email-confirmation.type";
// import {PasswordRecoveryType} from "./password-recovery.type";
//
// export class User{
//     _id?: ObjectId;
//     login: string;
//     email: string;
//     passwordHash: string;
//     createdAt: string;
//     emailConfirmation: EmailConfirmationType;
//     passwordRecovery: PasswordRecoveryType;
//
//     private constructor(dto: ClassFieldsOnly<User>) {
//         this.login = dto.login;
//         this.email = dto.email;
//         this.passwordHash = dto.passwordHash;
//         this.createdAt = dto.createdAt;
//         this.emailConfirmation = dto.emailConfirmation;
//
//         this.passwordRecovery = dto.passwordRecovery || { recoveryCode: null, expirationDate: null };
//
//         if(dto._id) {
//             this._id = dto._id;
//         }
//     }
//
//     static create (dto: UserDomainDto) {
//         return new User({
//             login: dto.login,
//             email: dto.email,
//             passwordHash: dto.passwordHash,
//             createdAt: dto.createdAt,
//             emailConfirmation: dto.emailConfirmation,
//
//             passwordRecovery: { recoveryCode: null, expirationDate: null }
//
//         })
//     }
//
//     static reconstitute(dto: ClassFieldsOnly<User>):WithId<User> {
//         const instance = new User(dto);
//
//         return instance as WithId<User>;
//     }
//
//     public setPasswordRecoveryCode(code: string, expirationDate: Date): void {
//         this.passwordRecovery.recoveryCode = code;
//         this.passwordRecovery.expirationDate = expirationDate;
//     }
//
//     public updatePassword(newPasswordHash: string): void {
//         this.passwordHash = newPasswordHash;
//         this.passwordRecovery.recoveryCode = null;
//         this.passwordRecovery.expirationDate = null;
//     }
//
// }