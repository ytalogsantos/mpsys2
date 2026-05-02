import { AuthenticationError } from "../tools/errors/authentication-error.js";
import { RegistrationError } from "../tools/errors/registration-error.js";
import { ProfileService } from "../services/profile-service.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import { UserService } from "../services/user-service.js";
import { AppError } from "../tools/errors/app-error.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import type { CreateUserInput } from "../interfaces/dtos/user.js";
import type { CreateProfileInput, CreateProfileResponse } from "../interfaces/dtos/profile.js";
import type { LoginUserRequest, LoginUserResponse, RegisterUserRequest, RegisterUserResponse } from "../interfaces/dtos/auth.js";
import type { CreateUserResponse } from "../interfaces/dtos/user.js";


export class AuthService {
    
    private readonly userService: UserService;
    private readonly profileService: ProfileService;

    constructor(userService: UserService, profileService: ProfileService) {
        this.userService = userService;
        this.profileService = profileService;
    };

    public async register(userInput: CreateUserInput, profileInput: CreateProfileInput): Promise<RegisterUserResponse> {
        try {
            userInput.password = await bcrypt.hash(userInput.password, 10);
            const user: CreateUserResponse = await this.userService.create(userInput);
            const profile: CreateProfileResponse = await this.profileService.create(user.email, {
                name: profileInput.name,
                role: profileInput.role,
            });
            const profileResponse: RegisterUserResponse = {
                profileId: profile.id,
                name: profile.name,
                email: user.email,
                role: profile.role,
            }
            return profileResponse;

        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === ErrorCodes.USER_ALREADY_EXISTS || e.code === ErrorCodes.PROFILE_ALREADY_EXISTS) {
                    console.error(e.message);
                    throw new RegistrationError("Account already exists.", e.code, e.status);
                }
                if (e.code === ErrorCodes.USER_NOT_FOUND) {
                    console.error(e.message);
                    throw new AppError(e.message, e.code, e.status);
                }
                console.error(e.message);
                throw new AppError(e.message, e.code, e.status);
            }
            console.error(e);
            throw new Error("Account creation failed.");
        }
    }

    public async login(userInput: LoginUserRequest): Promise<LoginUserResponse> {
        const secret: string = `${process.env.JWT_SECRET}`;
        const { email, password } = userInput;
        try {
            const user = await this.userService.getByEmail(email);
            if (!user) {
                throw new AuthenticationError("User not found.", ErrorCodes.USER_NOT_FOUND, 404);
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                throw new AuthenticationError("Incorrect password.", ErrorCodes.INCORRET_PASSWORD, 401);
            }

            const profile = await this.profileService.getByUserId(user.id);
            const token = await jwt.sign({ userId: user.id, role: profile.role }, secret, { expiresIn: "2m"});
            const loginResponse: LoginUserResponse = {
                id: profile.id,
                name: profile.name,
                email: user.email,
                token: token,
            }
            return loginResponse;

        } catch (e) {
            if (e instanceof AuthenticationError) {
                if (e.code === ErrorCodes.INCORRET_PASSWORD) {
                    throw new AuthenticationError(e.message, e.code, e.status);
                }
                if (e.code === ErrorCodes.USER_NOT_FOUND) {
                    throw new AuthenticationError(e.message, e.code, e.status);
                }
            }
            if (e instanceof AppError) {
                if (e.code == ErrorCodes.INVALID_USER_ID) {
                    console.error(e.message);
                    throw new AuthenticationError(e.message, e.code, e.status);
                }
                if (e.code == ErrorCodes.PROFILE_INTERNAL_ERROR) {
                    console.error(e.message);
                    throw new AuthenticationError("Authentication failed.", e.code, e.status);
                }
                console.error(e.message);
                throw new AppError(e.message, e.code, e.status);
            }
            console.error(e);
            throw new Error("Login failed.");
        }
    }
}