import { type NextFunction, type Request, type Response } from "express";
import { type ZodSchema } from "zod";

type RequestPart = "body" | "query";

export const validate =
  (schema: ZodSchema, part: RequestPart = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    if (part === "body") {
      req.body = result.data;
    }

    if (part === "query") {
      Object.assign(req.query, result.data);
    }

    next();
  };
