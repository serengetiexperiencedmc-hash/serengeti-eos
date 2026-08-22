import type { DbPool } from "@sedmc/db";
import type { NotifDismissal, NotifEmailOutboxEntry } from "@sedmc/kernel";
import { insertNotifDismissal, insertNotifEmailOutbox } from "./pg-repository.js";

export async function persistNotifDismissal(
  pool: DbPool | undefined,
  entry: NotifDismissal,
): Promise<void> {
  if (!pool) return;
  await insertNotifDismissal(pool, entry);
}

export async function persistNotifEmailOutbox(
  pool: DbPool | undefined,
  entry: NotifEmailOutboxEntry,
): Promise<void> {
  if (!pool) return;
  await insertNotifEmailOutbox(pool, entry);
}
