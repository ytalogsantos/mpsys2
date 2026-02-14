import { ProfileService } from "../services/profile-service.js";
import type { RequestHandler, Request, Response } from "express";
import { InputFilter } from "../tools/input-filter.js";
import { Prisma } from "../../generated/prisma/client.js";

export class ProfileController {
    private readonly service: ProfileService;

    
    constructor(service: ProfileService) {
        this.service = service;
    }

    create: RequestHandler = async (req: Request, res: Response) => {
        const body: object = req.body;
        const data: Prisma.profilesCreateInput = InputFilter(body);
       
        if (Object.keys(data).length === 0) {
            console.error("Data must be provided.");
            return res.status(400).json({message: "Data must be provided."});
        }
        try {
            const profile = await this.service.create(data);
            if (!profile) {
                return res.status(400).json({message: "An account with this email already exists! Please, log in."});
            }

            return res.status(201).json({message: "Account created successfully.", profile});
        } catch (e: unknown) {
            console.log(`Internal error: ${e}`);
            return res.status(500).json({message: "Internal error, please try again later."});
        }
    }
}