import { Prisma } from "../../generated/prisma/client.js";
import { UserService } from "../services/user-service.js";
import { ProfileService } from "../services/profile-service.js";
import type { RequestHandler, Request, Response } from "express";
import { UserInputFilter } from "../tools/user-input-filter.js";
import { ProfileInputFilter } from "../tools/profile-input-filter.js";
import { RegisterService } from "../services/register-service.js";
import { prisma } from "../config/db.js";

export class RegisterController {
    private readonly registerService: RegisterService;

    constructor(registerService: RegisterService) {
        this.registerService = registerService;
    };


    create: RequestHandler = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const { name, role } = req.body;

        const userInput: Prisma.usersCreateInput = UserInputFilter({email, password});
        const profileInput: Prisma.profilesCreateInput = ProfileInputFilter({name, role, users: {}});
        
        try {

            const profile: typeof prisma.profiles = await this.registerService.create(userInput, profileInput);
            return res.status(201).json({message: "Account created successfully.", profile});

        } catch (e: unknown) {
            console.error(`Internal error: ${e}`);
            return res.status(500).json({message: "Internal Error."});
        }
    }
}
