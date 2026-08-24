"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { EosApiError } from "@/lib/eos-client";
import {
  assignTicket,
  createTicket,
  getItsmHealth,
  getTicket,
  linkTicketCi,
  listCis,
  listTickets,
  ticketAction,
  TICKET_STATUS_LABELS,
  unlinkTicketCi,
  type CmdbCi,
  type ItsmTicket,
  type ItsmTicketCi,
} from "@/lib/it-api";

function statusBadge(status: ItsmTicket["status"]) {
  if (status === "open") return <Badge variant="urgent" label="Open" />;
  if (status === "triaged" || status === "assigned") return <Badge variant="review" label={TICKET_STATUS_LABELS[status]} />;
  if (status === "in_progress") return <Badge variant="progress" label="In progress" />;
  if (status === "resolved" || status === "closed") return <Badge variant="won" label={TICKET_STATUS_LABELS[status]} />;
  return <Badge variant="draft" label="Cancelled" />;
}

export default function ItsmPage() {
  const { token, ready } = useEosSession();
  const [tickets, setTickets] = useState<ItsmTicket[]>([]);
  const [cis, setCis] = useState<CmdbCi[]>([]);
  const [health, setHealth] = useState<{ tickets: number; openTickets: number } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<{ ticket: ItsmTicket; cis: ItsmTicketCi[] } | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [ticketType, setTicketType] = useState<ItsmTicket["ticketType"]>("incident");
  const [severity, setSeverity] = useState<ItsmTicket["severity"]>("medium");
  const [description, setDescription] = useState("");
  const [assignEmail, setAssignEmail] = useState("carol.admin@sedmc.local");
  const [linkCiId, setLinkCiId] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const [list, ciList, h] = await Promise.all([listTickets(token), listCis(token), getItsmHealth(token)]);
      setTickets(list.items);
      setCis(ciList.items);
      setHealth({ tickets: h.tickets, openTickets: h.openTickets });
      setLinkCiId((current) => current || ciList.items[0]?.id || "");
    } catch (err) {
      setTickets([]);
      setError(err instanceof EosApiError ? err.message : "Failed to load service desk");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    void load();
  }, [token, load]);

  useEffect(() => {
    if (!token || !selectedId) {
      setDetail(null);
      return;
    }
    getTicket(token, selectedId)
      .then(setDetail)
      .catch((err) => setError(err instanceof EosApiError ? err.message : "Failed to load ticket"));
  }, [token, selectedId]);

  async function run(action: () => Promise<void>) {
    if (!token) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await action();
      await load();
      if (selectedId) setDetail(await getTicket(token, selectedId));
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tickets.filter((t) => {
      if (statusFilter && t.status !== statusFilter) return false;
      if (!q) return true;
      return `${t.ticketCode} ${t.title}`.toLowerCase().includes(q);
    });
  }, [tickets, query, statusFilter]);

  if (ready && !token) return <p className="text-sm text-muted">Sign in to view the service desk.</p>;

  return (
    <>
      <PageHeader
        eyebrow="I11 · IT"
        title="Service Desk"
        subtitle="Incidents and requests · linked configuration items"
        actions={
          <div className="flex gap-2">
            <Btn variant="secondary" href="/commercial/cmdb">
              CMDB
            </Btn>
            <Btn variant="secondary" href="/commercial/itsm/changes">
              Changes
            </Btn>
            <Btn variant="secondary" href="/commercial">
              ← Dashboard
            </Btn>
          </div>
        }
      />

      {health && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card title="Tickets">
            <div className="font-display text-2xl font-semibold text-ink">{health.tickets}</div>
          </Card>
          <Card title="Open">
            <div className="font-display text-2xl font-semibold text-ink">{health.openTickets}</div>
          </Card>
        </div>
      )}

      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mb-4 text-sm text-green-800">{message}</p>}
      {loading && <p className="mb-4 text-sm text-muted">Loading service desk…</p>}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
        <div className="space-y-5 xl:col-span-2">
          <Card title="Log ticket">
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                void run(async () => {
                  const input: Parameters<typeof createTicket>[1] = { title, ticketType, severity };
                  if (description.trim()) input.description = description.trim();
                  await createTicket(token!, input);
                  setTitle("");
                  setDescription("");
                  setMessage("Ticket created");
                });
              }}
            >
              <input className="w-full rounded-md border border-line px-3 py-2 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <div className="grid grid-cols-2 gap-3">
                <select className="rounded-md border border-line px-3 py-2 text-sm" value={ticketType} onChange={(e) => setTicketType(e.target.value as ItsmTicket["ticketType"])}>
                  <option value="incident">Incident</option>
                  <option value="request">Request</option>
                </select>
                <select className="rounded-md border border-line px-3 py-2 text-sm" value={severity} onChange={(e) => setSeverity(e.target.value as ItsmTicket["severity"])}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <textarea className="w-full rounded-md border border-line px-3 py-2 text-sm" rows={3} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Btn type="submit" disabled={busy}>
                Create ticket
              </Btn>
            </form>
          </Card>

          <Card
            title="Queue"
            headerExtra={
              <div className="flex gap-2">
                <input className="w-32 rounded-md border border-line px-2 py-1 text-xs" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
                <select className="rounded-md border border-line px-2 py-1 text-xs" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">All</option>
                  {Object.entries(TICKET_STATUS_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            }
          >
            {visible.length === 0 && !loading ? (
              <p className="text-sm text-muted">No tickets match the current filter.</p>
            ) : (
              <div className="divide-y divide-line">
                {visible.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => setSelectedId(ticket.id)}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 px-1 py-3 text-left ${selectedId === ticket.id ? "bg-sand/50" : ""}`}
                  >
                    <div>
                      <div className="font-medium text-ink">{ticket.title}</div>
                      <div className="text-xs text-muted">
                        {ticket.ticketCode} · {ticket.ticketType} · {ticket.severity}
                      </div>
                    </div>
                    {statusBadge(ticket.status)}
                  </button>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="xl:col-span-3">
          {!detail ? (
            <Card title="Ticket detail">
              <p className="text-sm text-muted">Select a ticket to triage, assign, resolve, or link CIs.</p>
            </Card>
          ) : (
            <div className="space-y-5">
              <Card title={detail.ticket.title} headerExtra={statusBadge(detail.ticket.status)}>
                <p className="mb-4 text-sm text-muted">
                  {detail.ticket.ticketCode} · {detail.ticket.ticketType} · {detail.ticket.severity}
                  {detail.ticket.assignedToName ? ` · ${detail.ticket.assignedToName}` : ""}
                </p>
                {detail.ticket.description && <p className="mb-4 text-sm text-ink">{detail.ticket.description}</p>}
                <div className="flex flex-wrap gap-2">
                  {detail.ticket.status === "open" && (
                    <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await ticketAction(token!, detail.ticket.id, "triage"); setMessage("Triaged"); })}>
                      Triage
                    </Btn>
                  )}
                  {(detail.ticket.status === "triaged" ||
                    detail.ticket.status === "assigned" ||
                    detail.ticket.status === "in_progress") && (
                    <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await assignTicket(token!, detail.ticket.id, assignEmail); setMessage("Assigned"); })}>
                      Assign
                    </Btn>
                  )}
                  {detail.ticket.status === "assigned" && (
                    <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await ticketAction(token!, detail.ticket.id, "start"); setMessage("Investigation started"); })}>
                      Start
                    </Btn>
                  )}
                  {detail.ticket.status === "in_progress" && (
                    <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await ticketAction(token!, detail.ticket.id, "resolve"); setMessage("Resolved"); })}>
                      Resolve
                    </Btn>
                  )}
                  {detail.ticket.status === "resolved" && (
                    <Btn size="sm" disabled={busy} onClick={() => void run(async () => { await ticketAction(token!, detail.ticket.id, "close"); setMessage("Closed"); })}>
                      Close
                    </Btn>
                  )}
                  {(detail.ticket.status === "open" || detail.ticket.status === "triaged") && (
                    <Btn size="sm" variant="secondary" disabled={busy} onClick={() => void run(async () => { await ticketAction(token!, detail.ticket.id, "cancel"); setMessage("Cancelled"); })}>
                      Cancel
                    </Btn>
                  )}
                </div>
                {(detail.ticket.status === "triaged" || detail.ticket.status === "assigned" || detail.ticket.status === "in_progress") && (
                  <label className="mt-4 block text-xs text-muted">
                    Assign to email
                    <input className="mt-1 block w-full rounded-md border border-line px-3 py-2 text-sm text-ink" value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)} />
                  </label>
                )}
              </Card>

              <Card title="Linked CIs">
                <form
                  className="mb-4 flex flex-wrap items-end gap-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void run(async () => {
                      await linkTicketCi(token!, detail.ticket.id, linkCiId);
                      setMessage("CI linked");
                    });
                  }}
                >
                  <select className="rounded-md border border-line px-3 py-2 text-sm" value={linkCiId} onChange={(e) => setLinkCiId(e.target.value)}>
                    {cis.map((ci) => (
                      <option key={ci.id} value={ci.id}>
                        {ci.ciCode} · {ci.name}
                      </option>
                    ))}
                  </select>
                  <Btn type="submit" disabled={busy || !linkCiId}>
                    Link CI
                  </Btn>
                </form>
                {detail.cis.length === 0 ? (
                  <p className="text-sm text-muted">No configuration items linked.</p>
                ) : (
                  <div className="space-y-2">
                    {detail.cis.map((ci) => (
                      <div key={ci.ciId} className="flex items-center justify-between rounded border border-line px-3 py-2 text-sm">
                        <Link href="/commercial/cmdb" className="text-gold-deep underline">
                          {ci.ciCode} · {ci.name}
                        </Link>
                        <Btn size="sm" variant="ghost" disabled={busy} onClick={() => void run(async () => { await unlinkTicketCi(token!, detail.ticket.id, ci.ciId); setMessage("CI unlinked"); })}>
                          Remove
                        </Btn>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
