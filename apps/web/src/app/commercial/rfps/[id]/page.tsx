"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/commercial/Badge";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { SlaIndicator } from "@/components/commercial/SlaIndicator";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { listOrganizations, type CrmOrganization } from "@/lib/crm-api";
import { EosApiError } from "@/lib/eos-client";
import {
  formatBudgetRange,
  getRfp,
  RFP_WORKFLOW_LABELS,
  slaIndicatorStatus,
  slaLabel,
  type RfpSummary,
  type RfpVersion,
} from "@/lib/rfp-api";
import {
  listRfpDocuments,
  uploadRfpDocument,
  type CommercialDocumentSummary,
} from "@/lib/commercial-documents-api";
import { getCostSheetByRfp, formatCost, type CostSheetDetail } from "@/lib/costing-api";
import {
  approvalStatusLabel,
  decideCommercialApproval,
  listCommercialApprovals,
  requestCommercialApproval,
  type CommercialApprovalRequest,
} from "@/lib/commercial-approval-api";
import {
  formatProposalValue,
  generateProposal,
  getProposalByRfp,
  PROPOSAL_STATUS_LABELS,
  type ProposalSummary,
} from "@/lib/proposal-api";

const WORKFLOW_ORDER = ["intake", "programme", "costing", "approval", "proposal", "sent"] as const;

function stepState(current: string, step: string): "done" | "active" | "pending" {
  const ci = WORKFLOW_ORDER.indexOf(current as (typeof WORKFLOW_ORDER)[number]);
  const si = WORKFLOW_ORDER.indexOf(step as (typeof WORKFLOW_ORDER)[number]);
  if (si < ci) return "done";
  if (si === ci) return "active";
  return "pending";
}

