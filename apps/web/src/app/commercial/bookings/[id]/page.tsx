"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { formatCurrency } from "@/lib/analytics-api";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import {
  BOOKING_STATUS_LABELS,
  bookingStatusBadge,
  completeHandoverTask,
  formatBookingValue,
  getBookingCommandCenter,
  type BookingCommandCenter,
} from "@/lib/booking-api";
import { EosApiError } from "@/lib/eos-client";

function ProgressRing({ percent }: { percent: number }) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e8e4dc" strokeWidth="3" />
        <circle
          cx="18"
          cy="18"
          r="15.5"
          fill="none"
          stroke="#b8860b"
          strokeWidth="3"
          strokeDasharray={`${clamped} ${100 - clamped}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-semibold text-ink">{clamped}%</span>
    </div>
  );
}

export default function BookingCommandCenterPage() {
  const params = useParams<{ id: string }>();
  const { token, ready } = useEosSession();
  const [data, setData] = useState<BookingCommandCenter | null>(null);
  const [orgs, setOrgs] = useState<CrmOrganization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState<string | null>(null);

  async function load() {
    if (!token || !params.id) return;
    setLoading(true);
    setError(null);
    try {
      const [center, orgList] = await Promise.all([
        getBookingCommandCenter(token, params.id),
        listOrganizations(token),
      ]);
      setData(center);
      setOrgs(orgList.items);
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to load command center");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!token || !params.id) {
      setData(null);
      return;
    }
    void load();
  }, [token, params.id]);

  const clientName = useMemo(() => {
    if (!data) return "";
    const org = orgs.find((o) => o.id === data.booking.organizationId);
    return org?.tradingName ?? org?.legalName ?? "Client";
  }, [data, orgs]);

  async function handleCompleteTask(taskId: string) {
    if (!token || !data) return;
    setCompleting(taskId);
    try {
      await completeHandoverTask(token, data.booking.id, taskId);
      await load();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to complete task");
    } finally {
      setCompleting(null);
    }
  }

  if (ready && !token) {
    return (
      <p className="text-sm text-muted">
        <Link href="/commercial/bookings" className="text-gold-deep underline">
          ← Back to Bookings
        </Link>
        {" · "}Sign in to view booking command center.
      </p>
    );
  }

  if (loading) return <p className="text-sm text-muted">Loading command center…</p>;

  if (error || !data) {
    return (
      <>
        <Link href="/commercial/bookings" className="text-sm text-gold-deep underline">
          ← Back to Bookings
        </Link>
        <p className="mt-4 text-sm text-red-700">{error ?? "Booking not found"}</p>
      </>
    );
  }

  const { booking, handoverTasks, snapshot, invoices, quotes } = data;
  const { ops, finance } = snapshot;

  return (
    <>
      <PageHeader
        eyebrow={`C10 Command Center · ${booking.bookingCode}`}
        title={`${clientName} — ${booking.title}`}
        subtitle={`Handover ${snapshot.handover.completedCount}/${snapshot.handover.totalCount} · ${formatBookingValue(booking)}`}
        actions={
          <>
            <Link href="/commercial/bookings">
              <Btn variant="secondary">← All Bookings</Btn>
            </Link>
            <Link href={`/commercial/finance?booking=${booking.id}`}>
              <Btn variant="secondary">Finance</Btn>
            </Link>
            <Link href={`/commercial/operations/${booking.id}`}>
              <Btn variant="gold">Operations Workspace</Btn>
            </Link>
            <Link href={`/commercial/proposals/${booking.proposalId}`}>
              <Btn variant="secondary">Proposal</Btn>
            </Link>
          </>
        }
      />

      <div className="mb-4 flex items-center gap-3">
        <Badge variant={bookingStatusBadge(booking.status)} label={BOOKING_STATUS_LABELS[booking.status]} />
        {ops.syncConflicts > 0 && (
          <Link href="/commercial/sync" className="text-sm text-red-700 underline">
            {ops.syncConflicts} sync conflict{ops.syncConflicts === 1 ? "" : "s"}
          </Link>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-[auto_1fr]">
        <Card title="Handover Progress">
          <div className="flex items-center gap-4">
            <ProgressRing percent={snapshot.handover.progressPercent} />
            <div className="text-sm text-muted">
              <div>{snapshot.handover.completedCount} of {snapshot.handover.totalCount} checklist items complete</div>
              {booking.handoverCompletedAt && (
                <div className="mt-1">Completed {new Date(booking.handoverCompletedAt).toLocaleString()}</div>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Supplier Confs", value: `${ops.supplierConfirmationsConfirmed}/${ops.supplierConfirmationsTotal}`, warn: ops.supplierConfirmationsPending > 0 },
            { label: "Manifest", value: ops.manifestStatus ?? "none", warn: ops.manifestStatus !== "published" },
            { label: "Vouchers", value: `${ops.vouchersIssued} issued`, warn: ops.vouchersDraft > 0 },
            { label: "Field Tasks", value: `${ops.fieldTasksOpen} open`, warn: ops.fieldTasksOpen > 0 },
          ].map((stat) => (
            <Card key={stat.label} title={stat.label}>
              <div className={`font-display text-xl font-semibold ${stat.warn ? "text-gold-deep" : "text-ink"}`}>
                {stat.value}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Card title="Finance Snapshot">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Contract value</span>
              <span>{formatCurrency(finance.contractValue, finance.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Invoiced</span>
              <span>{formatCurrency(finance.invoicedTotal, finance.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span>Paid</span>
              <span className="text-success">{formatCurrency(finance.paidTotal, finance.currency)}</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2 font-semibold">
              <span>Outstanding</span>
              <span>{formatCurrency(finance.outstandingTotal, finance.currency)}</span>
            </div>
            {finance.reconciliationExceptions > 0 && (
              <Link href="/commercial/finance" className="block text-xs text-red-700 underline">
                {finance.reconciliationExceptions} reconciliation exception(s)
              </Link>
            )}
          </div>
        </Card>

        <Card title="Milestone Timeline">
          <div className="space-y-2">
            {snapshot.timeline.map((entry) => (
              <div key={entry.key} className="flex items-start gap-2 text-sm">
                <span className={entry.status === "complete" ? "text-success" : "text-muted"}>
                  {entry.status === "complete" ? "✓" : "○"}
                </span>
                <div>
                  <div className={entry.status === "complete" ? "text-ink" : "text-muted"}>{entry.label}</div>
                  {entry.at && (
                    <div className="text-xs text-muted">{new Date(entry.at).toLocaleString()}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Invoices & Quotes">
          <div className="space-y-3 text-sm">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex justify-between rounded border border-line px-3 py-2">
                <span>{inv.invoiceCode} · {inv.invoiceType}</span>
                <span className="text-muted">
                  {formatCurrency(inv.amountPaid, inv.currency)} / {formatCurrency(inv.amount, inv.currency)}
                </span>
              </div>
            ))}
            {quotes.map((q) => (
              <div key={q.id} className="flex justify-between rounded border border-line px-3 py-2">
                <span>{q.quoteCode}</span>
                <span className="text-muted">{q.status} · {formatCurrency(q.amount, q.currency)}</span>
              </div>
            ))}
            {invoices.length === 0 && quotes.length === 0 && (
              <p className="text-muted">No finance documents yet.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        <Card title="Operational Handover Checklist">
          <div className="space-y-2">
            {handoverTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-md border border-line px-4 py-3"
              >
                <div>
                  <div className={`text-sm ${task.status === "complete" ? "text-muted line-through" : "text-ink"}`}>
                    {task.label}
                  </div>
                  {task.completedAt && (
                    <div className="text-xs text-muted">Completed {new Date(task.completedAt).toLocaleString()}</div>
                  )}
                </div>
                {task.status === "pending" ? (
                  <Btn
                    variant="secondary"
                    size="sm"
                    disabled={completing === task.id}
                    onClick={() => void handleCompleteTask(task.id)}
                  >
                    {completing === task.id ? "…" : "Complete"}
                  </Btn>
                ) : (
                  <span className="text-success text-sm">✓</span>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card title="Booking Summary">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Pax</span>
              <span>{booking.paxCount ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Travel dates</span>
              <span>{booking.travelDates ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Destinations</span>
              <span className="text-right">{booking.destinations ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span>Ops brief</span>
              <span>{ops.briefIssued ? "Issued" : "Pending"}</span>
            </div>
            <div className="flex justify-between">
              <span>Manifest guests</span>
              <span>{ops.manifestGuestCount}</span>
            </div>
            <div className="flex justify-between border-t-2 border-ink pt-3 text-base font-semibold text-ink">
              <span>Contract value</span>
              <span>{formatBookingValue(booking)}</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
