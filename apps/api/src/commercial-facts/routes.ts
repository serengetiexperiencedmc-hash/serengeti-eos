import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import type { Store } from "../store.js";
import {
  getOpportunityCommercialFacts,
  getRfpCommercialFacts,
  putOpportunityCommercialFacts,
  putRfpCommercialFacts,
  transferOpportunityFollowUp,
} from "./service.js";
import { decidePathBApproval, getPathBApproval, putPathBCategories } from "./path-b.js";
import { getAccountCommercialFacts, putAccountCommercialFacts } from "./account.js";
import { getCostSheetRateIdentities, getRateCommercialFacts, putRateCommercialFacts } from "./rate-identity.js";
import { getCommercialKpiPreview } from "./kpis.js";
import { getProgrammeCommercialFacts, putProgrammeCommercialFacts } from "./programme.js";

export function registerCommercialFactsRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/pipeline/opportunities/:id/commercial-facts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getOpportunityCommercialFacts(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.put("/v1/pipeline/opportunities/:id/commercial-facts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await putOpportunityCommercialFacts(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as Parameters<typeof putOpportunityCommercialFacts>[3],
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/pipeline/opportunities/:id/commercial-facts/transfers", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await transferOpportunityFollowUp(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as { newOwnerPrincipalId: string; nextAction: string },
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/rfps/:id/commercial-facts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getRfpCommercialFacts(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.put("/v1/rfps/:id/commercial-facts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await putRfpCommercialFacts(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as Parameters<typeof putRfpCommercialFacts>[3],
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/rfps/:id/path-b-approval", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getPathBApproval(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.put("/v1/rfps/:id/path-b-approval", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await putPathBCategories(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as { categories?: string[] },
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/rfps/:id/path-b-approval/decision", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const body = req.body as { outcome: "approved" | "rejected"; notes?: string };
    if (body.outcome !== "approved" && body.outcome !== "rejected") {
      return reply.code(400).send({ error: "invalid_request" });
    }
    const result = await decidePathBApproval(store, principal, (req.params as { id: string }).id, body);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/accounts/:id/commercial-facts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getAccountCommercialFacts(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.put("/v1/crm/accounts/:id/commercial-facts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await putAccountCommercialFacts(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as Parameters<typeof putAccountCommercialFacts>[3],
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/suppliers/:supplierId/rates/:rateId/commercial-facts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const params = req.params as { supplierId: string; rateId: string };
    const at = (req.query as { at?: string }).at;
    const result = await getRateCommercialFacts(store, principal, params.supplierId, params.rateId, at);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.put("/v1/suppliers/:supplierId/rates/:rateId/commercial-facts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const params = req.params as { supplierId: string; rateId: string };
    const result = await putRateCommercialFacts(
      store,
      principal,
      params.supplierId,
      params.rateId,
      req.body as Parameters<typeof putRateCommercialFacts>[4],
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/costing/sheets/:id/rate-identities", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const at = (req.query as { at?: string }).at;
    const result = await getCostSheetRateIdentities(store, principal, (req.params as { id: string }).id, at);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/commercial/kpis/preview", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { from?: string; to?: string };
    const result = await getCommercialKpiPreview(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/programmes/:id/commercial-facts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await getProgrammeCommercialFacts(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.put("/v1/programmes/:id/commercial-facts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = await putProgrammeCommercialFacts(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as Parameters<typeof putProgrammeCommercialFacts>[3],
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });
}
