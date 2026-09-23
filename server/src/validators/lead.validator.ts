import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Invalid email format"),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number"),
  status: z
    .enum(["new", "contacted", "qualified", "lost"])
    .optional()
    .default("new"),
});

export const updateLeadSchema = createLeadSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const getLeadsQuerySchema = z.object({
  search: z.string().trim().optional(),
  status: z.enum(["new", "contacted", "qualified", "lost"]).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
});
