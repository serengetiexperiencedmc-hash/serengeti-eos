"use client";

import { useState } from "react";
import { EosApiError } from "@/lib/eos-client";
import {
  createCrmImportBatch,
  CRM_IMPORT_ENTITY_OPTIONS,
  executeCrmImportBatch,
  type CrmImportBatch,
  type CrmImportEntityType,
  validateCrmImportBatch,
} from "@/lib/crm-api";
import { Btn } from "./ui";

type Step = "configure" | "validate" | "done";

export function CrmImportModal({
  token,
  open,
  onClose,
  onCommitted,
}: {
  token: string;
  open: boolean;
  onClose: () => void;
  onCommitted: () => void;
}) {
  const [step, setStep] = useState<Step>("configure");
  const [entityType, setEntityType] = useState<CrmImportEntityType>("organization");
  const [sourceSystem, setSourceSystem] = useState("commercial-ui");
  const [csv, setCsv] = useState("");
  const [batch, setBatch] = useState<CrmImportBatch | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function reset() {
    setStep("configure");
    setBatch(null);
    setError(null);
    setCsv("");
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleFileUpload(file: File) {
    setCsv(await file.text());
  }

  async function handleCreateAndValidate() {
    setBusy(true);
    setError(null);
    try {
      const created = await createCrmImportBatch(token, { sourceSystem, entityType, csv });
      setBatch(created.batch);
      const validated = await validateCrmImportBatch(token, created.batch.id);
      setBatch(validated.batch);
      setStep("validate");
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Import validation failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleExecute() {
    if (!batch) return;
    setBusy(true);
    setError(null);
    try {
      const result = await executeCrmImportBatch(token, batch.id, `crm-ui-${batch.id}-${Date.now()}`);
      setBatch(result.batch);
      setStep("done");
      onCommitted();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Import commit failed");
    } finally {
      setBusy(false);
    }
  }

  const canCommit = batch?.status === "validated" && (batch.validCount ?? 0) > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[10px] border border-line bg-paper shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <div className="eyebrow mb-1">Bulk Import · C1</div>
            <h2 className="font-display text-xl font-semibold text-ink">Import CRM CSV</h2>
          </div>
          <button type="button" onClick={handleClose} className="text-muted hover:text-ink">
            ✕
          </button>
        </div>

        <div className="space-y-5 p-5">
          {step === "configure" && (
            <>
              <p className="text-sm text-ink-soft">
                Import organizations first, then contacts. Each batch is one entity type.
              </p>
              <label className="block text-sm">
                <span className="mb-1 block text-muted">Entity type</span>
                <select
                  value={entityType}
                  onChange={(e) => setEntityType(e.target.value as CrmImportEntityType)}
                  className="w-full rounded-md border border-line bg-ivory px-3 py-2 text-ink"
                >
                  {CRM_IMPORT_ENTITY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-muted">Source system</span>
                <input
                  value={sourceSystem}
                  onChange={(e) => setSourceSystem(e.target.value)}
                  className="w-full rounded-md border border-line bg-ivory px-3 py-2 text-ink"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-muted">CSV file</span>
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFileUpload(file);
                  }}
                  className="w-full text-sm"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1 block text-muted">Or paste CSV</span>
                <textarea
                  value={csv}
                  onChange={(e) => setCsv(e.target.value)}
                  rows={8}
                  placeholder="legalName,organizationTypeKey,country,status..."
                  className="w-full rounded-md border border-line bg-ivory px-3 py-2 font-mono text-xs text-ink"
                />
              </label>
            </>
          )}

          {step === "validate" && batch && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="rounded-md border border-line bg-ivory p-3">
                  <div className="text-2xl font-semibold text-ink">{batch.rowCount}</div>
                  <div className="text-muted">Rows</div>
                </div>
                <div className="rounded-md border border-success-bg p-3">
                  <div className="text-2xl font-semibold text-success">{batch.validCount ?? 0}</div>
                  <div className="text-muted">Valid</div>
                </div>
                <div className="rounded-md border border-danger-bg p-3">
                  <div className="text-2xl font-semibold text-danger">{batch.invalidCount ?? 0}</div>
                  <div className="text-muted">Invalid</div>
                </div>
              </div>
              <div className="rounded-md border border-line">
                <div className="border-b border-line px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  Validation results
                </div>
                <div className="max-h-48 overflow-y-auto p-3 font-mono text-xs">
                  {(batch.validationResults ?? []).map((row) => (
                    <div key={row.rowNumber} className="mb-1">
                      Row {row.rowNumber}: {row.status}
                      {row.errors?.length ? ` — ${row.errors.join(", ")}` : ""}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === "done" && batch && (
            <div className="rounded-md border border-success/30 bg-success-bg p-4 text-sm text-success">
              Import committed — {batch.committedCount ?? 0} record(s) created.
            </div>
          )}

          {error && <p className="text-sm text-danger">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
          <Btn variant="secondary" onClick={handleClose}>
            {step === "done" ? "Close" : "Cancel"}
          </Btn>
          {step === "configure" && (
            <Btn onClick={() => void handleCreateAndValidate()} disabled={busy || !csv.trim()}>
              {busy ? "Validating…" : "Validate"}
            </Btn>
          )}
          {step === "validate" && (
            <>
              <Btn variant="secondary" onClick={reset} disabled={busy}>
                Start over
              </Btn>
              <Btn onClick={() => void handleExecute()} disabled={busy || !canCommit}>
                {busy ? "Committing…" : "Commit import"}
              </Btn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
