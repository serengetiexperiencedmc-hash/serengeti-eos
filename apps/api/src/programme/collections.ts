import type { Store } from "../store.js";

export function ensureProgrammeCollections(store: Store): void {
  if (!store.prgProgrammes) store.prgProgrammes = [];
  if (!store.prgDays) store.prgDays = [];
  if (!store.prgItems) store.prgItems = [];
  if (!store.prgProgrammeVersions) store.prgProgrammeVersions = [];
}
