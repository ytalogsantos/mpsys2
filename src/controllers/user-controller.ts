import { UserService } from "@services/user-service.js";
import type { Request, RequestHandler, Response } from "express";

export class UserController {

    private readonly service: UserService;

    constructor(service: UserService) {
        this.service = service;
    }

    create: RequestHandler = async (req, res) => {
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

}