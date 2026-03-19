import type { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../config/db.js";
import { BaseService } from "../services/base-service.js";

export class ProfileService extends BaseService<Prisma.profilesDelegate, Prisma.profilesCreateInput> {
    constructor() {
        super(prisma.profiles);
    }
    
    public async create(input: Prisma.profilesCreateInput): Promise<Prisma.profilesModel> {
        try {
            return await prisma.profiles.create({ data: input });
        } catch (e) {
            throw new Error("Registration failed.");
        }
    }
}