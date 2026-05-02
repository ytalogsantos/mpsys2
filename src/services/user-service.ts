import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { AppError } from "../tools/errors/app-error.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import type { CreateUserInput, CreateUserResponse, GetUserResponse, GetUserByEmailResponse, UpdateUserInput } from "../interfaces/dtos/user.js";

export class UserService {

    public async create(userData: CreateUserInput): Promise<CreateUserResponse> {
        try {
            return await prisma.users.create({ 
                data: { email: userData.email, password: userData.password }
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    console.error(e.message);
                    throw new AppError("User already exists.", ErrorCodes.USER_ALREADY_EXISTS, 400);
                }
                console.error(e.message);
                throw new AppError(e.message, ErrorCodes.USER_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("User creation failed.");
        }
    }

    public async getAll(): Promise<GetUserResponse[]> {
            try {
                return await prisma.users.findMany();
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                console.error(e.message);
                throw new AppError(e.message, ErrorCodes.USER_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("Error searching for users.");
        }
    }

    public async getById(id: string): Promise<GetUserResponse | null> {
        try {
            return await prisma.users.findUnique({
                where: { id },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2007") {
                    console.error(e.message);
                    throw new AppError("Invalid Id.", ErrorCodes.INVALID_USER_ID, 400);
                }
                console.error(e.message);
                throw new AppError(e.message, ErrorCodes.USER_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("Error searching for user.");
        }
    }

    public async getByEmail(email: string): Promise<GetUserByEmailResponse | null> {
        try {
            return await prisma.users.findUnique({
                where: { email },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                console.error(e.message);
                throw new AppError(e.message, ErrorCodes.USER_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("Error searching for users.");
        }
    }

    public async update(id: string, userData: UpdateUserInput): Promise<void> {
        try {
            const user = await this.getById(id);
            if (!user) {
                throw new AppError("User does not exist.", ErrorCodes.USER_NOT_FOUND, 400);
            }
            await prisma.users.update({
                where: { id }, 
                data: userData
            });
        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === ErrorCodes.INVALID_USER_ID) {
                    console.error(e.message);
                    throw new AppError("Invalid Id.", ErrorCodes.INVALID_USER_ID, 400);
                }
                console.error(e.message, e.stack);
                throw new AppError(e.message, ErrorCodes.USER_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("Error updating user data.");
        }
    }

    public async delete(userId: string): Promise<void> {
        try {
            const user = await this.getById(userId);
            if (!user) {
                throw new AppError("User not found.", ErrorCodes.USER_NOT_FOUND, 404);
            }
            await prisma.users.delete({
                where: { id: userId },
            });
        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === ErrorCodes.INVALID_USER_ID) {
                    console.error(e.message, e.stack);
                    throw new AppError("Invalid Id.", ErrorCodes.INVALID_USER_ID, 400);
                }
                if (e.code === ErrorCodes.USER_NOT_FOUND) {
                    console.error(e.message, e.stack);
                    throw new AppError("User not found.", ErrorCodes.USER_NOT_FOUND, 404);
                }
                console.error(e.message);
                throw new AppError(e.message, ErrorCodes.USER_INTERNAL_ERROR, 500);
            }
            throw new Error("Error deleting user.");
        }
    }
}