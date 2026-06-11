import type { User } from "@suite/types";
import { api } from "./api";

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** Typed wrappers around the API's `/auth/*` endpoints. */
export const authApi = {
  async register(input: RegisterInput): Promise<AuthSession> {
    const res = await api.post<AuthSession>("/auth/register", input);
    return res.data;
  },

  async login(input: LoginInput): Promise<AuthSession> {
    const res = await api.post<AuthSession>("/auth/login", input);
    return res.data;
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const res = await api.post<AuthTokens>("/auth/refresh", { refreshToken });
    return res.data;
  },

  async me(): Promise<User> {
    const res = await api.get<User>("/auth/me");
    return res.data;
  },

  async updateProfile(patch: {
    name?: string;
    avatarUrl?: string;
  }): Promise<User> {
    const res = await api.patch<User>("/auth/me", patch);
    return res.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout", {});
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post("/auth/forgot-password", { email });
  },

  async verifyResetCode(email: string, code: string): Promise<void> {
    await api.post("/auth/verify-reset-code", { email, code });
  },

  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    await api.post("/auth/reset-password", { email, code, newPassword });
  },
};
