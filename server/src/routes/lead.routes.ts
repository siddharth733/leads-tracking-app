import { Router } from "express";
import {
  createLead,
  deleteLead,
  getLeadById,
  getLeads,
  updateLead,
} from "../controllers/lead.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createLeadSchema,
  getLeadsQuerySchema,
  updateLeadSchema,
} from "../validators/lead.validator.js";

const router = Router();

router.get("/", validate(getLeadsQuerySchema, "query"), getLeads);
router.get("/:id", getLeadById);
router.post("/", validate(createLeadSchema), createLead);
router.patch("/:id", validate(updateLeadSchema), updateLead);
router.delete("/:id", deleteLead);

export default router;
