import { authMiddleware } from "../middlewares/auth-middleware.js";
import type { Express, Request, Response } from "express";
import { profileRouter } from "./profile-routes.js";
import { userRouter } from "./user-routes.js";
import { authRouter } from "./auth-routes.js";
import { noteRouter } from "./note-routes.js";

const routes = (app: Express) => {
    app.route("/").get((req: Request, res: Response) => res.status(200).send("Hello server."));
    app.use(authRouter);
    app.use(authMiddleware);

    app.use(userRouter);
    app.use(profileRouter);
    app.use(noteRouter);
}

export { routes };