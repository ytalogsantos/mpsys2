import { AppError } from "./app-error.js";
import type { ErrorCodes } from "./error.codes.js";

export class RegistrationError extends AppError {
    constructor(message: string, code: ErrorCodes) {
        super(message, code);
    }
}
