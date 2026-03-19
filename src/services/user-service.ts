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
                    throw new AppError("User already exists.", ErrorCode.USER_ALREADY_EXISTS, 400);
                }
            }
            throw new Error(`${e}`);
        }
    }
}