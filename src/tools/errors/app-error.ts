import type { ErrorCodes } from "./error.codes.js";
export class AppError extends Error {
    public code: ErrorCodes;
    public status: number;

    constructor(message: string, code: ErrorCodes, status: number) {
        super(message);
        this.code = code;
        this.status = status;
    }

}