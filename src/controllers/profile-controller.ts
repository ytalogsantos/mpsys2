import { ProfileService } from "@/services/profile-service";
import type { RequestHandler, Request, Response } from "express";
import { ErrorCodes } from "@/tools/errors/error.codes"
import { AppError } from "@/tools/errors/app-error";
import { listProfilesSchema, profileIdSchema, updateProfileSchema } from "@schemas/profile-schema";

export class ProfileController {

    constructor(private readonly profileService: ProfileService) { }

    list: RequestHandler = async (req: Request, res: Response) => {

        const filterValidation = listProfilesSchema.safeParse(req.body);

        if (!filterValidation.success) {

            return res.status(422).json({ message: "Invalid filtering options." });

        }

        try {

            const profiles = await this.profileService.list(filterValidation.data);

            return res.status(200).json(profiles);

        } catch (e) {

            let status = 500;
            let message = "Internal error.";

            if (e instanceof AppError && e.code === ErrorCodes.UNEXPECTED_DATABASE_ERROR) {

                message = e.message;
                return res.status(status).json({ message });

            }

            console.error(e);
            return res.status(status).json({ message });

        }

    }

    find: RequestHandler = async (req: Request, res: Response) => {

        const idValidation = profileIdSchema.safeParse(req.params);

        if (!idValidation.success) {

            return res.status(400).json({ message: "Profile id is invalid or not provided." });

        }

        try {

            const profile = await this.profileService.find(idValidation.data.id);

            if (!profile) {

                return res.status(404).json({ message: "Profile not found." });

            }

            return res.status(200).json({ profile });

        } catch (e) {

            if (e instanceof AppError && e.code === ErrorCodes.UNEXPECTED_DATABASE_ERROR) {

                return res.status(500).json({ message: e.message });

            }

            console.error(e);
            return res.status(500).json({ message: "Internal error." });

        }

    }

    update: RequestHandler = async (req: Request, res: Response) => {

        const profileIdValidation = profileIdSchema.safeParse(req.params);

        if (!profileIdValidation.success) {
            return res.status(404).json({ message: "Profile Id is invalid or not provided." });
        }

        const profileUpdateDataValidation = updateProfileSchema.safeParse(req.body);

        if (!profileUpdateDataValidation.success) {
            return res.status(422).json({ message: "Invalid updating data." });
        }

        try {

            const updatedProfile = await this.profileService.update(
                profileIdValidation.data.id, profileUpdateDataValidation.data
            );

            return res.status(200).json({ message: "Profile updated successfully.", profile: updatedProfile });

        } catch (e) {

            if (e instanceof AppError) {

                if (e.code === ErrorCodes.RECORD_NOT_FOUND) {

                    return res.status(404).json({ message: "Profile not found." });

                }

                return res.status(500).json({ message: e.message });

            }

            console.error(e);
            return res.status(500).json("Internal error.");

        }
    }

    delete: RequestHandler = async (req: Request, res: Response) => {

        const profileIdValidation = profileIdSchema.safeParse(req.params);

        if (!profileIdValidation.success) {

            return res.status(400).json({ message: "Profile Id is invalid or not provided." });

        }

        try {

            await this.profileService.delete(profileIdValidation.data.id);

            return res.status(200).json({ message: "Profile deleted successfully." });

        } catch (e) {

            if (e instanceof AppError) {

                if (e.code === ErrorCodes.RECORD_NOT_FOUND) {

                    return res.status(404).json({ message: "Profile not found." });

                }

                return res.status(500).json({ message: e.message });

            }

            return res.status(500).json({ message: "Internal server error." });
        }
    }
}
