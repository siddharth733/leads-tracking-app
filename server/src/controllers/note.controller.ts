import type { Request, Response, NextFunction } from "express";
import * as noteService from "../services/note.service.js";
import * as leadService from "../services/lead.service.js";

export const getNotesByLeadId = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const leadId = Number(req.params.id);

    if (Number.isNaN(leadId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await leadService.getLeadById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const notes = await noteService.getNotesByLeadId(leadId);

    return res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const leadId = Number(req.params.id);

    if (Number.isNaN(leadId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await leadService.getLeadById(leadId);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    const note = await noteService.createNote(leadId, req.body.content);

    return res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    next(error);
  }
};
