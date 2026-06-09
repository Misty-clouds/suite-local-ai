import type { BankAccount, Transaction } from "@suite/types";
import { api } from "./api";

/** Typed wrappers around the API's Plaid + accounts/transactions endpoints. */
export const plaidApi = {
  async createLinkToken(): Promise<string> {
    const res = await api.post<{ linkToken: string }>("/plaid/link-token", {});
    return res.data.linkToken;
  },

  async exchange(
    publicToken: string,
    institutionName?: string,
  ): Promise<BankAccount[]> {
    const res = await api.post<BankAccount[]>("/plaid/exchange", {
      publicToken,
      institutionName,
    });
    return res.data;
  },

  async sync(): Promise<{ synced: number }> {
    const res = await api.post<{ synced: number }>("/plaid/sync", {});
    return res.data;
  },

  async listAccounts(): Promise<BankAccount[]> {
    const res = await api.get<BankAccount[]>("/accounts");
    return res.data;
  },

  async listTransactions(since?: string): Promise<Transaction[]> {
    const qs = since ? `?since=${encodeURIComponent(since)}` : "";
    const res = await api.get<Transaction[]>(`/transactions${qs}`);
    return res.data;
  },
};
