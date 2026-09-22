import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.log(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
