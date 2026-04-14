import { NoteService } from "../services/note-service.js";
import type { RequestHandler, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import { AppError } from "../tools/errors/app-error.js";

export class NoteController {
    private readonly noteService: NoteService;

    constructor(noteService: NoteService) {
        this.noteService = noteService;
    }

    create: RequestHandler = async (req: Request, res: Response) => {
        try {
            const note: Prisma.maintenance_notesCreateInput = req.body;
            return await this.noteService.create(note);
        } catch (e) {
            if (e instanceof AppError)  {
                console.error(e.message, e.stack);
                return res.status(e.status).json({message: `Internal error -- ${e.message}`, code: e.code});
            }
            console.error(e);
            return res.status(500).json({message: `Internal server error. Please, try again later.`});
        }
    }

    getById: RequestHandler = async (req: Request, res: Response) => {
        const noteId: string = String(req.body.id);
        try {
            return await this.noteService.getById(noteId);
        } catch (e) {
            if (e instanceof AppError)  {
                console.error(e.message, e.stack);
                return res.status(e.status).json({message: `Internal error -- ${e.message}`, code: e.code});
            }
            console.error(e);
            return res.status(500).json({message: `Internal server error. Please, try again later.`});
        }
    }


}