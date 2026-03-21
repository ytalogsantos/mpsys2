import express from "express";
import { UserController } from "../controllers/user-controller.js";
import { UserService } from "../services/user-service.js";

const service = new UserService();
const controller = new UserController(service);
const users = express.Router();

users.get("/users/:id", controller.getById);
users.get("/users", controller.getAll);
users.put("/users/:id", controller.update);
users.delete("/users/:id", controller.delete);

export { users };
