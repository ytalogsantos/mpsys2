import { prisma } from "../config/db.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../tools/errors/app-error.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";

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

    public async getAll(): Promise<Prisma.maintenance_notesModel[] | null> {
        try {
            return await prisma.maintenance_notes.findMany();

        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                console.error(e.message, e.stack);
                throw new AppError(e.message, ErrorCodes.MAINTENANCE_NOTE_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }
}