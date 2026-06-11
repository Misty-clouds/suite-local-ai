"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Download,
  Send,
  Plus,
  MapPin,
  Search,
  Trash2,
  Percent,
  Loader2,
} from "lucide-react";
import type { Client, CreateInvoiceInput } from "@suite/types";
import AddClientModal from "@/components/AddClientModal";
import { clientsApi } from "@/lib/clients-api";
import { invoicesApi } from "@/lib/invoices-api";

interface DraftItem {
  id: number;
  name: string;
  unit: string;
  price: string;
}

export default function CreateInvoicePage() {
  const router = useRouter();

  const [openSections, setOpenSections] = useState({
    client: true,
    details: true,
    notes: false,
  });

  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [projectName, setProjectName] = useState("");
  const [dateIssued, setDateIssued] = useState("");
  const [dateDue, setDateDue] = useState("");
  const [taxRate, setTaxRate] = useState(0);
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DraftItem[]>([
    { id: 1, name: "", unit: "", price: "" },
  ]);

  const [saving, setSaving] = useState<null | "draft" | "send">(null);
  const [error, setError] = useState<string | null>(null);

  const hasContent = projectName.length > 0 || items[0].name.length > 0;

  // ── Load clients for the picker ─────────────────────────────────────────────
  const loadClients = useCallback(async () => {
    try {
      setClients(await clientsApi.list());
    } catch {
      // Non-fatal — the picker will simply be empty.
    }
  }, []);

  useEffect(() => {
    // One-time fetch on mount to populate the client picker.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadClients();
  }, [loadClients]);

  const filteredClients = clients.filter((c) =>
    `${c.name} ${c.email ?? ""}`
      .toLowerCase()
      .includes(clientSearch.trim().toLowerCase()),
  );

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const addItem = () =>
    setItems([...items, { id: Date.now(), name: "", unit: "", price: "" }]);
  const removeItem = (id: number) =>
    setItems(items.filter((item) => item.id !== id));
  const updateItem = (id: number, field: keyof DraftItem, value: string) =>
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );

  const formatDateForPreview = (value: string) => {
    if (!value) return "";
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return "";
    const d = new Date(year, month - 1, day);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(d);
  };

  const parseNumber = (value: string) => {
    const n = Number.parseFloat(value.replace(/,/g, "").trim());
    return Number.isFinite(n) ? n : 0;
  };

  const formatMoney = (value: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
    }).format(value);

  const previewLineItems = items.map((item) => {
    const quantity = parseNumber(item.unit);
    const amount = parseNumber(item.price);
    return { ...item, quantity, amount, total: quantity * amount };
  });

  const previewSubtotal = previewLineItems.reduce((s, i) => s + i.total, 0);
  const previewTax = (previewSubtotal * taxRate) / 100;
  const previewTotal = previewSubtotal + previewTax;

  // ── Save / send ─────────────────────────────────────────────────────────────
  const buildPayload = (): CreateInvoiceInput | null => {
    if (!selectedClient) {
      setError("Please select a client");
      return null;
    }
    const cleanItems = items
      .filter((i) => i.name.trim() && parseNumber(i.price) > 0)
      .map((i) => ({
        name: i.name.trim(),
        quantity: parseNumber(i.unit) || 1,
        unitPrice: parseNumber(i.price),
      }));
    if (cleanItems.length === 0) {
      setError("Add at least one item with a name and price");
      return null;
    }
    return {
      client: {
        clientId: selectedClient.id,
        name: selectedClient.name,
        email: selectedClient.email,
        address: selectedClient.address,
      },
      projectName: projectName.trim() || undefined,
      notes: notes.trim() || undefined,
      issueDate: dateIssued || undefined,
      dueDate: dateDue || undefined,
      taxRate,
      items: cleanItems,
    };
  };

  const handleSave = async (mode: "draft" | "send") => {
    setError(null);
    const payload = buildPayload();
    if (!payload) return;
    setSaving(mode);
    try {
      const invoice = await invoicesApi.create(payload);
      if (mode === "send") await invoicesApi.send(invoice.id);
      router.push("/invoicing");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save invoice");
      setSaving(null);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#0A0A0A]">
      {/* ── Header ── */}
      <header className="flex h-auto shrink-0 items-center justify-between border-b border-[#272727] px-8 py-4">
        <div className="flex flex-col gap-1 w-full max-w-125">
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/invoicing"
              className="flex items-center gap-1.5 rounded-md border border-[#272727] px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-[#161616]"
            >
              <ChevronLeft size={14} /> Back
            </Link>
          </div>
          <h2 className="text-xl font-semibold text-white">
            Create new invoice
          </h2>
          <p className="text-[13px] text-zinc-500 mt-0.5">
            Fill in invoice details, save invoice as draft to send/edit later
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving !== null}
            className="flex items-center gap-2 rounded-lg border border-[#272727] bg-transparent px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-[#161616] disabled:opacity-60"
          >
            {saving === "draft" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Download size={15} />
            )}
            Save as draft
          </button>
          <button
            onClick={() => handleSave("send")}
            disabled={saving !== null}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {saving === "send" ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Send size={15} />
            )}
            Send invoice
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden p-8 gap-8">
        {/* Left Column - Form */}
        <div className="w-112.5 shrink-0 overflow-y-auto scrollbar-hide pr-2 flex flex-col gap-5">
          {error && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-[13px] text-rose-400">
              {error}
            </div>
          )}

          {/* Client Details */}
          <div className="rounded-xl border border-[#272727] bg-[#121212]">
            <button
              onClick={() => toggleSection("client")}
              className="flex w-full items-center justify-between p-4 px-5 text-[13px] font-medium text-white"
            >
              Client details
              {openSections.client ? (
                <ChevronUp size={16} className="text-zinc-500" />
              ) : (
                <ChevronDown size={16} className="text-zinc-500" />
              )}
            </button>

            {openSections.client && (
              <div className="p-5 pt-0">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[13px] text-zinc-400">Bill to</span>
                  {!isClientDropdownOpen && (
                    <button
                      onClick={() => setIsClientDropdownOpen(true)}
                      className="flex items-center gap-1.5 rounded-lg border border-[#272727] px-2.5 py-1 text-xs text-white hover:bg-[#1C1C1C] transition-colors"
                    >
                      <Plus size={12} /> Select client
                    </button>
                  )}
                </div>

                {!isClientDropdownOpen ? (
                  <div
                    onClick={() => setIsClientDropdownOpen(true)}
                    className="rounded-lg border border-[#272727] bg-[#161616] p-3 flex justify-between items-center cursor-pointer hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-orange-400 via-pink-500 to-purple-500 text-white font-bold text-[10px]">
                        {selectedClient?.name?.[0] ?? "?"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium text-white">
                          {selectedClient?.name || "No client selected"}
                        </span>
                        <span className="text-[12px] text-zinc-500">
                          {selectedClient?.email || "Tap to choose a client"}
                        </span>
                      </div>
                    </div>
                    <ChevronDown size={16} className="text-zinc-500" />
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#272727] bg-[#1a1a1a] overflow-hidden relative">
                    <div className="p-3 border-b border-[#272727] bg-[#161616]">
                      <button
                        onClick={() => {
                          setIsClientDropdownOpen(false);
                          setIsAddClientModalOpen(true);
                        }}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#272727] py-2.5 text-[13px] font-medium text-zinc-300 hover:bg-[#202020] transition-colors"
                      >
                        <Plus size={14} /> Add new client
                      </button>
                    </div>
                    <div className="p-3 border-b border-[#272727] relative bg-[#161616]">
                      <Search
                        size={14}
                        className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500"
                      />
                      <input
                        type="text"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        placeholder="Search clients"
                        className="w-full rounded-lg bg-[#0A0A0A] border border-[#272727] pl-9 pr-3 py-2 text-[13px] text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                      />
                    </div>
                    <div className="max-h-55 overflow-y-auto bg-[#161616]">
                      {filteredClients.length === 0 ? (
                        <div className="px-4 py-6 text-center text-[12px] text-zinc-500">
                          No clients found. Add a new one above.
                        </div>
                      ) : (
                        filteredClients.map((client) => (
                          <div
                            key={client.id}
                            onClick={() => {
                              setSelectedClient(client);
                              setIsClientDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#202020] cursor-pointer transition-colors border-b border-[#272727]/50"
                          >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-orange-400 via-pink-500 to-purple-500 text-white font-bold text-[10px]">
                              {client.name[0]}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[13px] font-medium text-white">
                                {client.name}
                              </span>
                              <span className="text-[12px] text-zinc-500">
                                {client.email || "—"}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {!isClientDropdownOpen && selectedClient?.address && (
                  <div className="mt-4 flex items-center gap-2 text-[13px] text-zinc-400 px-1">
                    <MapPin size={14} /> {selectedClient.address}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Invoice Details */}
          <div className="rounded-xl border border-[#272727] bg-[#121212]">
            <button
              onClick={() => toggleSection("details")}
              className="flex w-full items-center justify-between p-4 px-5 text-[13px] font-medium text-white"
            >
              Invoice details
              {openSections.details ? (
                <ChevronUp size={16} className="text-zinc-500" />
              ) : (
                <ChevronDown size={16} className="text-zinc-500" />
              )}
            </button>

            {openSections.details && (
              <div className="p-5 pt-0 flex flex-col gap-6">
                <div>
                  <label className="mb-2 block text-[13px] text-zinc-400">
                    Project name
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full rounded-lg border border-[#272727] bg-[#161616] px-3 py-2 text-[13px] text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-[#555]"
                    placeholder="API Integration"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="mb-2 block text-[13px] text-zinc-400">
                      Date issued
                    </label>
                    <input
                      type="date"
                      value={dateIssued}
                      onChange={(e) => setDateIssued(e.target.value)}
                      className="w-full rounded-lg border border-[#272727] bg-[#161616] px-3 py-2 text-[13px] text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-[#555]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="mb-2 block text-[13px] text-zinc-400">
                      Date due
                    </label>
                    <input
                      type="date"
                      value={dateDue}
                      onChange={(e) => setDateDue(e.target.value)}
                      className="w-full rounded-lg border border-[#272727] bg-[#161616] px-3 py-2 text-[13px] text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-[#555]"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-[13px] text-zinc-400">
                    GST status
                  </label>
                  <div className="relative">
                    <select
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full appearance-none rounded-lg border border-[#272727] bg-[#161616] px-3 py-2 text-[13px] text-white focus:outline-none focus:border-zinc-500 transition-colors"
                    >
                      <option value={0}>No GST</option>
                      <option value={7}>GST 7%</option>
                      <option value={18}>GST 18%</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                    />
                  </div>
                </div>

                <hr className="border-[#272727] my-1" />

                {items.map((item, index) => (
                  <div key={item.id} className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-[13px] text-zinc-400">
                        Item name
                      </label>
                      {index > 0 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-500 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, "name", e.target.value)
                      }
                      className="w-full rounded-lg border border-[#272727] bg-[#161616] px-3 py-2 text-[13px] text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-[#555]"
                      placeholder="API Integration"
                    />
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="mb-2 block text-[13px] text-zinc-400">
                          Unit
                        </label>
                        <input
                          type="number"
                          value={item.unit}
                          onChange={(e) =>
                            updateItem(item.id, "unit", e.target.value)
                          }
                          placeholder="5"
                          className="w-full rounded-lg border border-[#272727] bg-[#161616] px-3 py-2 text-[13px] text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-[#555]"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="mb-2 block text-[13px] text-zinc-400">
                          Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-[13px]">
                            $
                          </span>
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) =>
                              updateItem(item.id, "price", e.target.value)
                            }
                            placeholder="500"
                            className="w-full rounded-lg border border-[#272727] bg-[#161616] pl-7 pr-3 py-2 text-[13px] text-white focus:outline-none focus:border-zinc-500 transition-colors placeholder:text-[#555]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex gap-3 mt-1">
                  <button
                    onClick={addItem}
                    className="flex items-center gap-2 rounded-lg border border-[#272727] bg-transparent px-4 py-2 text-[13px] font-medium text-zinc-300 hover:bg-[#1C1C1C] transition-colors"
                  >
                    <Plus size={14} /> Add item
                  </button>
                  <button className="flex items-center gap-2 rounded-lg border border-[#272727] bg-transparent px-4 py-2 text-[13px] font-medium text-zinc-300 hover:bg-[#1C1C1C] transition-colors">
                    <Percent size={14} /> Add discount
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-[#272727] bg-[#121212] mb-10">
            <button
              onClick={() => toggleSection("notes")}
              className="flex w-full items-center justify-between p-4 px-5 text-[13px] font-medium text-white"
            >
              Notes
              {openSections.notes ? (
                <ChevronUp size={16} className="text-zinc-500" />
              ) : (
                <ChevronDown size={16} className="text-zinc-500" />
              )}
            </button>
            {openSections.notes && (
              <div className="p-5 pt-0">
                <label className="mb-2 block text-[13px] text-zinc-400">
                  Note/Special instruction (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-[#272727] bg-[#161616] px-3 py-2 text-[13px] text-white focus:outline-none focus:border-zinc-500 transition-colors min-h-30 resize-none"
                  placeholder="Type here"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Preview Area */}
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
          <h3 className="text-[14px] font-medium text-white mb-4">Preview</h3>

          <div className="flex-1 rounded-2xl border border-[#161616] bg-[#161616] relative overflow-hidden flex flex-col">
            {!hasContent ? (
              <>
                <div className="flex flex-1 flex-col items-center justify-center text-center p-8">
                  <div className="text-zinc-300 text-[14px] mb-2 leading-relaxed">
                    Start filling invoice details on the left to
                    <br />
                    see preview
                  </div>
                  <div className="text-zinc-500 text-[13px]">
                    Preview will appear here
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 opacity-70">
                  <Image
                    src="/assets/images/logo-no-bg.png"
                    width={90}
                    height={30}
                    alt="Logo"
                  />
                </div>
              </>
            ) : (
              <div className="relative p-8 pb-16 overflow-y-auto">
                <div className="rounded-2xl border border-[#222222] bg-[#222222] p-5">
                  <div className="flex justify-between items-start gap-8">
                    <div>
                      <div className="mb-8">
                        <h2 className="text-[26px] font-semibold text-white">
                          Invoice
                        </h2>
                        {projectName.trim() && (
                          <div className="mt-1 text-[13px] text-zinc-400">
                            {projectName}
                          </div>
                        )}
                      </div>
                      <div className="text-[12px] text-zinc-500 mb-1">
                        Billed To:
                      </div>
                      <div className="text-[14px] font-medium text-white mb-0.5">
                        {selectedClient?.name || "—"}
                      </div>
                      <div className="text-[12px] text-zinc-400">
                        {selectedClient?.address || "—"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-zinc-500 mb-0.5">
                        Issued on
                      </div>
                      <div className="text-[11px] text-white mb-4">
                        {formatDateForPreview(dateIssued) || "—"}
                      </div>
                      <div className="text-[11px] text-zinc-500 mb-0.5">
                        Payment Due
                      </div>
                      <div className="text-[11px] text-white">
                        {formatDateForPreview(dateDue) || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <table className="w-full text-[13px]">
                    <thead>
                      <tr className="text-[#8A98A6]">
                        <th className="text-left font-medium pb-4">
                          Description
                        </th>
                        <th className="text-right font-medium pb-4 w-16">
                          Qty.
                        </th>
                        <th className="text-right font-medium pb-4 w-28">
                          Amount
                        </th>
                        <th className="text-right font-medium pb-4 w-28">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewLineItems.map((item) => (
                        <tr
                          key={item.id}
                          className="transition-colors hover:bg-white/5"
                        >
                          <td className="py-5 text-zinc-300">
                            {item.name || "—"}
                          </td>
                          <td className="py-5 text-right text-zinc-300">
                            {item.unit || "—"}
                          </td>
                          <td className="py-5 text-right text-zinc-300">
                            {item.price ? formatMoney(item.amount) : "—"}
                          </td>
                          <td className="py-5 text-right text-zinc-300">
                            {item.unit && item.price
                              ? formatMoney(item.total)
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-8 rounded-xl bg-[#222222] px-7 py-6">
                    <div className="space-y-5 text-[13px]">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Subtotal</span>
                        <span className="text-white">
                          {formatMoney(previewSubtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Tax ({taxRate}%)</span>
                        <span className="text-white">
                          {formatMoney(previewTax)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-4 border-t border-[#272727] font-medium">
                        <span className="text-white">Total</span>
                        <span className="text-white">
                          {formatMoney(previewTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-14">
                  <Image
                    src="/assets/images/logo-no-bg.png"
                    width={95}
                    height={32}
                    alt="Logo"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onCreated={(client) => {
          setClients((prev) => [client, ...prev]);
          setSelectedClient(client);
        }}
      />
    </div>
  );
}
