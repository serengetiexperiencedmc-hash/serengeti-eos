"use client";

import { useCallback, useEffect, useState } from "react";
import { RateIdentityCommercialFactsPanel } from "@/components/commercial/RateIdentityCommercialFactsPanel";
import { EosApiError } from "@/lib/eos-client";
import {
  buildRateIdentityPutPayload,
  commercialFactsCanWrite,
  draftFromLatestRateIdentity,
  emptyRateIdentityDraft,
  getRateCommercialFacts,
  mapCommercialFactsPutFailure,
  nextRateVersionIdentity,
  putRateCommercialFacts,
  type F2FactsPersistence,
  type RateCommercialFacts,
  type RateIdentityDraft,
} from "@/lib/commercial-facts-api";

export function RateIdentityOverlayHost(props: {
  token: string;
  supplierId: string;
  rateId: string;
}) {
  const [facts, setFacts] = useState<RateCommercialFacts | null>(null);
  const [persistence, setPersistence] = useState<F2FactsPersistence | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [writeForbidden, setWriteForbidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<RateIdentityDraft>(emptyRateIdentityDraft());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setUnauthorized(false);
    try {
      const loaded = await getRateCommercialFacts(props.token, props.supplierId, props.rateId);
      setFacts(loaded);
      setPersistence(loaded.persistence);
      setDraft(draftFromLatestRateIdentity(loaded.identities));
    } catch (err) {
      setFacts(null);
      if (err instanceof EosApiError && err.status === 403) {
        setUnauthorized(true);
        setError("Not authorized to read rate identity overlay.");
      } else if (err instanceof EosApiError && err.status === 401) {
        setError("Sign in to load rate identity overlay.");
      } else {
        setError(err instanceof EosApiError ? err.message : "Failed to load F2 rate identity overlay");
      }
    } finally {
      setLoading(false);
    }
  }, [props.token, props.supplierId, props.rateId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    const versionIdentity = nextRateVersionIdentity(facts?.identities ?? []);
    const built = buildRateIdentityPutPayload(draft, versionIdentity);
    if (!built.ok) {
      setError(built.error);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const result = await putRateCommercialFacts(
        props.token,
        props.supplierId,
        props.rateId,
        built.payload,
      );
      setFacts(result);
      setPersistence(result.persistence);
      setDraft(draftFromLatestRateIdentity(result.identities));
    } catch (err) {
      const mapped = mapCommercialFactsPutFailure(err, "rate_identity");
      setWriteForbidden(mapped.writeForbidden);
      setError(mapped.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-3">
      <RateIdentityCommercialFactsPanel
        facts={facts}
        persistence={persistence}
        loading={loading}
        error={error}
        unauthorized={unauthorized}
        canWrite={commercialFactsCanWrite({
          hasToken: Boolean(props.token),
          factsLoaded: Boolean(facts),
          unauthorizedRead: unauthorized,
          writeForbidden,
        })}
        nextVersionIdentity={nextRateVersionIdentity(facts?.identities ?? [])}
        draft={draft}
        saving={saving}
        onDraftChange={(field, value) => setDraft((current) => ({ ...current, [field]: value }))}
        onSave={() => void save()}
      />
    </div>
  );
}
