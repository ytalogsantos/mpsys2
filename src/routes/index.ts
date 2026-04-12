import { authMiddleware } from "../middlewares/auth-middleware.js";
import type { Express, Request, Response } from "express";
import { profiles } from "./profile-routes.js";
import { users } from "./user-routes.js";
import { auth } from "./auth-routes.js";

const routes = (app: Express) => {
    app.route("/").get((req: Request, res: Response) => res.status(200).send("Hello server."));
    app.use(auth);
    app.use(authMiddleware);

    app.use(users);
    app.use(profiles);
}

export { routes };