import type { FastifyInstance } from "fastify";
import { authorize } from "@sedmc/kernel";
import { principalFromAuthHeader } from "../app.js";
import type { Store } from "../store.js";
import { getCorrelationId } from "../observability.js";
import { listCrmOutboxEvents } from "./events.js";
import { getCrmModuleHealth, listActivityTypes, listOrganizationTypes, listRelationshipTypes } from "./module.js";
import { isHttpErrorResult, sendHttpError } from "../http-error.js";
import {
  archiveOrganization,
  createOrganization,
  getOrganization,
  listOrganizations,
  transitionOrganization,
  updateOrganization,
} from "./organization.js";
import {
  createOrganizationUnit,
  getOrganizationUnit,
  listOrganizationUnits,
  updateOrganizationUnit,
} from "./organization-unit.js";
import {
  archiveContact,
  createContact,
  getContact,
  listContacts,
  updateContact,
} from "./contact.js";
import {
  createRelationship,
  getRelationship,
  listContactRelationships,
  listOrganizationRelationships,
  listRelationships,
  transitionRelationship,
  updateRelationship,
} from "./relationship.js";
import {
  archiveActivity,
  createActivity,
  getActivity,
  listActivities,
  listContactActivities,
  listOrganizationActivities,
  listOrganizationUnitActivities,
  listRelationshipActivities,
  updateActivity,
} from "./activity.js";
import {
  archiveAccount,
  createAccount,
  getAccount,
  listAccounts,
  listOrganizationAccounts,
  reassignAccountOwner,
  transitionAccount,
  updateAccount,
} from "./account.js";
import {
  archiveNote,
  createNote,
  getNote,
  listEntityNotes,
  listNotes,
  updateNote,
} from "./note.js";
import {
  cancelTask,
  completeTask,
  createTask,
  getTask,
  listTasks,
  updateTask,
} from "./task.js";
import {
  getDuplicateCandidate,
  listDuplicateCandidates,
  reviewDuplicateCandidate,
} from "./duplicate.js";
import {
  createImportBatch,
  executeImportBatch,
  getImportBatch,
  validateImportBatch,
} from "./import.js";
import { executeMerge, getMergeRecord } from "./merge.js";
import { searchCrm } from "./search.js";
import {
  archiveTag,
  assignTag,
  createTag,
  getTag,
  listTagAssignments,
  listTags,
  removeTagAssignment,
  updateTag,
} from "./tag.js";
import {
  createExternalIdentifier,
  deleteExternalIdentifier,
  getExternalIdentifier,
  lookupExternalIdentifier,
} from "./external-identifier.js";

