import {
  authorize,
  buildEmailFromNotification,
  DEFAULT_EMAIL_TEMPLATES,
  isSmtpConfigured,
  isSesConfigured,
  listEmailTemplateKeys,
  newId,
  parseSesConfigFromEnv,
  parseSmtpConfigFromEnv,
  resolveEmailTemplate,
  shouldEmailNotification,
  type EmailNotificationAdapter,
  type EmailNotificationMessage,
  type EmailTemplate,
  type NotifEmailOutboxEntry,
  type Principal,
} from "@sedmc/kernel";
import type { Store } from "../store.js";
import { persistNotifEmailOutbox, persistNotifEmailTemplate } from "../persistence/notifications.js";
import { ensureNotificationCollections } from "./collections.js";
import { buildLiveNotifications } from "./notifications.js";
import { resolveEmailAdapterName } from "./email-config.js";
import { sendViaSmtp } from "./smtp-transport.js";
import { sendViaSes } from "./ses-transport.js";
import { isSnsSignatureVerificationEnabled } from "./sns-signature.js";
import { isSnsAutoConfirmEnabled } from "./sns-subscription.js";
import { isEmailSuppressed } from "./email-suppression.js";

function templateOverrides(store: Store, tenantId: string): EmailTemplate[] {
  return (store.notifEmailTemplates ?? []).filter((t) => t.tenantId === tenantId);
}

async function guardSuppressed(
  store: Store,
  principal: Principal,
  message: EmailNotificationMessage,
  adapter: string,
): Promise<{ status: "skipped"; reason: string } | null> {
  if (!isEmailSuppressed(store, principal.tenantId, message.to)) return null;
  await recordOutboxEntry(store, principal, message, adapter, "failed");
  return { status: "skipped", reason: "suppressed" };
}

async function recordOutboxEntry(
  store: Store,
  principal: Principal,
  message: EmailNotificationMessage,
  adapter: string,
  status: NotifEmailOutboxEntry["status"] = "sent",
  sesMessageId?: string,
) {
  ensureNotificationCollections(store);
  if (!store.notifEmailOutbox) store.notifEmailOutbox = [];

  const now = new Date().toISOString();
  const entry: NotifEmailOutboxEntry = {
    id: newId(),
    tenantId: principal.tenantId,
    principalId: principal.id,
    notificationKey: message.notificationKey,
    to: message.to,
    subject: message.subject,
    bodyText: message.bodyText,
    templateKey: message.templateKey,
    status,
    adapter,
    ...(sesMessageId ? { sesMessageId } : {}),
    sentAt: status === "sent" ? now : undefined,
    createdAt: now,
  };
  store.notifEmailOutbox.push(entry);
  await persistNotifEmailOutbox(store.dbPool, entry);
  return entry;
}

function isDuplicate(store: Store, principal: Principal, notificationKey: string) {
  return store.notifEmailOutbox.some(
    (e) =>
      e.tenantId === principal.tenantId &&
      e.principalId === principal.id &&
      e.notificationKey === notificationKey,
  );
}

export function createDevOutboxEmailAdapter(store: Store, principal: Principal): EmailNotificationAdapter {
  return {
    name: "dev-outbox",
    async send(message: EmailNotificationMessage) {
      if (isDuplicate(store, principal, message.notificationKey)) {
        return { status: "skipped", reason: "already_dispatched" };
      }
      const suppressed = await guardSuppressed(store, principal, message, "dev-outbox");
      if (suppressed) return suppressed;
      await recordOutboxEntry(store, principal, message, "dev-outbox", "sent");
      return { status: "sent" };
    },
  };
}

export function createSmtpStubEmailAdapter(store: Store, principal: Principal): EmailNotificationAdapter {
  return {
    name: "smtp-stub",
    async send(message: EmailNotificationMessage) {
      if (isDuplicate(store, principal, message.notificationKey)) {
        return { status: "skipped", reason: "already_dispatched" };
      }
      const suppressed = await guardSuppressed(store, principal, message, "smtp-stub");
      if (suppressed) return suppressed;
      await recordOutboxEntry(store, principal, message, "smtp-stub", "sent");
      return { status: "sent", reason: "smtp_stub_noop" };
    },
  };
}

