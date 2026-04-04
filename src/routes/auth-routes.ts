import express from "express";
import { RegisterController } from "../controllers/auth-controller.js";
import { UserService } from "../services/user-service.js";
import { ProfileService } from "../services/profile-service.js";
import { AuthService } from "../services/auth-service.js";

const userService = new UserService();
const profileService = new ProfileService();
const registerService = new AuthService(userService, profileService);
const registerController = new RegisterController(registerService);
const register = express.Router();

register.post("/registration", registerController.register);

export { register };
