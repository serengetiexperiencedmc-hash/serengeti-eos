import { Btn, Card } from "@/components/commercial/ui";
import {
  persistenceCaption,
  type F2FactsPersistence,
  type ProgrammeCommercialFacts,
} from "@/lib/commercial-facts-api";

export function ProgrammeCommercialFactsPanel(props: {
  facts: ProgrammeCommercialFacts | null;
  persistence?: F2FactsPersistence;
  loading?: boolean;
  error?: string | null;
  unauthorized?: boolean;
  unauthenticated?: boolean;
  canWrite?: boolean;
  draftNote?: string;
  draftVersion?: string;
  saving?: boolean;
  onNoteChange?: (value: string) => void;
  onVersionChange?: (value: string) => void;
  onSave?: () => void;
}) {
  const versions = props.facts?.recordedClientFacingVersionNumbers ?? [];
  return (
    <Card title="F2 programme identity trace">
      {props.unauthenticated && (
        <p className="text-sm text-muted">Sign in to load programme commercial facts.</p>
      )}
      {props.unauthorized && (
        <p className="text-sm text-danger">Not authorized to read programme commercial facts.</p>
      )}
      {props.loading && <p className="text-sm text-muted">Loading F2 programme facts…</p>}
      {props.error && <p className="text-sm text-danger">{props.error}</p>}
      {props.facts && (
        <>
          <p className="mb-3 text-xs text-muted">{persistenceCaption(props.persistence)}</p>
          <p className="mb-3 text-sm text-muted">
            Trace uses explicit mixed foreign keys. Costing totals are not profit. Sell price is not
            revenue. Office documents are not identity.
          </p>
          <dl className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-muted">Programme</dt>
              <dd>{props.facts.programmeCode}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">RFP observed</dt>
              <dd>{props.facts.rfpObserved ? "yes" : "unavailable"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Costing on trace</dt>
              <dd>{props.facts.costingReferencesProgramme ? "observed" : "unavailable"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Proposal on trace</dt>
              <dd>{props.facts.proposalReferencesProgramme ? "observed" : "unavailable"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Observed client-facing version</dt>
              <dd>{props.facts.observedClientFacingVersionNumber ?? "unavailable"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Note</dt>
              <dd>{props.facts.note ?? "not recorded"}</dd>
            </div>
          </dl>
          {props.canWrite && props.onSave && (
            <div className="mt-4 space-y-3 border-t border-line pt-4">
              <label className="block text-sm">
                Operator note
                <input
                  className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-1"
                  value={props.draftNote ?? ""}
                  onChange={(e) => props.onNoteChange?.(e.target.value)}
                />
              </label>
              {versions.length > 0 && (
                <label className="block text-sm">
                  Observed client-facing version (recorded versions only)
                  <select
                    className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-1"
                    value={props.draftVersion ?? ""}
                    onChange={(e) => props.onVersionChange?.(e.target.value)}
                  >
                    <option value="">Do not change observed version</option>
                    {versions.map((n) => (
                      <option key={n} value={String(n)}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <Btn disabled={props.saving} onClick={props.onSave}>
                {props.saving ? "Saving…" : "Save F2 programme facts"}
              </Btn>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
