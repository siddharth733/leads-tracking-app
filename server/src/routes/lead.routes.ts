import { Router } from "express";
import {
  createLead,
  getLeadById,
  getLeads,
} from "../controllers/lead.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import { createLeadSchema } from "../validators/lead.validator.js";

const router = Router();

router.get("/", getLeads);
router.get("/:id", getLeadById);
router.post("/", validate(createLeadSchema), createLead);

export default router;
