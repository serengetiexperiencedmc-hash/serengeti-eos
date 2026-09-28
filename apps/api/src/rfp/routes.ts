import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  createRfp,
  createRfpVersion,
  getRfp,
  getRfpModuleHealth,
  listRfpWorkflowStages,
  listRfps,
  patchRfp,
  transitionRfpStage,
} from "./rfp.js";
import { getRfpCommercialWorkspace, getRfpProposalPreparation } from "../commercial/workspace.js";

function sendError(
  reply: { code: (n: number) => { send: (b: unknown) => unknown } },
  result: { error: string; reason?: string },
) {
  switch (result.error) {
    case "forbidden":
      return reply.code(403).send(result);
    case "not_found":
      return reply.code(404).send(result);
    case "conflict":
      return reply.code(409).send(result);
    default:
      return reply.code(400).send(result);
  }
}

function isPhase1RfpError(result: object): result is { error: string; reason?: string } {
  return "error" in result && typeof (result as { error?: unknown }).error === "string";
}

export function registerRfpRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/rfps/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getRfpModuleHealth(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/rfps/workflow-stages", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listRfpWorkflowStages(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/rfps", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { opportunityId?: string; workflowStage?: string; status?: string };
    const result = await listRfps(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/rfps", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = await createRfp(store, principal, req.body as Parameters<typeof createRfp>[2], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/rfps/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getRfp(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/rfps/:id/commercial-workspace", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getRfpCommercialWorkspace(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/rfps/:id/proposal-preparation", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getRfpProposalPreparation(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/rfps/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = await patchRfp(
      store,
      principal,
      (req.params as { id: string }).id,
      (req.body ?? {}) as Parameters<typeof patchRfp>[3],
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/rfps/:id/transitions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = req.body as { toStage: string };
    const result = await transitionRfpStage(
      store,
      principal,
      (req.params as { id: string }).id,
      body.toStage,
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/rfps/:id/versions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const body = req.body as { summary: string };
    const result = await createRfpVersion(
      store,
      principal,
      (req.params as { id: string }).id,
      body.summary,
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });
}
