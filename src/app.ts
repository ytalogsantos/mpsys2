import express from "express";
import { UserService } from "@services/user-service";

const service = new UserService();


const app = express();

export { app };