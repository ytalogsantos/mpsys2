import type { UserRepository } from "@interfaces/repositories/user-repository.js";
import { prisma } from "@config/db.js";
import type { CreateUserInput, CreateUserResponse, GetUserResponse, UpdateUserInput } from "@interfaces/dtos/user.js";
import { Prisma } from "@generated/prisma/client.js";
import { RegistrationError } from "@/tools/errors/registration-error.js";
import { ErrorCodes } from "@/tools/errors/error.codes.js";
import { AppError } from "@/tools/errors/app-error.js";

export class PrismaUserRepository implements UserRepository {

    public async create(userData: CreateUserInput): Promise<CreateUserResponse> {

        try {

            const created = await prisma.users.create({
                data: userData
            });

            return created;

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2002") {
                    throw new RegistrationError("User is already registered.", ErrorCodes.USER_ALREADY_EXISTS)
                }

            }

            throw e;

        }
        
    }

    public async get(): Promise<GetUserResponse[]> {

        const users = await prisma.users.findMany();
        return users;

    }

    public async find(userId: string): Promise<GetUserResponse | null> {
    
        const user = await prisma.users.findUnique({
            where: { id: userId }
        });

        return user;

    }

    public async findByEmail(userEmail: string): Promise<GetUserResponse | null> {
        
        const user = await prisma.users.findUnique({
            where: { email: userEmail }
        });

        return user;

    }

    public async update(userId: string, userData: UpdateUserInput): Promise<void> {

        const updated = [];
        let data = {};

        if (userData.email) {

            updated.push({
                email: userData.email
            });

        }

        if (userData.password) {
            
            updated.push({
                password: userData.password
            });

        }

        for (let i = 0; i < updated.length; i++) {

            data = { ...data, ...updated[i]};

        }

        try {

            await prisma.users.update({
                where: { id: userId },
                data: data
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2002") {

                    throw new AppError("Email already registered.", ErrorCodes.USER_ALREADY_EXISTS);

                }

            }

            throw e;

        }

    }

    public async delete(userId: string): Promise<void> {

        try {
            
            await prisma.users.delete({
                where: { id: userId }
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P02025") {

                    throw new AppError("User not found.", ErrorCodes.USER_NOT_FOUND);

                }

            }

            throw e;

        }

    }

}
