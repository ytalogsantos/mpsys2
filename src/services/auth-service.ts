import { AuthenticationError } from "../tools/errors/authentication-error.js";
import { RegistrationError } from "../tools/errors/registration-error.js";
import { ProfileService } from "../services/profile-service.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import { UserService } from "../services/user-service.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../tools/errors/app-error.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";


export class AuthService {
    
    private readonly userService: UserService;
    private readonly profileService: ProfileService;

    constructor(userService: UserService, profileService: ProfileService) {
        this.userService = userService;
        this.profileService = profileService;
    };

    public async register(userInput: Prisma.usersCreateInput, profileInput: Prisma.profilesCreateInput): Promise<Prisma.profilesModel> {
        try {
            userInput.password = await bcrypt.hash(userInput.password, 10);
            const user: Prisma.usersModel = await this.userService.create(userInput);
            const profile: Prisma.profilesModel = await this.profileService.create({
                users: {
                    connect: { id: user.id }
                },
                name: profileInput.name || "",
                role: profileInput.role || "PLANNER",
            });

            return profile;

        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === "USER-001") {
                    throw new RegistrationError(`Registration failed -- ${e.message}`, e.code, e.status);
                }
            }
            throw new Error(`${e}`);
        }
    }

    public async login(userInput: Prisma.usersModel): Promise<Object> {
        const secret: string = `${process.env.JWT_SECRET}`;
        try {
            const { email, password } = userInput;
            const user: Prisma.usersModel | null = await this.userService.getByEmail(email);
            if (!user) {
                throw new AppError("User not found.", ErrorCodes.USER_NOT_FOUND, 404);
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                throw new AppError("Incorrect password.", ErrorCodes.INCORRET_PASSWORD, 401);
            }

            const profile = await this.profileService.getByUserId(user.id);
            const token = await jwt.sign({ userId: user.id }, secret, { expiresIn: "1m"});
            return { token, profile};

        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === ErrorCodes.INCORRET_PASSWORD) {
                    throw new AuthenticationError(e.message, e.code, e.status);
                }
                if (e.code === ErrorCodes.USER_NOT_FOUND) {
                    throw new AuthenticationError(e.message, e.code, e.status);
                }
                throw new AppError(e.message, e.code, e.status);
            }
            throw new Error(`${e}`);
        }
    }


}