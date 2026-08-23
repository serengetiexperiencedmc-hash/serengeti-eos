import Fastify from "fastify";
import {
  approveConfig,
  createCostCenter,
  createLocation,
  createOrgUnit,
  createPayment,
  createPrincipal,
  decideApproval,
  draftConfig,
  getConfig,
  getPayment,
  grantRole,
  listAudit,
  listConfigHistory,
  listLocations,
  listOrganisations,
  listOrgUnits,
  listPrincipalsAdmin,
  listRoles,
  listSessions,
  listSodRules,
  login,
  principalFromAuthHeader,
  revokeSession,
  rollbackConfig,
  seedStore,
  setPrincipalStatus,
  verifyChain,
  type Store,
  addWorkflowVersion,
  approveRule,
  cancelWorkflowInstance,
  completeWorkflowTask,
  createRule,
  createWorkflowDefinition,
  publishWorkflowVersion,
  setWorkflowTelemetry,
  simulateRuleVersion,
  simulateWorkflowPath,
  startWorkflowInstance,
  executeReplayRequest,
  getEventInfrastructureHealth,
  getEventOperationsView,
  listConsumerProcessedEvents,
  listDeadLetters,
  publishPendingOutbox,
  registerEventType,
  replayEventsToConsumer,
  requestReplay,
  assignDeadLetterOwner,
  bulkAssignDeadLetterOwners,
  updateDeadLetterRemediation,
  acknowledgeDeadLetterSla,
  snoozeDeadLetterSla,
  clearDeadLetterSlaSuppression,
  traceEventCorrelation,
} from "./app.js";
import { listNatsConsumerOffsets, replayNatsStreamFromSeq } from "./events/nats-replay.js";
import { getNatsConsumerLagMetrics } from "./events/nats-lag.js";
import { registerCrmRoutes } from "./crm/routes.js";
import { registerPipelineRoutes } from "./pipeline/routes.js";
import { registerAnalyticsRoutes } from "./analytics/routes.js";
import { registerBookingRoutes } from "./booking/routes.js";
import { registerCommercialApprovalRoutes } from "./commercial-approval/routes.js";
import { registerCostingRoutes } from "./costing/routes.js";
import { registerProgrammeRoutes } from "./programme/routes.js";
import { registerFinanceRoutes } from "./finance/routes.js";
import { registerNotificationRoutes } from "./notifications/routes.js";
import { registerOpsRoutes } from "./ops/routes.js";
import { registerProposalRoutes } from "./proposal/routes.js";
import { registerRfpRoutes } from "./rfp/routes.js";
import { registerSupplierRoutes } from "./supplier/routes.js";
import type { EventCatalogueEntry } from "@sedmc/kernel";
import {
  createLogger,
  getCorrelationId,
  getRequestLog,
  registerObservability,
  setCorrelationHeader,
  type Logger,
} from "./observability.js";

const VERSION = "0.66.0-pg28-i3.28-i4.26";

export type ServerOptions = {
  store?: Store;
  logger?: Logger;
  dbHealth?: () => Promise<{ ok: boolean; error?: string }>;
};

