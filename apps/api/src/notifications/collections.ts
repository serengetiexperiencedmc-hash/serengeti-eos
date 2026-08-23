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
  if (!store.notifDlqSlaDigestStaleSuppressions) store.notifDlqSlaDigestStaleSuppressions = [];
  if (!store.notifDlqSlaDigestStaleSuppressionAudits) store.notifDlqSlaDigestStaleSuppressionAudits = [];
  if (!store.notifDlqSlaDigestStaleAuditExportLastFilters) {
    store.notifDlqSlaDigestStaleAuditExportLastFilters = [];
  }
  if (!store.notifDlqSlaDigestStaleAuditExportPresets) {
    store.notifDlqSlaDigestStaleAuditExportPresets = [];
  }
  if (!store.notifDlqSlaDigestStaleAuditExportLastPresets) {
    store.notifDlqSlaDigestStaleAuditExportLastPresets = [];
  }
  if (!store.notifDlqSlaDigestStaleAuditExportPresetUsages) {
    store.notifDlqSlaDigestStaleAuditExportPresetUsages = [];
  }
  if (!store.notifAllowlistDualDigestRecipients) store.notifAllowlistDualDigestRecipients = [];
  if (!store.notifAllowlistDualDigestLastRuns) store.notifAllowlistDualDigestLastRuns = [];
  if (!store.notifAllowlistDualDigestStaleSuppressions) store.notifAllowlistDualDigestStaleSuppressions = [];
  if (!store.notifAllowlistDualDigestStaleSuppressionAudits) store.notifAllowlistDualDigestStaleSuppressionAudits = [];
  if (!store.notifAllowlistDualDigestStaleAuditExportLastFilters) {
    store.notifAllowlistDualDigestStaleAuditExportLastFilters = [];
  }
  if (!store.notifAllowlistDualDigestStaleAuditExportPresets) {
    store.notifAllowlistDualDigestStaleAuditExportPresets = [];
  }
  if (!store.notifAllowlistDualDigestStaleAuditExportLastPresets) {
    store.notifAllowlistDualDigestStaleAuditExportLastPresets = [];
  }
  if (!store.notifAllowlistDualDigestStaleAuditExportPresetUsages) {
    store.notifAllowlistDualDigestStaleAuditExportPresetUsages = [];
  }
}
