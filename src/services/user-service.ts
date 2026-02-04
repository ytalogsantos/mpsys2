import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { BaseService } from "./base-service.js";

export class UserService extends BaseService<typeof prisma.users, Prisma.usersCreateInput> {
    constructor() {
        super(prisma.users);
    }
}