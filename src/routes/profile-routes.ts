import express from "express";
import { ProfileController } from "../controllers/profile-controller.js";
import { ProfileService } from "../services/profile-service.js";

const service = new ProfileService();
const controller = new ProfileController(service);
const profileRouter = express.Router();

profileRouter.get("/profiles/:id", controller.getById);
profileRouter.get("/profiles", controller.getAll);
profileRouter.put("/profiles/:id", controller.update);
profileRouter.delete("/profiles/:id", controller.delete);
export { profileRouter };