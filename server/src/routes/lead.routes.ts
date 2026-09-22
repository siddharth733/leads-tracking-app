import { Router } from "express";
import { createLead } from "../controllers/lead.controller.js";
import { validate } from "../middleware/validation.middleware.js";
import { createLeadSchema } from "../validators/lead.validator.js";

const router = Router();

router.post("/", validate(createLeadSchema), createLead);

export default router;
