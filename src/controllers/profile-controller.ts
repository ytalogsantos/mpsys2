import { ProfileService } from "../services/profile-service.js";
import type { RequestHandler, Request, Response } from "express";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import { AppError } from "../tools/errors/app-error.js";
import { Prisma } from "../../generated/prisma/client.js";

export class ProfileController {
    private readonly service: ProfileService;
    
    constructor(service: ProfileService) {
        this.service = service;
    }

    getAll: RequestHandler = async (req: Request, res: Response) => {
        try {
            const profiles = await this.service.getAll();
            if (!profiles) {
                console.log(ErrorCodes.USER_NOT_FOUND);
                return res.status(404).json({message: "No profiles were found.", code: ErrorCodes.PROFILE_NOT_FOUND});
            }
            return res.status(200).json({profiles});
        } catch (e) {
            if (e instanceof AppError) {
                return res.status(e.status).json({message: `Operation failed -- ${e.message}`, code: e.code});
            }
            console.error(ErrorCodes.PROFILE_INTERNAL_ERROR);
            return res.status(500).json({message: `${ErrorCodes.PROFILE_INTERNAL_ERROR} -- Internal error.`});
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
                if (e.code === ErrorCodes.INVALID_PROFILE_ID) {
                    return res.status(400).json({message: `The Id provided is not valid.`, code: e.code});
                }
                return res.status(e.status).json({message: `Operation failed -- ${e.message}`, code: e.code});
            }
            return res.status(500).json(`Operation failed due to an internal error -- ${ErrorCodes.PROFILE_INTERNAL_ERROR}`);
        }
    }

    update: RequestHandler = async (req: Request, res: Response) => {
        const id: string = String(req.params.id);
        const data: Prisma.profilesCreateInput = req.body;
        
        try {
            await this.service.update(id, data);
            return res.status(200).json({message: "Profile updated successfully."});
        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === ErrorCodes.INVALID_PROFILE_ID) {
                    return res.status(400).json({message: "The Id provived is invalid. Please, try again.", code: e.code});
                }
                return res.status(e.status).json({message: `${e.message}`, code: e.code});
            }
            return res.status(500).json({message: `${ErrorCodes.PROFILE_INTERNAL_ERROR} -- Operation failed due to an internal error`});
        }
    }

    delete: RequestHandler = async (req: Request, res: Response) => {
        const id: string = String(req.params.id);
        try {
            await this.service.delete(id);
            return res.status(200).json({message: "Profile deleted successfully."});
        } catch (e) {
            if (e instanceof AppError) {
                if (e.code === ErrorCodes.INVALID_PROFILE_ID) {
                    return res.status(400).json({message: "The Id provided is invalid. Please, try again.", code: e.code});
                }
                if (e.code === ErrorCodes.PROFILE_NOT_FOUND) {
                    return res.status(404).json({message: "Profile not found. Please, try again.", code: e.code});
                }
                return res.status(500).json({message: `Operation failed -- ${e.message}`, code: e.code});
            }
            return res.status(500).json({message: `${ErrorCodes.PROFILE_INTERNAL_ERROR} -- Internal error.`});
        }
    }
}