import type { ErrorCodes } from "./error.codes.js";
export class AppError extends Error {
    public code: ErrorCodes;

    constructor(message: string, code: ErrorCodes) {
        super(message);
        this.code = code;
    }
}
