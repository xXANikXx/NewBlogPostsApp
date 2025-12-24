export class BadRequestError extends Error {
    constructor(
        public field: string,
        message: string,
    ) {
        super(message)
    }
}