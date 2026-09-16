import type { Request, RequestHandler, Response } from "express";
import { userIdParamSchema, listUsersSchema, updateUserSchema } from "@schemas/user-schema.js";
import { UserService } from "@/services/user-service.js";
import { ErrorCodes } from "@/tools/errors/error.codes.js";
import { AppError } from "@/tools/errors/app-error.js";

export class UserController {

    constructor(private readonly userService: UserService) { }

    find: RequestHandler = async (req: Request, res: Response) => {

        const idValidation = userIdParamSchema.safeParse(req.params);

        if (!idValidation.success) {

            return res.status(400).json("User id is invalid or not provided.");

        }

        try {

            const user = await this.userService.find(idValidation.data.id);

            if (!user) {

                return res.status(404).json(
                    { message: "User not found." }
                );

            }

            return res.status(200).json({ user });

        } catch (e) {

            if (e instanceof AppError && e.code === ErrorCodes.UNEXPECTED_DATABASE_ERROR) {

                return res.status(500).json({ message: e.message });

            }

            console.error(e);
            return res.status(500).json({ message: "Internal error." });

        }
    }

    list: RequestHandler = async (req: Request, res: Response) => {

        const filterValidation = listUsersSchema.safeParse(req.body);

        if (!filterValidation.success) {

            return res.status(422).json("Invalid filtering data.");

        }

        try {

            const users = await this.userService.list(filterValidation.data);

            if (users.length < 1) {

                return res.status(404).json(
                    { message: "No users were found." }
                );

            }

            return res.status(200).json({ users })

        } catch (e) {

            if (e instanceof AppError && e.code === ErrorCodes.UNEXPECTED_DATABASE_ERROR) {

                return res.status(500).json({ message: e.message });

            }

            return res.status(500).json({ message: "Internal error." });

        }

    }

    update: RequestHandler = async (req: Request, res: Response) => {

        const idValidation = userIdParamSchema.safeParse(req.params);

        if (!idValidation.success) {

            return res.status(400).json({ message: "User id is invalid or not provided." });

        }

        const userDataValidation = updateUserSchema.safeParse(req.body);

        if (!userDataValidation.success) {

            return res.status(422).json({ message: "Invalid updating data." });

        }

        try {

            const updatedUser = await this.userService.update(
                idValidation.data.id, userDataValidation.data
            );

            return res.status(200).json(
                { message: "User updated successfully.", updatedUser }
            );

        } catch (e) {

            if (e instanceof AppError) {

                if (e.code === ErrorCodes.RECORD_ALREADY_EXISTS) {

                    return res.status(409).json({ message: "Email address is already in use." });

                }

                if (e.code === ErrorCodes.UNEXPECTED_DATABASE_ERROR) {
                    
                    return res.status(500).json({ message: e.message });

                }


            }
            
            console.error(e);
            return res.status(500).json({ message: "Internal error." });

        }

    }

    delete: RequestHandler = async (req: Request, res: Response) => {

        const idValidation = userIdParamSchema.safeParse(req.params);

        if (!idValidation.success) {

            return res.status(400).json({ message: "User id is invalid or not provided."});

        }

        try {

            await this.userService.delete(idValidation.data.id);
            return res.status(200).json({ message: "User deleted successfully." });

        } catch (e) {

            if (e instanceof AppError) {

                if (e.code === ErrorCodes.RECORD_NOT_FOUND) {

                    return res.status(404).json({ message: "User not found."});

                }

                return res.status(500).json({ message: e.message });

            }

            return res.status(500).json({ message: "Internal error." });

        }

    }

}
