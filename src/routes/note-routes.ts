import express from "express";
import { NoteService } from "../services/note-service.js";
import { NoteController } from "../controllers/note-controller.js";

const noteService = new NoteService();
const noteController = new NoteController(noteService);

const noteRouter = express.Router();

noteRouter.post("/notes", noteController.create);
noteRouter.get("/notes", noteController.getById);


export { noteRouter };