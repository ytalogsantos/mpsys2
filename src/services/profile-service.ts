import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { BaseService } from "../services/base-service.js";

export class ProfileService extends BaseService<typeof prisma.profiles, Prisma.profilesCreateInput> {
    constructor() {
        super(prisma.profiles);
    }
}