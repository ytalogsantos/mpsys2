import { users } from "./user-routes.js";
import { profiles } from "./profile-routes.js";
import { register } from "./register-routes.js";
import type { Express, Request, Response } from "express";

const routes = (app: Express) => {
    app.route("/").get((req: Request, res: Response) => res.status(200).send("Hello server."));
    app.use(users);
    app.use(profiles);
    app.use(register);
}

export { routes };