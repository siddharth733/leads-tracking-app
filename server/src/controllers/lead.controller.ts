import { type NextFunction, type Request, type Response } from "express";
import * as leadService from "../services/lead.service.js";

export const createLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const lead = await leadService.createLead(req.body);

    return res.status(201).json({
      success: true,
      date: lead,
    });
  } catch (error) {
    next(error);
  }
};
