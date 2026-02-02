import { prisma } from "../config/db.js";
import { BaseService } from "./base-service.js";

export class UserService extends BaseService<typeof prisma.users> {
    constructor() {
        super(prisma.users);
    }
}