import { Btn, Card } from "@/components/commercial/ui";
import {
  isControlledDevtestResidue,
  persistenceCaption,
  QUALIFICATION_CONDITION_LABELS,
  QUALIFICATION_STATUS_LABELS,
  type F2FactsPersistence,
  type OpportunityCommercialFacts,
} from "@/lib/commercial-facts-api";

export type OpportunityCommercialFactsPanelProps = {
  opportunityCode?: string;
  opportunityTitle?: string;
  facts: OpportunityCommercialFacts | null;
  persistence?: F2FactsPersistence;
  loading?: boolean;
  error?: string | null;
  unauthorized?: boolean;
  unauthenticated?: boolean;
  canWrite?: boolean;
  draftStatus: string;
  draftConditions: Record<string, boolean>;
  draftNextAction: string;
  saving?: boolean;
  onStatusChange: (value: string) => void;
  onConditionToggle: (key: string) => void;
  onNextActionChange: (value: string) => void;
  onSave: () => void;
};

export function OpportunityCommercialFactsPanel(props: OpportunityCommercialFactsPanelProps) {
  const residue = isControlledDevtestResidue(props.opportunityCode, props.opportunityTitle);
  return (
    <Card title="F2 commercial facts (OR-01 qualification)">
      {residue && (
        <p className="mb-3 rounded-md border border-warning bg-warning-bg px-3 py-2 text-xs text-warning">
          Controlled Dev/Test residue (H91-TEST). This is not live commercial adoption evidence.
        </p>
      )}
      {props.unauthenticated && (
        <p className="text-sm text-muted">Sign in to load opportunity commercial facts.</p>
      )}
      {props.unauthorized && (
        <p className="text-sm text-danger">Not authorized to read opportunity commercial facts.</p>
      )}
      {props.error && !props.unauthorized && !props.unauthenticated && (
        <p className="text-sm text-danger">{props.error}</p>
      )}
      {props.loading && <p className="text-sm text-muted">Loading F2 commercial facts…</p>}
      {!props.loading && props.facts && (
        <>
          <p className="mb-4 text-xs text-muted">{persistenceCaption(props.persistence)}</p>
          {!props.persistence?.recorded && (
            <p className="mb-4 text-sm text-muted">
              No F2 commercial facts recorded yet. Qualification is independent of workflow stage
              {props.facts.newQualifiedStageIsNotQualification
                ? " — `new_qualified` is not OR-01 qualified."
                : "."}{" "}
              No revenue, profit, FX, or booking values are shown.
            </p>
          )}
          <dl className="mb-4 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-muted">Workflow stage</dt>
              <dd>{props.facts.workflowStage}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">OR-01 qualification</dt>
              <dd>{QUALIFICATION_STATUS_LABELS[props.facts.qualificationStatus] ?? props.facts.qualificationStatus}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Owner</dt>
              <dd className="break-all">{props.facts.ownerPrincipalId}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Follow-up owner</dt>
              <dd className="break-all">{props.facts.followUpOwnerPrincipalId}</dd>
            </div>
            {props.facts.c1Account.linked && (
              <div className="md:col-span-2">
                <dt className="text-xs uppercase text-muted">Linked account (F2 OR-03 / OR-03-M)</dt>
                <dd>
                  {props.facts.c1Account.accountName ?? props.facts.c1Account.accountId}
                  {props.facts.c1Account.accountTypeLabel ? ` · ${props.facts.c1Account.accountTypeLabel}` : ""}
                  {props.facts.c1Account.marketLabel ? ` · ${props.facts.c1Account.marketLabel}` : ""}
                </dd>
              </div>
            )}
            {props.facts.nextAction && (
              <div className="md:col-span-2">
                <dt className="text-xs uppercase text-muted">Recorded next action</dt>
                <dd>{props.facts.nextAction.description}</dd>
              </div>
            )}
          </dl>
          {props.canWrite && (
            <div className="space-y-3 border-t border-line pt-4">
              <label className="block text-sm">
                Qualification status
                <select
                  className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2"
                  value={props.draftStatus}
                  onChange={(event) => props.onStatusChange(event.target.value)}
                >
                  {Object.entries(QUALIFICATION_STATUS_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <fieldset>
                <legend className="mb-2 text-xs uppercase text-muted">OR-01-B conditions</legend>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {Object.keys(QUALIFICATION_CONDITION_LABELS).map((key) => (
                    <label key={key} className="flex items-start gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(props.draftConditions[key])}
                        onChange={() => props.onConditionToggle(key)}
                      />
                      <span>{QUALIFICATION_CONDITION_LABELS[key]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="block text-sm">
                Next action
                <input
                  className="mt-1 w-full rounded-md border border-line bg-paper px-3 py-2"
                  value={props.draftNextAction}
                  onChange={(event) => props.onNextActionChange(event.target.value)}
                  placeholder="Required when marking qualified"
                />
              </label>
              <Btn type="button" onClick={props.onSave} disabled={props.saving}>
                {props.saving ? "Saving…" : "Save F2 facts"}
              </Btn>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
