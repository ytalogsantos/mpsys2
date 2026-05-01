import express from "express";
import { ProfileController } from "../controllers/profile-controller.js";
import { ProfileService } from "../services/profile-service.js";
import { UserService } from "../services/user-service.js";

const userService = new UserService();
const profileService = new ProfileService(userService);
const controller = new ProfileController(profileService);
const profileRouter = express.Router();

profileRouter.get("/profiles/:id", controller.getById);
profileRouter.get("/profiles", controller.getAll);
profileRouter.put("/profiles/:id", controller.update);
profileRouter.delete("/profiles/:id", controller.delete);
export { profileRouter };