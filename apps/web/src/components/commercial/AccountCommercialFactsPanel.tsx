import { Btn, Card } from "@/components/commercial/ui";
import {
  COMMERCIAL_ACCOUNT_TYPE_LABELS,
  COMMERCIAL_MARKET_LABELS,
  persistenceCaption,
  type AccountCommercialFacts,
  type F2FactsPersistence,
} from "@/lib/commercial-facts-api";

export function AccountCommercialFactsPanel(props: {
  facts: AccountCommercialFacts | null;
  persistence?: F2FactsPersistence;
  loading?: boolean;
  error?: string | null;
  unauthorized?: boolean;
  unauthenticated?: boolean;
  canWrite?: boolean;
  draftType: string;
  draftMarket: string;
  saving?: boolean;
  onTypeChange: (value: string) => void;
  onMarketChange: (value: string) => void;
  onSave: () => void;
}) {
  return (
    <Card title="F2 account facts (OR-03 / OR-03-M)">
      {props.unauthenticated && (
        <p className="text-sm text-muted">Sign in to load account commercial facts.</p>
      )}
      {props.unauthorized && (
        <p className="text-sm text-danger">Not authorized to read account commercial facts.</p>
      )}
      {props.error && !props.unauthorized && !props.unauthenticated && (
        <p className="text-sm text-danger">{props.error}</p>
      )}
      {props.loading && <p className="text-sm text-muted">Loading F2 account facts…</p>}
      {!props.loading && props.facts && (
        <>
          <p className="mb-4 text-xs text-muted">{persistenceCaption(props.persistence)}</p>
          <p className="mb-4 text-sm text-muted">
            Account type is independent of market. Market is independent of account type. Names,
            telephone numbers, and email addresses are not used to infer either catalogue.
          </p>
          <dl className="mb-4 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-muted">Account</dt>
              <dd>{props.facts.accountName}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Account type</dt>
              <dd>{props.facts.accountTypeLabel ?? "not recorded"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Market</dt>
              <dd>{props.facts.marketLabel ?? "not recorded"}</dd>
            </div>
          </dl>
          {props.canWrite && (
            <div className="space-y-3 border-t border-line pt-4">
              <label className="block text-sm">
                Account type
                <select
                  className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-1"
                  value={props.draftType}
                  onChange={(e) => props.onTypeChange(e.target.value)}
                >
                  <option value="">Select account type</option>
                  {Object.entries(COMMERCIAL_ACCOUNT_TYPE_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                Market
                <select
                  className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-1"
                  value={props.draftMarket}
                  onChange={(e) => props.onMarketChange(e.target.value)}
                >
                  <option value="">Select market</option>
                  {Object.entries(COMMERCIAL_MARKET_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <Btn disabled={props.saving} onClick={props.onSave}>
                {props.saving ? "Saving…" : "Save F2 account facts"}
              </Btn>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