export function createSmtpEmailAdapter(store: Store, principal: Principal): EmailNotificationAdapter {
  const config = parseSmtpConfigFromEnv();
  return {
    name: "smtp",
    async send(message: EmailNotificationMessage) {
      if (isDuplicate(store, principal, message.notificationKey)) {
        return { status: "skipped", reason: "already_dispatched" };
      }
      const suppressed = await guardSuppressed(store, principal, message, "smtp");
      if (suppressed) return suppressed;
      if (!config) {
        await recordOutboxEntry(store, principal, message, "smtp", "failed");
        return { status: "skipped", reason: "smtp_not_configured" };
      }
      try {
        await sendViaSmtp(config, message);
        await recordOutboxEntry(store, principal, message, "smtp", "sent");
        return { status: "sent" };
      } catch (err) {
        await recordOutboxEntry(store, principal, message, "smtp", "failed");
        return { status: "skipped", reason: err instanceof Error ? err.message : "smtp_send_failed" };
      }
    },
  };
}

export function createSesStubEmailAdapter(store: Store, principal: Principal): EmailNotificationAdapter {
  return {
    name: "ses-stub",
    async send(message: EmailNotificationMessage) {
      if (isDuplicate(store, principal, message.notificationKey)) {
        return { status: "skipped", reason: "already_dispatched" };
      }
      const suppressed = await guardSuppressed(store, principal, message, "ses-stub");
      if (suppressed) return suppressed;
      await recordOutboxEntry(store, principal, message, "ses-stub", "sent");
      return { status: "sent", reason: "ses_stub_noop" };
    },
  };
}

export function createSesEmailAdapter(store: Store, principal: Principal): EmailNotificationAdapter {
  const config = parseSesConfigFromEnv();
  return {
    name: "ses",
    async send(message: EmailNotificationMessage) {
      if (isDuplicate(store, principal, message.notificationKey)) {
        return { status: "skipped", reason: "already_dispatched" };
      }
      const suppressed = await guardSuppressed(store, principal, message, "ses");
      if (suppressed) return suppressed;
      if (!config) {
        await recordOutboxEntry(store, principal, message, "ses", "failed");
        return { status: "skipped", reason: "ses_not_configured" };
      }
      try {
        const sent = await sendViaSes(config, message, {
          tenantId: principal.tenantId,
          notificationKey: message.notificationKey,
        });
        await recordOutboxEntry(store, principal, message, "ses", "sent", sent.messageId || undefined);
        return { status: "sent" };
      } catch (err) {
        await recordOutboxEntry(store, principal, message, "ses", "failed");
        return { status: "skipped", reason: err instanceof Error ? err.message : "ses_send_failed" };
      }
    },
  };
}

export function createEmailAdapter(store: Store, principal: Principal): EmailNotificationAdapter {
  const name = resolveEmailAdapterName();
  if (name === "ses") return createSesEmailAdapter(store, principal);
  if (name === "ses-stub") return createSesStubEmailAdapter(store, principal);
  if (name === "smtp") return createSmtpEmailAdapter(store, principal);
  if (name === "smtp-stub") return createSmtpStubEmailAdapter(store, principal);
  return createDevOutboxEmailAdapter(store, principal);
}

