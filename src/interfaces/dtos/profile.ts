import type { Role } from "@generated/prisma/enums.js";

export interface CreateProfileInput {
    userId: string,
    name: string,
    role: Role
}

export interface UpdateProfileName {
    name: string,
}

export interface UpdateProfileRole {
    role: Role,
}

export interface CreateProfileRequest {
    userId: string,
    name: string,
    role: Role,
}


export interface CreateProfileResponse {
    id: string,
    name: string,
    role: Role,
}