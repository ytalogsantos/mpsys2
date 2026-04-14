import { AuthenticationError } from "../tools/errors/authentication-error.js";
import { RegistrationError } from "../tools/errors/registration-error.js";
import type { RequestHandler, Request, Response } from "express";
import { Prisma, Role } from "../../generated/prisma/client.js";
import { UserInputFilter } from "../tools/user-input-filter.js";
import { AuthService } from "../services/auth-service.js";
import "dotenv/config";
import { ErrorCodes } from "../tools/errors/error.codes.js";

export class AuthController {
    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    };

    register: RequestHandler = async (req: Request, res: Response) => {

        const email: string = req.body["email" as keyof Object];
        const password: string = req.body["password" as keyof Object];
        const name: string = req.body["name" as keyof Object];
        const role: Role = req.body["role" as keyof Object];

        const validUserInput: Prisma.usersCreateInput | boolean = UserInputFilter({ email, password});

        if (!validUserInput) {
            return res.status(400).json({ message: "Invalid user input. Account coundn't be creacted." });
        }

        if (!name || name.trim().length < 3) {
            return res.status(400).json({ message: "Name field is invalid or missing." });
        }

        const roles: string[] = Object.keys(Role);
        if (!roles.includes(String(role))) {
            return res.status(400).json({message: `Invalid role.`});
        }

        try {
            const profile: Prisma.profilesModel = await this.authService.register({ email, password}, { name, role, users: {} });
            return res.status(201).json({message: "Account created successfully.", profile});

        } catch (e) {
            if (e instanceof RegistrationError) {
                console.log(e.code);
                return res.status(e.status).json({message: `${e.message}`});
            }
            return res.status(500).json({message: `${e}`});
        }
    }

    login: RequestHandler = async (req: Request, res: Response) => {
        const userCredentials: Prisma.usersModel = req.body;

        try {
            const payload: Object = await this.authService.login(userCredentials);
            const profile: Prisma.profilesModel = payload["profile" as keyof object]; // TODO: refactor
            const token: string = payload["token" as keyof object]; // TODO: refactor as well

            return res.status(200).json({message: "Login successful.", token, profile: { id: profile.id, name: profile.name, role: profile.role }});
        } catch (e) {
            if (e instanceof AuthenticationError) {
                if (e.code === ErrorCodes.INCORRET_PASSWORD || ErrorCodes.USER_NOT_FOUND) {
                    return res.status(e.status).json({message: "Email or password incorrect.", code: e.code});
                }
                return res.status(e.status).json({message: `${e.message}`});
            }
            return res.status(500).json({message: `${e}`});
        }

    }
}
