import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { AppError } from "../tools/errors/app-error.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";

export class UserService {

    public async create(input: Prisma.usersCreateInput): Promise<Prisma.usersModel> {
        try {
            return await prisma.users.create({
                data: input
            }); 
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    throw new AppError("User already exists.", ErrorCodes.USER_ALREADY_EXISTS, 400);
                }
                console.error(e);
                throw new AppError(e.message, ErrorCodes.USER_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }

    public async getAll(): Promise<Prisma.usersModel[] | null> {
        try {
            return await prisma.users.findMany();
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                console.error(e);
                throw new AppError(e.message, ErrorCodes.USER_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }

    public async getById(id: string): Promise<Prisma.usersModel | null> {
        try {
            return await prisma.users.findUnique({
                where: { id },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2007") {
                    throw new AppError("Invalid Id.", ErrorCodes.INVALID_USER_ID, 400);
                }
                console.error(e);
                throw new AppError(e.message, ErrorCodes.USER_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }

    public async getByEmail(email: string): Promise<Prisma.usersModel | null> {
        try {
            return await prisma.users.findUnique({
                where: { email }
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError(e.message, ErrorCodes.USER_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }

    public async update(id: string, data: Prisma.usersCreateInput): Promise<void> {
        try {
            const user = await this.getById(id);
            if (!user) {
                throw new AppError("User does not exist.", ErrorCodes.USER_NOT_FOUND, 400);
            }
            await prisma.users.update({
                where: { id: id }, 
                data: data
            });
        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === ErrorCodes.INVALID_USER_ID) {
                    throw new AppError("Invalid Id.", ErrorCodes.INVALID_USER_ID, 400);
                }
                console.error(e);
                throw new AppError(e.message, ErrorCodes.USER_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            const user = await this.getById(id);
            if (!user) {
                throw new AppError("User not found.", ErrorCodes.USER_NOT_FOUND, 400);
            }
            await prisma.users.delete({
                where: { id: id },
            });
        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === ErrorCodes.INVALID_USER_ID) {
                    throw new AppError("Invalid Id.", ErrorCodes.INVALID_USER_ID, 500);
                }
                if (e.code === ErrorCodes.USER_NOT_FOUND) {
                    throw new AppError("User does not exist.", ErrorCodes.USER_NOT_FOUND, 404);
                }
                console.error(e);
                throw new AppError(e.message, ErrorCodes.USER_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }
}