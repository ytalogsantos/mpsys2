import { prisma } from "../config/db.js";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../tools/errors/app-error.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";

export class MaintenanceNotesService {
    
    public async create(input: Prisma.maintenance_notesCreateInput): Promise<Prisma.maintenance_notesModel> {
        try {
            return await prisma.maintenance_notes.create({ data: input });
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                throw new AppError(e.message, ErrorCodes.MAINTENANCE_NOTE_INTERNAL_ERROR, 500);
            }
            throw new Error(`${e}`);
        }
    }
}