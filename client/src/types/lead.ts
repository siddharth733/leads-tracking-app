export type LeadStatus = "new" | "contacted" | "qualified" | "lost";

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
}

export interface Note {
  id: number;
  leadId: number;
  content: string;
  createdAt: string;
}

export interface CreateNoteInput {
  content: string;
}

export interface UpdateLeadInput {
  name?: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
}

export interface LeadsResponse {
  success: boolean;
  data: Lead[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LeadResponse {
  success: boolean;
  data: Lead;
}

export interface NotesResponse {
  success: boolean;
  data: Note[];
}