export async function dispatchEmailDigest(store: Store, principal: Principal) {
  const decision = authorize({ principal, permission: "notification:dispatch:email", action: "dispatch:email_digest" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  if (!principal.email) return { error: "invalid_request" as const, reason: "principal_has_no_email" };

  const adapter = createEmailAdapter(store, principal);
  const overrides = templateOverrides(store, principal.tenantId);
  const items = buildLiveNotifications(store, principal).filter(shouldEmailNotification);

  const dispatched: string[] = [];
  const skipped: { key: string; reason?: string }[] = [];

  for (const item of items) {
    const message = buildEmailFromNotification(item, principal.email, overrides);
    const result = await adapter.send(message);
    if (result.status === "sent") dispatched.push(item.key);
    else skipped.push({ key: item.key, reason: result.reason });
  }

  return { dispatched, skipped, adapter: adapter.name };
}

export function listEmailOutbox(store: Store, principal: Principal) {
  const decision = authorize({ principal, permission: "notification:read:email_outbox", action: "read:email_outbox" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  ensureNotificationCollections(store);
  const items = (store.notifEmailOutbox ?? [])
    .filter((e) => e.tenantId === principal.tenantId && e.principalId === principal.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((e) => ({
      id: e.id,
      notificationKey: e.notificationKey,
      to: e.to,
      subject: e.subject,
      templateKey: e.templateKey,
      status: e.status,
      adapter: e.adapter,
      sentAt: e.sentAt,
      createdAt: e.createdAt,
    }));
  return { items };
}

export function listEmailTemplates(store: Store, principal: Principal) {
  const decision = authorize({ principal, permission: "notification:read:email_outbox", action: "read:email_templates" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const overrides = templateOverrides(store, principal.tenantId);
  const keys = listEmailTemplateKeys(overrides);
  const items = keys.map((key) => {
    const override = overrides.find((t) => t.key === key);
    const defaults = DEFAULT_EMAIL_TEMPLATES.find((t) => t.key === key);
    const source = override ?? defaults;
    return {
      key,
      subject: source?.subject ?? key,
      bodyText: source?.bodyText ?? "",
      source: override ? ("tenant" as const) : ("default" as const),
    };
  });
  return { items, adapter: resolveEmailAdapterName() };
}

export function previewEmailTemplate(
  store: Store,
  principal: Principal,
  templateKey: string,
  sample?: { title?: string; body?: string; href?: string },
) {
  const decision = authorize({ principal, permission: "notification:read:email_outbox", action: "preview:email_template" });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  const resolved = resolveEmailTemplate(
    templateKey,
    {
      severity: "warning",
      title: sample?.title ?? "Sample notification title",
      body: sample?.body ?? "Sample notification body text",
      href: sample?.href ?? "/commercial/notifications",
    },
    templateOverrides(store, principal.tenantId),
  );
  return { preview: resolved };
}

export type UpsertEmailTemplateInput = {
  subject: string;
  bodyText: string;
  bodyHtml?: string;
};

export async function upsertEmailTemplate(
  store: Store,
  principal: Principal,
  templateKey: string,
  input: UpsertEmailTemplateInput,
) {
  const decision = authorize({
    principal,
    permission: "notification:dispatch:email",
    action: "write:email_template",
  });
  if (decision.result === "deny") return { error: "forbidden" as const, reason: decision.reason };

  if (!templateKey.trim() || !input.subject.trim() || !input.bodyText.trim()) {
    return { error: "invalid_request" as const, reason: "template_fields_required" };
  }

  ensureNotificationCollections(store);
  const existingIdx = store.notifEmailTemplates.findIndex(
    (t) => t.tenantId === principal.tenantId && t.key === templateKey,
  );
  const template: EmailTemplate & { tenantId: string } = {
    tenantId: principal.tenantId,
    key: templateKey,
    subject: input.subject.trim(),
    bodyText: input.bodyText.trim(),
    ...(input.bodyHtml !== undefined ? { bodyHtml: input.bodyHtml.trim() } : {}),
  };

  if (existingIdx >= 0) store.notifEmailTemplates[existingIdx] = template;
  else store.notifEmailTemplates.push(template);

  await persistNotifEmailTemplate(store.dbPool, {
    ...template,
    id: newId(),
  });

  return { template: { ...template, source: "tenant" as const } };
}

export function getEmailAdapterHealth(store: Store) {
  ensureNotificationCollections(store);
  const adapter = resolveEmailAdapterName();
  return {
    module: "notification-email",
    increment: "I3.14",
    adapter,
    status: "ok" as const,
    outboxCount: (store.notifEmailOutbox ?? []).length,
    deliveryEventCount: (store.notifEmailDeliveryEvents ?? []).length,
    suppressionCount: (store.notifEmailSuppressions ?? []).filter((s) => !s.liftedAt).length,
    allowlistCount: (store.notifEmailAllowlist ?? []).filter((e) => !e.revokedAt).length,
    templateCount: listEmailTemplateKeys(store.notifEmailTemplates?.map(({ tenantId: _, ...t }) => t) ?? []).length,
    smtpConfigured: isSmtpConfigured(),
    smtpHost: process.env.EOS_SMTP_HOST ?? null,
    sesConfigured: isSesConfigured(),
    sesRegion: process.env.EOS_SES_REGION ?? null,
    sesConfigurationSet: process.env.EOS_SES_CONFIGURATION_SET ?? null,
    webhookSecretConfigured: Boolean(process.env.EOS_SES_WEBHOOK_SECRET),
    snsSignatureVerification: isSnsSignatureVerificationEnabled(),
    snsAutoConfirmSubscription: isSnsAutoConfirmEnabled(),
  };
}

export { resolveEmailAdapterName } from "./email-config.js";