export default function RfpDetailPage() {
  const params = useParams<{ id: string }>();
  const { token, ready } = useEosSession();
  const [rfp, setRfp] = useState<RfpSummary | null>(null);
  const [versions, setVersions] = useState<RfpVersion[]>([]);
  const [documents, setDocuments] = useState<CommercialDocumentSummary[]>([]);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [costing, setCosting] = useState<CostSheetDetail | null>(null);
  const [approval, setApproval] = useState<CommercialApprovalRequest | null>(null);
  const [proposal, setProposal] = useState<ProposalSummary | null>(null);
  const [orgs, setOrgs] = useState<CrmOrganization[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [deciding, setDeciding] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!token || !params.id) {
      setRfp(null);
      setVersions([]);
      setDocuments([]);
      setDocumentsError(null);
      return;
    }
    setLoading(true);
    setError(null);
    setDocumentsError(null);
    Promise.all([getRfp(token, params.id), listOrganizations(token)])
      .then(async ([detail, orgList]) => {
        setRfp(detail.rfp);
        setVersions(detail.versions);
        setOrgs(orgList.items);
        try {
          const docs = await listRfpDocuments(token, params.id);
          setDocuments(docs.items);
          setDocumentsError(null);
        } catch (err) {
          setDocuments([]);
          if (err instanceof EosApiError && err.status === 401) {
            setDocumentsError("Not authenticated to view documents.");
          } else if (err instanceof EosApiError && err.status === 403) {
            setDocumentsError("Not authorized to view documents.");
          } else {
            setDocumentsError("Failed to load documents.");
          }
        }
        try {
          const sheet = await getCostSheetByRfp(token, params.id);
          setCosting(sheet);
          const approvals = await listCommercialApprovals(token, { rfpId: params.id });
          setApproval(approvals.items[0] ?? null);
          try {
            const prop = await getProposalByRfp(token, params.id);
            setProposal(prop.proposal);
          } catch {
            setProposal(null);
          }
        } catch {
          setCosting(null);
          setApproval(null);
        }
      })
      .catch((err) => {
        setError(err instanceof EosApiError ? err.message : "Failed to load RFP");
        setRfp(null);
      })
      .finally(() => setLoading(false));
  }, [token, params.id]);

  const clientName = useMemo(() => {
    if (!rfp) return "";
    const org = orgs.find((o) => o.id === rfp.organizationId);
    return org?.tradingName ?? org?.legalName ?? "Client";
  }, [rfp, orgs]);

  const steps = WORKFLOW_ORDER.map((key) => ({
    label: RFP_WORKFLOW_LABELS[key] ?? key,
    state: rfp ? stepState(rfp.workflowStage, key) : "pending",
  }));

  async function handleRequestApproval() {
    if (!token || !costing) return;
    setRequesting(true);
    setError(null);
    try {
      const result = await requestCommercialApproval(token, costing.sheet.id);
      setApproval(result.request);
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to request approval");
    } finally {
      setRequesting(false);
    }
  }

  async function handleDecideApproval(outcome: "approved" | "rejected") {
    if (!token || !approval) return;
    setDeciding(true);
    setError(null);
    try {
      const result = await decideCommercialApproval(token, approval.id, outcome);
      setApproval(result.request);
      if (params.id) {
        const detail = await getRfp(token, params.id);
        setRfp(detail.rfp);
      }
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to record finance decision");
    } finally {
      setDeciding(false);
    }
  }

  async function handleGenerateProposal() {
    if (!token || !params.id) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await generateProposal(token, params.id);
      setProposal(result.proposal);
    } catch (err) {
      setError(err instanceof EosApiError ? err.message : "Failed to generate proposal");
    } finally {
      setGenerating(false);
    }
  }

  if (ready && !token) {
    return (
      <p className="text-sm text-muted">
        <Link href="/commercial/rfps" className="text-gold-deep underline">
          ← Back to RFPs
        </Link>
        {" · "}Sign in to view RFP details.
      </p>
    );
  }

  if (loading) {
    return <p className="text-sm text-muted">Loading RFP…</p>;
  }

  if (error || !rfp) {
    return (
      <>
        <Link href="/commercial/rfps" className="text-sm text-gold-deep underline">
          ← Back to RFPs
        </Link>
        <p className="mt-4 text-sm text-red-700">{error ?? "RFP not found"}</p>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={`RFP · ${rfp.rfpCode}`}
        title={`${clientName} — ${rfp.title}`}
        subtitle={`Updated ${new Date(rfp.updatedAt).toLocaleDateString()} · v${rfp.currentVersion}`}
        actions={
          <>
            <Link href="/commercial/rfps">
              <Btn variant="secondary">← All RFPs</Btn>
            </Link>
            <LinkBtn href={`/commercial/programme?rfpId=${rfp.id}`}>Open Programme Builder</LinkBtn>
          </>
        }
      />

      <WorkflowSteps steps={steps} />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Card
            title="RFP Requirements"
            headerExtra={
              <SlaIndicator
                status={slaIndicatorStatus(rfp.slaStatus)}
                label={slaLabel(rfp.slaDueAt, rfp.slaStatus)}
              />
            }
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ["Client", clientName],
                ["Programme Type", rfp.programmeType ?? "—"],
                ["Pax", rfp.paxCount ? `${rfp.paxCount} delegates` : "—"],
                ["Dates", rfp.travelDates ?? "—"],
                ["Destinations", rfp.destinations ?? "—"],
                ["Budget Range", formatBudgetRange(rfp.budgetMin, rfp.budgetMax, rfp.currency)],
              ].map(([label, val]) => (
                <div key={label}>
                  <label className="mb-1 block text-[0.7rem] uppercase tracking-wide text-muted">{label}</label>
                  <div className="font-medium text-ink">{val}</div>
                </div>
              ))}
            </div>
            {rfp.requirementsText && (
              <p className="mt-4 text-sm text-muted">{rfp.requirementsText}</p>
            )}
          </Card>

          <Card title="RFP Documents">
            <ul className="mb-3 space-y-2 text-sm">
              {documentsError && <li className="text-muted">{documentsError}</li>}
              {!documentsError && documents.length === 0 && (
                <li className="text-muted">No documents uploaded yet.</li>
              )}
              {!documentsError &&
                documents.map((doc) => (
                  <li key={doc.id} className="flex justify-between gap-2 border-b border-line py-2">
                    <span className="font-medium text-ink">{doc.filename}</span>
                    <span className="text-muted">
                      {doc.mimeType} · {(doc.sizeBytes / 1024).toFixed(1)} KB
                    </span>
                  </li>
                ))}
            </ul>
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-gold-deep">
              <span>{uploading ? "Uploading…" : "Upload PDF / DOCX / XLSX"}</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.xlsx,application/pdf"
                disabled={uploading || !token}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file || !token || !params.id) return;
                  setUploading(true);
                  setError(null);
                  try {
                    const buf = await file.arrayBuffer();
                    const bytes = new Uint8Array(buf);
                    let binary = "";
                    for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
                    const contentBase64 = btoa(binary);
                    const res = await uploadRfpDocument(token, params.id, {
                      filename: file.name,
                      mimeType: file.type || "application/pdf",
                      contentBase64,
                    });
                    setDocuments((prev) => [res.document, ...prev]);
                    setDocumentsError(null);
                  } catch (err) {
                    setError(err instanceof EosApiError ? err.message : "Upload failed");
                  } finally {
                    setUploading(false);
                  }
                }}
              />
            </label>
          </Card>

          <Card title="Workflow" padding={false}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[0.7rem] uppercase tracking-wide text-muted">
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-line">
                  <td className="px-4 py-3">{RFP_WORKFLOW_LABELS[rfp.workflowStage] ?? rfp.workflowStage}</td>
                  <td className="px-4 py-3">
                    <Badge variant="progress" label={rfp.status} />
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Commercial Summary">
            {costing ? (
              <>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Cost</span>
                    <span>{formatCost(costing.sheet.totalCost, costing.sheet.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sell Price</span>
                    <span>{formatCost(costing.sheet.sellPrice ?? 0, costing.sheet.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Margin</span>
                    <span className={costing.sheet.marginMeetsFloor ? "text-success" : "text-danger"}>
                      {costing.sheet.marginPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-sand">
                    <div
                      className="h-full rounded-full bg-success"
                      style={{ width: `${Math.min(100, costing.sheet.marginPercent)}%` }}
                    />
                  </div>
                  {costing.sheet.perPerson !== undefined && (
                    <div className="flex justify-between border-t-2 border-ink pt-3 text-base font-semibold text-ink">
                      <span>Per Person</span>
                      <span>{formatCost(costing.sheet.perPerson, costing.sheet.currency)}</span>
                    </div>
                  )}
                </div>
                {approval && (
                  <div className="mt-3 rounded-md bg-sand px-3 py-2 text-xs">
                    <div className="font-medium text-ink">{approvalStatusLabel(approval.status)}</div>
                    <div className="text-muted">{approval.gateReason}</div>
                  </div>
                )}
                <Btn
                  variant="gold"
                  className="mt-4 w-full"
                  disabled={!token || !costing.sheet.marginMeetsFloor || approval?.status === "pending" || approval?.status === "approved" || requesting}
                  onClick={() => void handleRequestApproval()}
                >
                  {requesting
                    ? "Submitting…"
                    : approval?.status === "approved"
                      ? "Finance Approved"
                      : approval?.status === "pending"
                        ? "Approval Pending"
                        : "Request Finance Approval"}
                </Btn>
                {approval?.status === "pending" && (
                  <div className="mt-2 flex gap-2">
                    <Btn
                      variant="secondary"
                      className="w-full"
                      disabled={deciding}
                      onClick={() => void handleDecideApproval("approved")}
                    >
                      {deciding ? "Saving…" : "Approve"}
                    </Btn>
                    <Btn
                      variant="ghost"
                      className="w-full"
                      disabled={deciding}
                      onClick={() => void handleDecideApproval("rejected")}
                    >
                      Reject
                    </Btn>
                  </div>
                )}
                {approval?.status === "approved" && !proposal && (
                  <Btn
                    variant="secondary"
                    className="mt-2 w-full"
                    disabled={generating}
                    onClick={() => void handleGenerateProposal()}
                  >
                    {generating ? "Generating…" : "Generate Proposal"}
                  </Btn>
                )}
                {proposal && (
                  <Link href={`/commercial/proposals/${proposal.id}`} className="mt-2 block">
                    <Btn variant="gold" className="w-full">
                      View Proposal · {formatProposalValue(proposal)} · {PROPOSAL_STATUS_LABELS[proposal.status]}
                    </Btn>
                  </Link>
                )}
              </>
            ) : (
              <p className="text-sm text-muted">No cost sheet linked yet.</p>
            )}
          </Card>

          <Card title="Version History">
            {versions.map((v) => (
              <div key={v.id} className="border-b border-line py-3 last:border-0">
                <p className="text-sm">
                  <strong>v{v.versionNumber}</strong> — {v.summary}
                </p>
                <div className="mt-0.5 text-xs text-muted">
                  {new Date(v.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}

function LinkBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="inline-flex items-center rounded-md border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-ink-soft">
      {children}
    </a>
  );
}

function WorkflowSteps({ steps }: { steps: { label: string; state: string }[] }) {
  return (
    <div className="mb-6 flex items-center overflow-x-auto">
      {steps.map((step, i) => (
        <div key={step.label} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold ${
                step.state === "done"
                  ? "border-success bg-success text-white"
                  : step.state === "active"
                    ? "border-gold bg-gold text-ink"
                    : "border-line bg-paper text-muted"
              }`}
            >
              {step.state === "done" ? "✓" : i + 1}
            </div>
            <span className={`max-w-[80px] text-xs ${step.state === "active" ? "font-medium text-ink" : "text-muted"}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`mx-2 h-0.5 w-8 shrink-0 ${step.state === "done" ? "bg-success" : "bg-line"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
