import { Response } from 'express';
import { RepositoryNotFoundError } from "./repository-not-found.error";
import { HttpStatus } from "../typesAny/http-statuses";
import { DomainError } from "./domain.error";
import {createErrorMessages} from "./create-error-messages";
import {LoginEmailError} from "./login-email.error";
import {ForbiddenError} from "./forbidden.Error";
import {BadRequestError} from "./badReq";


export function errorHandler(error: unknown, res: Response): void {

    console.log("🔴 ERROR OCCURRED:", error);

    if (res.headersSent) {
        console.log('⚠️ Response already sent, skipping errorHandler');
        return;
    }


    if (error instanceof Error && (error.name === 'CastError' || error.message.includes('ObjectId'))) {
        res.sendStatus(HttpStatus.NotFound);
        return;
    }

    if (error instanceof RepositoryNotFoundError) {
        res.status(HttpStatus.NotFound).send({
            errors: [
                {
                    message: error.message,
                    field: 'id',
                },
            ],
        });
        return;
    }

    if (error instanceof Error && error.name === 'ValidationError') {
        res.status(400).send({
            errorsMessages: Object.values((error as any).errors).map((e: any) => ({
                message: e.message,
                field: e.path
            }))
        });
        return;
    }

    if (error instanceof BadRequestError) {
        res.status(HttpStatus.BadRequest).send({
            errorsMessages: [
                { message: error.message,
                    field: error.field },
            ],
        });
        return;
    }

    if (error instanceof ForbiddenError) {
        res.sendStatus(HttpStatus.Forbidden);
        return;
    }

    if (error instanceof LoginEmailError) {
        res.status(HttpStatus.BadRequest).send({
            errorsMessages: [
                {field: error.field, message: error.message},
            ],
        })
        return;
    }

    if (error instanceof DomainError) {
        res.status(HttpStatus.UnprocessableEntity).send(
            createErrorMessages([
                { message: error.message, field: error.field },
            ]),
        );
        return;
    }

    if (error instanceof Error) {
        console.error('Error Stack:', error.stack);
    }

    // Ошибка 500 Internal Server Error
    res.status(HttpStatus.InternalServerError).send(
        createErrorMessages([
            { message: 'Internal server error', field: '' },
        ]),
    );
}