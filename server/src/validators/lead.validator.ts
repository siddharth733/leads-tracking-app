import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email format"),
  phone: z.string().trim().min(1, "Phone is required"),
  status: z
    .enum(["new", "contacted", "qualified", "lost"])
    .optional()
    .default("new"),
});

export const updateLeadSchema = createLeadSchema.partial();
