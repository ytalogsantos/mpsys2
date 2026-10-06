import type 
{
    CreateMaintenanceNoteResponse, 
    GetMaintenanceNoteResponse
} 
from "@interfaces/dtos/maintenance-note";
import type 
{
    CreateMaintenanceNoteInput, 
    ListMaintenanceNoteInput,
    UpdateMaintenanceNoteInput
} 
from "@schemas/maintenance-note-schema";
import type { MaintenanceNoteRepository } from "@interfaces/repositories/maintenance-note-repository";

export class MaintenanceNoteService {

    constructor(private readonly maintenanceNoteRepository: MaintenanceNoteRepository) { }

    public async create(noteData: CreateMaintenanceNoteInput): Promise<CreateMaintenanceNoteResponse> {

        return await this.maintenanceNoteRepository.create(noteData);

    }

    public async list(noteFilters: ListMaintenanceNoteInput): Promise<GetMaintenanceNoteResponse[]> {

        return await this.maintenanceNoteRepository.list(noteFilters);

    }

    public async find(noteId: string): Promise<GetMaintenanceNoteResponse | null> {

        return await this.maintenanceNoteRepository.find(noteId);

    }

    public async update(noteId: string, noteData: UpdateMaintenanceNoteInput): Promise<GetMaintenanceNoteResponse> {

        return await this.maintenanceNoteRepository.update(noteId, noteData);

    }

    public async delete(noteId: string): Promise<void> {

        return await this.maintenanceNoteRepository.delete(noteId);

    }

}
