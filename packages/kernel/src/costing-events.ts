export const COSTING_EVENT_TYPES = [
  "costing.sheet.created.v1",
  "costing.sheet.recalculated.v1",
  "costing.line_item.added.v1",
  "costing.version.created.v1",
] as const;

export type CostingEventType = (typeof COSTING_EVENT_TYPES)[number];
