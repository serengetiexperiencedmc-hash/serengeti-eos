"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AccountCommercialFactsPanel } from "@/components/commercial/AccountCommercialFactsPanel";
import { useEosSession } from "@/components/commercial/EosSessionProvider";
import { Btn, PageHeader } from "@/components/commercial/ui";
import { getAccount, type CrmAccount } from "@/lib/crm-api";
import { EosApiError } from "@/lib/eos-client";
import {
  commercialFactsCanWrite,
  getAccountCommercialFacts,
  mapCommercialFactsPutFailure,
  putAccountCommercialFacts,
  type AccountCommercialFacts,
  type F2FactsPersistence,
} from "@/lib/commercial-facts-api";

export default function AccountDetailPage() {
  const params = useParams<{ id: string }>();
  const { token, ready } = useEosSession();
  const [account, setAccount] = useState<CrmAccount | null>(null);
  const [facts, setFacts] = useState<AccountCommercialFacts | null>(null);
  const [persistence, setPersistence] = useState<F2FactsPersistence | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [factsError, setFactsError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [writeForbidden, setWriteForbidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftType, setDraftType] = useState("");
  const [draftMarket, setDraftMarket] = useState("");

  const load = useCallback(async () => {
    if (!token || !params.id) {
      setAccount(null);
      setFacts(null);
      return;
    }
    setLoading(true);
    setError(null);
    setFactsError(null);
    setUnauthorized(false);
    try {
      const loaded = await getAccount(token, params.id);
      setAccount(loaded.account);
      try {
        const commercial = await getAccountCommercialFacts(token, params.id);
        setFacts(commercial.facts);
        setPersistence(commercial.persistence);
        setDraftType(commercial.facts.accountType ?? "");
        setDraftMarket(commercial.facts.market ?? "");
      } catch (err) {
        setFacts(null);
        if (err instanceof EosApiError && err.status === 403) {
          setUnauthorized(true);
          setFactsError("Not authorized to read account commercial facts.");
        } else if (err instanceof EosApiError && err.status === 401) {
          setFactsError("Sign in to load account commercial facts.");
        } else {
          setFactsError(err instanceof EosApiError ? err.message : "Failed to load F2 account facts");
        }
      }
    } catch (err) {
      setAccount(null);
      setError(err instanceof EosApiError ? err.message : "Failed to load account");
    } finally {
      setLoading(false);
    }
  }, [token, params.id]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save() {
    if (!token || !params.id) return;
    setSaving(true);
    setFactsError(null);
    try {
      const payload: { accountType?: string; market?: string } = {};
      if (draftType) payload.accountType = draftType;
      if (draftMarket) payload.market = draftMarket;
      const result = await putAccountCommercialFacts(token, params.id, payload);
      setFacts(result.facts);
      setPersistence(result.persistence);
    } catch (err) {
      const mapped = mapCommercialFactsPutFailure(err, "account");
      setWriteForbidden(mapped.writeForbidden);
      setFactsError(mapped.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="CRM account"
        title={account?.accountName ?? (loading ? "Loading…" : "Account")}
        subtitle="F2 account type and market. Not a G-08-B admin console."
        actions={
          <Link href="/commercial/crm">
            <Btn variant="secondary">← CRM</Btn>
          </Link>
        }
      />
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      {ready && !token && <p className="mb-4 text-sm text-muted">Sign in to load this account.</p>}
      <AccountCommercialFactsPanel
        facts={facts}
        persistence={persistence}
        loading={loading}
        error={factsError}
        unauthorized={unauthorized}
        unauthenticated={ready && !token}
        canWrite={commercialFactsCanWrite({
          hasToken: Boolean(token),
          factsLoaded: Boolean(facts),
          unauthorizedRead: unauthorized,
          writeForbidden,
        })}
        draftType={draftType}
        draftMarket={draftMarket}
        saving={saving}
        onTypeChange={setDraftType}
        onMarketChange={setDraftMarket}
        onSave={() => void save()}
      />
    </>
  );
}
