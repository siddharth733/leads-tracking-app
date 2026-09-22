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

export const getLeads = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const search =
      typeof req.query.search === "string" ? req.query.search : undefined;
    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const leads = await leadService.getLeads({
      search,
      status: status as "new" | "contacted" | "qualified" | "lost" | undefined,
    });

    return res.status(200).json({
      success: true,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const lead = await leadService.getLeadById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const existingLead = await leadService.getLeadById(id);

    if (!existingLead) {
      return res.status(200).json({
        success: false,
        message: "Lead not found",
      });
    }

    const lead = await leadService.updateLead(id, req.body);

    return res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID",
      });
    }

    const existingLead = await leadService.getLeadById(id);

    if (!existingLead) {
      return res.status(200).json({
        success: false,
        message: "Lead not found",
      });
    }

    await leadService.deleteLead(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
};
