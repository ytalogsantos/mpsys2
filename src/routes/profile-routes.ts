import express from "express";
import { ProfileController } from "../controllers/profile-controller.js";
import { ProfileService } from "../services/profile-service.js";
import { UserService } from "../services/user-service.js";
import { PrismaUserRepository } from "@repositories/prisma-user-repository.js";
import { PrismaProfileRepository } from "@repositories/prisma-profile-repository.js";

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);

const profileRepository = new PrismaProfileRepository();
const profileService = new ProfileService(profileRepository);

const controller = new ProfileController(profileService);
const profileRouter = express.Router();

profileRouter.get("/profiles/:id", controller.find);
profileRouter.get("/profiles", controller.list);
profileRouter.put("/profiles/:id", controller.update);
profileRouter.delete("/profiles/:id", controller.delete);
export { profileRouter };
