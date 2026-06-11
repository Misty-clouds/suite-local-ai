import { createClient } from "@suite/sdk";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./auth-tokens";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050";

// Dedupe concurrent refreshes — many requests can 401 at once.
let refreshInFlight: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as {
      data?: { accessToken?: string; refreshToken?: string };
    };
    const data = json.data;
    if (data?.accessToken && data?.refreshToken) {
      setTokens(data.accessToken, data.refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

function refreshSession(): Promise<boolean> {
  if (!refreshInFlight) {
    refreshInFlight = doRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

/**
 * Shared API client. Sends the current access token, and on a 401 transparently
 * refreshes the session once and replays the request. If refresh fails, the
 * session is cleared and the user is sent to /login.
 */
export const api = createClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  getToken: () => getAccessToken(),
  onRefresh: refreshSession,
  onUnauthorized: () => {
    clearTokens();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
});
