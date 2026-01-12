import { prisma } from "../config/db.js";
import { BaseRepository } from "./base-repository.js";

export class UserRepository extends BaseRepository<typeof prisma.users> {
    constructor() {
        super(prisma.users);
    };
}