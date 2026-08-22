import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import type { Store } from "../store.js";
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
    const result = dismissNotification(store, principal, key);
    if ("error" in result) return sendError(reply, result);
    return result;
  });

  app.post("/v1/notifications/dismiss-all", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return dismissAllNotifications(store, principal);
  });
}
