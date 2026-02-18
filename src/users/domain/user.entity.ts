// import {EmailConfirmationType} from "./email-confirmation.type";
// import {PasswordRecoveryType} from "./password-recovery.type";
// import {randomUUID} from "crypto";
//
// export class User {
//     constructor(
//         public login: string,
//         public email: string,
//         public passwordHash: string,
//         public createdAt: string,
//         public emailConfirmation: EmailConfirmationType,
//         public passwordRecovery: PasswordRecoveryType,
//         public id?: string, // ID опционален для новых юзеров
//     ) {}
//
//     // Фабричный метод для создания НОВОГО пользователя
//     static create(login: string, email: string, passwordHash: string): User {
//         return new User(
//             login,
//             email,
//             passwordHash,
//             new Date().toISOString(),
//             {
//                 confirmationCode: randomUUID(),
//                 isConfirmed: false,
//                 expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // +24ч
//             },
//             { recoveryCode: null, expirationDate: null }
//         );
//     }
//
//     public confirmEmail(code: string) {
//         if (this.emailConfirmation.confirmationCode !== code) throw new Error("Wrong code");
//         this.emailConfirmation.isConfirmed = true;
//     }
// }



//async resendEmail(email: string): Promise<Result<any>> {
//     const user = await this.usersRepository.findByLoginOrEmail(email);
//
//     if (!user) {
//         return {
//             status: ResultStatus.BadRequest,
//             errorMessage: 'Bad Request',
//             data: null,
//             extensions: [{ field: 'email', message: 'User not found' }],
//         };
//     }
//
//     try {
//         // Просим сущность обновить код. Если что-то не так, она "выбросит" ошибку.
//         user.updateConfirmationCode();
//
//         // Если дошли сюда, значит ошибок не было — сохраняем изменения
//         await this.usersRepository.save(user);
//
//         // Отправляем письмо
//         await this.nodemailerService.sendEmail(
//             user.email,
//             user.emailConfirmation.confirmationCode,
//             emailExamples.registrationEmail
//         );
//
//         return {
//             status: ResultStatus.Success,
//             data: null,
//             extensions: [],
//         };
//     } catch (e: any) {
//         // Ловим ошибку "Email already confirmed" из сущности
//         return {
//             status: ResultStatus.BadRequest,
//             errorMessage: 'Bad Request',
//             data: null,
//             extensions: [{ field: 'email', message: e.message }],
//         };
//     }
// }


// confirmEmail(code: string): void {
//     // Валидация формата (защита от мусора)
//     const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(code);
//     if (!isUuid) {
//     throw new Error('Incorrect code format');
// }
//
// // 1. Правило: Нельзя подтвердить уже подтвержденный email
// if (this.emailConfirmation.isConfirmed) {
//     throw new Error('Email already confirmed');
// }
//
// // 2. Правило: Коды должны совпадать
// if (this.emailConfirmation.confirmationCode !== code) {
//     throw new Error('Invalid confirmation code');
// }
//
// // 3. Правило: Срок жизни кода не должен истечь
// if (new Date() > this.emailConfirmation.expirationDate) {
//     throw new Error('Confirmation code expired');
// }
//
// // Все проверки пройдены — меняем состояние
// this.emailConfirmation.isConfirmed = true;
// }
//
//  async confirmEmail(code: string): Promise<Result<any>> {
//
//         const user = await this.userQueryRepository.findByConfirmationCode(code);
//         if (!user) {
//             return {
//                 status: ResultStatus.BadRequest,
//                 errorMessage: 'Bad Request',
//                 data: null,
//                 extensions: [{ field: 'code', message: 'Incorrect or expired code' }],
//             };
//         }
//          try{
//         user.confirmEmail(code);
//         await this.usersRepository.save(user);
//
//         return {
//             status: ResultStatus.Success,
//             data: null,
//             extensions: [],
//         };
//         } catch (e: any) {
//         return {
//             status: ResultStatus.BadRequest,
//             errorMessage: 'Bad Request',
//             data: null,
//             extensions: [{ field: 'code', message: e.message }],
//         };
//         }
//     }
//

