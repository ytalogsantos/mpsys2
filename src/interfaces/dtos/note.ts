import type { Priority } from "@generated/prisma/enums.js";

export interface CreateNoteInput {
    title: string,
    priority: Priority;
    description: string,
    profileId: string,
}

export interface UpdateNoteInput {
    title: string,
    priority: Priority,
    description: string
}

export interface CreateNoteRequest {
    title: string,
    priority: Priority,
    description: string
}

export interface CreateNoteResponse {
    id: string,
    title: string,
    priority: Priority,
    description: string,
}