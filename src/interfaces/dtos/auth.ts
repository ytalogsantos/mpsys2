import type { Role } from "@generated/prisma/enums.js";

export interface LoginUserRequest {
    email: string,
    password: string
}

export interface LoginUserResponse {
    id: string,
    name: string,
    email: string,
    token: string,
}

export interface RegisterUserRequest {
    email: string,
    password: string,
    name: string,
    role: Role,
}

export interface RegisterUserResponse {
    profileId: string,
    name: string,
    email: string,
    role: string,
}

export interface AuthPayload {
    userId: string,
    role: Role
}