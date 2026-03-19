import { AppError } from "./app-error.js";
import type { ErrorCode } from "./error.codes.js";
export class RegistrationError extends AppError {
    constructor(message: string, code: ErrorCode, status: number) {
        super(message, code, status);
    }
}