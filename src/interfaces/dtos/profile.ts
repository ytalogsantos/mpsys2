import type { Role } from "@generated/prisma/enums";

export interface CreateProfileResponse {
    id: string,
    name: string,
}

export interface GetProfileResponse {
    id: string,
    name: string,
    // maintenance_notes: 
}

export interface UpdateProfileRequest {
    name?: string,
    role?: Role,
}

export interface UpdateProfileInput {
    name?: string,
    role?: Role,
}
