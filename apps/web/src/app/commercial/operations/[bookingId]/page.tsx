"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { BOOKING_STATUS_LABELS, bookingStatusBadge, formatBookingValue, getBooking, type BookingDetail } from "@/lib/booking-api";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import { EosApiError } from "@/lib/eos-client";
import {
  confirmSupplier,
  completeFieldTask,
  createFieldTask,
  generateSupplierConfirmations,
  getBrief,
  issueBrief,
  listFieldTasks,
  listSupplierConfirmations,
  OPS_BOOKING_TABS,
  saveBrief,
  type OpsBrief,
  type OpsFieldTask,
  type SupplierConfirmation,
} from "@/lib/ops-api";

type Tab = (typeof OPS_BOOKING_TABS)[number];

export default function OperationsBookingPage() {
  const params = useParams<{ bookingId: string }>();
  const { token, ready } = useEosSession();
  const [tab, setTab] = useState<Tab>("suppliers");
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [orgs, setOrgs] = useState<CrmOrganization[]>([]);
  const [confirmations, setConfirmations] = useState<SupplierConfirmation[]>([]);
  const [brief, setBrief] = useState<OpsBrief | null>(null);
  const [tasks, setTasks] = useState<OpsFieldTask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [briefDraft, setBriefDraft] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const bookingId = params.bookingId;

  useEffect(() => {
    if (!token || !bookingId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getBooking(token, bookingId),
      listOrganizations(token),
      listSupplierConfirmations(token, bookingId).catch(() => ({ items: [] })),
      getBrief(token, bookingId).catch(() => null),
      listFieldTasks(token, bookingId).catch(() => ({ items: [] })),
    ])
      .then(([bkg, orgList, conf, br, fld]) => {
        setBooking(bkg);
        setOrgs(orgList.items);
        setConfirmations(conf.items);
        setBrief(br?.brief ?? null);
        setBriefDraft(br?.brief?.content ?? "");
        setTasks(fld.items);
      })
      .catch((err) => setError(err instanceof EosApiError ? err.message : "Failed to load operations"))
      .finally(() => setLoading(false));
  }, [token, bookingId]);

  const clientName = useMemo(() => {
    if (!booking) return "";
    const org = orgs.find((o) => o.id === booking.booking.organizationId);
    return org?.tradingName ?? org?.legalName ?? "Client";
  }, [booking, orgs]);

  async function refreshBooking() {
    if (!token || !bookingId) return;
    const bkg = await getBooking(token, bookingId);
    setBooking(bkg);
  }

  async function handleGenerateConfirmations() {
    if (!token || !bookingId) return;
    setBusy(true);
    try {
      const res = await generateSupplierConfirmations(token, bookingId);
      setConfirmations(res.items);
      await refreshBooking();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to generate confirmations");
    } finally {
      setBusy(false);
    }
  }

  async function handleConfirm(id: string) {
    if (!token) return;
    setBusy(true);
    try {
      const res = await confirmSupplier(token, id, `REF-${id.slice(0, 8).toUpperCase()}`);
      setConfirmations((prev) => prev.map((c) => (c.id === id ? res.confirmation : c)));
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to confirm supplier");
    } finally {
      setBusy(false);
    }
  }

  async function handleSaveBrief() {
    if (!token || !bookingId) return;
    setBusy(true);
    try {
      const res = await saveBrief(token, bookingId, briefDraft);
      setBrief(res.brief);
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to save brief");
    } finally {
      setBusy(false);
    }
  }

  async function handleIssueBrief() {
    if (!token || !bookingId) return;
    setBusy(true);
    try {
      if (!brief?.content && briefDraft) await saveBrief(token, bookingId, briefDraft);
      const res = await issueBrief(token, bookingId);
      setBrief(res.brief);
      await refreshBooking();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to issue brief");
    } finally {
      setBusy(false);
    }
  }

  async function handleAddTask() {
    if (!token || !bookingId || !newTaskTitle.trim()) return;
    setBusy(true);
    try {
      const res = await createFieldTask(token, { bookingId, title: newTaskTitle.trim() });
      setTasks((prev) => [...prev, res.task]);
      setNewTaskTitle("");
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to add task");
    } finally {
      setBusy(false);
    }
  }

  async function handleCompleteTask(taskId: string) {
    if (!token) return;
    setBusy(true);
    try {
      const res = await completeFieldTask(token, taskId);
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.task : t)));
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to complete task");
    } finally {
      setBusy(false);
    }
  }

  if (ready && !token) {
    return <p className="text-sm text-muted">Sign in to manage operations.</p>;
  }
  if (loading) return <p className="text-sm text-muted">Loading operations workspace…</p>;
  if (error && !booking) return <p className="text-sm text-red-700">{error}</p>;
  if (!booking) return <p className="text-sm text-muted">Booking not found.</p>;

  const tabs: { id: Tab; label: string }[] = [
    { id: "suppliers", label: "Supplier Confirmations" },
    { id: "field", label: "Field Ops" },
  ];

  return (
    <>
      <PageHeader
        eyebrow={`Operations · ${booking.booking.bookingCode}`}
        title={`${clientName} — ${booking.booking.title}`}
        subtitle="Supplier confirmations and field operations"
        actions={
          <>
            <Link href="/commercial/operations">
              <Btn variant="secondary">← Workbench</Btn>
            </Link>
            <Link href={`/commercial/bookings/${bookingId}`}>
              <Btn variant="secondary">Command Center</Btn>
            </Link>
            <Badge variant={bookingStatusBadge(booking.booking.status)} label={BOOKING_STATUS_LABELS[booking.booking.status]} />
          </>
        }
      />

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}

      <div className="mb-5 flex gap-2 border-b border-line">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm ${tab === t.id ? "border-b-2 border-gold font-medium text-gold-deep" : "text-muted"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "suppliers" && (
        <Card title="Supplier Confirmations">
          {confirmations.length === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted">Generate confirmation requests from programme supplier references.</p>
              <Btn variant="gold" disabled={busy} onClick={() => void handleGenerateConfirmations()}>
                {busy ? "Generating…" : "Generate from Programme"}
              </Btn>
            </div>
          ) : (
            <div className="space-y-2">
              {confirmations.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-md border border-line px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-ink">{c.label}</div>
                    <div className="text-xs text-muted capitalize">{c.status}</div>
                  </div>
                  {c.status === "requested" && (
                    <Btn variant="secondary" size="sm" disabled={busy} onClick={() => void handleConfirm(c.id)}>
                      Confirm
                    </Btn>
                  )}
                  {c.status === "confirmed" && <span className="text-success text-sm">✓ Confirmed</span>}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === "field" && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Card title="Operations Brief">
            {brief?.issuedAt ? (
              <div>
                <p className="mb-2 text-xs text-muted">Issued {new Date(brief.issuedAt).toLocaleString()}</p>
                <pre className="whitespace-pre-wrap rounded bg-sand/40 p-3 text-sm">{brief.content}</pre>
              </div>
            ) : (
              <div className="space-y-3">
                <textarea
                  className="min-h-[120px] w-full rounded border border-line px-3 py-2 text-sm"
                  value={briefDraft}
                  onChange={(e) => setBriefDraft(e.target.value)}
                  placeholder="Field team briefing notes…"
                />
                <div className="flex gap-2">
                  <Btn variant="secondary" disabled={busy} onClick={() => void handleSaveBrief()}>
                    Save Draft
                  </Btn>
                  <Btn variant="gold" disabled={busy || !briefDraft.trim()} onClick={() => void handleIssueBrief()}>
                    Issue to Field Team
                  </Btn>
                </div>
              </div>
            )}
          </Card>
          <Card title="Field Tasks">
            <div className="mb-3 flex gap-2">
              <input
                className="flex-1 rounded border border-line px-3 py-2 text-sm"
                placeholder="New task title"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <Btn variant="secondary" disabled={busy} onClick={() => void handleAddTask()}>
                Add
              </Btn>
            </div>
            <div className="space-y-2">
              {tasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between rounded border border-line px-3 py-2 text-sm">
                  <span className={t.status === "complete" ? "text-muted line-through" : ""}>{t.title}</span>
                  {t.status !== "complete" && (
                    <Btn variant="secondary" size="sm" disabled={busy} onClick={() => void handleCompleteTask(t.id)}>
                      Done
                    </Btn>
                  )}
                </div>
              ))}
              {tasks.length === 0 && <p className="text-sm text-muted">No field tasks yet.</p>}
            </div>
          </Card>
        </div>
      )}

      <p className="mt-6 text-xs text-muted">
        Contract value: {formatBookingValue(booking.booking)} · Completing ops work auto-updates the booking handover checklist.
      </p>
    </>
  );
}