export function buildServer(options: ServerOptions | Store = {}) {
  const opts: ServerOptions =
    options && "tenants" in options ? { store: options as Store } : (options as ServerOptions);
  const store = opts.store ?? seedStore(process.env.EOS_TOKEN_SECRET ?? "dev-only-change-me");
  const logger = opts.logger ?? createLogger((process.env.EOS_LOG_LEVEL as "info") ?? "info");
  const app = Fastify({ logger: false });
  registerObservability(app, logger);
  setWorkflowTelemetry((t) => logger.info(t.event, t.fields ?? {}));

  const health = {
    status: "ok",
    service: "sedmc-eos-api",
    version: VERSION,
    increment: "I9.2-encrypted-field-cache",
    productionReady: false as const,
  };

  registerCrmRoutes(app, store);
  registerSupplierRoutes(app, store);
  registerPipelineRoutes(app, store);
  registerRfpRoutes(app, store);
  registerProgrammeRoutes(app, store);
  registerCostingRoutes(app, store);
  registerCommercialApprovalRoutes(app, store);
  registerProposalRoutes(app, store);
  registerBookingRoutes(app, store);
  registerOpsRoutes(app, store);
  registerFinanceRoutes(app, store);
  registerNotificationRoutes(app, store);
  registerAnalyticsRoutes(app, store);

  app.get("/health", async (_req, reply) => {
    setCorrelationHeader(reply, crypto.randomUUID());
    return health;
  });

  app.get("/ready", async (req, reply) => {
    const correlationId = getCorrelationId(req);
    setCorrelationHeader(reply, correlationId);
    const db = opts.dbHealth ? await opts.dbHealth() : { ok: true, mode: "memory" as const };
    const events = getEventInfrastructureHealth(store);
    const applicationReady = db.ok;
    const payload = {
      ...health,
      applicationReady,
      eventInfrastructureReady: events.eventInfrastructureReady,
      database: db,
      events,
    };
    if (!applicationReady) {
      getRequestLog(req).error("readiness_db_failed", { error: "error" in db ? db.error : "unknown" });
      return reply.code(503).send({ ...payload, status: "not_ready" });
    }
    return payload;
  });

  const requirePrincipal = (req: { headers: { authorization?: string } }, reply: { code: (n: number) => { send: (b: unknown) => unknown } }) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) {
      getRequestLog(req as never).warn("authn_failed", { reason: "unauthenticated" });
      reply.code(401).send({ error: "unauthenticated" });
      return undefined;
    }
    return principal;
  };
  void requirePrincipal;

  app.post("/v1/auth/login", async (req, reply) => {
    const correlationId = getCorrelationId(req);
    setCorrelationHeader(reply, correlationId);
    const body = (req.body ?? {}) as { email?: string; password?: string; tenantSlug?: string };
    if (!body.email || !body.password || !body.tenantSlug) {
      return reply.code(400).send({ error: "invalid_request" });
    }
    const result = await login(store, {
      email: body.email,
      password: body.password,
      tenantSlug: body.tenantSlug,
    });
    if ("error" in result) {
      getRequestLog(req).warn("authentication_failed", {
        email: body.email,
        tenantSlug: body.tenantSlug,
        reason: result.error,
      });
      return reply.code(401).send({ error: result.error });
    }
    getRequestLog(req).info("authentication_succeeded", {
      principalId: result.principal.id,
      actorType: result.principal.actorType,
      tenantId: result.principal.tenantId,
    });
    return {
      accessToken: result.token,
      expiresIn: 3600,
      expiresInSeconds: 3600,
      principal: {
        id: result.principal.id,
        tenantId: result.principal.tenantId,
        actorType: result.principal.actorType,
        displayName: result.principal.displayName,
        email: result.principal.email,
        roles: result.principal.roles,
      },
    };
  });

  app.get("/v1/me", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    return {
      id: principal.id,
      tenantId: principal.tenantId,
      actorType: principal.actorType,
      displayName: principal.displayName,
      email: principal.email,
      roles: principal.roles,
    };
  });

  app.get("/v1/organisations", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listOrganisations(store, principal);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.get("/v1/org-units", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listOrgUnits(store, principal);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.post("/v1/org-units", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as {
      organisationId?: string;
      code?: string;
      name?: string;
      departmentKey?: string;
      unitType?: "business_unit" | "department" | "team" | "desk";
      parentId?: string;
      locationId?: string;
      costCenterId?: string;
    };
    if (!body.organisationId || !body.code || !body.name || !body.departmentKey || !body.unitType) {
      return reply.code(400).send({ error: "invalid_request" });
    }
    const result = createOrgUnit(store, principal, body as Required<typeof body>, getCorrelationId(req));
    if ("error" in result && result.error === "forbidden") return reply.code(403).send(result);
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result) return reply.code(409).send(result);
    return reply.code(201).send(result);
  });

  app.get("/v1/locations", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listLocations(store, principal);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.post("/v1/locations", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as { code?: string; name?: string; countryCode?: string; city?: string };
    if (!body.code || !body.name) return reply.code(400).send({ error: "invalid_request" });
    const result = createLocation(store, principal, body as { code: string; name: string }, getCorrelationId(req));
    if ("error" in result && result.error === "forbidden") return reply.code(403).send(result);
    if ("error" in result) return reply.code(409).send(result);
    return reply.code(201).send(result);
  });

  app.post("/v1/cost-centers", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as { code?: string; name?: string };
    if (!body.code || !body.name) return reply.code(400).send({ error: "invalid_request" });
    const result = createCostCenter(store, principal, { code: body.code, name: body.name }, getCorrelationId(req));
    if ("error" in result && result.error === "forbidden") return reply.code(403).send(result);
    if ("error" in result) return reply.code(409).send(result);
    return reply.code(201).send(result);
  });

  app.get("/v1/principals", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listPrincipalsAdmin(store, principal);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.post("/v1/principals", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as {
      actorType?: "Human" | "Service" | "AiAgent";
      email?: string;
      displayName?: string;
      orgUnitId?: string;
      classificationClearance?: "Public" | "Internal" | "Confidential" | "Restricted" | "HighlyRestricted";
      attributes?: Record<string, string>;
    };
    if (!body.actorType || !body.displayName || !body.classificationClearance) {
      return reply.code(400).send({ error: "invalid_request" });
    }
    const result = createPrincipal(
      store,
      principal,
      {
        actorType: body.actorType,
        ...(body.email !== undefined ? { email: body.email } : {}),
        displayName: body.displayName,
        ...(body.orgUnitId !== undefined ? { orgUnitId: body.orgUnitId } : {}),
        classificationClearance: body.classificationClearance,
        ...(body.attributes !== undefined ? { attributes: body.attributes } : {}),
      },
      getCorrelationId(req),
    );
    if ("error" in result) return reply.code(403).send(result);
    return reply.code(201).send(result);
  });

  app.post("/v1/principals/:id/status", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const body = (req.body ?? {}) as { status?: "active" | "suspended" | "deprovisioned" };
    if (!body.status) return reply.code(400).send({ error: "invalid_request" });
    const result = setPrincipalStatus(store, principal, id, body.status, getCorrelationId(req));
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.get("/v1/roles", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listRoles(store, principal);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.post("/v1/role-grants", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as {
      principalId?: string;
      roleKey?: string;
      scopeOrgUnitId?: string;
      expiresAt?: string;
    };
    if (!body.principalId || !body.roleKey) return reply.code(400).send({ error: "invalid_request" });
    const result = grantRole(
      store,
      principal,
      {
        principalId: body.principalId,
        roleKey: body.roleKey,
        ...(body.scopeOrgUnitId !== undefined ? { scopeOrgUnitId: body.scopeOrgUnitId } : {}),
        ...(body.expiresAt !== undefined ? { expiresAt: body.expiresAt } : {}),
      },
      getCorrelationId(req),
    );
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result) return reply.code(403).send(result);
    return reply.code(201).send(result);
  });

  app.get("/v1/sod-rules", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listSodRules(store, principal);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.post("/v1/config/:key/drafts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { key } = req.params as { key: string };
    const body = (req.body ?? {}) as { value?: unknown; effectiveFrom?: string };
    if (body.value === undefined) return reply.code(400).send({ error: "invalid_request" });
    const result = draftConfig(
      store,
      principal,
      {
        key,
        value: body.value,
        ...(body.effectiveFrom !== undefined ? { effectiveFrom: body.effectiveFrom } : {}),
      },
      getCorrelationId(req),
    );
    if ("error" in result) return reply.code(403).send(result);
    return reply.code(201).send(result);
  });

  app.post("/v1/config/versions/:id/approve", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = approveConfig(store, principal, id, getCorrelationId(req));
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result && result.error === "conflict") return reply.code(409).send(result);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.post("/v1/config/:key/rollback", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { key } = req.params as { key: string };
    const body = (req.body ?? {}) as { toVersion?: number };
    if (typeof body.toVersion !== "number") return reply.code(400).send({ error: "invalid_request" });
    const result = rollbackConfig(store, principal, { key, toVersion: body.toVersion }, getCorrelationId(req));
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result) return reply.code(403).send(result);
    return reply.code(201).send(result);
  });

  app.get("/v1/config/:key/history", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { key } = req.params as { key: string };
    const result = listConfigHistory(store, principal, key);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.get("/v1/principals/:id/sessions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = listSessions(store, principal, id);
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.post("/v1/sessions/:id/revoke", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = revokeSession(store, principal, id, getCorrelationId(req));
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.post("/v1/payments", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as { amount?: number; currency?: string; beneficiary?: string };
    if (typeof body.amount !== "number" || !body.currency || !body.beneficiary) {
      return reply.code(400).send({ error: "invalid_request" });
    }
    const result = createPayment(
      store,
      principal,
      { amount: body.amount, currency: body.currency, beneficiary: body.beneficiary },
      getCorrelationId(req),
    );
    if ("error" in result) return reply.code(403).send(result);
    return reply.code(201).send(result);
  });

  app.get("/v1/payments/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = getPayment(store, principal, id);
    if ("error" in result) return reply.code(404).send({ error: "not_found" });
    return result;
  });

  app.post("/v1/approvals/:id/decision", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const body = (req.body ?? {}) as { outcome?: string; reason?: string };
    if (body.outcome !== "approved" && body.outcome !== "rejected") {
      return reply.code(400).send({ error: "invalid_request" });
    }
    const result = decideApproval(store, principal, id, body.outcome, getCorrelationId(req));
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.get("/v1/audit-events", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listAudit(store, principal);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.get("/v1/audit-events/verify", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = verifyChain(store, principal);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.get("/v1/config/:key", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { key } = req.params as { key: string };
    const result = getConfig(store, principal, key);
    if ("error" in result && result.error === "forbidden") return reply.code(403).send(result);
    if ("error" in result) return reply.code(404).send(result);
    return result;
  });

  app.post("/v1/workflows/definitions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as { key?: string; name?: string };
    if (!body.key || !body.name) return reply.code(400).send({ error: "invalid_request" });
    const result = createWorkflowDefinition(store, principal, { key: body.key, name: body.name }, getCorrelationId(req));
    if ("error" in result && result.error === "forbidden") return reply.code(403).send(result);
    if ("error" in result) return reply.code(409).send(result);
    return reply.code(201).send(result);
  });

  app.post("/v1/workflows/definitions/:id/versions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const body = (req.body ?? {}) as { graph?: Parameters<typeof addWorkflowVersion>[3] };
    if (!body.graph) return reply.code(400).send({ error: "invalid_request" });
    const result = addWorkflowVersion(store, principal, id, body.graph, getCorrelationId(req));
    if ("error" in result && result.error === "forbidden") return reply.code(403).send(result);
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    return reply.code(201).send(result);
  });

  app.post("/v1/workflows/versions/:id/publish", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = publishWorkflowVersion(store, principal, id, getCorrelationId(req));
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.post("/v1/workflows/instances", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as {
      definitionKey?: string;
      businessKey?: string;
      context?: Record<string, unknown>;
    };
    if (!body.definitionKey) return reply.code(400).send({ error: "invalid_request" });
    const result = startWorkflowInstance(
      store,
      principal,
      {
        definitionKey: body.definitionKey,
        ...(body.businessKey !== undefined ? { businessKey: body.businessKey } : {}),
        ...(body.context !== undefined ? { context: body.context } : {}),
      },
      getCorrelationId(req),
    );
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result && result.error === "forbidden") return reply.code(403).send(result);
    if ("error" in result) return reply.code(409).send(result);
    return reply.code(201).send(result);
  });

  app.post("/v1/workflows/tasks/:id/complete", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const body = (req.body ?? {}) as {
      decision?: "approved" | "rejected";
      reason?: string;
      idempotencyKey?: string;
    };
    if (!body.decision || !body.idempotencyKey) return reply.code(400).send({ error: "invalid_request" });
    const result = completeWorkflowTask(
      store,
      principal,
      id,
      {
        decision: body.decision,
        idempotencyKey: body.idempotencyKey,
        ...(body.reason !== undefined ? { reason: body.reason } : {}),
      },
      getCorrelationId(req),
    );
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result && result.error === "forbidden") return reply.code(403).send(result);
    if ("error" in result) return reply.code(409).send(result);
    return result;
  });

  app.post("/v1/workflows/instances/:id/cancel", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = cancelWorkflowInstance(store, principal, id, getCorrelationId(req));
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result && result.error === "forbidden") return reply.code(403).send(result);
    if ("error" in result) return reply.code(409).send(result);
    return result;
  });

  app.post("/v1/workflows/simulate", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as {
      definitionKey?: string;
      decisions?: Array<"approved" | "rejected">;
    };
    if (!body.definitionKey || !body.decisions) return reply.code(400).send({ error: "invalid_request" });
    const result = simulateWorkflowPath(store, principal, {
      definitionKey: body.definitionKey,
      decisions: body.decisions,
    });
    if ("error" in result && result.error === "forbidden") return reply.code(403).send(result);
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result) return reply.code(409).send(result);
    return result;
  });

  app.post("/v1/rules", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as {
      key?: string;
      name?: string;
      purpose?: string;
      condition?: Parameters<typeof createRule>[2]["condition"];
      result?: Record<string, unknown>;
      priority?: number;
    };
    if (!body.key || !body.name || !body.condition || !body.result) {
      return reply.code(400).send({ error: "invalid_request" });
    }
    const result = createRule(
      store,
      principal,
      {
        key: body.key,
        name: body.name,
        condition: body.condition,
        result: body.result,
        ...(body.purpose !== undefined ? { purpose: body.purpose } : {}),
        ...(body.priority !== undefined ? { priority: body.priority } : {}),
      },
      getCorrelationId(req),
    );
    if ("error" in result) return reply.code(403).send(result);
    return reply.code(201).send(result);
  });

  app.post("/v1/rules/versions/:id/approve", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = approveRule(store, principal, id, getCorrelationId(req));
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result && result.error === "conflict") return reply.code(409).send(result);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.post("/v1/rules/versions/:id/simulate", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const body = (req.body ?? {}) as { input?: Record<string, unknown> };
    const result = simulateRuleVersion(store, principal, id, body.input ?? {});
    if ("error" in result && result.error === "not_found") return reply.code(404).send(result);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  /** Dev/Test: drain pending outbox via EventTransport (in-memory stand-in — not Production). */
  app.post("/v1/events/outbox/publish", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    if (!principal.permissions.includes("events:publish:outbox")) {
      return reply.code(403).send({ error: "forbidden" });
    }
    const result = publishPendingOutbox(store);
    getRequestLog(req).info("outbox_publish_cycle", result);
    return result;
  });

  app.get("/v1/events/operations", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getEventOperationsView(store, principal);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });

  app.get("/v1/events/dlq", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as {
      owner?: string;
      status?: string;
      unassigned?: string;
      minAgeHours?: string;
      maxAgeHours?: string;
      slaBreached?: string;
      slaHours?: string;
    };
    const result = listDeadLetters(store, principal, {
      ...(query.owner !== undefined ? { owner: query.owner } : {}),
      ...(query.status !== undefined ? { status: query.status } : {}),
      ...(query.unassigned === "1" || query.unassigned === "true" ? { unassigned: true } : {}),
      ...(query.minAgeHours && Number.isFinite(Number(query.minAgeHours))
        ? { minAgeHours: Number(query.minAgeHours) }
        : {}),
      ...(query.maxAgeHours && Number.isFinite(Number(query.maxAgeHours))
        ? { maxAgeHours: Number(query.maxAgeHours) }
        : {}),
      ...(query.slaBreached === "1" || query.slaBreached === "true" ? { slaBreached: true } : {}),
      ...(query.slaHours && Number.isFinite(Number(query.slaHours)) ? { slaHours: Number(query.slaHours) } : {}),
    });
    if (!result.ok) return reply.code(403).send({ error: "forbidden", reason: result.reason });
    return {
      items: result.items,
      owners: result.owners,
      sla: result.sla,
      increment: result.increment,
    };
  });

  app.post("/v1/events/dlq/assign", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as { ids?: string[]; owner?: string | null };
    if (!body.ids?.length) return reply.code(400).send({ error: "invalid_request", reason: "ids_required" });
    if (body.owner === undefined) {
      return reply.code(400).send({ error: "invalid_request", reason: "owner_required" });
    }
    const result = bulkAssignDeadLetterOwners(
      store,
      principal,
      { ids: body.ids, owner: body.owner },
      getCorrelationId(req),
    );
    if (!result.ok) {
      const code = result.reason === "ids_required" ? 400 : 403;
      return reply.code(code).send({ error: "invalid_request", reason: result.reason });
    }
    return result;
  });

  app.patch("/v1/events/dlq/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as {
      status?: string;
      owner?: string | null;
      remediation?: string | null;
    };
    const id = (req.params as { id: string }).id;
    const correlationId = getCorrelationId(req);

    // I4.11 — owner-only assignment (no status transition required)
    if (!body.status && body.owner !== undefined) {
      const result = assignDeadLetterOwner(store, principal, id, { owner: body.owner }, correlationId);
      if (!result.ok) {
        const code = result.reason === "not_found" ? 404 : 403;
        return reply.code(code).send({
          error: result.reason === "not_found" ? "not_found" : "forbidden",
          reason: result.reason,
        });
      }
      return result;
    }

    if (!body.status) return reply.code(400).send({ error: "invalid_request", reason: "status_required" });
    const result = updateDeadLetterRemediation(
      store,
      principal,
      id,
      {
        status: body.status as Parameters<typeof updateDeadLetterRemediation>[3]["status"],
        ...(body.owner !== undefined ? { owner: body.owner } : {}),
        ...(body.remediation !== undefined ? { remediation: body.remediation } : {}),
      },
      correlationId,
    );
    if (!result.ok) {
      const code = result.reason === "not_found" ? 404 : result.reason === "invalid_transition" ? 400 : 403;
      return reply.code(code).send({ error: result.reason === "not_found" ? "not_found" : "invalid_request", reason: result.reason });
    }
    return result;
  });

  app.post("/v1/events/dlq/:id/sla-acknowledge", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = acknowledgeDeadLetterSla(
      store,
      principal,
      (req.params as { id: string }).id,
      getCorrelationId(req),
    );
    if (!result.ok) {
      const code = result.reason === "not_found" ? 404 : 403;
      return reply.code(code).send({
        error: result.reason === "not_found" ? "not_found" : "forbidden",
        reason: result.reason,
      });
    }
    return result;
  });

  app.post("/v1/events/dlq/:id/sla-snooze", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as { until?: string; hours?: number };
    const result = snoozeDeadLetterSla(
      store,
      principal,
      (req.params as { id: string }).id,
      body,
      getCorrelationId(req),
    );
    if (!result.ok) {
      const code =
        result.reason === "not_found"
          ? 404
          : result.reason === "until_or_hours_required" || result.reason === "invalid_until"
            ? 400
            : 403;
      return reply.code(code).send({
        error: result.reason === "not_found" ? "not_found" : code === 400 ? "invalid_request" : "forbidden",
        reason: result.reason,
      });
    }
    return result;
  });

  app.post("/v1/events/dlq/:id/sla-clear", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = clearDeadLetterSlaSuppression(
      store,
      principal,
      (req.params as { id: string }).id,
      getCorrelationId(req),
    );
    if (!result.ok) {
      const code = result.reason === "not_found" ? 404 : 403;
      return reply.code(code).send({
        error: result.reason === "not_found" ? "not_found" : "forbidden",
        reason: result.reason,
      });
    }
    return result;
  });

  app.post("/v1/events/replay/request", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as {
      reason?: string;
      intent?: "reconstruction" | "reexecute";
      deadLetterIds?: string[];
      targetConsumer?: string;
    };
    if (!body.reason || !body.intent || !body.deadLetterIds?.length) {
      return reply.code(400).send({ error: "invalid_request" });
    }
    const result = requestReplay(store, principal, {
      reason: body.reason,
      intent: body.intent,
      deadLetterIds: body.deadLetterIds,
      ...(body.targetConsumer !== undefined ? { targetConsumer: body.targetConsumer } : {}),
      correlationId: getCorrelationId(req),
    });
    if (!result.ok) return reply.code(403).send({ error: "forbidden", reason: result.reason });
    return { ...result.request, increment: "I4.15" };
  });

  app.post("/v1/events/replay/:id/execute", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = executeReplayRequest(store, principal, id, getCorrelationId(req));
    if (!result.ok) return reply.code(403).send({ error: "forbidden", reason: result.reason });
    return { ...result, increment: "I4.15" };
  });

  app.get("/v1/events/consumers/processed", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { consumer?: string; limit?: string };
    const result = listConsumerProcessedEvents(store, principal, {
      ...(query.consumer !== undefined ? { consumer: query.consumer } : {}),
      ...(query.limit !== undefined ? { limit: Number(query.limit) } : {}),
    });
    if (!result.ok) return reply.code(403).send({ error: "forbidden", reason: result.reason });
    return { items: result.items, increment: "I4.3" };
  });

  app.post("/v1/events/consumers/replay", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as {
      consumer?: string;
      eventIds?: string[];
      force?: boolean;
    };
    if (!body.consumer || !body.eventIds?.length) {
      return reply.code(400).send({ error: "invalid_request" });
    }
    const result = replayEventsToConsumer(store, principal, {
      consumer: body.consumer,
      eventIds: body.eventIds,
      ...(body.force !== undefined ? { force: body.force } : {}),
      correlationId: getCorrelationId(req),
    });
    if (!result.ok) return reply.code(403).send({ error: "forbidden", reason: result.reason });
    return { ...result, increment: "I4.3" };
  });

  app.get("/v1/events/consumers/nats/offsets", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listNatsConsumerOffsets(store, principal);
    if (!result.ok) return reply.code(403).send({ error: "forbidden", reason: result.reason });
    return { items: result.items, increment: "I4.4" };
  });

  app.post("/v1/events/consumers/nats/replay", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as {
      stream?: string;
      consumer?: string;
      fromSeq?: number;
      maxMessages?: number;
      force?: boolean;
    };
    if (body.fromSeq === undefined || !Number.isFinite(body.fromSeq)) {
      return reply.code(400).send({ error: "invalid_request" });
    }
    const result = await replayNatsStreamFromSeq(store, principal, {
      ...(body.stream !== undefined ? { stream: body.stream } : {}),
      ...(body.consumer !== undefined ? { consumer: body.consumer } : {}),
      fromSeq: body.fromSeq,
      ...(body.maxMessages !== undefined ? { maxMessages: body.maxMessages } : {}),
      ...(body.force !== undefined ? { force: body.force } : {}),
    });
    if (!result.ok) {
      const code = result.reason === "nats_not_configured" ? 503 : 403;
      return reply.code(code).send({ error: code === 503 ? "service_unavailable" : "forbidden", reason: result.reason });
    }
    return { ...result, increment: "I4.4" };
  });

  app.get("/v1/events/consumers/nats/lag", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { stream?: string };
    const result = await getNatsConsumerLagMetrics(store, principal, {
      ...(query.stream !== undefined ? { stream: query.stream } : {}),
    });
    if (!result.ok) return reply.code(403).send({ error: "forbidden", reason: result.reason });
    return result.metrics;
  });

  app.post("/v1/events/catalogue", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = (req.body ?? {}) as EventCatalogueEntry;
    if (!body.eventType || !body.owner) return reply.code(400).send({ error: "invalid_request" });
    const result = registerEventType(store, principal, body, getCorrelationId(req));
    if (!result.ok) return reply.code(403).send({ error: "forbidden", reason: result.reason });
    return result.entry;
  });

  app.get("/v1/events/trace/:correlationId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { correlationId } = req.params as { correlationId: string };
    const ops = getEventOperationsView(store, principal);
    if ("error" in ops) return reply.code(403).send(ops);
    return traceEventCorrelation(store, correlationId, principal.tenantId);
  });

  return app;
}
