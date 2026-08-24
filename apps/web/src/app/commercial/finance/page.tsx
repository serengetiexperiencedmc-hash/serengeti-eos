"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { formatCurrency } from "@/lib/analytics-api";
import { EosApiError } from "@/lib/eos-client";
import {
  applyApprovedPayment,
  approveFinancePayment,
  autoCreateFinalInvoice,
  createDepositInvoice,
  createFinalInvoice,
  createProgressInvoice,
  createQuote,
  getFinalInvoiceEligibility,
  issueInvoice,
  listFinanceControl,
  listInvoices,
  listPaymentRequests,
  listQuotes,
  listReconciliations,
  requestInvoicePayment,
  resolveReconciliation,
  sendQuote,
  type BookingFinancialControl,
  type FinInvoice,
  type FinQuote,
  type FinReconciliation,
  type PaymentRequestItem,
} from "@/lib/finance-api";

type Tab = "quotes" | "invoices" | "payments" | "reconciliation";

export default function FinancePage() {
  const { token, ready } = useEosSession();
  const [tab, setTab] = useState<Tab>("invoices");
  const [controlItems, setControlItems] = useState<BookingFinancialControl[]>([]);
  const [control, setControl] = useState<BookingFinancialControl | null>(null);
  const [quotes, setQuotes] = useState<FinQuote[]>([]);
  const [invoices, setInvoices] = useState<FinInvoice[]>([]);
  const [reconciliations, setReconciliations] = useState<FinReconciliation[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequestItem[]>([]);
  const [finalEligibility, setFinalEligibility] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [pendingApproval, setPendingApproval] = useState<{ approvalId: string; invoiceId: string } | null>(null);

  async function reload(explicitId?: string) {
    if (!token) return;
    const [controlList, pay] = await Promise.all([listFinanceControl(token), listPaymentRequests(token)]);
    setControlItems(controlList.items);
    const id = explicitId || bookingId || controlList.items[0]?.bookingId || "";
    const selected = controlList.items.find((item) => item.bookingId === id) ?? null;
    setControl(selected);
    if (id !== bookingId) setBookingId(id);
    if (!id) {
      setQuotes([]);
      setInvoices([]);
      setReconciliations([]);
      setPaymentRequests([]);
      return;
    }
    const [q, inv, rec] = await Promise.all([
      listQuotes(token, id),
      listInvoices(token, id),
      listReconciliations(token, id),
    ]);
    setQuotes(q.items);
    setInvoices(inv.items);
    setReconciliations(rec.items);
    setPaymentRequests(pay.items.filter((p) => p.bookingId === id));
  }

  useEffect(() => {
    if (!token) return;
    reload().catch((err) => setError(err instanceof EosApiError ? err.message : "Failed to load finance data"));
  }, [token]);

  async function runAction(action: () => Promise<void>) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      await reload();
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view finance reconciliation.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I8 · I8.4 · Finance"
        title="Booking Financial Control"
        subtitle="Client revenue · supplier cost · margin · invoices · SoD payments"
        actions={
          <div className="flex flex-wrap gap-2">
            {bookingId && (
              <>
                <Link href={`/commercial/bookings/${bookingId}`}>
                  <Btn variant="secondary">Command center</Btn>
                </Link>
                <Link href={`/commercial/operations/${bookingId}`}>
                  <Btn variant="secondary">Operations</Btn>
                </Link>
              </>
            )}
            <Link href="/commercial">
              <Btn variant="secondary">← Dashboard</Btn>
            </Link>
          </div>
        }
      />

      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      {message && <p className="mb-4 text-sm text-success">{message}</p>}

      <div className="mb-5 flex flex-wrap gap-2">
        <select
          value={bookingId}
          onChange={(e) => {
            const next = e.target.value;
            setBookingId(next);
            setBusy(true);
            setError(null);
            void reload(next).finally(() => setBusy(false));
          }}
          className="min-w-[280px] rounded-md border border-line bg-paper px-3 py-2 text-sm"
        >
          {controlItems.length === 0 && <option value="">No bookings</option>}
          {controlItems.map((item) => (
            <option key={item.bookingId} value={item.bookingId}>
              {item.bookingCode} · {item.title}
            </option>
          ))}
        </select>
        <Btn
          variant="secondary"
          size="sm"
          disabled={busy || !bookingId || !token}
          onClick={() =>
            void runAction(async () => {
              if (!token) return;
              await createQuote(token, bookingId);
              setMessage("Quote created");
              setTab("quotes");
            })
          }
        >
          + Quote
        </Btn>
        <Btn
          variant="secondary"
          size="sm"
          disabled={busy || !bookingId || !token}
          onClick={() =>
            void runAction(async () => {
              if (!token) return;
              await createDepositInvoice(token, bookingId);
              setMessage("Deposit invoice created");
              setTab("invoices");
            })
          }
        >
          + Deposit
        </Btn>
        <Btn
          variant="secondary"
          size="sm"
          disabled={busy || !bookingId || !token}
          onClick={() =>
            void runAction(async () => {
              if (!token) return;
              await createProgressInvoice(token, bookingId);
              setMessage("Progress invoice created");
              setTab("invoices");
            })
          }
        >
          + Progress
        </Btn>
        <Btn
          variant="secondary"
          size="sm"
          disabled={busy || !bookingId || !token}
          onClick={() =>
            void runAction(async () => {
              if (!token) return;
              await createFinalInvoice(token, bookingId);
              setMessage("Final invoice created");
              setTab("invoices");
            })
          }
        >
          + Final
        </Btn>
        <Btn
          variant="secondary"
          size="sm"
          disabled={busy || !bookingId || !token}
          onClick={() =>
            void runAction(async () => {
              if (!token) return;
              const check = await getFinalInvoiceEligibility(token, bookingId);
              if (!check.eligible) {
                setFinalEligibility(`Not eligible: ${check.reason ?? "unknown"}`);
                return;
              }
              await autoCreateFinalInvoice(token, bookingId);
              setFinalEligibility(`Auto-created final invoice for ${check.remainingAmount} USD`);
              setMessage("Final invoice auto-created");
              setTab("invoices");
            })
          }
        >
          Auto final
        </Btn>
      </div>
      {finalEligibility && <p className="mb-4 text-sm text-muted">{finalEligibility}</p>}

      {control && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Client revenue", value: formatCurrency(control.clientRevenue, control.currency) },
            { label: "Supplier cost", value: formatCurrency(control.supplierCost, control.currency) },
            { label: "Margin", value: `${formatCurrency(control.marginAmount, control.currency)} · ${control.marginPercent}%` },
            { label: "Outstanding", value: formatCurrency(control.outstandingTotal, control.currency) },
          ].map((stat) => (
            <Card key={stat.label} title={stat.label}>
              <div className="font-display text-2xl font-semibold text-ink">{stat.value}</div>
              {stat.label === "Outstanding" && (
                <p className="mt-1 text-xs text-muted">
                  Invoiced {formatCurrency(control.invoicedTotal, control.currency)} · paid{" "}
                  {formatCurrency(control.paidTotal, control.currency)}
                  {control.reconciliationExceptions > 0 ? ` · ${control.reconciliationExceptions} recon exceptions` : ""}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="mb-4 flex gap-2">
        {(["quotes", "invoices", "payments", "reconciliation"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 text-sm capitalize ${tab === t ? "bg-ink text-paper" : "bg-sand text-ink-soft"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "quotes" && (
        <Card title={`Quotes (${quotes.length})`}>
          <div className="space-y-2">
            {quotes.map((q) => (
              <div key={q.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-line px-3 py-2 text-sm">
                <div>
                  <div className="font-medium">{q.quoteCode}</div>
                  <div className="text-xs text-muted">
                    {formatCurrency(q.amount, q.currency)} · {q.status} · valid until {q.validUntil}
                  </div>
                </div>
                {q.status === "draft" && token && (
                  <Btn
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() =>
                      void runAction(async () => {
                        await sendQuote(token!, q.id);
                        setMessage("Quote sent");
                      })
                    }
                  >
                    Send
                  </Btn>
                )}
              </div>
            ))}
            {quotes.length === 0 && <p className="text-sm text-muted">No quotes yet.</p>}
          </div>
        </Card>
      )}

      {tab === "invoices" && (
        <Card title={`Invoices (${invoices.length})`}>
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="rounded border border-line px-3 py-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">
                      {inv.invoiceCode} · {inv.invoiceType}
                    </div>
                    <div className="text-xs text-muted">
                      {formatCurrency(inv.amountPaid, inv.currency)} / {formatCurrency(inv.amount, inv.currency)} · {inv.status}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {inv.status === "draft" && token && (
                      <Btn
                        size="sm"
                        variant="gold"
                        disabled={busy}
                        onClick={() =>
                          void runAction(async () => {
                            await issueInvoice(token!, inv.id);
                            setMessage("Invoice issued + reconciliation opened");
                          })
                        }
                      >
                        Issue
                      </Btn>
                    )}
                    {(inv.status === "issued" || inv.status === "partially_paid") && token && (
                      <Btn
                        size="sm"
                        variant="secondary"
                        disabled={busy}
                        onClick={() =>
                          void runAction(async () => {
                            const remaining = inv.amount - inv.amountPaid;
                            const res = await requestInvoicePayment(token!, inv.id, remaining, "Client bank transfer");
                            setPendingApproval({ approvalId: res.approvalId, invoiceId: inv.id });
                            setMessage(res.message);
                          })
                        }
                      >
                        Request payment (SoD)
                      </Btn>
                    )}
                  </div>
                </div>
                {pendingApproval?.invoiceId === inv.id && token && (
                  <div className="mt-2 flex gap-2 rounded bg-warning-bg/40 p-2 text-xs">
                    <span>Approval {pendingApproval.approvalId.slice(0, 8)}… pending</span>
                    <Btn
                      size="sm"
                      variant="gold"
                      disabled={busy}
                      onClick={() =>
                        void runAction(async () => {
                          await approveFinancePayment(token!, pendingApproval!.approvalId);
                          await applyApprovedPayment(token!, inv.id);
                          setPendingApproval(null);
                          setMessage("Payment approved and applied to invoice");
                        })
                      }
                    >
                      Approve & apply (finance manager)
                    </Btn>
                  </div>
                )}
              </div>
            ))}
            {invoices.length === 0 && <p className="text-sm text-muted">No invoices yet.</p>}
          </div>
        </Card>
      )}

      {tab === "payments" && (
        <Card title={`Payment requests (${paymentRequests.length})`}>
          <p className="mb-3 text-sm text-muted">SoD payment requests awaiting finance approver sign-off.</p>
          <div className="space-y-2">
            {paymentRequests.map((req) => (
              <div key={req.approvalId} className="flex flex-wrap items-center justify-between gap-2 rounded border border-line px-3 py-2 text-sm">
                <div>
                  <div className="font-medium">
                    {req.invoiceCode} · {formatCurrency(req.amount, req.currency)}
                  </div>
                  <div className="text-xs text-muted">
                    {req.beneficiary} · {req.status} · approval {req.approvalStatus}
                  </div>
                </div>
                {req.status === "pending_approval" && token && (
                  <Btn
                    size="sm"
                    variant="gold"
                    disabled={busy}
                    onClick={() =>
                      void runAction(async () => {
                        await approveFinancePayment(token!, req.approvalId);
                        await applyApprovedPayment(token!, req.invoiceId);
                        setMessage("Payment approved and applied");
                      })
                    }
                  >
                    Approve & apply
                  </Btn>
                )}
              </div>
            ))}
            {paymentRequests.length === 0 && <p className="text-sm text-muted">No pending payment requests.</p>}
          </div>
        </Card>
      )}

      {tab === "reconciliation" && (
        <Card title={`Reconciliations (${reconciliations.length})`}>
          <div className="space-y-2">
            {reconciliations.map((rec) => (
              <div key={rec.id} className="flex flex-wrap items-center justify-between gap-2 rounded border border-line px-3 py-2 text-sm">
                <div>
                  <div className="capitalize font-medium">{rec.status}</div>
                  <div className="text-xs text-muted">
                    {formatCurrency(rec.receivedAmount, rec.currency)} / {formatCurrency(rec.expectedAmount, rec.currency)}
                    {rec.variance !== 0 && ` · Δ ${formatCurrency(rec.variance, rec.currency)}`}
                  </div>
                </div>
                {rec.status === "exception" && token && (
                  <Btn
                    size="sm"
                    variant="secondary"
                    disabled={busy}
                    onClick={() =>
                      void runAction(async () => {
                        await resolveReconciliation(token!, rec.id, "Manual variance accepted — demo resolution");
                        setMessage("Reconciliation resolved");
                      })
                    }
                  >
                    Resolve
                  </Btn>
                )}
              </div>
            ))}
            {reconciliations.length === 0 && <p className="text-sm text-muted">No reconciliations yet.</p>}
          </div>
        </Card>
      )}
    </>
  );
}
