import { NextFunction, Request, Response } from "express";
import {
    FieldValidationError,
    ValidationError,
    validationResult
} from "express-validator";
import {ValidationErrorType} from "../errors/types/validationError";
import {HttpStatus} from "../typesAny/http-statuses";
import {createErrorMessages} from "../errors/create-error-messages";


const formatValidationErrors =
    (error: ValidationError): ValidationErrorType => {
        const expressError = error as unknown as FieldValidationError;

        return {
            field: expressError.path,
            message: expressError.msg,
        };
    };

export const inputValidationResultMiddleware = (
    req: Request<{}, {}, {}, {}>,
    res: Response,
    next: NextFunction,
) => {

    // console.log('QUERY PARAMS:', req.query);
    // console.log('BODY:', req.body);
    // console.log('PARAMS:', req.params);


    const errors = validationResult(req)
        .formatWith(formatValidationErrors).
        array({ onlyFirstError: true });

    if (!errors.length) {
        next();
        return;
    }
    res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
    return;
};
