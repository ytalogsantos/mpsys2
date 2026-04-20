import { Prisma, Role } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { AppError } from "../tools/errors/app-error.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import type { CreateProfileInput, UpdateProfileName, UpdateProfileRole } from "../interfaces/dtos/profile.js";
import { AuthorizationError } from "../tools/errors/authorization-error.js";

export class ProfileService {    
    public async create(profileData: CreateProfileInput): Promise<Prisma.profilesModel> {
        try {
            return await prisma.profiles.create({
                data: {
                    user_id: profileData.userId,
                    name: profileData.name,
                    role: profileData.role
                }
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2002") {
                    console.error(e.message);
                    throw new AppError("Profile already exists.", ErrorCodes.PROFILE_ALREADY_EXISTS, 400);
                }
                console.error(e.message);
                throw new AppError(e.message, ErrorCodes.PROFILE_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("Registration failed.");
        }
    }

    public async getAll(): Promise<Prisma.profilesModel[] | null> {
        try {
            return await prisma.profiles.findMany();
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                console.error(e.message, e.stack);
                throw new AppError(e.message, ErrorCodes.PROFILE_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("Error at ProfileService's getAll method.");
        }
    }

    public async getById(profileId: string): Promise<Prisma.profilesModel | null> {
        try {
            const profile = await prisma.profiles.findUnique({
                where: {id: profileId},
                include: { users: true}
            });
            return profile;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2007") {
                    throw new AppError("Invalid profile Id.", ErrorCodes.INVALID_PROFILE_ID, 400);
                }
                console.error(e.message, e.stack);
                throw new AppError(e.message, ErrorCodes.PROFILE_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("Error at ProfileService's getById method.");
        }
    }

    public async getByUserId(userId: string): Promise<Prisma.profilesModel | null> {
        try {
            return await prisma.profiles.findUnique({
                where: { user_id: userId },
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2007") {
                    console.error(e.message, e.stack);
                    throw new AppError("Invalid user Id.", ErrorCodes.INVALID_USER_ID, 400);
                }
                console.error(e.message, e.stack);
                throw new AppError(e.message, ErrorCodes.PROFILE_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("Error at ProfileService's getByUserId method.");
        }
    }

    public async update(id: string, profileData: UpdateProfileName | UpdateProfileRole): Promise<void> {
        try {
            const profile = await this.getById(id);
            if (!profile) {
                throw new AppError("Profile does not exist.", ErrorCodes.PROFILE_NOT_FOUND, 404);
            }

            if ("role" in profileData) {
                if (profile.role != Role.ADMIN) {
                    throw new AuthorizationError("This user is not allowed to change its role.", ErrorCodes.ACESS_DENIED, 403);
                }
                profile.role = profileData.role;
            }

            if ("name" in profileData) {
                profile.name = profileData.name;
            }

            await prisma.profiles.update({
                where: { id },
                data: {
                    name: profile.name,
                    role: profile.role
                }
            });
        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === ErrorCodes.INVALID_PROFILE_ID) {
                    console.error(e.message);
                    throw new AppError("Invalid Id.", ErrorCodes.INVALID_PROFILE_ID, 400);
                }
                console.error(e.message);
                throw new AppError(e.message, ErrorCodes.PROFILE_INTERNAL_ERROR, 500);
            }
            if (e instanceof AuthorizationError) {
                console.error(e.message);
                throw new AuthorizationError(e.message, e.code, e.status);
            }

            console.error(e);
            throw new Error("Error at ProfileService's update method.");
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
                    console.error(e.message, e.stack);
                    throw new AppError("Invalid Id.", ErrorCodes.INVALID_PROFILE_ID, 400);
                }

                if (e.code === ErrorCodes.PROFILE_NOT_FOUND) {
                    console.error(e.message, e.stack);
                    throw new AppError("Profile does not exist.", ErrorCodes.PROFILE_NOT_FOUND, 404);
                }
                console.error(e.message, e.stack);
                throw new AppError(e.message, ErrorCodes.PROFILE_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("Error at ProfileService's delete method.");
        }
    }
}