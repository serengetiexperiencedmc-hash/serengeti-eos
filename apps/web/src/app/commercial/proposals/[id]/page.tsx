"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import {
  createBooking,
  getBookingByProposal,
  type BookingDetail,
} from "@/lib/booking-api";
import { formatCost } from "@/lib/costing-api";
import { EosApiError } from "@/lib/eos-client";
import {
  formatProposalValue,
  getProposal,
  PROPOSAL_STATUS_LABELS,
  proposalStatusBadge,
  transitionProposal,
  type ProposalDetail,
} from "@/lib/proposal-api";

export default function ProposalDetailPage() {
  const params = useParams<{ id: string }>();
  const { token, ready } = useEosSession();
  const [detail, setDetail] = useState<ProposalDetail | null>(null);
  const [orgs, setOrgs] = useState<CrmOrganization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [creatingBooking, setCreatingBooking] = useState(false);

  useEffect(() => {
    if (!token || !params.id) {
      setDetail(null);
      setBooking(null);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([
      getProposal(token, params.id),
      listOrganizations(token),
      getBookingByProposal(token, params.id).catch(() => null),
    ])
      .then(([data, orgList, bookingDetail]) => {
        setDetail(data);
        setOrgs(orgList.items);
        setBooking(bookingDetail);
      })
      .catch((err) => {
        setError(err instanceof EosApiError ? err.message : "Failed to load proposal");
        setDetail(null);
      })
      .finally(() => setLoading(false));
  }, [token, params.id]);

  const clientName = useMemo(() => {
    if (!detail) return "";
    const org = orgs.find((o) => o.id === detail.proposal.organizationId);
    return org?.tradingName ?? org?.legalName ?? "Client";
  }, [detail, orgs]);

  async function handleAcceptAndBook() {
    if (!token || !detail) return;
    setCreatingBooking(true);
    try {
      if (detail.proposal.status === "sent") {
        const accepted = await transitionProposal(token, detail.proposal.id, "accepted");
        setDetail({ ...detail, proposal: accepted.proposal });
      }
      const created = await createBooking(token, detail.proposal.id);
      setBooking(created);
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to create booking");
    } finally {
      setCreatingBooking(false);
    }
  }

  async function handleSend() {
    if (!token || !detail) return;
    setTransitioning(true);
    try {
      const result = await transitionProposal(token, detail.proposal.id, "sent");
      setDetail({ ...detail, proposal: result.proposal });
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to send proposal");
    } finally {
      setTransitioning(false);
    }
  }

  if (ready && !token) {
    return (
      <p className="text-sm text-muted">
        <Link href="/commercial/proposals" className="text-gold-deep underline">
          ← Back to Proposals
        </Link>
        {" · "}Sign in to view proposal details.
      </p>
    );
  }

  if (loading) return <p className="text-sm text-muted">Loading proposal…</p>;

  if (error || !detail) {
    return (
      <>
        <Link href="/commercial/proposals" className="text-sm text-gold-deep underline">
          ← Back to Proposals
        </Link>
        <p className="mt-4 text-sm text-red-700">{error ?? "Proposal not found"}</p>
      </>
    );
  }

  const { proposal, programme, costLines, versions } = detail;

  return (
    <>
      <PageHeader
        eyebrow={`Proposal · ${proposal.proposalCode}`}
        title={`${clientName} — ${proposal.title}`}
        subtitle={`v${proposal.currentVersion} · ${PROPOSAL_STATUS_LABELS[proposal.status] ?? proposal.status}`}
        actions={
          <>
            <Link href="/commercial/proposals">
              <Btn variant="secondary">← All Proposals</Btn>
            </Link>
            <Link href={`/commercial/rfps/${proposal.rfpId}`}>
              <Btn variant="secondary">View RFP</Btn>
            </Link>
            {proposal.status === "approved" && (
              <Btn variant="gold" disabled={transitioning} onClick={() => void handleSend()}>
                {transitioning ? "Sending…" : "Send Proposal"}
              </Btn>
            )}
            {proposal.status === "sent" && !booking && (
              <Btn variant="gold" disabled={creatingBooking} onClick={() => void handleAcceptAndBook()}>
                {creatingBooking ? "Creating…" : "Accept & Create Booking"}
              </Btn>
            )}
            {booking && (
              <Link href={`/commercial/bookings/${booking.booking.id}`}>
                <Btn variant="gold">View Booking</Btn>
              </Link>
            )}
          </>
        }
      />

      <div className="mb-4">
        <Badge variant={proposalStatusBadge(proposal.status)} label={PROPOSAL_STATUS_LABELS[proposal.status]} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card title="Programme Summary">
            {programme ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-ink">{programme.title}</p>
                {programme.days.map((day) => (
                  <div key={day.dayNumber} className="rounded-md border border-line p-3">
                    <div className="text-sm font-medium">{day.title}</div>
                    {day.location && <div className="text-xs text-muted">{day.location}</div>}
                    <ul className="mt-2 space-y-1 text-xs text-muted">
                      {day.items.map((item) => (
                        <li key={`${day.dayNumber}-${item.title}`}>
                          {item.startTime ? `${item.startTime} · ` : ""}
                          {item.title}
                          {item.description ? ` — ${item.description}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No programme linked.</p>
            )}
          </Card>

          <Card title="Cost Breakdown" padding={false}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {costLines.map((line, i) => (
                  <tr key={`${line.category}-${i}`} className="border-b border-line">
                    <td className="px-4 py-3">{line.category}</td>
                    <td className="px-4 py-3">{line.description}</td>
                    <td className="px-4 py-3 text-right">{formatCost(line.lineTotal, line.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Commercial Summary">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Cost</span>
                <span>{formatCost(proposal.totalCost, proposal.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sell Price</span>
                <span>{formatProposalValue(proposal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Margin</span>
                <span className="text-success">{proposal.marginPercent.toFixed(1)}%</span>
              </div>
              {proposal.paxCount && (
                <div className="flex justify-between border-t-2 border-ink pt-3 text-base font-semibold text-ink">
                  <span>Per Person</span>
                  <span>{formatCost(proposal.sellPrice / proposal.paxCount, proposal.currency)}</span>
                </div>
              )}
            </div>
          </Card>

          <Card title="Version History">
            {versions.map((v) => (
              <div key={v.id} className="border-b border-line py-3 last:border-0">
                <p className="text-sm">
                  <strong>v{v.versionNumber}</strong> — {v.summary}
                </p>
                <div className="mt-0.5 text-xs text-muted">{new Date(v.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}
