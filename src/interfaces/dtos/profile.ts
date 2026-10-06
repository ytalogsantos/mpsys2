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
