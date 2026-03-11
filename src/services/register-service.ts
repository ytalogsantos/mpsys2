import { UserService } from "../services/user-service.js";
import { ProfileService } from "../services/profile-service.js";
import { prisma } from "../config/db.js";
import { Prisma, Role } from "../../generated/prisma/client.js";

export class RegisterService {
    
    private readonly userService: UserService;
    private readonly profileService: ProfileService;

    constructor(userService: UserService, profileService: ProfileService) {
        this.userService = userService;
        this.profileService = profileService;
    };

    public async create(userInput: Prisma.usersCreateInput, profileInput: Prisma.profilesCreateInput): Promise<typeof prisma.profiles> {
        try { 
            const user: typeof prisma.users = await this.userService.create(userInput);
            const userId: string = String(user["id" as keyof Object]);

            const profile: typeof prisma.profiles | null = await this.profileService.create({
                users: {
                    connect: { id: userId }
                },
                name: profileInput.name || "Unknown",
                role: profileInput.role || "OPERATOR",

            });

            return profile;

        } catch (e: unknown) {
            throw new Error(`"Account couldn't be created due to: ${e}`);
        }
    }


}