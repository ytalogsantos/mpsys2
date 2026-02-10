import { UserService } from "../services/user-service.js";
import type { Request, RequestHandler, Response } from "express";

export class UserController {

    private readonly service: UserService;

    constructor(service: UserService) {
        this.service = service;
    }

    create: RequestHandler = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        if (!email || !password) {
            console.error("Data missing. Please, fill the fields 'email' and 'password'.");
            return res.status(400).json({message: "Data missing. Please, fill the fields 'email' and 'password'."});
        }

        try {
            const newUser = await this.service.create({ email, password });
            if (!newUser) {
                console.error("Something went wrong.");
                return res.status(400).json({message: "Something went wrong. Please, try again later."});
            }
            console.log("User created successfully.");
            return res.status(201).json({message: "User created successfully.", data: newUser});
        } catch (e: unknown) {
            console.error(`Internal server error: ${e}`);
            return res.status(500).json({message: `Internal error: ${e}`});
        }
    }

    get: RequestHandler = async (req: Request, res: Response) => {
        const { email } = req.body;

        if (!email) {
            console.error("Identifier missing.");
            return res.status(400).json({message: "Identifier missing"});
        }

        try {
            const user = await this.service.get({email});
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
        const id = req.params.id || "";
        const { email, password } = req.body;

        if (!id) {
            console.error("Identifier missing.");
            return res.status(400).json({message: "Identifier missing."});
        }

        if (!email && !password) {
            console.error("Data for update must be provided.");
            return res.status(400).json({message: "Please, provide the data for updating."});
        }

        try {
            const user = await this.service.get({id});
            if (!user) {
                console.error("User not found.");
                return res.status(404).json({message: "User not found, please create an account or check the data provided."});
            }

            await this.service.update(id, {email, password});

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