import type { Store } from "../store.js";

export function ensureNotificationCollections(store: Store): void {
  if (!store.notifDismissals) store.notifDismissals = [];
  if (!store.notifEmailOutbox) store.notifEmailOutbox = [];
  if (!store.notifEmailDeliveryEvents) store.notifEmailDeliveryEvents = [];
  if (!store.notifEmailTemplates) store.notifEmailTemplates = [];
  if (!store.notifEmailSuppressions) store.notifEmailSuppressions = [];
  if (!store.notifEmailAllowlist) store.notifEmailAllowlist = [];
  if (!store.notifDlqSlaDigestRecipients) store.notifDlqSlaDigestRecipients = [];
  if (!store.notifDlqSlaDigestLastRuns) store.notifDlqSlaDigestLastRuns = [];
  if (!store.notifAllowlistDualDigestRecipients) store.notifAllowlistDualDigestRecipients = [];
  if (!store.notifAllowlistDualDigestLastRuns) store.notifAllowlistDualDigestLastRuns = [];
}
