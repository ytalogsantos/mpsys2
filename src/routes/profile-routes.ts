import express from "express";
import { ProfileController } from "../controllers/profile-controller.js";
import { ProfileService } from "../services/profile-service.js";

const service = new ProfileService();
const controller = new ProfileController(service);
const profiles = express.Router();

profiles.get("/profiles/:id", controller.get);

export { profiles };