import type { JwtPayload } from "jsonwebtoken";

export interface JwtPayloadSafe extends JwtPayload {
    userId: string,
}