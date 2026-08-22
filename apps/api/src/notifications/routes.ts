import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import type { Store } from "../store.js";
import { dispatchEmailDigest, getEmailAdapterHealth, listEmailOutbox, listEmailTemplates, previewEmailTemplate, upsertEmailTemplate } from "./email.js";
import { handleSesDeliveryWebhook, listEmailDeliveryEvents } from "./ses-webhook.js";
import { liftEmailSuppression, listEmailSuppressions, syncEmailSuppressionsFromSes } from "./email-suppression.js";
import { getEmailDeliveryAnalytics } from "./email-analytics.js";
import { dismissAllNotifications, dismissNotification, getNotificationHealth, listNotifications } from "./notifications.js";

function sendError(
  reply: { code: (n: number) => { send: (b: unknown) => unknown } },
  result: { error: string; reason?: string },
) {
  switch (result.error) {
    case "forbidden":
      return reply.code(403).send(result);
    case "not_found":
      return reply.code(404).send(result);
    default:
      return reply.code(400).send(result);
  }
}

export function registerNotificationRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/notifications/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return getNotificationHealth(store);
  });

  app.get("/v1/notifications", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listNotifications(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/notifications/unread-count", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listNotifications(store, principal);
    if ("error" in result) return sendError(reply, result);
    return { unreadCount: result.unreadCount };
  });

  app.post("/v1/notifications/:key/dismiss", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const key = decodeURIComponent((req.params as { key: string }).key);
    const result = await dismissNotification(store, principal, key);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/notifications/dismiss-all", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return dismissAllNotifications(store, principal);
  });

  app.get("/v1/notifications/email/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return getEmailAdapterHealth(store);
  });

  app.get("/v1/notifications/email/outbox", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listEmailOutbox(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/notifications/email/dispatch-digest", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await dispatchEmailDigest(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/notifications/email/templates", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listEmailTemplates(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/notifications/email/templates/:key/preview", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const templateKey = decodeURIComponent((req.params as { key: string }).key);
    const result = previewEmailTemplate(store, principal, templateKey);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.put("/v1/notifications/email/templates/:key", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const templateKey = decodeURIComponent((req.params as { key: string }).key);
    const body = (req.body ?? {}) as { subject?: string; bodyText?: string; bodyHtml?: string };
    if (!body.subject || !body.bodyText) return reply.code(400).send({ error: "invalid_request" });
    const result = await upsertEmailTemplate(store, principal, templateKey, {
      subject: body.subject,
      bodyText: body.bodyText,
      ...(body.bodyHtml !== undefined ? { bodyHtml: body.bodyHtml } : {}),
    });
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/notifications/email/ses-webhook", async (req, reply) => {
    const secret = req.headers["x-eos-webhook-secret"];
    const result = await handleSesDeliveryWebhook(store, {
      ...(typeof secret === "string" ? { secret } : {}),
      body: req.body,
    });
    if (!result.ok) return reply.code(result.reason === "webhook_unauthorized" ? 401 : 400).send(result);
    return { ...result, increment: "I3.6" };
  });

  app.get("/v1/notifications/email/delivery-events", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { limit?: string };
    const limit = query.limit ? Number(query.limit) : 50;
    return { ...listEmailDeliveryEvents(store, principal.tenantId, limit), increment: "I3.11" };
  });

  app.get("/v1/notifications/email/analytics", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { windowHours?: string };
    const windowHours = query.windowHours ? Number(query.windowHours) : 168;
    const result = getEmailDeliveryAnalytics(store, principal, {
      windowHours: Number.isFinite(windowHours) && windowHours > 0 ? windowHours : 168,
    });
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.get("/v1/notifications/email/suppressions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listEmailSuppressions(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/notifications/email/suppressions/sync", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await syncEmailSuppressionsFromSes(store, principal);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/notifications/email/suppressions/:id/lift", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await liftEmailSuppression(store, principal, (req.params as { id: string }).id);
    if ("error" in result) return sendError(reply, result);
    return result;
  });
}
