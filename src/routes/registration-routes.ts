import express from "express";
import { RegisterController } from "../controllers/registration-controller.js";
import { UserService } from "../services/user-service.js";
import { ProfileService } from "../services/profile-service.js";
import { RegistrationService } from "../services/registration-service.js";

const userService = new UserService();
const profileService = new ProfileService();
const registerService = new RegistrationService(userService, profileService);
const registerController = new RegisterController(registerService);
const register = express.Router();

register.post("/register", registerController.create);

export { register };
