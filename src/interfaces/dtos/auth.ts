import type { Role } from "@generated/prisma/enums.js";

export interface LoginUserRequest {
    email: string,
    password: string
}

export interface LoginUserResponse {
    id: string, // profileId
    name: string, // profileName
    email: string, // userEmail
    token: string,
}

export interface RegisterUserRequest {
    email: string,
    password: string,
    name: string,
    role: Role,
}

export interface RegisterProfileInput {
    name: string,
    role: Role,
}

export interface AuthPayload {
    userId: string,
    acessLevel: Role
}