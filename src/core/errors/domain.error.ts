export class DomainError extends Error {
    constructor(
        public readonly message: string,
        public readonly field: string,
    ) {
        super(message);
    }
}