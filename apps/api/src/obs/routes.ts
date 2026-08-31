import type { FastifyInstance, FastifyRequest } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  getObservabilityHealth,
  getObservabilityMap,
  listObservabilityTraces,
  recordHttpSpan,
  type ProbeSnapshot,
} from "./service.js";

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

async function probesFromReady(
  dbHealth?: () => Promise<{ ok: boolean; error?: string }>,
): Promise<ProbeSnapshot> {
  const db = dbHealth ? await dbHealth() : { ok: true };
  const snapshot: ProbeSnapshot = {
    api: "ok",
    web: "unknown",
    oltp: db.ok ? "ok" : "unavailable",
  };
  return snapshot;
}

export function registerObsRoutes(
  app: FastifyInstance,
  store: Store,
  dbHealth?: () => Promise<{ ok: boolean; error?: string }>,
): void {
  app.addHook("onResponse", async (req, reply) => {
    const started = (req as FastifyRequest & { eosStartedAt?: number }).eosStartedAt ?? Date.now();
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    const route = req.routeOptions?.url ?? req.url;
    recordHttpSpan(store, {
      correlationId: getCorrelationId(req),
      method: req.method,
      route,
      statusCode: reply.statusCode,
      durationMs: Date.now() - started,
      startTime: new Date(started).toISOString(),
      ...(principal ? { tenantId: principal.tenantId } : {}),
    });
  });

  app.addHook("onRequest", async (req) => {
    (req as FastifyRequest & { eosStartedAt: number }).eosStartedAt = Date.now();
  });

  app.get("/v1/observability/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getObservabilityHealth(store, principal, await probesFromReady(dbHealth));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/observability/map", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getObservabilityMap(
      store,
      principal,
      await probesFromReady(dbHealth),
      req.query as { lifecycle?: string },
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/observability/traces", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listObservabilityTraces(store, principal, req.query as { limit?: string });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });
}
