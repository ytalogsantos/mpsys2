import { isEmailValid, isPasswordValid } from "../tools/user-input-filter.js";
import type { Request, RequestHandler, Response } from "express";
import { UserService } from "../services/user-service.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import { AppError } from "../tools/errors/app-error.js";
import type { UpdateUserRequest } from "@interfaces/dtos/user.js";
import type { usersModel } from "@generated/prisma/models.js";

export class UserController {
    constructor(private readonly service: UserService) { }

    getById: RequestHandler = async (req: Request, res: Response) => {
        const id: string = String(req.params.id);
        try {
            const user = await this.service.getById(id);
            if (!user) {
                console.log(ErrorCodes.USER_NOT_FOUND);
                return res.status(404).json({message: "User not found.", code: ErrorCodes.USER_NOT_FOUND});    
            }
            return res.status(200).json({user});
        } catch (e) {
            if (e instanceof AppError) {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal error.", code: ErrorCodes.USER_INTERNAL_ERROR});
        }
    }

    getAll: RequestHandler = async (req: Request, res: Response) => {
        try {
            const users = await this.service.getAll();
            if (!users) {
                console.log(ErrorCodes.USER_NOT_FOUND);
                return res.status(404).json({message: "No users were found.", code: ErrorCodes.USER_NOT_FOUND});
            }
            return res.status(200).json({users})

        } catch (e) {
            if (e instanceof AppError) {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal error.", code: ErrorCodes.USER_INTERNAL_ERROR});
        }
    }

    update: RequestHandler = async (req: Request, res: Response) => {
        const id: string = String(req.params.id);
        const userData: UpdateUserRequest = req.body;
        const email = userData.email
        const password = userData.password;
        
        if (Object.keys(userData).length == 0) {
            return res.status(400).json({message: "Fields can't be empty.", code: ErrorCodes.INVALID_USER_DATA});
        }
        if (email) {
            if (!isEmailValid(email)) {
                console.error(ErrorCodes.INVALID_USER_EMAIL);
                return res.status(400).json({message: "Invalid email format. Please, try again.", code: ErrorCodes.INVALID_USER_EMAIL});
            }
        }
        if (password) {
            if (!isPasswordValid(password)) {
                return res.status(400).json({message: "Password is too weak. Please, include numbers, special characters and capital letters.", code: ErrorCodes.INVALID_USER_PASSWORD_FORMAT});
            }
        }

        try { 
            await this.service.update(id, userData);
            return res.status(200).json({message: "User updated successfully."});

        } catch (e) {
            if (e instanceof AppError) {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal error.", code: ErrorCodes.USER_INTERNAL_ERROR});
        }
    }

    delete: RequestHandler = async (req: Request, res: Response) => {
        const id: string = String(req.params.id);
        try {
            const user = await this.service.getById(id);
            if (!user) {
                return res.status(404).json({message: "User not found."});
            }

            await this.service.delete(id);
            return res.status(200).json({message: "User deleted successfully."});

        } catch (e) {
            if (e instanceof AppError) {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal error.", code: ErrorCodes.USER_INTERNAL_ERROR});
        }
    }

}