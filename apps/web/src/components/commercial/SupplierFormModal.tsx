"use client";

import { useEffect, useState } from "react";
import { EosApiError } from "@/lib/eos-client";
import {
  CATEGORY_LABELS,
  createSupplier,
  updateSupplier,
  type SupplierSummary,
} from "@/lib/suppliers-api";
import { Btn } from "./ui";

const CATEGORIES = Object.keys(CATEGORY_LABELS);
const STATUSES = ["draft", "pending_review", "active", "inactive", "suspended"] as const;

type FormState = {
  supplierCode: string;
  legalName: string;
  tradingName: string;
  category: string;
  country: string;
  region: string;
  city: string;
  status: string;
  preferredPartner: boolean;
  defaultCurrency: string;
};

const EMPTY: FormState = {
  supplierCode: "",
  legalName: "",
  tradingName: "",
  category: "accommodation",
  country: "TZ",
  region: "",
  city: "",
  status: "pending_review",
  preferredPartner: false,
  defaultCurrency: "USD",
};

export function SupplierFormModal({
  token,
  open,
  mode,
  initial,
  onClose,
  onSaved,
}: {
  token: string;
  open: boolean;
  mode: "create" | "edit";
  initial?: SupplierSummary | null;
  onClose: () => void;
  onSaved: (supplier: SupplierSummary) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && initial) {
      setForm({
        supplierCode: initial.supplierCode,
        legalName: initial.legalName,
        tradingName: initial.tradingName ?? "",
        category: initial.category,
        country: initial.country,
        region: initial.region ?? "",
        city: initial.city ?? "",
        status: initial.status,
        preferredPartner: initial.preferredPartner,
        defaultCurrency: initial.defaultCurrency ?? "",
      });
    } else {
      setForm(EMPTY);
    }
    setError(null);
  }, [open, mode, initial]);

  if (!open) return null;

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "create") {
        const result = await createSupplier(token, {
          supplierCode: form.supplierCode,
          legalName: form.legalName,
          ...(form.tradingName.trim() ? { tradingName: form.tradingName.trim() } : {}),
          category: form.category,
          country: form.country,
          ...(form.region.trim() ? { region: form.region.trim() } : {}),
          ...(form.city.trim() ? { city: form.city.trim() } : {}),
          status: form.status,
          preferredPartner: form.preferredPartner,
          ...(form.defaultCurrency.trim() ? { defaultCurrency: form.defaultCurrency.trim() } : {}),
        });
        onSaved(result.supplier);
      } else if (initial) {
        const result = await updateSupplier(token, initial.id, {
          legalName: form.legalName,
          tradingName: form.tradingName.trim() ? form.tradingName.trim() : null,
          category: form.category,
          country: form.country,
          region: form.region.trim() ? form.region.trim() : null,
          city: form.city.trim() ? form.city.trim() : null,
          status: form.status,
          preferredPartner: form.preferredPartner,
          defaultCurrency: form.defaultCurrency.trim() ? form.defaultCurrency.trim() : null,
        });
        onSaved(result.supplier);
      }
      onClose();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[12px] border border-line bg-paper shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            {mode === "create" ? "Add supplier" : "Edit supplier"}
          </h2>
          <button type="button" onClick={onClose} className="text-muted hover:text-ink">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-md border border-danger/30 bg-danger-bg px-3 py-2 text-sm text-danger">{error}</div>
          )}

          <label className="block text-sm">
            <span className="text-muted">Supplier code</span>
            <input
              required
              disabled={mode === "edit"}
              value={form.supplierCode}
              onChange={(e) => setField("supplierCode", e.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-ivory px-3 py-2 font-mono text-sm disabled:opacity-60"
              placeholder="LODGE-001"
            />
          </label>

          <label className="block text-sm">
            <span className="text-muted">Legal name</span>
            <input
              required
              value={form.legalName}
              onChange={(e) => setField("legalName", e.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-ivory px-3 py-2 text-sm"
            />
          </label>

          <label className="block text-sm">
            <span className="text-muted">Trading name</span>
            <input
              value={form.tradingName}
              onChange={(e) => setField("tradingName", e.target.value)}
              className="mt-1 w-full rounded-md border border-line bg-ivory px-3 py-2 text-sm"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="text-muted">Category</span>
              <select
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}
                className="mt-1 w-full rounded-md border border-line bg-ivory px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-muted">Status</span>
              <select
                value={form.status}
                onChange={(e) => setField("status", e.target.value)}
                className="mt-1 w-full rounded-md border border-line bg-ivory px-3 py-2 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="block text-sm">
              <span className="text-muted">Country</span>
              <input
                required
                maxLength={2}
                value={form.country}
                onChange={(e) => setField("country", e.target.value.toUpperCase())}
                className="mt-1 w-full rounded-md border border-line bg-ivory px-3 py-2 font-mono text-sm uppercase"
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">Region</span>
              <input
                value={form.region}
                onChange={(e) => setField("region", e.target.value)}
                className="mt-1 w-full rounded-md border border-line bg-ivory px-3 py-2 text-sm"
              />
            </label>
            <label className="block text-sm">
              <span className="text-muted">City</span>
              <input
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                className="mt-1 w-full rounded-md border border-line bg-ivory px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm">
              <span className="text-muted">Currency</span>
              <input
                maxLength={3}
                value={form.defaultCurrency}
                onChange={(e) => setField("defaultCurrency", e.target.value.toUpperCase())}
                className="mt-1 w-full rounded-md border border-line bg-ivory px-3 py-2 font-mono text-sm uppercase"
                placeholder="USD"
              />
            </label>
            <label className="flex items-end gap-2 pb-2 text-sm text-ink">
              <input
                type="checkbox"
                checked={form.preferredPartner}
                onChange={(e) => setField("preferredPartner", e.target.checked)}
              />
              Preferred partner
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Btn type="button" variant="secondary" onClick={onClose} disabled={busy}>
              Cancel
            </Btn>
            <Btn type="submit" disabled={busy}>
              {busy ? "Saving…" : mode === "create" ? "Create" : "Save changes"}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
}
