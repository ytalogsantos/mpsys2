import { AppError } from "./app-error.js";
import { ErrorCodes } from "./error.codes.js";

export class AuthenticationError extends AppError {
    constructor(message: string, code: ErrorCodes) {
        super(message, code);
    }
}
