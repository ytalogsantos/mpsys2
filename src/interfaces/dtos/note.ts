import type { Note_Status, Priority, Role } from "@generated/prisma/enums.js";

export interface CreateNoteInput {
    title: string,
    priority: Priority;
    description: string,
    profileId: string,
    noteStatus: Note_Status,
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

export interface CreateNoteRequest {
    title: string,
    priority: Priority,
    description: string,
    profileId: string,
}

export interface CreateNoteResponse {
    id: string,
    title: string,
    priority: Priority,
    description: string,
}