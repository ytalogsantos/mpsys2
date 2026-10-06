import type { CreateMaintenanceNoteResponse, GetMaintenanceNoteResponse } from "@interfaces/dtos/maintenance-note";
import type { CreateMaintenanceNoteInput, ListMaintenanceNoteInput, UpdateMaintenanceNoteInput } from "@schemas/maintenance-note-schema";

export interface MaintenanceNoteRepository {
    
    create(noteData: CreateMaintenanceNoteInput): Promise<CreateMaintenanceNoteResponse>;

    list(noteFilters: ListMaintenanceNoteInput): Promise<GetMaintenanceNoteResponse[]>;

    find(noteId: string): Promise<GetMaintenanceNoteResponse | null>;

    update(noteId: string, noteData: UpdateMaintenanceNoteInput): Promise<GetMaintenanceNoteResponse>;

    delete(noteId: string): Promise<void>;

}
