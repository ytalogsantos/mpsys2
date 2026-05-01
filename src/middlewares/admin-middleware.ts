import { ErrorCodes } from "../tools/errors/error.codes.js";
import { Role } from "../../generated/prisma/enums.js";
import type { RequestHandler, Request, Response, NextFunction } from "express";
import type { profilesModel } from "@generated/prisma/models.js";
import { prisma } from "../config/db.js";

const adminMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const profileId: string = req.body.profileId;
    const profile: profilesModel | null = await prisma.profiles.findUnique({where: {id: profileId }});
    if ((!profile) || profile.role != Role.ADMIN) {
        return res.status(403).json({message: "Access denied.", code: ErrorCodes.ACESS_DENIED});
    }
    next();
}

export { adminMiddleware };