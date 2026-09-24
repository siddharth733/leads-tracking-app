import { apiClient } from "./apiClient";
import type {
  Lead,
  LeadResponse,
  LeadsResponse,
  LeadStatus,
} from "../types/lead";

export interface GetLeadsParams {
  search?: string;
  status?: LeadStatus;
  page?: number;
  limit?: number;
}

export const leadService = {
  getLeads: async (
    params?: GetLeadsParams,
    options?: RequestInit,
  ): Promise<LeadsResponse> => {
    const searchParams = new URLSearchParams();

    if (params?.search) searchParams.set("search", params.search);
    if (params?.status) searchParams.set("status", params.status);
    if (params?.page) searchParams.set("page", String(params.page));
    if (params?.limit) searchParams.set("limit", String(params.limit));

    const queryString = searchParams.toString();
    const endpoint = `/leads${queryString ? `?${queryString}` : ""}`;

    return apiClient<LeadsResponse>(endpoint, options);
  },

  getLeadById: async (
    id: number,
    options?: RequestInit,
  ): Promise<LeadResponse> => {
    return apiClient<LeadResponse>(`/leads/${id}`, options);
  },

  createLead: async (
    data: Omit<Lead, "id" | "createdAt">,
    options?: RequestInit,
  ): Promise<LeadResponse> => {
    return apiClient<LeadResponse>("/leads", {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateLead: async (
    id: number,
    data: Partial<Omit<Lead, "id" | "createdAt">>,
    options?: RequestInit,
  ): Promise<LeadResponse> => {
    return apiClient<LeadResponse>(`/leads/${id}`, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  deleteLead: async (id: number, options?: RequestInit): Promise<void> => {
    return apiClient<void>(`/leads/${id}`, {
      ...options,
      method: "DELETE",
    });
  },
};
