import { ProfileService } from "../services/profile-service.js";
import type { RequestHandler, Request, Response } from "express";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import { AppError } from "../tools/errors/app-error.js";
import type { UpdateProfileRequest, UpdateProfileInput } from "../interfaces/dtos/profile.js";

export class ProfileController {
    private readonly service: ProfileService;
    
    constructor(service: ProfileService) {
        this.service = service;
    }

    getAll: RequestHandler = async (req: Request, res: Response) => {   
        try {
            const profiles = await this.service.getAll();
            if (!profiles) {
                return res.status(404).json({message: "No profiles were found.", code: ErrorCodes.PROFILE_NOT_FOUND});
            }
            return res.status(200).json({profiles});
        } catch (e) {
            if (e instanceof AppError) {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal error.", code: ErrorCodes.PROFILE_INTERNAL_ERROR});
        }
    }

    getById: RequestHandler = async (req: Request, res: Response) => {
        try {
            const id: string = String(req.params.id);
            const profile = await this.service.getById(id);

            if(!profile) {
                return res.status(404).json({message: "Profile not found.", code: ErrorCodes.PROFILE_NOT_FOUND});
            }
            return res.status(200).json({profile});
        } catch (e) {
             if (e instanceof AppError) {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal error.", code: ErrorCodes.PROFILE_INTERNAL_ERROR});
        }
    }

    update: RequestHandler = async (req: Request, res: Response) => {
        const id: string = String(req.params.id);
        const profileData: UpdateProfileRequest = req.body;
        let profile: UpdateProfileInput = {};
        try {

            if (Object.entries(profileData).length < 1) {
                return res.status(400).json({message: "Fields must not be empty."});
            }

            if ("name" in profileData) {
                profile.name = profileData.name
                await this.service.updateName(id, profile.name); 
            }

            if ("role" in profileData) {
                profile.role = profileData.role
                await this.service.updateRole(id, profile.role)
            }
            
            return res.status(200).json({message: "Profile updated successfully."});
        } catch (e) {
             if (e instanceof AppError) {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal error.", code: ErrorCodes.PROFILE_INTERNAL_ERROR});
        }
    }

    delete: RequestHandler = async (req: Request, res: Response) => { 
        const id: string = String(req.params.id);
        try {
            await this.service.delete(id);
            return res.status(200).json({message: "Profile deleted successfully."});
        } catch (e) {
            if (e instanceof AppError) {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal error.", code: ErrorCodes.PROFILE_INTERNAL_ERROR});
        }
    }
}