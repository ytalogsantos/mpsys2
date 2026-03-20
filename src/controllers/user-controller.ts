import { UserService } from "../services/user-service.js";
import type { Request, RequestHandler, Response } from "express";
import { UserInputFilter } from "../tools/user-input-filter.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../tools/errors/app-error.js";
import { ErrorCode } from "../tools/errors/error.codes.js";

export class UserController {
    constructor(private readonly service: UserService) { }

    create: RequestHandler = async (req: Request, res: Response) => {
        const validUserInput: Prisma.usersCreateInput | boolean = UserInputFilter(req.body);

        if (!validUserInput) {
            return res.status(400).json({message: `Invalid input. Please, fill the fields 'email' and 'password' properly.`});
        }

        const email: string  = String(validUserInput["email" as keyof Object]);
        const password: string = String(validUserInput["password" as keyof Object]);

        try {
            const newUser = await this.service.create({ email, password });
            return res.status(201).json({message: "User created successfully.", newUser});
        } catch (e) {
            if (e instanceof AppError) {
                return res.status(e.status).json({message: `Operation failed -- ${e.message}`, code: e.code});
            }
            console.log(`${ErrorCode.USER_UNEXPECTED_ERROR} -- ${e}`);
            return res.status(500).json({message: `${ErrorCode.USER_UNEXPECTED_ERROR} -- Internal error`});
        }
    }

    getById: RequestHandler = async (req: Request, res: Response) => {
        const id: string = String(req.params.id);

        try {
            const user = await this.service.getById(id);
            if (!user) {
                return res.status(404).json({message: "User not found."});    
            }
            return res.status(200).json({user});
        } catch (e) {
            console.log("reached here.");
            if (e instanceof AppError) {
                return res.status(e.status).json({message: `Operation failed -- ${e.message}`});
            }
            console.log(`${ErrorCode.USER_UNEXPECTED_ERROR} -- ${e}`);
            return res.status(500).json({message: `${ErrorCode.USER_UNEXPECTED_ERROR} -- Internal error.`});
        }
    }

    getAll: RequestHandler = async (req: Request, res: Response) => {
        try {
            const users = await this.service.getAll();
            if (!users) {
                return res.status(404).json({message: "No users were found."});
            }
            return res.status(200).json({users})

        } catch (e) {
            if (e instanceof AppError) {
                return res.status(e.status).json({message: `Operation failed -- ${e.message}`, code: e.code});
            }
            console.log(`${ErrorCode.USER_UNEXPECTED_ERROR} -- ${e}`);
            return res.status(500).json({message: `${ErrorCode.USER_UNEXPECTED_ERROR} -- Internal error`});
        }
    }

    update: RequestHandler = async (req: Request, res: Response) => {
        const id: string  = String(req.params.id);
        const body: Prisma.usersCreateInput = req.body;

        if (Object.keys(body).length == 0) {
            return res.status(400).json({message: "Please, provide the data for updating."});
        }

        try { 
            await this.service.update(id, body);
            return res.status(200).json({message: "User updated successfully."});

        } catch (e) {
            console.log("reached here.");
            if (e instanceof AppError) {
                return res.status(e.status).json({message: `Operation failed -- ${e.message}`, code: e.code});
            }
            console.log(`${ErrorCode.USER_UNEXPECTED_ERROR} -- ${e}`);
            return res.status(500).json({message: `${ErrorCode.USER_UNEXPECTED_ERROR} -- Internal error`});
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
                return res.status(e.status).json({message: `Operation failed -- ${e.message}`, code: e.code});
            }
            console.log(`${ErrorCode.USER_UNEXPECTED_ERROR} -- ${e}`);
            return res.status(500).json({message: `${ErrorCode.USER_UNEXPECTED_ERROR} -- Internal error`});
        }
    }

}