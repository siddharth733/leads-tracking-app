const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function isEnvAuth(): boolean {
  const envUser = import.meta.env.VITE_BASIC_AUTH_USER;
  const envPass = import.meta.env.VITE_BASIC_AUTH_PASS;
  return Boolean(envUser && envPass);
}

export function isLocalStorageAuth(): boolean {
  return Boolean(localStorage.getItem("basic_auth_credentials"));
}

export function setAuthCredentials(username: string, password: string): void {
  const credentials = btoa(`${username}:${password}`);
  localStorage.setItem("basic_auth_credentials", credentials);
  window.dispatchEvent(new CustomEvent("auth:changed"));
}

export function clearAuthCredentials(): void {
  localStorage.removeItem("basic_auth_credentials");
  window.dispatchEvent(new CustomEvent("auth:changed"));
}

export function getAuthCredentials(): string | null {
  const envUser = import.meta.env.VITE_BASIC_AUTH_USER;
  const envPass = import.meta.env.VITE_BASIC_AUTH_PASS;
  if (envUser && envPass) {
    return btoa(`${envUser}:${envPass}`);
  }
  return localStorage.getItem("basic_auth_credentials");
}

export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  const credentials = btoa(`${username}:${password}`);
  const url = `${API_BASE_URL}/leads`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json",
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const authHeader = getAuthCredentials();
  if (authHeader) {
    defaultHeaders["Authorization"] = `Basic ${authHeader}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options?.headers,
    },
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    // Only dispatch auth modal if not using static env credentials
    if (!isEnvAuth()) {
      window.dispatchEvent(new CustomEvent("auth:required"));
    }
    const errorData = await response.json().catch(() => null);
    throw new ApiError(errorData?.message || "Authentication required: Invalid username or password", 401);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    let errorMessage = errorData?.message || `HTTP error! Status: ${response.status}`;

    if (errorData?.errors && typeof errorData.errors === "object") {
      const fieldErrors = Object.entries(errorData.errors)
        .map(([field, msgs]) =>
          Array.isArray(msgs) ? `${field}: ${msgs.join(", ")}` : `${field}: ${msgs}`,
        )
        .join(" | ");

      if (fieldErrors) {
        errorMessage = fieldErrors;
      }
    }

    throw new ApiError(errorMessage, response.status, errorData?.errors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}
