/**
 * @suite/sdk — API client for Suites frontend apps
 *
 * Usage in a Next.js app:
 *
 *   // lib/api.ts
 *   import { createClient } from "@suite/sdk";
 *
 *   export const api = createClient({
 *     baseUrl: process.env.NEXT_PUBLIC_API_URL,
 *     getToken: () => localStorage.getItem("token"),
 *     onUnauthorized: () => { window.location.href = "/login"; },
 *   });
 *
 *   // In a component or server action:
 *   const { data } = await api.get<Project[]>("/projects");
 */

export { createClient } from "./client";
export type { ClientConfig, SuitesClient } from "./client";
