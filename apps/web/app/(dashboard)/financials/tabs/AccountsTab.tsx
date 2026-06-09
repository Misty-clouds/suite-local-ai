"use client";

import { useCallback, useEffect, useState } from "react";
import {
  usePlaidLink,
  type PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";
import {
  Shield,
  Eye,
  RefreshCw,
  Building2,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import type { BankAccount } from "@suite/types";
import { plaidApi } from "@/lib/plaid-api";

const HOW_IT_WORKS = [
  {
    icon: Shield,
    iconBg: "#162C1E",
    iconColor: "#4ADE80",
    title: "Bank-level encryption",
    desc: "Your credentials are never stored by Suite",
  },
  {
    icon: Eye,
    iconBg: "#1A2A3F",
    iconColor: "#66A4FF",
    title: "Read-only access",
    desc: "Suite can view but never move your money",
  },
  {
    icon: RefreshCw,
    iconBg: "#2E2E18",
    iconColor: "#D7C24E",
    title: "Auto-sync",
    desc: "Transactions update on a schedule automatically",
  },
];

function formatBalance(value?: number | null, currency?: string): string {
  if (value == null) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(value);
  } catch {
    return value.toLocaleString();
  }
}

export function AccountsTab() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      setAccounts(await plaidApi.listAccounts());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + fetch a Plaid Link token.
  useEffect(() => {
    void loadAccounts();
    plaidApi
      .createLinkToken()
      .then(setLinkToken)
      .catch((e) =>
        setError(
          e instanceof Error
            ? `Plaid not ready: ${e.message}`
            : "Plaid not ready",
        ),
      );
  }, [loadAccounts]);

  const onSuccess = useCallback(
    async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
      setBusy(true);
      setError(null);
      try {
        await plaidApi.exchange(
          publicToken,
          metadata.institution?.name ?? undefined,
        );
        await loadAccounts();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not connect bank");
      } finally {
        setBusy(false);
      }
    },
    [loadAccounts],
  );

  const { open, ready } = usePlaidLink({ token: linkToken, onSuccess });

  const handleSync = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await plaidApi.sync();
      await loadAccounts();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setBusy(false);
    }
  }, [loadAccounts]);

  return (
    <div className="flex p-6 lg:min-h-[calc(100vh-116px)]">
      <div className="flex w-full flex-1 flex-col overflow-hidden rounded-2xl border border-[#272727] bg-[#161616] shadow-lg lg:flex-row">
        {/* Left — intro + how it works */}
        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-[18px] font-medium text-[#DEDEDE]">
              Connect Your Bank Accounts
            </h2>
            <p className="text-[14px] leading-[1.1] text-[#6E7B82]">
              Link your bank or mobile money account so Suite can pull your real
              financial data automatically.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[12px] font-medium text-[#6E7B82]">HOW IT WORKS</p>
            <div className="flex flex-col">
              {HOW_IT_WORKS.map((item, i) => {
                const Icon = item.icon;
                const isLast = i === HOW_IT_WORKS.length - 1;
                return (
                  <div
                    key={item.title}
                    className={`flex items-center gap-2 ${i === 0 ? "pb-3" : isLast ? "pt-3" : "py-3"} ${
                      isLast ? "" : "border-b border-[#3B3B3B]"
                    }`}
                  >
                    <div
                      className="flex shrink-0 items-center justify-center rounded-[12px] p-3"
                      style={{ backgroundColor: item.iconBg }}
                    >
                      <Icon size={16} style={{ color: item.iconColor }} />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <p className="truncate text-[14px] font-medium leading-[1.1] text-[#DEDEDE]">
                        {item.title}
                      </p>
                      <p className="text-[12px] leading-[1.2] text-[#6E7B82]">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right — connected accounts */}
        <div className="flex flex-1 flex-col gap-3 border-t border-[#272727] p-6 lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-medium text-[#6E7B82]">
              YOUR ACCOUNTS
            </p>
            {accounts.length > 0 && (
              <button
                onClick={handleSync}
                disabled={busy}
                className="flex items-center gap-1.5 rounded-lg border border-[#272727] px-2.5 py-1 text-[11px] text-zinc-400 transition-colors hover:text-white disabled:opacity-50"
              >
                <RefreshCw
                  size={11}
                  className={busy ? "animate-spin" : ""}
                />
                Sync
              </button>
            )}
          </div>

          {/* Connect button */}
          <button
            onClick={() => open()}
            disabled={!ready || busy}
            className="flex items-center justify-center gap-2 rounded-full bg-[#045DDF] px-4 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#034BBB] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            {accounts.length > 0 ? "Connect another bank" : "Connect a bank"}
          </button>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-[#3a2222] bg-[#1f1414] px-3 py-2 text-[12px] text-[#FF8080]">
              <AlertCircle size={14} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Accounts list */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-hide max-h-[360px] lg:max-h-none">
            {loading ? (
              <div className="flex flex-1 items-center justify-center py-10 text-zinc-600">
                <Loader2 size={18} className="animate-spin" />
              </div>
            ) : accounts.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
                <Building2 size={24} className="text-zinc-600" />
                <p className="text-[13px] text-[#6E7B82]">
                  No accounts connected yet.
                </p>
              </div>
            ) : (
              accounts.map((a, i) => (
                <div
                  key={a.id}
                  className={`flex items-center gap-3 py-3 ${
                    i === accounts.length - 1 ? "" : "border-b border-[#3B3B3B]"
                  }`}
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-[#1A2A3F] text-[#66A4FF]">
                    <Building2 size={16} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="truncate text-[14px] font-medium leading-[1.1] text-[#DEDEDE]">
                      {a.name}
                      {a.mask ? (
                        <span className="text-[#6E7B82]"> ••{a.mask}</span>
                      ) : null}
                    </p>
                    <p className="text-[12px] leading-[1.2] text-[#6E7B82]">
                      {a.institutionName ?? a.subtype ?? a.type ?? "Account"}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[14px] font-medium text-[#DEDEDE]">
                      {formatBalance(a.currentBalance, a.isoCurrency)}
                    </p>
                    <p className="text-[11px] text-[#6E7B82]">Balance</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
