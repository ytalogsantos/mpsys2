import { prisma } from "@config/db";
import { BaseService } from "@";

export class UserService extends BaseService<typeof prisma.users> {
    constructor() {
        super(prisma.users)
    }
}