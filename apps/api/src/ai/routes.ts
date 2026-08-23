import type { FastifyInstance } from "fastify";
import { principalFromAuthHeader } from "../app.js";
import { getCorrelationId } from "../observability.js";
import type { Store } from "../store.js";
import { listAiRecommendations } from "./recommend.js";

export function registerAiRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/ai/recommendations", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = listAiRecommendations(store, principal, correlationId);
    if ("error" in result) return reply.code(403).send(result);
    return result;
  });
}
