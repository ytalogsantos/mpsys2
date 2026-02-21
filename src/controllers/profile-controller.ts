import { ProfileService } from "../services/profile-service.js";
import type { RequestHandler, Request, Response } from "express";
import { ProfileInputFilter } from "../tools/profile-input-filter.js";
import { Prisma } from "../../generated/prisma/client.js";

export class ProfileController {
    private readonly service: ProfileService;
    
    constructor(service: ProfileService) {
        this.service = service;
    }

    // create: RequestHandler = async (req: Request, res: Response) => {
    //     const filteredInput: Prisma.profilesCreateInput = ProfileInputFilter(req.body);
    //     const { name, role } = filteredInput;
        
    //     if (!name && !role) {
    //         console.error("Data must be provided.");
    //         return res.status(400).json({message: "Data must be provided."});
    //     }

    //     try {
    //         const profile = await this.service.create(filteredInput);
    //         return res.status(201).json({message: "Account created successfully.", profile});
    //     } catch (e: unknown) {
    //         console.log(`Internal error: ${e}`);
    //         return res.status(500).json({message: "Internal error, please try again later."});
    //     }
    // }

    get: RequestHandler = async (req: Request, res: Response) => {
        const filteredInput: Prisma.profilesCreateInput = ProfileInputFilter(req.body);
        try {
            const profiles = await this.service.get(filteredInput);
            return res.status(200).json({profiles});
        } catch (e: unknown) {
            console.error(`Internal error: ${e}`);
            return res.status(500).json({message: "Internal error."});
        }
    }
}