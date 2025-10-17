import {ValidationErrorType} from "./types/validationError";
import {ValidationErrorOutput} from "./types/validationError.dto";

export const createErrorMessages = (
    errors: ValidationErrorType[],
): ValidationErrorOutput => {
    return { errorsMessages: errors };
};