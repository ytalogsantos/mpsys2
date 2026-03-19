import type { ErrorCode } from "./error.codes.js";
export class AppError extends Error {
    public code: ErrorCode;
    public status: number;

    constructor(message: string, code: ErrorCode, status: number) {
        super(message);
        this.code = code;
        this.status = status;
    }

}