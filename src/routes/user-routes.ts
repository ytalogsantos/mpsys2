import express from "express";
import { UserController } from "../controllers/user-controller.js";
import { UserService } from "../services/user-service.js";

const service = new UserService();
const controller = new UserController(service);
const userRouter = express.Router();

userRouter.get("/users/:id", controller.getById);
userRouter.get("/users", controller.getAll);
userRouter.put("/users/:id", controller.update);
userRouter.delete("/users/:id", controller.delete);

export { userRouter };
