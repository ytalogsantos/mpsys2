import { users } from "./user-routes.js";
import type { Express, Request, Response } from "express";

const routes = (app: Express) => {
    app.route("/").get((req: Request, res: Response) => res.status(200).send("Hello server."));
    app.use(users);
}

export { routes };