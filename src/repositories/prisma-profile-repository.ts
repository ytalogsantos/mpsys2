import type { CreateProfileResponse, GetProfileResponse } from "@interfaces/dtos/profile";
import type { ProfileRepository } from "@interfaces/repositories/profile-repository";
import type { CreateProfileInput, ListProfilesInput, UpdateProfileInput } from "@schemas/profile-schema";
import { prisma } from "@config/db";
import { Prisma } from "@generated/prisma/client";
import { AppError } from "@/tools/errors/app-error";
import { ErrorCodes } from "@/tools/errors/error.codes";

export class PrismaProfileRepository implements ProfileRepository {

    public async create(profileData: CreateProfileInput): Promise<CreateProfileResponse> {

        try {

            return await prisma.profile.create({ data: profileData });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {

                    throw new AppError("User not found, check User Id.", ErrorCodes.RECORD_NOT_FOUND);

                }

                throw new AppError(e.message, ErrorCodes.UNEXPECTED_DATABASE_ERROR);

            }

            throw e;

        }

    }

    public async list(profileFilters: ListProfilesInput): Promise<GetProfileResponse[]> {

        const profileData = {
            ...(profileFilters.name && {
                name: {
                    startsWith: profileFilters.name
                }
            }),
        };

        try {

            return await prisma.profile.findMany({
                where: profileData
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                throw new AppError(e.message, ErrorCodes.UNEXPECTED_DATABASE_ERROR);

            }

            throw e;

        }

    }

    public async find(profileId: string): Promise<GetProfileResponse | null> {

        try {

            return await prisma.profile.findFirst({
                where: { id: profileId }
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                throw new AppError(e.message, ErrorCodes.UNEXPECTED_DATABASE_ERROR);

            }

            throw e;

        }

    }

    public async update(profileId: string, profileData: UpdateProfileInput): Promise<GetProfileResponse> {

        const profileUpdateData = {
            ...(profileData.name && {
                name: profileData.name
            })
        };

        try {

            return await prisma.profile.update({
                where: { id: profileId },
                data: profileUpdateData
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {

                    throw new AppError("Profile not found.", ErrorCodes.RECORD_NOT_FOUND);

                }

                throw new AppError(e.message, ErrorCodes.UNEXPECTED_DATABASE_ERROR);

            }

            throw e;

        }

    }

    public async delete(profileId: string): Promise<void> {

        try {

            await prisma.profile.delete({
                where: { id: profileId }
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {

                    throw new AppError("Profile not found.", ErrorCodes.RECORD_NOT_FOUND);

                }

                throw new AppError(e.message, ErrorCodes.UNEXPECTED_DATABASE_ERROR);

            }

            throw e;

        }
    }

}
