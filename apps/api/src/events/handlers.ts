import type { EnterpriseEventEnvelope } from "@sedmc/kernel";
import { CRM_EVENT_TYPES } from "@sedmc/kernel";
import type { Store } from "../store.js";

export type EventHandler = (event: EnterpriseEventEnvelope, store: Store) => void;

const handlers = new Map<string, EventHandler>();

handlers.set("platform.ping.v1", (event, store) => {
  if (store.eventMetrics) store.eventMetrics.replays += 0;
  void event.payload.ping;
});

handlers.set(CRM_EVENT_TYPES.ORGANIZATION_CREATED, (event, store) => {
  void store;
  void event.payload.organizationId;
});

handlers.set(CRM_EVENT_TYPES.RECORD_MERGED, (event, store) => {
  void store;
  void event.payload.mergeRecordId;
});

export function getEventHandler(eventType: string): EventHandler | undefined {
  return handlers.get(eventType);
}

export function registerEventHandler(eventType: string, handler: EventHandler): void {
  handlers.set(eventType, handler);
}

export function listRegisteredHandlerEventTypes(): string[] {
  return [...handlers.keys()];
}
