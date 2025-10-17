import { body } from "express-validator";

export const authInputValidation = [
    body('loginOrEmail')
        .notEmpty().withMessage('Login or Email is required')
        .isString().withMessage('Must be a string')
        .trim(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isString().withMessage('Must be a string')
        .trim()
];
