import { ProfileService } from "../services/profile-service.js";
import type { RequestHandler, Request, Response } from "express";

export class ProfileController {
    private readonly service: ProfileService;
    
    constructor(service: ProfileService) {
        this.service = service;
    }

    get: RequestHandler = async (req: Request, res: Response) => {        

        const id: string = String(req.params.id);

        try {
            const profile = await this.service.findById(id);
            return res.status(200).json({profile});
        } catch (e: unknown) {
            console.error(`Internal error: ${e}`);
            return res.status(500).json({message: "Internal error."});
        }
    }
}