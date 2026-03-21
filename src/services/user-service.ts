import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { AppError } from "../tools/errors/app-error.js";
import { ErrorCode } from "../tools/errors/error.codes.js";

export class UserService {

    public async create(input: Prisma.usersCreateInput): Promise<Prisma.usersModel> {
        try {
            return await prisma.users.create({ data: input }); 
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    throw new AppError("User already exists (by UserService)", ErrorCode.USER_ALREADY_EXISTS, 400);
                }
            }
            throw new Error(`${e}`);
        }
    }

    public async getAll(): Promise<Prisma.usersModel[] | null> {
        try {
            return await prisma.users.findMany();
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError(e.message, ErrorCode.USER_UNEXPECTED_ERROR, 500);
            }
            console.log(e);
            return null;
        }
    }

    public async getById(id: string): Promise<Prisma.usersModel | null> {
        try {
            return await prisma.users.findUnique({
                where: { id },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError(e.message, ErrorCode.USER_UNEXPECTED_ERROR, 500);
            }
            return null;
        }
    }

    public async update(id: string, data: Prisma.usersCreateInput): Promise<void> {
        try {
            const user = await this.getById(id);
            if (!user) {
                throw new AppError("User does not exist.", ErrorCode.USER_NOT_FOUND, 400);
            }
            prisma.users.update({
                where: { id: id }, 
                data: data
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError(e.message, ErrorCode.USER_UNEXPECTED_ERROR, 500);
            }
            if (e instanceof AppError) {
                throw new AppError(e.message, e.code, e.status);
            }
            throw new Error(`${e}`);
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            const user: Promise<Prisma.usersModel | null> = this.getById(id);
            if (!user) {
                throw new AppError("User does not exist.", ErrorCode.USER_NOT_FOUND, 400);
            }
            await prisma.users.delete({
                where: { id },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError(e.message, ErrorCode.USER_UNEXPECTED_ERROR, 500);
            }
            console.log(e);
        }
    }
}