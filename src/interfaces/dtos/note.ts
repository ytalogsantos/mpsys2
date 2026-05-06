import type { Note_Status, Priority, Role } from "@generated/prisma/enums.js";

export interface CreateNoteInput {
    title: string,
    priority: Priority;
    description: string,
    userEmail: string,
}

export interface CreateNoteRequest {
    title: string,
    priority: Priority,
    description: string,
    userEmail: string,
}

export interface CreateNoteResponse {
    id: string,
    title: string,
    priority: Priority,
    description: string,
    created_at: Date,
    profile_id: string
}

export interface GetNoteResponse {
    id: string,
    profile_id: string,
    title: string,
    priority: Priority,
    description: string,
    created_at: Date,
}

export interface UpdateNoteInput {
    title: string,
    priority: Priority,
    description: string,
    noteStatus: Note_Status,
}


export interface UpdateNoteRequest {
    profileRole: Role,
    title: string,
    priority: Priority,
    description: string,
    noteStatus: Note_Status,
}


