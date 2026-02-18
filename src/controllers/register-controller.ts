import { UserService } from "../services/user-service.js";
import { ProfileService } from "../services/profile-service.js";
import type { RequestHandler, Request, Response } from "express";

export class RegisterController {
    private readonly userService: UserService;
    private readonly profileService: ProfileService;

    constructor(userService: UserService, profileService: ProfileService) {
        this.userService = userService;
        this.profileService = profileService;
    };


    create: RequestHandler = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const userInput = { email, password };

        

        try {

        }
    }
}