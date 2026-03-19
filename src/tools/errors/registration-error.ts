import { AppError } from "./app-error.js";
export class RegistrationError extends AppError {
    constructor(message: string, code: string, status: number) {
        super(message, code, status);
    }
}