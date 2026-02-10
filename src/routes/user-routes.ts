import express from "express";
import { UserController } from "../controllers/user-controller.js";
import { UserService } from "../services/user-service.js";

const service = new UserService();
const controller = new UserController(service);
const users = express.Router();

users.post("/users", controller.create);

export { users };
