export const OPS_EVENT_TYPES = [
  "ops.supplier_confirmation.generated.v1",
  "ops.supplier_confirmation.confirmed.v1",
  "ops.supplier_confirmation.declined.v1",
  "ops.manifest.published.v1",
  "ops.brief.issued.v1",
  "ops.assignment.created.v1",
  "ops.field_task.completed.v1",
] as const;

export type OpsEventType = (typeof OPS_EVENT_TYPES)[number];