// Внутри класса UserEntity
// static createUserByRegistration(
//     login: string,
//     email: string,
//     passwordHash: string
// ): UserDocument {
//     // Вся логика генерации кодов и дат инкапсулирована здесь
//     return new UserModel({
//         login,
//         email,
//         passwordHash,
//         createdAt: new Date().toISOString(),
//         emailConfirmation: {
//             confirmationCode: randomUUID(),
//             expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
//             isConfirmed: false,
//         },
//         passwordRecovery: {
//             recoveryCode: null,
//             expirationDate: null,
//         },
//     });
// }
//
//async registerUser(
//     login: string,
//     password: string,
//     email: string,
// ): Promise<Result<null>> {
//     // 1. Проверки на уникальность (оставляем как есть)
//     const loginExists = await this.userQueryRepository.findByLogin(login);
//     if (loginExists) {
//         return {
//             status: ResultStatus.BadRequest,
//             errorMessage: 'User already exists',
//             data: null,
//             extensions: [{ field: 'login', message: 'Login already taken' }],
//         };
//     }
//
//     const emailExists = await this.userQueryRepository.findByEmail(email);
//     if (emailExists) {
//         return {
//             status: ResultStatus.BadRequest,
//             errorMessage: 'User already exists',
//             data: null,
//             extensions: [{ field: 'email', message: 'Email already registered' }],
//         };
//     }
//
//     // 2. Хеширование
//     const passwordHash = await this.bcryptService.generateHash(password);
//
//     // 3. Вызов доменной фабрики
//     // Мы просто передаем чистые данные, сущность сама знает, что с ними делать
//     const newUser = UserModel.createUserByRegistration(login, email, passwordHash);
//
//     // 4. Сохранение (Active Record стиль)
//     await this.usersRepository.save(newUser);
//
//     // 5. Отправка Email (остается без изменений)
//     try {
//         await this.nodemailerService.sendEmail(
//             newUser.email,
//             newUser.emailConfirmation.confirmationCode,
//             emailExamples.registrationEmail
//         );
//     } catch (e: unknown) {
//         console.error('Send email error', e);
//     }
//
//     return {
//         status: ResultStatus.Success,
//         data: null,
//         extensions: [],
//     };
// }

// static createUserByAdmin(login: string, email: string, passwordHash: string): UserDocument {
//     return new UserModel({
//         login,
//         email,
//         passwordHash,
//         createdAt: new Date().toISOString(),
//         emailConfirmation: {
//             confirmationCode: randomUUID(), // Можно оставить для уникальности поля
//             expirationDate: new Date(),    // Для админа срок не важен
//             isConfirmed: true,             // ГЛАВНОЕ ОТЛИЧИЕ: сразу true
//         },
//         passwordRecovery: {
//             recoveryCode: null,
//             expirationDate: null
//         }
//     });
// }
//
// async create(command: CreateUserCommand): Promise<Result<string | null>> {
//     const { login, email, password } = command;
//
//     // 1. Проверки на уникальность (Email)
//     const existingByEmail = await this.usersRepository.findByLoginOrEmail(email);
//     if (existingByEmail) {
//         return {
//             status: ResultStatus.BadRequest,
//             errorMessage: 'User already exists',
//             data: null,
//             extensions: [{ field: 'email', message: 'Email already registered' }],
//         };
//     }
//
//     // 2. Проверки на уникальность (Login)
//     const existingByLogin = await this.usersRepository.findByLoginOrEmail(login);
//     if (existingByLogin) {
//         return {
//             status: ResultStatus.BadRequest,
//             errorMessage: 'User already exists',
//             data: null,
//             extensions: [{ field: 'login', message: 'Login already taken' }],
//         };
//     }
//
//     // 3. Подготовка данных
//     const passwordHash = await this.bcryptService.generateHash(password);
//
//     // 4. Создание через фабрику сущности
//     const newUser = UserModel.createUserByAdmin(login, email, passwordHash);
//
//     // 5. Сохранение
//     await this.usersRepository.save(newUser);
//
//     return {
//         status: ResultStatus.Success,
//         data: newUser._id.toString(), // Возвращаем ID созданного юзера
//         extensions: [],
//     };
// }



