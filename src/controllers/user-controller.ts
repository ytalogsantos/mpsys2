import { UserService } from "../services/user-service.js";
import type { Request, RequestHandler, Response } from "express";
import { UserInputFilter } from "../tools/user-input-filter.js";
import { Prisma } from "../../generated/prisma/client.js";

export class UserController {
    constructor(private readonly service: UserService) { }

    create: RequestHandler = async (req: Request, res: Response) => {
        const validUserInput: Prisma.usersCreateInput | boolean = UserInputFilter(req.body);

        if (!validUserInput) {
            return res.status(400).json({message: `Data missing. Please, fill the fields "email" and "password" properly.`});
        }

        const email: string  = String(validUserInput["email" as keyof Object]);
        const password: string = String(validUserInput["password" as keyof Object]);

        try {
            const newUser = await this.service.create({ email, password });
            return res.status(201).json({message: "User created successfully.", newUser});
        } catch (e: unknown) {
            return res.status(500).json({message: `${e}`});
        }
    }

    get: RequestHandler = async (req: Request, res: Response) => {
        const id = req.params.id;

        if (!id) {
            console.error("Identifier missing.");
            return res.status(400).json({message: "Identifier missing"});
        }

        try {
            const user = await this.service.get({id});
            if (!user) {
                console.log("No user was found.");
                return res.status(404).json({message: "User not found."});    
            }
            return res.status(200).json({user});
        } catch (e: unknown) {
            console.error(`Internal error: ${e}`);
            return res.status(500).json({message: `Internal error.`});
        }
    }

    getAll: RequestHandler = async (req: Request, res: Response) => {
        try {
            const users = await this.service.getAll();
            if (!users) {
                console.log("No users were found.");
                return res.status(404).json({message: "No users were found."});
            }
            return res.status(200).json({users})

        } catch (e: unknown) {
            console.error(`Internal error: ${e}`);
            return res.status(500).json({message: `Internal error.`});
        }
    }

    update: RequestHandler = async (req: Request, res: Response) => {
        const id: string  = req.params.id || "";
        const body: Prisma.usersCreateInput = req.body;
        const filteredInput: object = InputFilter(body);

        if (!id) {
            console.error("Identifier missing.");
            return res.status(400).json({message: "Identifier missing."});
        }

        if (Object.keys(filteredInput).length == 0) {
            console.error("Data for update must be provided.");
            return res.status(400).json({message: "Please, provide the data for updating."});
        }

        try {
            const user = await this.service.get({id});
            if (!user) {
                console.error("User not found.");
                return res.status(404).json({message: "User not found, please create an account or check the data provided."});
            }

            await this.service.update(id, body);
            return res.status(200).json({message: "User updated successfully."});

        } catch (e: unknown) {
            console.error(`Internal error ${e}`);
            return res.status(500).json({message: "Internal error."});
        }
    }

    delete: RequestHandler = async (req: Request, res: Response) => {
        const id = req.params.id || "";
        
        try {
            const user = await this.service.get({id});
            if (!user) {
                console.error("User not found.");
                return res.status(404).json({message: "User not found."});
            }

            await this.service.delete(id);
            return res.status(200).json({message: "User deleted successfully."});

        } catch (e: unknown) {
            console.error(`Internal error ${e}`);
            return res.status(500).json({message: "Internal error."});
        }
    }

}