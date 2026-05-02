import { AuthenticationError } from "../tools/errors/authentication-error.js";
import { RegistrationError } from "../tools/errors/registration-error.js";
import type { RequestHandler, Request, Response } from "express";
import { Prisma, Role } from "../../generated/prisma/client.js";
import { UserInputFilter } from "../tools/user-input-filter.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import { AuthService } from "../services/auth-service.js";
import { AppError } from "../tools/errors/app-error.js";
import "dotenv/config";
import type { LoginUserRequest, LoginUserResponse, RegisterUserRequest, RegisterUserResponse } from "../interfaces/dtos/auth.js";
import type { CreateUserInput } from "@interfaces/dtos/user.js";
import type { CreateProfileInput } from "@interfaces/dtos/profile.js";

export class AuthController {
    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    };

    register: RequestHandler = async (req: Request, res: Response) => {

        const registerData: RegisterUserRequest = req.body;
        const userData: CreateUserInput = { ...registerData };
        const profileData: CreateProfileInput = { ...registerData};
        
        const validUserInput: Prisma.usersCreateInput | boolean = UserInputFilter({ ...userData });

        if (!validUserInput) {
            return res.status(400).json({ message: "Invalid email or password. Account coundn't be creacted." });
        }

        if (!profileData.name || profileData.name.trim().length < 3) {
            return res.status(400).json({ message: "Name field is invalid or missing." });
        }

        const roles: string[] = Object.keys(Role);
        if (!roles.includes(String(profileData.role))) {
            return res.status(400).json({message: "Invalid role."});
        }

        try {
            const profile: RegisterUserResponse = await this.authService.register({ ...userData}, { ...profileData });
            return res.status(201).json({message: "Account created successfully.", profile});

        } catch (e) {
            if (e instanceof RegistrationError) {
                return res.status(e.status).json({message: `${e.message}`});
            }
            if (e instanceof AppError) {
                return res.status(e.status).json({message: `${e.message}`, code: e.code});
            }
            return res.status(500).json({message: "Internal server error at Register process.", code: ErrorCodes.REGISTRATION_INTERNAL_ERROR});
        }
    }

    login: RequestHandler = async (req: Request, res: Response) => {
        const userCredentials: LoginUserRequest = req.body;

        try {
            const loginResponse: LoginUserResponse = await this.authService.login(userCredentials);
            return res.status(200).json({message: "Login successful.", loginResponse});
        } catch (e) {
            if (e instanceof AuthenticationError) {
                if (e.code === ErrorCodes.INCORRET_PASSWORD || ErrorCodes.USER_NOT_FOUND) {
                    return res.status(e.status).json({message: "Email or password incorrect.", code: e.code});
                }
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            if (e instanceof AppError) {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal server error at login process.", code: ErrorCodes.LOGIN_INTERNAL_ERROR});
        }

    }
}
