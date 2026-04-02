import { Prisma, Role } from "../../generated/prisma/client.js";
import type { RequestHandler, Request, Response } from "express";
import { RegistrationService } from "../services/registration-service.js";
import { UserInputFilter } from "../tools/user-input-filter.js";
import { RegistrationError } from "../tools/errors/registration-error.js";

export class RegisterController {
    private readonly registrationService: RegistrationService;

    constructor(registrationService: RegistrationService) {
        this.registrationService = registrationService;
    };

    create: RequestHandler = async (req: Request, res: Response) => {

        const email: string = req.body["email" as keyof Object];
        const password: string = req.body["password" as keyof Object];
        const name: string = req.body["name" as keyof Object];
        const role: Role = req.body["role" as keyof Object];

        const validUserInput: Prisma.usersCreateInput | boolean = UserInputFilter({ email, password});

        if (!validUserInput) {
            return res.status(400).json({ message: "Invalid user input. Account coundn't be creacted." });
        }

        if (name.trim().length < 3) {
            return res.status(400).json({ message: "Invalid name." });
        }

        const roles: string[] = Object.keys(Role);
        if (!roles.includes(String(role))) {
            return res.status(400).json({message: `Invalid role.`});
        }

        try {
            const profile: Prisma.profilesModel = await this.registrationService.create({ email, password}, { name, role, users: {} });
            return res.status(201).json({message: "Account created successfully.", profile});

        } catch (e) {
            if (e instanceof RegistrationError) {
                console.log(e.code);
                return res.status(e.status).json({message: `${e.message}`});
            }
            return res.status(500).json({message: `${e}`});
        }
    }
}
