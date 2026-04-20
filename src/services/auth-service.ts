import { AuthenticationError } from "../tools/errors/authentication-error.js";
import { RegistrationError } from "../tools/errors/registration-error.js";
import { ProfileService } from "../services/profile-service.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import { UserService } from "../services/user-service.js";
import { Prisma, Role } from "../../generated/prisma/client.js";
import { AppError } from "../tools/errors/app-error.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import type { CreateUserInput, LoginUserRequest } from "../interfaces/dtos/user.js";
import type { CreateProfileInput } from "../interfaces/dtos/profile.js";


export class AuthService {
    
    private readonly userService: UserService;
    private readonly profileService: ProfileService;

    constructor(userService: UserService, profileService: ProfileService) {
        this.userService = userService;
        this.profileService = profileService;
    };

    public async register(userInput: CreateUserInput, profileInput: CreateProfileInput): Promise<Prisma.profilesModel> {
        try {
            userInput.password = await bcrypt.hash(userInput.password, 10);
            const user: Prisma.usersModel = await this.userService.create(userInput);
            
            const profile: Prisma.profilesModel = await this.profileService.create({
                userId: user.id,
                name: profileInput.name,
                role: profileInput.role,
            });

            return profile;

        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === ErrorCodes.USER_ALREADY_EXISTS || e.code === ErrorCodes.PROFILE_ALREADY_EXISTS) {
                    console.error(e.message, e.stack);
                    throw new RegistrationError("Account already exists.", e.code, e.status);
                }
                console.error(e.message, e.stack);
                throw new AppError(e.message, e.code, e.status);
            }
            console.error(e);
            throw new Error("Error at AuthService's register method.");
        }
    }

    public async login(userInput: LoginUserRequest): Promise<Object> {
        const secret: string = `${process.env.JWT_SECRET}`;
        try {
            const { email, password } = userInput;
            const user: Prisma.usersModel | null = await this.userService.getByEmail(email);
            if (!user) {
                throw new AuthenticationError("User not found.", ErrorCodes.USER_NOT_FOUND, 404);
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                throw new AuthenticationError("Incorrect password.", ErrorCodes.INCORRET_PASSWORD, 401);
            }

            const profile = await this.profileService.getByUserId(user.id);
            const token = await jwt.sign({ userId: user.id }, secret, { expiresIn: "2m"});
            return { token, profile};

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
                    console.error(e.message, e.stack);
                    throw new AuthenticationError(e.message, e.code, e.status);
                }
                if (e.code == ErrorCodes.PROFILE_INTERNAL_ERROR) {
                    console.error(e.message, e.stack);
                    throw new AuthenticationError("Retrieving profile's data.", e.code, e.status);
                }
                console.error(e.message, e.stack);
                throw new AppError(e.message, e.code, e.status);
                
            }
            console.error(e);
            throw new Error("Error at AuthService's login method.");
        }
    }


}