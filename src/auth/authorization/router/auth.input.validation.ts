import { body } from "express-validator"

// Валидация логина
const loginValidation = body('login')
    .notEmpty().withMessage('Login is required')
    .isString().withMessage('Login must be a string')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('Login length must be between 3 and 10 characters')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('Login can contain only letters, numbers, underscores, and hyphens')

// Валидация пароля
const newPasswordValidation = body('newPassword')
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be a string')
    .trim()
    .isLength({ min: 6, max: 20 }).withMessage('Password length must be between 6 and 20 characters')

const passwordValidation = body('password')
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be a string')
    .trim()
    .isLength({ min: 6, max: 20 }).withMessage('Password length must be between 6 and 20 characters')
// Валидация email
const emailValidation = body('email')
    .notEmpty().withMessage('Email is required')
    .isString().withMessage('Email must be a string')
    .trim()
    .matches(/^[\w.+-]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Email must be a valid email address')

const recoveryCodeValidation = body('recoveryCode')
    .notEmpty().withMessage('Recovery code is required')
    .isString().withMessage('Recovery code must be a string')
    .trim()
    .isUUID().withMessage('Recovery code must be a valid UUID format');

// Экспортируем массив валидаторов
export const authInputVal = [
    loginValidation,
    passwordValidation,
    emailValidation,
]

export const passwordValidator = [recoveryCodeValidation, newPasswordValidation]

export const emailValidator = [emailValidation]
