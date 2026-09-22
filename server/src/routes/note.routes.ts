import { Router } from "express";
import { validate } from "../middleware/validation.middleware.js";
import { createNoteSchema } from "../validators/note.validator.js";
import {
  createNote,
  getNotesByLeadId,
} from "../controllers/note.controller.js";

const router = Router();

router.get("/:id/notes", getNotesByLeadId);
router.post("/:id/notes", validate(createNoteSchema), createNote);

export default router;
