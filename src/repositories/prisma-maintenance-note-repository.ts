import { AppError } from "@/tools/errors/app-error";
import { ErrorCodes } from "@/tools/errors/error.codes";
import { prisma } from "@config/db";
import { Prisma } from "@generated/prisma/client";
import type { CreateMaintenanceNoteResponse, GetMaintenanceNoteResponse } from "@interfaces/dtos/maintenance-note";
import type { MaintenanceNoteRepository } from "@interfaces/repositories/maintenance-note-repository";
import type { CreateMaintenanceNoteInput, ListMaintenanceNoteInput, UpdateMaintenanceNoteInput } from "@schemas/maintenance-note-schema";

export class PrismaMaintenanceNoteRepository implements MaintenanceNoteRepository {

    public async create(noteData: CreateMaintenanceNoteInput): Promise<CreateMaintenanceNoteResponse> {

        try {

            return await prisma.maintenanceNote.create({ data: noteData });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {

                    throw new AppError("Profile not found.", ErrorCodes.RECORD_NOT_FOUND);

                }

                throw new AppError(e.message, ErrorCodes.UNEXPECTED_DATABASE_ERROR);

            }

            throw e;

        }

    }

    public async list(noteFilters: ListMaintenanceNoteInput): Promise<GetMaintenanceNoteResponse[]> {

        const noteData = {
            ...(noteFilters.note_satatus && {
                note_status: noteFilters.note_satatus
            }),
            ...(noteFilters.priority && {
                priority: noteFilters.priority
            }),
            ...(noteFilters.profile_id && {
                profile_id: noteFilters.profile_id
            }),
            ...(noteFilters.title && {
                title: {
                    startsWith: noteFilters.title
                }
            })
        };

        try {

            return await prisma.maintenanceNote.findMany({
                where: noteData
            });
            
        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                throw new AppError(e.message, ErrorCodes.UNEXPECTED_DATABASE_ERROR);

            }

            throw e;

        }

    }

    public async find(noteId: string): Promise<GetMaintenanceNoteResponse | null> {
        
        try {

            return await prisma.maintenanceNote.findUnique({
                where: { id: noteId }
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                throw new AppError(e.message, ErrorCodes.UNEXPECTED_DATABASE_ERROR);

            }
            
            throw e;

        }

    }

    public async update(noteId: string, noteData: UpdateMaintenanceNoteInput): Promise<GetMaintenanceNoteResponse> {
        
        const noteUpdateData = {
            ...(noteData.title && {
                title: noteData.title
            }),
            ...(noteData.priority && {
                priority: noteData.priority
            }),
            ...(noteData.note_status && {
                note_status: noteData.note_status
            }),
            ...(noteData.description && {
                description: noteData.description
            }),
        };

        try {

            return await prisma.maintenanceNote.update({
                where: { id: noteId },
                data: noteUpdateData
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {

                    throw new AppError("Maintenance note was not found.", ErrorCodes.RECORD_NOT_FOUND);

                }

                throw new AppError(e.message, ErrorCodes.UNEXPECTED_DATABASE_ERROR);

            }

            throw e;

        }

    }

    public async delete(noteId: string): Promise<void> {
        
        try {

            await prisma.maintenanceNote.delete({
                where: { id: noteId }
            });

        } catch (e) {

            if (e instanceof Prisma.PrismaClientKnownRequestError) {

                if (e.code === "P2025") {

                    throw new AppError("Maintenance note was not found.", ErrorCodes.RECORD_NOT_FOUND);

                }

                throw new AppError(e.message, ErrorCodes.UNEXPECTED_DATABASE_ERROR);

            }

            throw e;

        }
        
    }

}
