"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import { EosApiError } from "@/lib/eos-client";
import {
  formatProposalValue,
  listProposals,
  PROPOSAL_STATUS_LABELS,
  proposalStatusBadge,
  type ProposalSummary,
} from "@/lib/proposal-api";

function formatSent(proposal: ProposalSummary): string {
  if (proposal.sentAt) return new Date(proposal.sentAt).toLocaleDateString();
  return "—";
}

function formatViewed(proposal: ProposalSummary): string {
  if (proposal.clientViewedAt) return `${new Date(proposal.clientViewedAt).toLocaleDateString()} ✓`;
  return "—";
}

export default function ProposalsPage() {
  const { token, ready } = useEosSession();
  const [proposals, setProposals] = useState<ProposalSummary[]>([]);
  const [orgs, setOrgs] = useState<CrmOrganization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setProposals([]);
      return;
    }
    setLoading(true);
    setError(null);
    Promise.all([listProposals(token), listOrganizations(token)])
      .then(([list, orgList]) => {
        setProposals(list.items);
        setOrgs(orgList.items);
      })
      .catch((err) => {
        setError(err instanceof EosApiError ? err.message : "Failed to load proposals");
        setProposals([]);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const orgNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const org of orgs) map[org.id] = org.tradingName ?? org.legalName;
    return map;
  }, [orgs]);

  return (
    <>
      <PageHeader
        eyebrow="Proposal Management"
        title="Proposals"
        subtitle={
          token && !loading
            ? `${proposals.length} proposal${proposals.length === 1 ? "" : "s"} · Live · C8 API`
            : "Generated from approved programmes and costing"
        }
        actions={
          <Link href="/commercial/rfps">
            <Btn variant="secondary">From RFPs</Btn>
          </Link>
        }
      />

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      {ready && !token && (
        <p className="mb-4 text-sm text-muted">Sign in to load proposals from the API.</p>
      )}

      <Card padding={false}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wide text-muted">
              <th className="px-4 py-3">Proposal</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sent</th>
              <th className="px-4 py-3">Client Viewed</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {!token ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-sm text-muted">
                  Sign in to view proposals.
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-sm text-muted">
                  Loading proposals…
                </td>
              </tr>
            ) : proposals.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-sm text-muted">
                  No proposals yet. Approve costing on an RFP, then generate a proposal.
                </td>
              </tr>
            ) : (
              proposals.map((p) => (
                <tr key={p.id} className="border-b border-line hover:bg-sand/30">
                  <td className="px-4 py-3">
                    <strong className="text-ink">{p.proposalCode}</strong>
                    <br />
                    <span className="text-xs text-muted">{p.title}</span>
                  </td>
                  <td className="px-4 py-3">{orgNames[p.organizationId] ?? "Client"}</td>
                  <td className="px-4 py-3">v{p.currentVersion}</td>
                  <td className="px-4 py-3">
                    <Badge variant={proposalStatusBadge(p.status)} label={PROPOSAL_STATUS_LABELS[p.status] ?? p.status} />
                  </td>
                  <td className="px-4 py-3">{formatSent(p)}</td>
                  <td className="px-4 py-3">{formatViewed(p)}</td>
                  <td className="px-4 py-3">{formatProposalValue(p)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/commercial/proposals/${p.id}`}>
                      <Btn variant={p.status === "draft" ? "gold" : "secondary"} size="sm">
                        {p.status === "draft" ? "Continue" : "View"}
                      </Btn>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </>
  );
}
