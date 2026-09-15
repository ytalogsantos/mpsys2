import type { UserRepository } from "@interfaces/repositories/user-repository.js";
import { prisma } from "@config/db.js";
import type { CreateUserResponse, GetUserResponse } from "@interfaces/dtos/user.js";
import type { CreateUserInput, ListUsersInput, UpdateUserInput } from "@schemas/user-schema";
import { Prisma } from "@generated/prisma/client.js";
import { ErrorCodes } from "@/tools/errors/error.codes.js";
import { AppError } from "@/tools/errors/app-error.js";
import { DatabaseError } from "pg";

export class PrismaUserRepository implements UserRepository {

    public async create(userData: CreateUserInput): Promise<CreateUserResponse> {

        try {

            const created = await prisma.user.create({
                data: userData
            });

            return { ...created, created_at: created.created_at.toDateString() };

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2002") {

                    const message = "User is already registered.";
                    throw new AppError(message, ErrorCodes.USER_ALREADY_EXISTS);

                }

            }

            throw e;

        }
        
    }

    public async list(userFilters: ListUsersInput): Promise<GetUserResponse[]> {

        const userData = {
            ...(userFilters.role && {
                role: userFilters.role
            }),
            ...(userFilters.active && {
                active: userFilters.active
            }),
            ...(userFilters.created_at && {
                created_at: userFilters.created_at
            })
        };

        try {

            const users = await prisma.user.findMany({
                where: userData
            });

            return users;

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                throw new AppError(e.message, ErrorCodes.UNEXPECTED_DATABASE_ERROR);
            }

            throw e;

        }

    }

    public async find(userId: string): Promise<GetUserResponse | null> {

        try {
            
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            return user;

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                
                throw new AppError(e.message, ErrorCodes.UNEXPECTED_DATABASE_ERROR);

            }

            throw e;

        }
    
    }

    public async update(userId: string, userData: UpdateUserInput): Promise<void> {

        const userUpdateData = {
            ...(userData.email && {
                email: userData.email
            }),
            ...(userData.password && {
                password: userData.password
            })
        };

        try {

            await prisma.user.update({
                where: { id: userId },
                data: userUpdateData
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2002") {

                    const message = "Email already registered.";
                    throw new AppError(message, ErrorCodes.USER_ALREADY_EXISTS);

                }

            }

            throw e;

        }

    }

    public async delete(userId: string): Promise<void> {

        try {
            
            await prisma.user.delete({
                where: { id: userId }
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P02025") {
                    
                    const message = "User not found.";
                    throw new AppError(message, ErrorCodes.USER_NOT_FOUND);

                }

            }

            throw e;

        }

    }

}
