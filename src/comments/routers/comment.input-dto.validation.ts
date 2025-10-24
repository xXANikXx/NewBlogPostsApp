import {body} from 'express-validator';

const contentValidation = body ('content')
    .isString()
    .withMessage('name should be a string')
    .trim()
    .isLength({min: 20, max: 300})
    .withMessage('Length of name is not correct');

export const commentInputDtoValidation = [
    contentValidation,
]