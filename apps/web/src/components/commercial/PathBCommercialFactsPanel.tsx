import { Btn, Card } from "@/components/commercial/ui";
import {
  PATH_B_EXCEPTIONAL_APPROVAL_LABELS,
  persistenceCaption,
  type F2FactsPersistence,
  type PathBFacts,
} from "@/lib/commercial-facts-api";

export function PathBCommercialFactsPanel(props: {
  pathB: PathBFacts | null;
  persistence?: F2FactsPersistence;
  loading?: boolean;
  error?: string | null;
  unauthorized?: boolean;
  unauthenticated?: boolean;
  canWrite?: boolean;
  canDecide?: boolean;
  draftCategories: string[];
  draftNotes: string;
  saving?: boolean;
  deciding?: boolean;
  onToggleCategory: (key: string) => void;
  onNotesChange: (value: string) => void;
  onSaveCategories: () => void;
  onDecide: (outcome: "approved" | "rejected") => void;
}) {
  const pending = props.pathB?.required && props.pathB.status === "pending";
  return (
    <Card title="F2 Path B exceptional approval">
      {props.unauthenticated && <p className="text-sm text-muted">Sign in to load Path B.</p>}
      {props.unauthorized && <p className="text-sm text-danger">Not authorized to read Path B.</p>}
      {props.error && !props.unauthorized && !props.unauthenticated && (
        <p className="text-sm text-danger">{props.error}</p>
      )}
      {props.loading && <p className="text-sm text-muted">Loading Path B…</p>}
      {!props.loading && props.pathB && (
        <>
          <p className="mb-4 text-xs text-muted">{persistenceCaption(props.persistence)}</p>
          <p className="mb-4 text-sm text-muted">
            Categories are declared, not inferred from sell price or costing margin. Empty
            categories means Path B is not required.
          </p>
          <dl className="mb-4 grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <div>
              <dt className="text-xs uppercase text-muted">Status</dt>
              <dd>
                {props.pathB.status}
                {props.pathB.required ? " (required)" : " (not required)"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase text-muted">Declared categories</dt>
              <dd>
                {props.pathB.categories.length
                  ? props.pathB.categories
                      .map((key) => PATH_B_EXCEPTIONAL_APPROVAL_LABELS[key] ?? key)
                      .join(", ")
                  : "none"}
              </dd>
            </div>
          </dl>
          {props.canWrite && (
            <div className="space-y-2 border-t border-line pt-4">
              {Object.entries(PATH_B_EXCEPTIONAL_APPROVAL_LABELS).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={props.draftCategories.includes(key)}
                    onChange={() => props.onToggleCategory(key)}
                  />
                  {label}
                </label>
              ))}
              <Btn disabled={props.saving} onClick={props.onSaveCategories}>
                {props.saving ? "Saving…" : "Save Path B categories"}
              </Btn>
            </div>
          )}
          {pending && props.canDecide && (
            <div className="mt-4 space-y-2 border-t border-line pt-4">
              <label className="block text-sm">
                Decision notes
                <input
                  className="mt-1 w-full rounded-md border border-line bg-paper px-2 py-1"
                  value={props.draftNotes}
                  onChange={(e) => props.onNotesChange(e.target.value)}
                />
              </label>
              <div className="flex gap-2">
                <Btn disabled={props.deciding} onClick={() => props.onDecide("approved")}>
                  Approve Path B
                </Btn>
                <Btn
                  variant="secondary"
                  disabled={props.deciding}
                  onClick={() => props.onDecide("rejected")}
                >
                  Reject Path B
                </Btn>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
