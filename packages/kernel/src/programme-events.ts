export const PROGRAMME_EVENT_TYPES = [
  "programme.created.v1",
  "programme.updated.v1",
  "programme.day.added.v1",
  "programme.item.added.v1",
] as const;

export type ProgrammeEventType = (typeof PROGRAMME_EVENT_TYPES)[number];
