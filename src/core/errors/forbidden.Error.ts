export class ForbiddenError extends Error {
    constructor(message = 'Forbidden') {
        super(message);
        this.name = 'ForbiddenError';
    }
}
