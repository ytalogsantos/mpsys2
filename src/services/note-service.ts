import { prisma } from "../config/db.js";
import { Prisma, Role } from "../../generated/prisma/client.js";
import { AppError } from "../tools/errors/app-error.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import { AuthorizationError } from "../tools/errors/authorization-error.js";

export class NoteService {
    
    public async create(note: Prisma.maintenance_notesCreateInput): Promise<Prisma.maintenance_notesModel> {
        try {
            return await prisma.maintenance_notes.create({ data: note });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError(e.message, ErrorCodes.MAINTENANCE_NOTE_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }

    public async getById(noteId: string): Promise<Prisma.maintenance_notesModel | null> {
        try {
            return await prisma.maintenance_notes.findUnique({ where: {id: noteId }});
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError(e.message, ErrorCodes.MAINTENANCE_NOTE_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }

    public async getAll(userRole: Role): Promise<Prisma.maintenance_notesModel[] | null> {
        try {
            if ((userRole != Role.ADMIN) && (userRole != Role.GATEKEEPER)) {
                throw new AuthorizationError("Access denied.", ErrorCodes.ACESS_DENIED, 403);
            }
            return await prisma.maintenance_notes.findMany();

        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                console.error(e.message, e.stack);
                throw new AppError(e.message, ErrorCodes.MAINTENANCE_NOTE_INTERNAL_ERROR, 500);
            }

            if (e instanceof AuthorizationError) {
                if (e.code === ErrorCodes.ACESS_DENIED) {
                    console.log(e.message, e.stack);
                    throw new AuthorizationError(e.message, e.code, e.status);
                }
            }
            throw new Error(`${e}`);
        }
    }

    public async update(userRole: Role, noteId: string, noteData: Prisma.maintenance_notesCreateInput): Promise<void> {
        if ((userRole != Role.ADMIN) && (userRole != Role.GATEKEEPER)) {
            throw new AuthorizationError("Access denied.", ErrorCodes.ACESS_DENIED, 403);
        }
        try {
            const note: Prisma.maintenance_notesModel | null = await prisma.maintenance_notes.findUnique({
                where: { id: noteId }
            });

            if (!note) {
                throw new AppError("Note not found.", ErrorCodes.MAINTENANCE_NOTE_NOT_FOUND, 404);
            }
            await prisma.maintenance_notes.update({
                where: { id: noteId },
                data: noteData
            });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                console.error(e.message, e.stack);
                throw new AppError(e.message, ErrorCodes.MAINTENANCE_NOTE_INTERNAL_ERROR, 500);
            }
            if (e instanceof AuthorizationError) {
                console.log(e.message, e.stack);
                throw new AuthorizationError(e.message, e.code, e.status);
            }
            if (e instanceof AppError) {
                console.error(e.message, e.stack);
                throw new AppError(e.message, e.code, e.status);
            }
            throw new Error(`${e}`);
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
                console.error(e.message, e.stack);
                throw new AppError(e.message, ErrorCodes.MAINTENANCE_NOTE_INTERNAL_ERROR, 500);
            }
            if (e instanceof AuthorizationError) {
                console.error(e.message, e.stack);
                throw new AuthorizationError(e.message, e.code, e.status);
            }
            throw new Error(`${e}`);
        }
    }

}