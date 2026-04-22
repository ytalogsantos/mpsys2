import { prisma } from "../config/db.js";
import { Prisma, Role } from "../../generated/prisma/client.js";
import { AppError } from "../tools/errors/app-error.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import { AuthorizationError } from "../tools/errors/authorization-error.js";
import type { CreateNoteInput, UpdateNoteInput } from "../interfaces/dtos/note.js";

export class NoteService {
    
    public async create(noteData: CreateNoteInput): Promise<Prisma.maintenance_notesModel> {
        try {
            return await prisma.maintenance_notes.create({
                data: {
                    title: noteData.title,
                    priority: noteData.priority,
                    description: noteData.description,
                    profile_id: noteData.profileId
                }
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2007") {
                    console.error(e.message);
                    throw new AppError("Invalid profile.", ErrorCodes.INVALID_PROFILE_ID, 400);
                }
                if (e.code === "P2002") {
                    console.error(e.message);
                    throw new AppError("Note already exists.", ErrorCodes.NOTE_ALREADY_EXISTS, 400);
                }
                throw new AppError(e.message, ErrorCodes.NOTE_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("Error at NoteService's create method.");
        }
    }

    public async getById(noteId: string): Promise<Prisma.maintenance_notesModel | null> {
        try {
            return await prisma.maintenance_notes.findUnique({ where: {id: noteId }});
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2007") {
                    console.error(e.message);
                    throw new AppError("Invalid id.", ErrorCodes.INVALID_NOTE_ID, 400);
                }
                console.error(e.message, e.stack);
                throw new AppError(e.message, ErrorCodes.NOTE_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("Error at NoteService's getById method.");
        }
    }

    public async getAll(userRole: Role): Promise<Prisma.maintenance_notesModel[] | null> {
        try {
            if ((userRole != Role.ADMIN) && (userRole != Role.GATEKEEPER)) {
                throw new AuthorizationError("Access denied.", ErrorCodes.ACESS_DENIED, 403);
            }
            return await prisma.maintenance_notes.findMany();

        } catch (e) {
            if (e instanceof AuthorizationError) {
                if (e.code === ErrorCodes.ACESS_DENIED) {
                    console.log(e.message, e.stack);
                    throw new AuthorizationError(e.message, e.code, e.status);
                }
            }
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                console.error(e.message);
                throw new AppError(e.message, ErrorCodes.NOTE_INTERNAL_ERROR, 500);
            }
            console.error(e);
            throw new Error("Error at NoteService's getAll method.");
        }
    }

    public async update(userRole: Role, noteId: string, noteData: UpdateNoteInput): Promise<void> {
        if ((userRole != Role.ADMIN) && (userRole != Role.GATEKEEPER)) {
            throw new AuthorizationError("Access denied.", ErrorCodes.ACESS_DENIED, 403);
        }
        try {
            const note = await prisma.maintenance_notes.findUnique({
                where: { id: noteId }
            });

            if (!note) {
                throw new AppError("Note not found.", ErrorCodes.NOTE_NOT_FOUND, 404);
            }
            await prisma.maintenance_notes.update({
                where: { id: noteId },
                data: {
                    title: noteData.title,
                    priority: noteData.priority,
                    description: noteData.description,
                }
            });
        } catch (e) {
            if (e instanceof AuthorizationError) {
                console.log(e.message);
                throw new AuthorizationError(e.message, e.code, e.status);
            }
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                console.error(e.message);
                throw new AppError(e.message, ErrorCodes.NOTE_INTERNAL_ERROR, 500);
            }
            if (e instanceof AppError) {
                console.error(e.message);
                throw new AppError(e.message, e.code, e.status);
            }
            console.error(e);
            throw new Error("Error at NoteService's update method.");
        }
    }

    public async delete(userRole: Role, noteId: string): Promise<void> {
        if ((userRole != Role.ADMIN) && (userRole != Role.GATEKEEPER)) {
            throw new AuthorizationError("Access denied.", ErrorCodes.ACESS_DENIED, 403);
        }
        
        try {
            await prisma.maintenance_notes.delete({ where: {id: noteId }});
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2007") {
                    console.error(e.message);
                    throw new AppError("Invalid id.", ErrorCodes.INVALID_NOTE_ID, 400);
                }
                console.error(e.message);
                throw new AppError(e.message, ErrorCodes.NOTE_INTERNAL_ERROR, 500);
            }
            if (e instanceof AuthorizationError) {
                console.error(e.message);
                throw new AuthorizationError(e.message, e.code, e.status);
            }
            throw new Error("Error at NoteService's delete method.");
        }
    }

}