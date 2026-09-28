"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { OpportunityCommercialFactsPanel } from "@/components/commercial/OpportunityCommercialFactsPanel";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, Card, PageHeader } from "@/components/commercial/ui";
import { listOrganizations } from "@/lib/crm-api";
import { EosApiError } from "@/lib/eos-client";
import {
  commercialFactsCanWrite,
  getOpportunityCommercialFacts,
  mapCommercialFactsPutFailure,
  putOpportunityCommercialFacts,
  QUALIFICATION_CONDITION_LABELS,
  type F2FactsPersistence,
  type OpportunityCommercialFacts,
} from "@/lib/commercial-facts-api";
import { getOpportunity, type PipelineOpportunity } from "@/lib/pipeline-api";
import { listRfps, type RfpSummary } from "@/lib/rfp-api";

function emptyConditions(): Record<string, boolean> {
  return Object.fromEntries(Object.keys(QUALIFICATION_CONDITION_LABELS).map((key) => [key, false]));
}

export default function OpportunityDetailPage() {
  const params = useParams<{ id: string }>();
  const { token, ready } = useEosSession();
  const [opportunity, setOpportunity] = useState<PipelineOpportunity | null>(null);
  const [facts, setFacts] = useState<OpportunityCommercialFacts | null>(null);
  const [persistence, setPersistence] = useState<F2FactsPersistence | undefined>();
  const [rfps, setRfps] = useState<RfpSummary[]>([]);
  const [orgName, setOrgName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [factsError, setFactsError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [writeForbidden, setWriteForbidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftStatus, setDraftStatus] = useState("not_yet_assessed");
  const [draftConditions, setDraftConditions] = useState<Record<string, boolean>>(emptyConditions);
  const [draftNextAction, setDraftNextAction] = useState("");

  const load = useCallback(async () => {
    if (!token || !params.id) {
      setOpportunity(null);
      setFacts(null);
      return;
    }
    setLoading(true);
    setError(null);
    setFactsError(null);
    setUnauthorized(false);
    setWriteForbidden(false);
    try {
      const detail = await getOpportunity(token, params.id);
      setOpportunity(detail.opportunity);
      try {
        const orgs = await listOrganizations(token);
        const match = orgs.items.find((org) => org.id === detail.opportunity.organizationId);
        setOrgName(match?.tradingName ?? match?.legalName ?? null);
      } catch {
        setOrgName(null);
      }
      try {
        const listed = await listRfps(token);
        setRfps(listed.items.filter((rfp) => rfp.opportunityId === params.id));
      } catch {
        setRfps([]);
      }
      try {
        const commercial = await getOpportunityCommercialFacts(token, params.id);
        setFacts(commercial.facts);
        setPersistence(commercial.persistence);
        setDraftStatus(commercial.facts.qualificationStatus);
        setDraftConditions({ ...emptyConditions(), ...commercial.facts.qualificationConditions });
        setDraftNextAction(commercial.facts.nextAction?.description ?? "");
      } catch (err) {
        setFacts(null);
        setPersistence(undefined);
        if (err instanceof EosApiError && err.status === 403) {
          setUnauthorized(true);
          setFactsError("Not authorized to read opportunity commercial facts.");
        } else {
          setFactsError(err instanceof EosApiError ? err.message : "Failed to load F2 commercial facts");
        }
      }
    } catch (err) {
      setOpportunity(null);
      setFacts(null);
      if (err instanceof EosApiError && err.status === 403) {
        setUnauthorized(true);
        setError("Not authorized to read this opportunity.");
      } else {
        setError(err instanceof EosApiError ? err.message : "Failed to load opportunity");
      }
    } finally {
      setLoading(false);
    }
  }, [token, params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveFacts() {
    if (!token || !params.id) return;
    setSaving(true);
    setFactsError(null);
    try {
      const saved = await putOpportunityCommercialFacts(token, params.id, {
        qualificationStatus: draftStatus,
        qualificationConditions: draftConditions,
        ...(draftNextAction.trim() ? { nextAction: { description: draftNextAction.trim() } } : {}),
      });
      setFacts(saved.facts);
      setPersistence(saved.persistence);
      setWriteForbidden(false);
    } catch (err) {
      const failure = mapCommercialFactsPutFailure(err, "opportunity");
      setFactsError(failure.message);
      if (failure.writeForbidden) setWriteForbidden(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Sales Pipeline"
        title={opportunity?.title ?? "Opportunity"}
        subtitle={
          opportunity
            ? `${opportunity.opportunityCode}${orgName ? ` · ${orgName}` : ""}`
            : token
              ? loading
                ? "Loading opportunity…"
                : "Opportunity not loaded"
              : "Sign in to view opportunity commercial facts"
        }
        actions={
          <Btn variant="secondary" href="/commercial/pipeline">
            Back to pipeline
          </Btn>
        }
      />

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      {opportunity && (
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card title="Identity">
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs uppercase text-muted">Code</dt>
                <dd>{opportunity.opportunityCode}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted">Stage / status</dt>
                <dd>
                  {opportunity.stage} · {opportunity.status}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-muted">Owner</dt>
                <dd className="break-all">{opportunity.ownerPrincipalId}</dd>
              </div>
            </dl>
          </Card>
          <Card title="Related RFPs">
            {rfps.length === 0 ? (
              <p className="text-sm text-muted">No related RFP records in this process.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {rfps.map((rfp) => (
                  <li key={rfp.id}>
                    <Link className="text-gold-deep underline" href={`/commercial/rfps/${rfp.id}`}>
                      {rfp.rfpCode} · {rfp.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Card title="Programme summary">
            <p className="text-sm">{opportunity.programmeSummary ?? "No programme summary recorded on this opportunity."}</p>
          </Card>
        </div>
      )}

      <OpportunityCommercialFactsPanel
        opportunityCode={opportunity?.opportunityCode}
        opportunityTitle={opportunity?.title}
        facts={facts}
        persistence={persistence}
        loading={loading && !facts}
        error={factsError}
        unauthorized={unauthorized}
        unauthenticated={ready && !token}
        canWrite={commercialFactsCanWrite({
          hasToken: Boolean(token),
          factsLoaded: Boolean(facts),
          unauthorizedRead: unauthorized,
          writeForbidden,
        })}
        draftStatus={draftStatus}
        draftConditions={draftConditions}
        draftNextAction={draftNextAction}
        saving={saving}
        onStatusChange={setDraftStatus}
        onConditionToggle={(key) =>
          setDraftConditions((current) => ({ ...current, [key]: !current[key] }))
        }
        onNextActionChange={setDraftNextAction}
        onSave={() => void saveFacts()}
      />
    </>
  );
}
