import type { NoteStatus, NotePriority, Role } from "@generated/prisma/enums.js";

export interface CreateMaintenanceNoteData {
    id: string,
    title: string,
    priority: NotePriority;
    description: string,
    createdBy: string,
    createdAt: string
}

export interface CreateMaintenanceNoteResponse {
    id: string,
    title: string,
    priority: NotePriority;
    description: string,
    profile_id: string,
    created_at: Date
}

export interface GetMaintenanceNoteResponse {
    id: string,
    title: string,
    priority: NotePriority,
    description: string,
    profile_id: string,
    created_at: Date,
}
