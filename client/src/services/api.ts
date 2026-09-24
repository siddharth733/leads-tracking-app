import { leadService } from "./leadService";
import { noteService } from "./noteService";

export const getLeads = leadService.getLeads;
export const getLeadById = leadService.getLeadById;
export const createLead = leadService.createLead;
export const updateLead = leadService.updateLead;
export const deleteLead = leadService.deleteLead;

export const getNotes = noteService.getNotesByLeadId;
export const createNote = noteService.createNote;
