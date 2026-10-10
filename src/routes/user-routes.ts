import express from "express";
import { UserController } from "../controllers/user-controller";
import { UserService } from "../services/user-service";
// import { authMiddleware } from "../middlewares/auth-middleware.js";
import { PrismaUserRepository } from "@repositories/prisma-user-repository";

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);
const controller = new UserController(userService);

const userRouter = express.Router();

userRouter.get("/users/:id", controller.find);
userRouter.get("/users", controller.list);
userRouter.put("/users/:id", controller.update);
userRouter.delete("/users/:id", controller.delete);

export { userRouter };
