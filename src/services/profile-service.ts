import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { AppError } from "../tools/errors/app-error.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";

export class ProfileService {    
    public async create(input: Prisma.profilesCreateInput): Promise<Prisma.profilesModel> {
        try {
            return await prisma.profiles.create({ data: input });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    throw new AppError("Profile already exists.", ErrorCodes.PROFILE_ALREADY_EXISTS, 400);
                }
                console.error(e);
                throw new AppError(e.message, ErrorCodes.PROFILE_INTERNAL_ERROR, 500);
            }
            throw new Error("Registration failed.");
        }
    }

    public async getAll(): Promise<Prisma.profilesModel[] | null> {
        try {
            return await prisma.profiles.findMany();
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                console.error(e);
                throw new AppError(e.message, ErrorCodes.PROFILE_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }

    public async getById(id: string): Promise<Prisma.profilesModel | null> {
        try {
            const profile = await prisma.profiles.findUnique({
                where: {id: id}
            });
            return profile;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2007") {
                    throw new AppError("Invalid profile Id.", ErrorCodes.INVALID_PROFILE_ID, 400);
                }
                console.error(e);
                throw new AppError(e.message, ErrorCodes.PROFILE_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }

    public async update(id: string, data: Prisma.profilesCreateInput): Promise<void> {
        try {
            const user = await this.getById(id);
            if (!user) {
                throw new AppError("Profile does not exist.", ErrorCodes.PROFILE_NOT_FOUND, 404);
            }
            await prisma.profiles.update({
                where: { id: id },
                data: data
            });
        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === ErrorCodes.INVALID_PROFILE_ID) {
                    throw new AppError("Invalid Id.", ErrorCodes.INVALID_PROFILE_ID, 400);
                }
                console.error(e);
                throw new AppError(e.message, ErrorCodes.PROFILE_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            const user = await this.getById(id);
            if (!user) {
                throw new AppError("Profile does not exist.", ErrorCodes.PROFILE_NOT_FOUND, 400);
            }
            await prisma.profiles.delete({
                where: {id: id}
            });
        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === ErrorCodes.INVALID_PROFILE_ID) {
                    throw new AppError("Invalid Id.", ErrorCodes.INVALID_PROFILE_ID, 400);
                }

                if (e.code === ErrorCodes.PROFILE_NOT_FOUND) {
                    throw new AppError("Profile does not exist.", ErrorCodes.PROFILE_NOT_FOUND, 404);
                }
                throw new AppError(e.message, ErrorCodes.PROFILE_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }
}