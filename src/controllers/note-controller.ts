import { NoteService } from "../services/note-service.js";
import type { RequestHandler, Request, Response } from "express";
import { Note_Status, Prisma, Role } from "../../generated/prisma/client.js";
import { AppError } from "../tools/errors/app-error.js";
import { AuthorizationError } from "../tools/errors/authorization-error.js";
import { ErrorCodes } from "../tools/errors/error.codes.js";
import type { CreateNoteInput, CreateNoteRequest, UpdateNoteRequest } from "../interfaces/dtos/note.js";

export class NoteController {
    private readonly noteService: NoteService;

    constructor(noteService: NoteService) {
        this.noteService = noteService;
    }

    create: RequestHandler = async (req: Request, res: Response) => {
        try {
            const noteData: CreateNoteRequest = req.body;
            const note: CreateNoteInput = {...noteData, noteStatus: Note_Status.OPEN}
            return await this.noteService.create(note);
        } catch (e) {
            if (e instanceof AppError)  {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal server error. Please, try again later.", code: ErrorCodes.NOTE_INTERNAL_ERROR});
        }
    }

    getById: RequestHandler = async (req: Request, res: Response) => {
        const noteId: string = String(req.params.id);
        try {
            return await this.noteService.getById(noteId);
        } catch (e) {
            if (e instanceof AppError)  {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal server error. Please, try again later."});
        }
    }

    getAll: RequestHandler = async (req: Request, res: Response) => {
        const userRole: Role = req.body.userRole;
        try {
            const users = await this.noteService.getAll(userRole);
            return res.status(200).json({users});
        } catch (e) {
            if (e instanceof AuthorizationError) {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            if (e instanceof AppError)  {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal server error. Please, try again later."});
        }
    }

    update: RequestHandler = async (req: Request, res: Response) => {
        const noteId: string = String(req.params.id);
        const noteData: UpdateNoteRequest = req.body;
        const profileRole = noteData.profileRole;

        try {
            await this.noteService.update(profileRole, noteId, noteData);
            return res.status(204).json({message: "Note updated successfully."});
        } catch (e) {
            if (e instanceof AuthorizationError) {
                return res.status(e.status).json({message: `${e.message}`, code: e.code});
            }
            if (e instanceof AppError)  {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal server error. Please, try again later."});
        }
    }

    delete: RequestHandler = async (req: Request, res: Response) => {
        const noteId: string = String(req.params.id);
        const userRole: Role = req.body.userRole;
        try {
            await this.noteService.delete(userRole, noteId);
            return res.status(200).json({message: "Note deleted successfully."});
        } catch (e) {
            if (e instanceof AuthorizationError) {
                return res.status(e.status).json({message: `${e.message}`, code: e.code});
            }
            if (e instanceof AppError)  {
                return res.status(e.status).json({message: e.message, code: e.code});
            }
            return res.status(500).json({message: "Internal server error. Please, try again later."});
        }
    }
}