import type { JwtPayloadSafe } from "../interfaces/jwt-payload-safe.js"
import type { AuthRequest } from "../interfaces/auth-request.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;    
    const secret = String(process.env.JWT_SECRET);
    if (!authHeader) {
        return res.status(401).json({message: "Error - Authorization token not provided.", code: ErrorCodes.AUTHORIZATION_TOKEN_NOT_PROVIDED});
    }
    try {
        const token = String(authHeader.split(" ")[1]);
        const payload = jwt.verify(token, secret) as JwtPayloadSafe;
        req.user = payload;
        next();
    } catch (e) {
        console.error(e);
        return res.status(401).json({ message: "Authentication error. The token may be expired or invalid."});
    }
}

export { authMiddleware };