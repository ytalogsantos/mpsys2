import { UserService } from "../services/user-service.js";
import { ProfileService } from "../services/profile-service.js";
import { Prisma } from "../../generated/prisma/client.js";
import { RegistrationError } from "../tools/errors/registration-error.js";
import { AppError } from "../tools/errors/app-error.js";

export class RegistrationService {
    
    private readonly userService: UserService;
    private readonly profileService: ProfileService;

    constructor(userService: UserService, profileService: ProfileService) {
        this.userService = userService;
        this.profileService = profileService;
    };

    public async create(userInput: Prisma.usersCreateInput, profileInput: Prisma.profilesCreateInput): Promise<Prisma.profilesModel> {
        try { 
            const user: Prisma.usersModel = await this.userService.create(userInput);
            const profile: Prisma.profilesModel = await this.profileService.create({
                users: {
                    connect: { id: user.id }
                },
                name: profileInput.name || "Unknown",
                role: profileInput.role || "OPERATOR",

            });

            return profile;

        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === "USER-001") {
                    throw new RegistrationError(`Registration failed -- ${e.message}`, e.code, e.status);
                }
            }
            throw new Error(`${e}`);
        }
    }


}