import type { ApiResponse, PaginatedResponse, ApiError } from "@suite/types";

// ─── Config ───────────────────────────────────────────────────────────────────

const DEFAULT_BASE_URL =
  typeof process !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050")
    : "http://localhost:5050";

export interface ClientConfig {
  baseUrl?: string;
  getToken?: () => string | null | undefined;
  onUnauthorized?: () => void;
  /** Attempt to refresh the session on 401. Return true if the request
   *  should be retried (a fresh token is now available). */
  onRefresh?: () => Promise<boolean>;
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit,
  config: ClientConfig,
  allowRetry = true
): Promise<T> {
  const baseUrl = config.baseUrl ?? DEFAULT_BASE_URL;
  const token = config.getToken?.();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });

  if (res.status === 401) {
    // Try a one-time token refresh, then replay the request.
    if (allowRetry && config.onRefresh) {
      const refreshed = await config.onRefresh();
      if (refreshed) {
        return request<T>(path, options, config, false);
      }
    }
    config.onUnauthorized?.();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({
      message: res.statusText,
      statusCode: res.status,
    }));
    throw Object.assign(new Error(err.message), { statusCode: err.statusCode });
  }

  return res.json() as Promise<T>;
}

// ─── Client factory ───────────────────────────────────────────────────────────

export function createClient(config: ClientConfig = {}) {
  function get<T>(path: string): Promise<ApiResponse<T>> {
    return request<ApiResponse<T>>(path, { method: "GET" }, config);
  }

  function getPaginated<T>(path: string): Promise<PaginatedResponse<T>> {
    return request<PaginatedResponse<T>>(path, { method: "GET" }, config);
  }

  function post<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return request<ApiResponse<T>>(
      path,
      { method: "POST", body: JSON.stringify(body) },
      config
    );
  }

  function patch<T>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return request<ApiResponse<T>>(
      path,
      { method: "PATCH", body: JSON.stringify(body) },
      config
    );
  }

  function del<T>(path: string): Promise<ApiResponse<T>> {
    return request<ApiResponse<T>>(path, { method: "DELETE" }, config);
  }

  return { get, getPaginated, post, patch, del };
}

export type SuitesClient = ReturnType<typeof createClient>;
