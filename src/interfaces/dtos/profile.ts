import type { Role } from "@generated/prisma/enums.js";

export interface CreateProfileInput {
    name: string,
    role: Role
}

export interface CreateProfileResponse {
    id: string,
    name: string,
    role: Role,
}

export interface GetProfileResponse {
    id: string,
    name: string,
    role: Role,
}

export interface UpdateProfileRequest {
    name?: string,
    role?: Role,
}

export interface UpdateProfileInput {
    name?: string,
    role?: Role,
}