function sendCrmError(
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

export function registerCrmRoutes(app: FastifyInstance, store: Store): void {
  app.get("/v1/crm/health", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    void getCorrelationId(req);
    return getCrmModuleHealth(store);
  });

  app.get("/v1/crm/dev/outbox-events", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    void getCorrelationId(req);

    const decision = authorize({
      principal,
      permission: "events:read:operations",
      action: "read:crm_outbox_events",
    });
    if (decision.result === "deny") {
      return reply.code(403).send({ error: "forbidden", reason: decision.reason });
    }

    const query = req.query as { limit?: string };
    const limit = query.limit !== undefined ? Number(query.limit) : undefined;
    return listCrmOutboxEvents(store, principal, {
      ...(limit !== undefined && !Number.isNaN(limit) ? { limit } : {}),
    });
  });

  app.get("/v1/crm/organization-types", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listOrganizationTypes(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/relationship-types", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listRelationshipTypes(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/activity-types", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listActivityTypes(store, principal);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/organizations", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { status?: string; organizationTypeId?: string };
    const result = listOrganizations(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/organizations", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createOrganization(store, principal, req.body as Parameters<typeof createOrganization>[2], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/crm/organizations/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = getOrganization(store, principal, id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/crm/organizations/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const ifMatch = req.headers["if-match"];
    const expectedVersion =
      typeof ifMatch === "string" && ifMatch.trim() !== "" ? Number.parseInt(ifMatch, 10) : undefined;
    const result = updateOrganization(
      store,
      principal,
      id,
      req.body as Parameters<typeof updateOrganization>[3],
      correlationId,
      Number.isFinite(expectedVersion) ? expectedVersion : undefined,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/organizations/:id/transitions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const result = transitionOrganization(
      store,
      principal,
      id,
      req.body as Parameters<typeof transitionOrganization>[3],
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/organizations/:id/archive", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const result = archiveOrganization(store, principal, id, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/organizations/:orgId/units", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { orgId } = req.params as { orgId: string };
    const result = listOrganizationUnits(store, principal, orgId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/organizations/:orgId/units", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { orgId } = req.params as { orgId: string };
    const result = createOrganizationUnit(
      store,
      principal,
      orgId,
      req.body as Parameters<typeof createOrganizationUnit>[3],
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/crm/organization-units/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = getOrganizationUnit(store, principal, id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/crm/organization-units/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const result = updateOrganizationUnit(
      store,
      principal,
      id,
      req.body as Parameters<typeof updateOrganizationUnit>[3],
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/contacts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { status?: string; organizationId?: string; email?: string };
    const result = listContacts(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/contacts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createContact(store, principal, req.body as Parameters<typeof createContact>[2], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/crm/contacts/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = getContact(store, principal, id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/crm/contacts/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const ifMatch = req.headers["if-match"];
    const expectedVersion =
      typeof ifMatch === "string" && ifMatch.trim() !== "" ? Number.parseInt(ifMatch, 10) : undefined;
    const result = updateContact(
      store,
      principal,
      id,
      req.body as Parameters<typeof updateContact>[3],
      correlationId,
      Number.isFinite(expectedVersion) ? expectedVersion : undefined,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/contacts/:id/archive", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const result = archiveContact(store, principal, id, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/contacts/:id/relationships", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const query = req.query as { organizationId?: string; status?: string };
    const result = listContactRelationships(store, principal, id, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/relationships", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as {
      contactId?: string;
      organizationId?: string;
      organizationUnitId?: string;
      status?: string;
    };
    const result = listRelationships(store, principal, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/relationships", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createRelationship(
      store,
      principal,
      req.body as Parameters<typeof createRelationship>[2],
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/crm/relationships/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = getRelationship(store, principal, id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/crm/relationships/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const ifMatch = req.headers["if-match"];
    const expectedVersion =
      typeof ifMatch === "string" && ifMatch.trim() !== "" ? Number.parseInt(ifMatch, 10) : undefined;
    const result = updateRelationship(
      store,
      principal,
      id,
      req.body as Parameters<typeof updateRelationship>[3],
      correlationId,
      Number.isFinite(expectedVersion) ? expectedVersion : undefined,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/relationships/:id/transitions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const result = transitionRelationship(
      store,
      principal,
      id,
      req.body as Parameters<typeof transitionRelationship>[3],
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/organizations/:orgId/relationships", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { orgId } = req.params as { orgId: string };
    const query = req.query as { contactId?: string; status?: string };
    const result = listOrganizationRelationships(store, principal, orgId, query);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/activities", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as {
      activityType?: string;
      contactId?: string;
      organizationId?: string;
      organizationUnitId?: string;
      relationshipId?: string;
      occurredFrom?: string;
      occurredTo?: string;
      includeArchived?: string;
      limit?: string;
      cursor?: string;
    };
    const result = listActivities(store, principal, {
      ...(query.activityType !== undefined ? { activityType: query.activityType } : {}),
      ...(query.contactId !== undefined ? { contactId: query.contactId } : {}),
      ...(query.organizationId !== undefined ? { organizationId: query.organizationId } : {}),
      ...(query.organizationUnitId !== undefined ? { organizationUnitId: query.organizationUnitId } : {}),
      ...(query.relationshipId !== undefined ? { relationshipId: query.relationshipId } : {}),
      ...(query.occurredFrom !== undefined ? { occurredFrom: query.occurredFrom } : {}),
      ...(query.occurredTo !== undefined ? { occurredTo: query.occurredTo } : {}),
      ...(query.includeArchived === "true" ? { includeArchived: true } : {}),
      ...(query.limit !== undefined ? { limit: Number.parseInt(query.limit, 10) } : {}),
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
    });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/activities", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createActivity(store, principal, req.body as Parameters<typeof createActivity>[2], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/crm/activities/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = getActivity(store, principal, id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/crm/activities/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const ifMatch = req.headers["if-match"];
    const expectedVersion =
      typeof ifMatch === "string" && ifMatch.trim() !== "" ? Number.parseInt(ifMatch, 10) : undefined;
    const result = updateActivity(
      store,
      principal,
      id,
      req.body as Parameters<typeof updateActivity>[3],
      correlationId,
      Number.isFinite(expectedVersion) ? expectedVersion : undefined,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/activities/:id/archive", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const result = archiveActivity(store, principal, id, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/contacts/:id/activities", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const query = req.query as { limit?: string; cursor?: string; activityType?: string };
    const result = listContactActivities(store, principal, id, {
      ...(query.limit !== undefined ? { limit: Number.parseInt(query.limit, 10) } : {}),
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
      ...(query.activityType !== undefined ? { activityType: query.activityType } : {}),
    });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/organizations/:orgId/activities", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { orgId } = req.params as { orgId: string };
    const query = req.query as { limit?: string; cursor?: string; activityType?: string };
    const result = listOrganizationActivities(store, principal, orgId, {
      ...(query.limit !== undefined ? { limit: Number.parseInt(query.limit, 10) } : {}),
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
      ...(query.activityType !== undefined ? { activityType: query.activityType } : {}),
    });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/relationships/:id/activities", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const query = req.query as { limit?: string; cursor?: string };
    const result = listRelationshipActivities(store, principal, id, {
      ...(query.limit !== undefined ? { limit: Number.parseInt(query.limit, 10) } : {}),
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
    });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/organization-units/:id/activities", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const query = req.query as { limit?: string; cursor?: string };
    const result = listOrganizationUnitActivities(store, principal, id, {
      ...(query.limit !== undefined ? { limit: Number.parseInt(query.limit, 10) } : {}),
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
    });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/accounts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { organizationId?: string; status?: string; ownerPrincipalId?: string; limit?: string; cursor?: string };
    const result = listAccounts(store, principal, {
      ...(query.organizationId !== undefined ? { organizationId: query.organizationId } : {}),
      ...(query.status !== undefined ? { status: query.status } : {}),
      ...(query.ownerPrincipalId !== undefined ? { ownerPrincipalId: query.ownerPrincipalId } : {}),
      ...(query.limit !== undefined ? { limit: Number.parseInt(query.limit, 10) } : {}),
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
    });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/accounts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createAccount(store, principal, req.body as Parameters<typeof createAccount>[2], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/crm/accounts/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getAccount(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/crm/accounts/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const ifMatch = req.headers["if-match"];
    const expectedVersion = typeof ifMatch === "string" && ifMatch.trim() !== "" ? Number.parseInt(ifMatch, 10) : undefined;
    const result = updateAccount(store, principal, id, req.body as Parameters<typeof updateAccount>[3], correlationId, Number.isFinite(expectedVersion) ? expectedVersion : undefined);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/accounts/:id/transitions", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = transitionAccount(store, principal, (req.params as { id: string }).id, req.body as Parameters<typeof transitionAccount>[3], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/accounts/:id/archive", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = archiveAccount(store, principal, (req.params as { id: string }).id, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/accounts/:id/reassign-owner", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = reassignAccountOwner(store, principal, (req.params as { id: string }).id, req.body as Parameters<typeof reassignAccountOwner>[3], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/organizations/:orgId/accounts", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listOrganizationAccounts(store, principal, (req.params as { orgId: string }).orgId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/notes", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { entityType?: string; entityId?: string; limit?: string; cursor?: string };
    const result = listNotes(store, principal, {
      ...(query.entityType !== undefined ? { entityType: query.entityType } : {}),
      ...(query.entityId !== undefined ? { entityId: query.entityId } : {}),
      ...(query.limit !== undefined ? { limit: Number.parseInt(query.limit, 10) } : {}),
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
    });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/notes", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createNote(store, principal, req.body as Parameters<typeof createNote>[2], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/crm/notes/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getNote(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/crm/notes/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const ifMatch = req.headers["if-match"];
    const expectedVersion = typeof ifMatch === "string" && ifMatch.trim() !== "" ? Number.parseInt(ifMatch, 10) : undefined;
    const result = updateNote(store, principal, id, req.body as Parameters<typeof updateNote>[3], correlationId, Number.isFinite(expectedVersion) ? expectedVersion : undefined);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/notes/:id/archive", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = archiveNote(store, principal, (req.params as { id: string }).id, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/contacts/:id/notes", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { id } = req.params as { id: string };
    const result = listEntityNotes(store, principal, "contact", id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/organizations/:orgId/notes", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = listEntityNotes(store, principal, "organization", (req.params as { orgId: string }).orgId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/tasks", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { status?: string; assigneePrincipalId?: string; limit?: string; cursor?: string };
    const result = listTasks(store, principal, {
      ...(query.status !== undefined ? { status: query.status } : {}),
      ...(query.assigneePrincipalId !== undefined ? { assigneePrincipalId: query.assigneePrincipalId } : {}),
      ...(query.limit !== undefined ? { limit: Number.parseInt(query.limit, 10) } : {}),
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
    });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/tasks", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createTask(store, principal, req.body as Parameters<typeof createTask>[2], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/crm/tasks/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getTask(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/crm/tasks/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const ifMatch = req.headers["if-match"];
    const expectedVersion = typeof ifMatch === "string" && ifMatch.trim() !== "" ? Number.parseInt(ifMatch, 10) : undefined;
    const result = updateTask(store, principal, id, req.body as Parameters<typeof updateTask>[3], correlationId, Number.isFinite(expectedVersion) ? expectedVersion : undefined);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/tasks/:id/complete", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = completeTask(store, principal, (req.params as { id: string }).id, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/tasks/:id/cancel", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = cancelTask(store, principal, (req.params as { id: string }).id, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/search", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as {
      q?: string;
      types?: string | string[];
      limit?: string;
      cursor?: string;
      status?: string;
      owner?: string;
      country?: string;
      type?: string;
    };
    const typesRaw = query.types;
    const types = typesRaw === undefined ? undefined : Array.isArray(typesRaw) ? typesRaw : [typesRaw];
    const result = searchCrm(store, principal, {
      q: query.q ?? "",
      ...(types !== undefined ? { types } : {}),
      ...(query.limit !== undefined ? { limit: Number.parseInt(query.limit, 10) } : {}),
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
      ...(query.status !== undefined ? { status: query.status } : {}),
      ...(query.owner !== undefined ? { owner: query.owner } : {}),
      ...(query.country !== undefined ? { country: query.country } : {}),
      ...(query.type !== undefined ? { type: query.type } : {}),
    });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/duplicates", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { status?: string; entityType?: string; limit?: string; cursor?: string };
    const result = listDuplicateCandidates(store, principal, {
      ...(query.status !== undefined ? { status: query.status } : {}),
      ...(query.entityType !== undefined ? { entityType: query.entityType } : {}),
      ...(query.limit !== undefined ? { limit: Number.parseInt(query.limit, 10) } : {}),
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
    });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/duplicates/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getDuplicateCandidate(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/duplicates/:id/review", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = reviewDuplicateCandidate(
      store,
      principal,
      (req.params as { id: string }).id,
      req.body as Parameters<typeof reviewDuplicateCandidate>[3],
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/merges", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const idempotencyKey = req.headers["idempotency-key"];
    const result = executeMerge(
      store,
      principal,
      req.body as Parameters<typeof executeMerge>[2],
      correlationId,
      typeof idempotencyKey === "string" ? idempotencyKey : undefined,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(result.replay ? 200 : 201).send(result);
  });

  app.get("/v1/crm/merges/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getMergeRecord(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/imports", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createImportBatch(store, principal, req.body as Parameters<typeof createImportBatch>[2], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.post("/v1/crm/imports/:id/validate", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = validateImportBatch(store, principal, (req.params as { id: string }).id, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/imports/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getImportBatch(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/imports/:id/execute", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const idempotencyKey = req.headers["idempotency-key"];
    const result = executeImportBatch(
      store,
      principal,
      (req.params as { id: string }).id,
      correlationId,
      typeof idempotencyKey === "string" ? idempotencyKey : undefined,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/tags", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as { includeArchived?: string };
    const result = listTags(store, principal, {
      includeArchived: query.includeArchived === "true",
    });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/tags", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createTag(store, principal, req.body as Parameters<typeof createTag>[2], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/crm/tags/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getTag(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.patch("/v1/crm/tags/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const { id } = req.params as { id: string };
    const ifMatch = req.headers["if-match"];
    const expectedVersion =
      typeof ifMatch === "string" && ifMatch.trim() !== "" ? Number.parseInt(ifMatch, 10) : undefined;
    const result = updateTag(
      store,
      principal,
      id,
      req.body as Parameters<typeof updateTag>[3],
      correlationId,
      Number.isFinite(expectedVersion) ? expectedVersion : undefined,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/tags/:id/archive", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = archiveTag(store, principal, (req.params as { id: string }).id, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/tag-assignments", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const query = req.query as {
      tagId?: string;
      entityType?: string;
      entityId?: string;
      limit?: string;
      cursor?: string;
    };
    const result = listTagAssignments(store, principal, {
      ...(query.tagId !== undefined ? { tagId: query.tagId } : {}),
      ...(query.entityType !== undefined ? { entityType: query.entityType } : {}),
      ...(query.entityId !== undefined ? { entityId: query.entityId } : {}),
      ...(query.limit !== undefined ? { limit: Number.parseInt(query.limit, 10) } : {}),
      ...(query.cursor !== undefined ? { cursor: query.cursor } : {}),
    });
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/tag-assignments", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = assignTag(store, principal, req.body as Parameters<typeof assignTag>[2], correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.delete("/v1/crm/tag-assignments/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = removeTagAssignment(store, principal, (req.params as { id: string }).id, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.get("/v1/crm/external-identifiers/lookup/:systemKey/:externalId", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const { systemKey, externalId } = req.params as { systemKey: string; externalId: string };
    const result = lookupExternalIdentifier(store, principal, decodeURIComponent(systemKey), decodeURIComponent(externalId));
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.post("/v1/crm/external-identifiers", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = createExternalIdentifier(
      store,
      principal,
      req.body as Parameters<typeof createExternalIdentifier>[2],
      correlationId,
    );
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return reply.code(201).send(result);
  });

  app.get("/v1/crm/external-identifiers/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const result = getExternalIdentifier(store, principal, (req.params as { id: string }).id);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });

  app.delete("/v1/crm/external-identifiers/:id", async (req, reply) => {
    const principal = principalFromAuthHeader(store, req.headers.authorization);
    if (!principal) return reply.code(401).send({ error: "unauthenticated" });
    const correlationId = getCorrelationId(req);
    const result = deleteExternalIdentifier(store, principal, (req.params as { id: string }).id, correlationId);
    if (isHttpErrorResult(result)) return sendHttpError(reply, result);
    return result;
  });
}
