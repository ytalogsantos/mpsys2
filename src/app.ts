import express from "express";
import { routes } from "./routes/index.js";
import { UserService } from "./services/user-service.js";

// const service = new UserService();

const app = express();
app.use(express.json());
routes(app);

export { app };