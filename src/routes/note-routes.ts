import express from "express";
import { NoteService } from "../services/note-service.js";
import { NoteController } from "../controllers/note-controller.js";
import { ProfileService } from "../services/profile-service.js";
import { UserService } from "../services/user-service.js";

const userService = new UserService();
const profileService = new ProfileService(userService);
const noteService = new NoteService(profileService);
const noteController = new NoteController(noteService);

const noteRouter = express.Router();

noteRouter.post("/notes", noteController.create);
noteRouter.get("/notes", noteController.getAll);
noteRouter.get("/notes/:id", noteController.getById);
noteRouter.put("/notes/:id", noteController.update);
noteRouter.delete("/notes/:id", noteController.delete);

export { noteRouter };