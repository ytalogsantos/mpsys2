import express from "express";
import { AuthController } from "../controllers/auth-controller.js";
import { UserService } from "../services/user-service.js";
import { ProfileService } from "../services/profile-service.js";
import { AuthService } from "../services/auth-service.js";

const userService = new UserService();
const profileService = new ProfileService();
const registerService = new AuthService(userService, profileService);
const authController = new AuthController(registerService);
const auth = express.Router();

auth.post("/auth/register", authController.register);
// authRoutes.post("/auth/login", authController.login);


export { auth };
