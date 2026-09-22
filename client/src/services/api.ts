import type {
  Lead,
  LeadResponse,
  LeadsResponse,
  NotesResponse,
  LeadStatus,
} from "../types/lead";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(errorData?.message || "Something went wrong");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const getLeads = async (params?: {
  search?: string;
  status?: LeadStatus;
  page?: number;
  limit?: number;
}) => {
  const searchParams = new URLSearchParams();

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const query = searchParams.toString();

  return request<LeadsResponse>(`/leads${query ? `?${query}` : ""}`);
};

export const getLeadById = async (id: number) => {
  return request<LeadResponse>(`/leads/${id}`);
};

export const createLead = async (data: Omit<Lead, "id" | "createdAt">) => {
  return request<LeadResponse>("/leads", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateLead = async (
  id: number,
  data: Partial<Omit<Lead, "id" | "createdAt">>,
) => {
  return request<LeadResponse>(`/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};

export const deleteLead = async (id: number) => {
  return request<void>(`/leads/${id}`, {
    method: "DELETE",
  });
};

export const getNotes = async (leadId: number) => {
  return request<NotesResponse>(`/leads/${leadId}/notes`);
};

export const createNotes = async (leadId: number, content: string) => {
  return request<NotesResponse>(`/leads/${leadId}/notes`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
};
