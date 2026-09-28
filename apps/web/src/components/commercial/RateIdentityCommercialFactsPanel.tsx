import { Btn, Card } from "@/components/commercial/ui";
import {
  persistenceCaption,
  SUPPLIER_RATE_SOURCE_CLASS_LABELS,
  SUPPLIER_RATE_TYPE_LABELS,
  type F2FactsPersistence,
  type RateCommercialFacts,
  type RateIdentityDraft,
} from "@/lib/commercial-facts-api";

export function RateIdentityCommercialFactsPanel(props: {
  facts: RateCommercialFacts | null;
  persistence?: F2FactsPersistence;
  loading?: boolean;
  error?: string | null;
  unauthorized?: boolean;
  unauthenticated?: boolean;
  canWrite?: boolean;
  nextVersionIdentity: number;
  draft: RateIdentityDraft;
  saving?: boolean;
  onDraftChange: (field: keyof RateIdentityDraft, value: string) => void;
  onSave: () => void;
}) {
  const identities = props.facts?.identities ?? [];
  return (
    <Card title="F2 rate identity overlay (OR-08)">
      {props.unauthenticated && (
        <p className="text-sm text-muted">Sign in to load rate identity overlay.</p>
      )}
      {props.unauthorized && (
        <p className="text-sm text-danger">Not authorized to read rate identity overlay.</p>
      )}
      {props.error && !props.unauthorized && !props.unauthenticated && (
        <p className="text-sm text-danger">{props.error}</p>
      )}
      {props.loading && <p className="text-sm text-muted">Loading F2 rate identity overlay…</p>}
      {!props.loading && props.facts && (
        <>
          <p className="mb-3 text-xs text-muted">{persistenceCaption(props.persistence)}</p>
          <p className="mb-3 text-sm text-muted">
            Overlay identity is distinct from legacy mixed C4 <code>SupRate</code>. Amount is not
            identity. Supplier owns the rate; supplier identity is not the rate identity. Original
            currency is authoritative. FX is not implemented.
          </p>
          <p className="mb-3 text-xs text-muted">
            Unresolved and not implemented here: overlap winner / preferred rate; live-proposal
            freeze; expired-rate live-proposal use; public-for-sale approval; FX conversion;
            overlay-versus-mixed precedence.
          </p>
          {identities.length === 0 ? (
            <p className="mb-3 text-sm text-muted">No F2 overlay versions recorded yet.</p>
          ) : (
            <ul className="mb-4 space-y-3">
              {identities.map((identity) => (
                <li key={identity.identityId} className="rounded-md border border-line bg-ivory p-3 text-sm">
                  <dl className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div>
                      <dt className="text-xs uppercase text-muted">versionIdentity</dt>
                      <dd>{identity.versionIdentity}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-muted">Source class</dt>
                      <dd>{identity.sourceClassLabel}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-muted">OR-08 type</dt>
                      <dd>{identity.rateTypeLabel}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-muted">Supplier ownership</dt>
                      <dd>
                        {identity.supplierCode} · {identity.supplierLegalName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-muted">Original currency</dt>
                      <dd>{identity.originalCurrency}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-muted">Validity observation</dt>
                      <dd>
                        {identity.validFrom} → {identity.validTo} · {identity.validityState}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-muted">Item identity</dt>
                      <dd>{identity.itemIdentity ?? identity.rateCode}</dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-muted">Legacy mixed C4 (not F2)</dt>
                      <dd>
                        {identity.legacyCurrency} {identity.legacyAmount} · {identity.legacyUnitRateType}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          )}
          {props.canWrite && (
            <div className="space-y-3 border-t border-line pt-4">
              <p className="text-xs text-muted">
                Append versionIdentity {props.nextVersionIdentity}. Prior versions are not edited.
              </p>
              <label className="block text-sm">
                Source class
                <select
                  className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-1"
                  value={props.draft.sourceClass}
                  onChange={(e) => props.onDraftChange("sourceClass", e.target.value)}
                >
                  <option value="">Select source class</option>
                  {Object.entries(SUPPLIER_RATE_SOURCE_CLASS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                OR-08 rate type
                <select
                  className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-1"
                  value={props.draft.rateType}
                  onChange={(e) => props.onDraftChange("rateType", e.target.value)}
                >
                  <option value="">Select OR-08 type</option>
                  {Object.entries(SUPPLIER_RATE_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                Original currency
                <input
                  className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-1"
                  value={props.draft.originalCurrency}
                  onChange={(e) => props.onDraftChange("originalCurrency", e.target.value.toUpperCase())}
                  maxLength={3}
                />
              </label>
              <label className="block text-sm">
                Valid from
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-1"
                  value={props.draft.validFrom}
                  onChange={(e) => props.onDraftChange("validFrom", e.target.value)}
                />
              </label>
              <label className="block text-sm">
                Valid to
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-1"
                  value={props.draft.validTo}
                  onChange={(e) => props.onDraftChange("validTo", e.target.value)}
                />
              </label>
              <label className="block text-sm">
                Season label (optional)
                <input
                  className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-1"
                  value={props.draft.seasonLabel}
                  onChange={(e) => props.onDraftChange("seasonLabel", e.target.value)}
                />
              </label>
              <label className="block text-sm">
                Item identity (optional)
                <input
                  className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-1"
                  value={props.draft.itemIdentity}
                  onChange={(e) => props.onDraftChange("itemIdentity", e.target.value)}
                />
              </label>
              <Btn disabled={props.saving} onClick={props.onSave}>
                {props.saving ? "Saving…" : "Append F2 rate identity version"}
              </Btn>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
