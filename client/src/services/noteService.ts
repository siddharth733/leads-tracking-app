import { apiClient } from "./apiClient";
import type { CreateNoteInput, Note, NotesResponse } from "../types/lead";

export const noteService = {
  getNotesByLeadId: async (
    leadId: number,
    options?: RequestInit,
  ): Promise<NotesResponse> => {
    return apiClient<NotesResponse>(`/leads/${leadId}/notes`, options);
  },

  createNote: async (
    leadId: number,
    data: CreateNoteInput,
    options?: RequestInit,
  ): Promise<{ success: boolean; data: Note }> => {
    return apiClient<{ success: boolean; data: Note }>(`/leads/${leadId}/notes`, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
