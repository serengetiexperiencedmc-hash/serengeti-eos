import { Btn, Card } from "@/components/commercial/ui";
import {
  COMMERCIAL_CHANNEL_LABELS,
  COMMERCIAL_SOURCE_LABELS,
  isControlledDevtestResidue,
  persistenceCaption,
  RFP_CLARIFICATION_EVENT_TYPE_LABELS,
  RFP_CLARIFICATION_STATUS_LABELS,
  type F2FactsPersistence,
  type PathBFacts,
  type RfpCommercialFacts,
  type RfpFactsDraft,
} from "@/lib/commercial-facts-api";

export type RfpCommercialFactsPanelProps = {
  rfpCode?: string;
  rfpTitle?: string;
  facts: RfpCommercialFacts | null;
  pathB: PathBFacts | null;
  persistence?: F2FactsPersistence;
  loading?: boolean;
  error?: string | null;
  unauthorized?: boolean;
  unauthenticated?: boolean;
  canWrite?: boolean;
  draft: RfpFactsDraft;
  saving?: boolean;
  onDraftChange: (patch: Partial<RfpFactsDraft>) => void;
  onSave: () => void;
};

function sourceLabel(key: string | undefined): string {
  if (!key) return "not recorded";
  return COMMERCIAL_SOURCE_LABELS[key] ?? key;
}

function channelLabel(key: string | undefined): string {
  if (!key) return "not recorded";
  return COMMERCIAL_CHANNEL_LABELS[key] ?? key;
}

function timestampCaption(iso: string | undefined, status?: string): string {
  if (!iso) return status === "unavailable" || !status ? "not recorded" : status;
  return iso;
}

export function RfpCommercialFactsPanel(props: RfpCommercialFactsPanelProps) {
  const residue = isControlledDevtestResidue(props.rfpCode, props.rfpTitle);
  const receivedImmutable = Boolean(props.facts?.receivedAt);
  const firstResponseImmutable = Boolean(props.facts?.firstResponseAt);
  return (
    <Card title="F2 RFP facts (source, timestamps, Path B)">
      {residue && (
        <p className="mb-3 rounded-md border border-warning bg-warning-bg px-3 py-2 text-xs text-warning">
          Controlled Dev/Test residue (H91-TEST). This is not live commercial adoption evidence.
        </p>
      )}
      {props.unauthenticated && (
        <p className="text-sm text-muted">Sign in to load RFP commercial facts.</p>
      )}
      {props.unauthorized && (
        <p className="text-sm text-danger">Not authorized to read RFP commercial facts.</p>
      )}
      {props.error && !props.unauthorized && !props.unauthenticated && (
        <p className="text-sm text-danger">{props.error}</p>
      )}
      {props.loading && <p className="text-sm text-muted">Loading F2 RFP facts…</p>}
      {!props.loading && props.facts && (
        <>
          <p className="mb-3 text-xs text-muted">{persistenceCaption(props.persistence)}</p>
          {!props.persistence?.recorded && (
            <p className="mb-3 text-sm text-muted">
              No F2 RFP facts recorded yet. Legacy collapsed source is not F2 SOURCE. SOURCE and CHANNEL
              remain distinct fields. Missing timestamps are not inferred from this page load or from a
              save.
            </p>
          )}
          <dl className="mb-4 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-muted">Primary source (origin)</dt>
              <dd>{sourceLabel(props.facts.primarySource)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Channel (intake path)</dt>
              <dd>{channelLabel(props.facts.channel)}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Received at</dt>
              <dd>
                {timestampCaption(props.facts.receivedAt, props.facts.receivedAtStatus)}
                {receivedImmutable ? " · immutable once observed" : " · editable until recorded"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">First response at</dt>
              <dd>
                {timestampCaption(props.facts.firstResponseAt, props.facts.firstResponseAtStatus)}
                {firstResponseImmutable ? " · immutable once observed" : " · not inferred from a PUT"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Clarification status</dt>
              <dd>
                {RFP_CLARIFICATION_STATUS_LABELS[props.facts.clarificationStatus] ??
                  props.facts.clarificationStatus}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Path B</dt>
              <dd>
                {props.pathB
                  ? `${props.pathB.status}${props.pathB.required ? " (required)" : " (not required)"}`
                  : "unavailable"}
                {props.pathB?.categories?.length ? ` · ${props.pathB.categories.join(", ")}` : ""}
              </dd>
            </div>
          </dl>
          {props.facts.clarificationEvents.length > 0 && (
            <div className="mb-4 text-sm">
              <p className="text-xs uppercase text-muted">Clarification events (recorded)</p>
              <ul className="mt-1 list-disc pl-5">
                {props.facts.clarificationEvents.map((event) => (
                  <li key={event.id}>
                    {event.eventType} at {event.eventAt}
                    {event.note ? ` — ${event.note}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {props.canWrite && (
            <div className="space-y-3 border-t border-line pt-4">
              <p className="text-xs text-muted">
                SOURCE is origin. CHANNEL is intake path. Do not copy one into the other. Timestamps
                require an explicit ISO instant; this form does not stamp now.
              </p>
              <label className="block text-sm">
                Primary source
                <select
                  className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2"
                  value={props.draft.primarySource}
                  onChange={(event) => props.onDraftChange({ primarySource: event.target.value })}
                >
                  <option value="">Not recorded</option>
                  {Object.entries(COMMERCIAL_SOURCE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                Channel
                <select
                  className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2"
                  value={props.draft.channel}
                  onChange={(event) => props.onDraftChange({ channel: event.target.value })}
                >
                  <option value="">Not recorded</option>
                  {Object.entries(COMMERCIAL_CHANNEL_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                Received at (ISO, explicit)
                <input
                  className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2"
                  value={props.draft.receivedAt}
                  disabled={receivedImmutable}
                  onChange={(event) => props.onDraftChange({ receivedAt: event.target.value })}
                  placeholder="2026-09-10T08:00:00.000Z"
                />
              </label>
              <label className="block text-sm">
                First response at (ISO, explicit first-response event)
                <input
                  className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2"
                  value={props.draft.firstResponseAt}
                  disabled={firstResponseImmutable}
                  onChange={(event) => props.onDraftChange({ firstResponseAt: event.target.value })}
                  placeholder="Leave blank unless a first response was recorded"
                />
              </label>
              <label className="block text-sm">
                Clarification status
                <select
                  className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2"
                  value={props.draft.clarificationStatus}
                  onChange={(event) => props.onDraftChange({ clarificationStatus: event.target.value })}
                >
                  {Object.entries(RFP_CLARIFICATION_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <fieldset className="space-y-2">
                <legend className="text-xs uppercase text-muted">Append clarification event (optional)</legend>
                <label className="block text-sm">
                  Event type
                  <select
                    className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2"
                    value={props.draft.clarificationEventType}
                    onChange={(event) =>
                      props.onDraftChange({ clarificationEventType: event.target.value })
                    }
                  >
                    <option value="">Do not append an event</option>
                    {Object.entries(RFP_CLARIFICATION_EVENT_TYPE_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm">
                  Event at (ISO)
                  <input
                    className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2"
                    value={props.draft.clarificationEventAt}
                    onChange={(event) =>
                      props.onDraftChange({ clarificationEventAt: event.target.value })
                    }
                    placeholder="Required only when appending an event"
                  />
                </label>
                <label className="block text-sm">
                  Event note
                  <input
                    className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2"
                    value={props.draft.clarificationEventNote}
                    onChange={(event) =>
                      props.onDraftChange({ clarificationEventNote: event.target.value })
                    }
                  />
                </label>
              </fieldset>
              <Btn type="button" onClick={props.onSave} disabled={props.saving}>
                {props.saving ? "Saving…" : "Save F2 RFP facts"}
              </Btn>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
