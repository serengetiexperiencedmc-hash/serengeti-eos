import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pyPath = path.join(__dirname, "generate_crm_c1.py");
const py = fs.readFileSync(pyPath, "utf8");

const STD_ERRORS = {
  400: { $ref: "#/components/responses/BadRequest" },
  401: { $ref: "#/components/responses/Unauthorized" },
  403: { $ref: "#/components/responses/Forbidden" },
  404: { $ref: "#/components/responses/NotFound" },
  409: { $ref: "#/components/responses/Conflict" },
};
const AUTH = [{ bearerAuth: [] }];

function mergeResponses(...extra) {
  const r = { ...STD_ERRORS };
  for (const [code, val] of extra) r[code] = val;
  return r;
}

function sec(...tags) {
  return { tags: [...tags], security: AUTH };
}

function idParam(name = "id") {
  return [{ $ref: "#/components/parameters/Id", name, description: "Resource UUID" }];
}

function orgId() {
  return [{ $ref: "#/components/parameters/OrgId" }];
}

function ifMatch() {
  return [{ $ref: "#/components/parameters/IfMatch" }];
}

function idempotency() {
  return [{ $ref: "#/components/parameters/IdempotencyKey" }];
}

function limitCursor(extra = []) {
  return [...extra, { $ref: "#/components/parameters/Limit" }, { $ref: "#/components/parameters/Cursor" }];
}

function extractSpecObject() {
  const start = py.indexOf("spec = {");
  const end = py.indexOf('\nP = spec["paths"]');
  let block = py.slice(start + "spec = ".length, end).trim();
  block = block.replace(/\(\s*("(?:[^"\\]|\\.)*"\s*)+\)/gs, (match) => {
    const parts = [...match.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
    return JSON.stringify(parts.join(""));
  });
  block = block.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false").replace(/\bNone\b/g, "null");
  return Function(`"use strict"; return (${block});`)();
}

function buildPaths() {
  const P = {};
  const activityScopedParams = limitCursor([{ name: "activityType", in: "query", schema: { type: "string" } }]);

  P["/v1/crm/health"] = {
    get: {
      ...sec("Health"),
      summary: "CRM module health (Dev/Test only)",
      description: "Returns CRM module metadata and entity counts. Requires authentication only.",
      responses: mergeResponses([
        "200",
        {
          description: "Module health",
          content: { "application/json": { schema: { $ref: "#/components/schemas/CrmModuleHealth" } } },
        },
      ]),
    },
  };

  P["/v1/crm/dev/outbox-events"] = {
    get: {
      ...sec("Dev"),
      summary: "List CRM outbox events (Dev/Test only)",
      description: "Requires `events:read:operations` permission.",
      parameters: [{ name: "limit", in: "query", schema: { type: "integer", minimum: 1, maximum: 200 } }],
      responses: mergeResponses([
        "200",
        {
          description: "Recent CRM outbox events",
          content: { "application/json": { schema: { $ref: "#/components/schemas/OutboxEventList" } } },
        },
      ]),
    },
  };

  for (const [route, perm] of [
    ["organization-types", "crm:read:organization"],
    ["relationship-types", "crm:read:relationship"],
    ["activity-types", "crm:read:activity"],
  ]) {
    P[`/v1/crm/${route}`] = {
      get: {
        ...sec("Catalogues"),
        summary: `List ${route.replace(/-/g, " ")}`,
        description: `Requires \`${perm}\` permission.`,
        responses: mergeResponses([
          "200",
          {
            description: "Catalogue items",
            content: { "application/json": { schema: { $ref: "#/components/schemas/CatalogueList" } } },
          },
        ]),
      },
    };
  }

  P["/v1/crm/organizations"] = {
    get: {
      ...sec("Organizations"),
      summary: "List organizations",
      parameters: [
        { name: "status", in: "query", schema: { type: "string" } },
        { name: "organizationTypeId", in: "query", schema: { type: "string", format: "uuid" } },
      ],
      responses: mergeResponses([
        "200",
        {
          description: "Organizations",
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrganizationList" } } },
        },
      ]),
    },
    post: {
      ...sec("Organizations"),
      summary: "Create organization",
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/CreateOrganizationRequest" } } },
      },
      responses: mergeResponses([
        "201",
        {
          description: "Created",
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrganizationEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/organizations/{id}"] = {
    get: {
      ...sec("Organizations"),
      summary: "Get organization",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Organization",
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrganizationEnvelope" } } },
        },
      ]),
    },
    patch: {
      ...sec("Organizations"),
      summary: "Update organization",
      parameters: [...idParam(), ...ifMatch()],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateOrganizationRequest" } } },
      },
      responses: mergeResponses([
        "200",
        {
          description: "Updated",
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrganizationEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/organizations/{id}/transitions"] = {
    post: {
      ...sec("Organizations"),
      summary: "Transition organization status",
      parameters: idParam(),
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/OrganizationTransitionRequest" } },
        },
      },
      responses: mergeResponses([
        "200",
        {
          description: "Transitioned",
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrganizationEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/organizations/{id}/archive"] = {
    post: {
      ...sec("Organizations"),
      summary: "Archive organization",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Archived",
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrganizationEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/organizations/{orgId}/units"] = {
    get: {
      ...sec("OrganizationUnits"),
      summary: "List organization units",
      parameters: orgId(),
      responses: mergeResponses([
        "200",
        {
          description: "Units",
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrganizationUnitList" } } },
        },
      ]),
    },
    post: {
      ...sec("OrganizationUnits"),
      summary: "Create organization unit",
      parameters: orgId(),
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/CreateOrganizationUnitRequest" } },
        },
      },
      responses: mergeResponses([
        "201",
        {
          description: "Created",
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrganizationUnitEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/organization-units/{id}"] = {
    get: {
      ...sec("OrganizationUnits"),
      summary: "Get organization unit",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Unit",
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrganizationUnitEnvelope" } } },
        },
      ]),
    },
    patch: {
      ...sec("OrganizationUnits"),
      summary: "Update organization unit",
      parameters: idParam(),
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/UpdateOrganizationUnitRequest" } },
        },
      },
      responses: mergeResponses([
        "200",
        {
          description: "Updated",
          content: { "application/json": { schema: { $ref: "#/components/schemas/OrganizationUnitEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/contacts"] = {
    get: {
      ...sec("Contacts"),
      summary: "List contacts",
      parameters: [
        { name: "status", in: "query", schema: { type: "string" } },
        { name: "organizationId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "email", in: "query", schema: { type: "string" } },
      ],
      responses: mergeResponses([
        "200",
        {
          description: "Contacts",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ContactList" } } },
        },
      ]),
    },
    post: {
      ...sec("Contacts"),
      summary: "Create contact",
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/CreateContactRequest" } } },
      },
      responses: mergeResponses([
        "201",
        {
          description: "Created",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ContactEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/contacts/{id}"] = {
    get: {
      ...sec("Contacts"),
      summary: "Get contact",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Contact",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ContactEnvelope" } } },
        },
      ]),
    },
    patch: {
      ...sec("Contacts"),
      summary: "Update contact",
      parameters: [...idParam(), ...ifMatch()],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateContactRequest" } } },
      },
      responses: mergeResponses([
        "200",
        {
          description: "Updated",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ContactEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/contacts/{id}/archive"] = {
    post: {
      ...sec("Contacts"),
      summary: "Archive contact",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Archived",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ContactEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/contacts/{id}/relationships"] = {
    get: {
      ...sec("Relationships"),
      summary: "List contact relationships",
      parameters: [
        ...idParam(),
        { name: "organizationId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "status", in: "query", schema: { type: "string" } },
      ],
      responses: mergeResponses([
        "200",
        {
          description: "Relationships",
          content: { "application/json": { schema: { $ref: "#/components/schemas/RelationshipList" } } },
        },
      ]),
    },
  };

  P["/v1/crm/relationships"] = {
    get: {
      ...sec("Relationships"),
      summary: "List relationships",
      parameters: [
        { name: "contactId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "organizationId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "organizationUnitId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "status", in: "query", schema: { type: "string" } },
      ],
      responses: mergeResponses([
        "200",
        {
          description: "Relationships",
          content: { "application/json": { schema: { $ref: "#/components/schemas/RelationshipList" } } },
        },
      ]),
    },
    post: {
      ...sec("Relationships"),
      summary: "Create relationship",
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/CreateRelationshipRequest" } } },
      },
      responses: mergeResponses([
        "201",
        {
          description: "Created",
          content: { "application/json": { schema: { $ref: "#/components/schemas/RelationshipEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/relationships/{id}"] = {
    get: {
      ...sec("Relationships"),
      summary: "Get relationship",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Relationship",
          content: { "application/json": { schema: { $ref: "#/components/schemas/RelationshipEnvelope" } } },
        },
      ]),
    },
    patch: {
      ...sec("Relationships"),
      summary: "Update relationship",
      parameters: [...idParam(), ...ifMatch()],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateRelationshipRequest" } } },
      },
      responses: mergeResponses([
        "200",
        {
          description: "Updated",
          content: { "application/json": { schema: { $ref: "#/components/schemas/RelationshipEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/relationships/{id}/transitions"] = {
    post: {
      ...sec("Relationships"),
      summary: "Transition relationship status",
      parameters: idParam(),
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/RelationshipTransitionRequest" } },
        },
      },
      responses: mergeResponses([
        "200",
        {
          description: "Transitioned",
          content: { "application/json": { schema: { $ref: "#/components/schemas/RelationshipEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/organizations/{orgId}/relationships"] = {
    get: {
      ...sec("Relationships"),
      summary: "List organization relationships",
      parameters: [
        ...orgId(),
        { name: "contactId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "status", in: "query", schema: { type: "string" } },
      ],
      responses: mergeResponses([
        "200",
        {
          description: "Relationships",
          content: { "application/json": { schema: { $ref: "#/components/schemas/RelationshipList" } } },
        },
      ]),
    },
  };

  P["/v1/crm/activities"] = {
    get: {
      ...sec("Activities"),
      summary: "List activities",
      parameters: [
        { name: "activityType", in: "query", schema: { type: "string" } },
        { name: "contactId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "organizationId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "organizationUnitId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "relationshipId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "occurredFrom", in: "query", schema: { type: "string", format: "date-time" } },
        { name: "occurredTo", in: "query", schema: { type: "string", format: "date-time" } },
        { name: "includeArchived", in: "query", schema: { type: "string", enum: ["true"] } },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Cursor" },
      ],
      responses: mergeResponses([
        "200",
        {
          description: "Activities",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ActivityList" } } },
        },
      ]),
    },
    post: {
      ...sec("Activities"),
      summary: "Create activity",
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/CreateActivityRequest" } } },
      },
      responses: mergeResponses([
        "201",
        {
          description: "Created",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ActivityEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/activities/{id}"] = {
    get: {
      ...sec("Activities"),
      summary: "Get activity",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Activity",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ActivityEnvelope" } } },
        },
      ]),
    },
    patch: {
      ...sec("Activities"),
      summary: "Update activity",
      parameters: [...idParam(), ...ifMatch()],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateActivityRequest" } } },
      },
      responses: mergeResponses([
        "200",
        {
          description: "Updated",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ActivityEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/activities/{id}/archive"] = {
    post: {
      ...sec("Activities"),
      summary: "Archive activity",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Archived",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ActivityEnvelope" } } },
        },
      ]),
    },
  };

  for (const scopedPath of ["/v1/crm/contacts/{id}/activities", "/v1/crm/organizations/{orgId}/activities"]) {
    P[scopedPath] = {
      get: {
        ...sec("Activities"),
        summary: "List scoped activities",
        parameters: (scopedPath.includes("contacts") ? idParam() : orgId()).concat(activityScopedParams),
        responses: mergeResponses([
          "200",
          {
            description: "Activities",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ActivityList" } } },
          },
        ]),
      },
    };
  }

  for (const scopedPath of ["/v1/crm/relationships/{id}/activities", "/v1/crm/organization-units/{id}/activities"]) {
    P[scopedPath] = {
      get: {
        ...sec("Activities"),
        summary: "List scoped activities",
        parameters: idParam().concat(limitCursor()),
        responses: mergeResponses([
          "200",
          {
            description: "Activities",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ActivityList" } } },
          },
        ]),
      },
    };
  }

  P["/v1/crm/accounts"] = {
    get: {
      ...sec("Accounts"),
      summary: "List accounts",
      parameters: [
        { name: "organizationId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "status", in: "query", schema: { type: "string" } },
        { name: "ownerPrincipalId", in: "query", schema: { type: "string", format: "uuid" } },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Cursor" },
      ],
      responses: mergeResponses([
        "200",
        {
          description: "Accounts",
          content: { "application/json": { schema: { $ref: "#/components/schemas/AccountList" } } },
        },
      ]),
    },
    post: {
      ...sec("Accounts"),
      summary: "Create account",
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/CreateAccountRequest" } } },
      },
      responses: mergeResponses([
        "201",
        {
          description: "Created",
          content: { "application/json": { schema: { $ref: "#/components/schemas/AccountEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/accounts/{id}"] = {
    get: {
      ...sec("Accounts"),
      summary: "Get account",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Account",
          content: { "application/json": { schema: { $ref: "#/components/schemas/AccountEnvelope" } } },
        },
      ]),
    },
    patch: {
      ...sec("Accounts"),
      summary: "Update account",
      parameters: [...idParam(), ...ifMatch()],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateAccountRequest" } } },
      },
      responses: mergeResponses([
        "200",
        {
          description: "Updated",
          content: { "application/json": { schema: { $ref: "#/components/schemas/AccountEnvelope" } } },
        },
      ]),
    },
  };

  for (const [suffix, summary] of [
    ["transitions", "Transition account status"],
    ["archive", "Archive account"],
    ["reassign-owner", "Reassign account owner"],
  ]) {
    const op = {
      ...sec("Accounts"),
      summary,
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: summary.split(" ")[0],
          content: { "application/json": { schema: { $ref: "#/components/schemas/AccountEnvelope" } } },
        },
      ]),
    };
    if (suffix === "transitions") {
      op.requestBody = {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/AccountTransitionRequest" } } },
      };
    } else if (suffix === "reassign-owner") {
      op.requestBody = {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/ReassignAccountOwnerRequest" } },
        },
      };
    }
    P[`/v1/crm/accounts/{id}/${suffix}`] = { post: op };
  }

  P["/v1/crm/organizations/{orgId}/accounts"] = {
    get: {
      ...sec("Accounts"),
      summary: "List organization accounts",
      parameters: orgId(),
      responses: mergeResponses([
        "200",
        {
          description: "Accounts",
          content: { "application/json": { schema: { $ref: "#/components/schemas/AccountList" } } },
        },
      ]),
    },
  };

  P["/v1/crm/notes"] = {
    get: {
      ...sec("Notes"),
      summary: "List notes",
      parameters: [
        { name: "entityType", in: "query", schema: { type: "string" } },
        { name: "entityId", in: "query", schema: { type: "string", format: "uuid" } },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Cursor" },
      ],
      responses: mergeResponses([
        "200",
        {
          description: "Notes",
          content: { "application/json": { schema: { $ref: "#/components/schemas/NoteList" } } },
        },
      ]),
    },
    post: {
      ...sec("Notes"),
      summary: "Create note",
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/CreateNoteRequest" } } },
      },
      responses: mergeResponses([
        "201",
        {
          description: "Created",
          content: { "application/json": { schema: { $ref: "#/components/schemas/NoteEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/notes/{id}"] = {
    get: {
      ...sec("Notes"),
      summary: "Get note",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Note",
          content: { "application/json": { schema: { $ref: "#/components/schemas/NoteEnvelope" } } },
        },
      ]),
    },
    patch: {
      ...sec("Notes"),
      summary: "Update note",
      parameters: [...idParam(), ...ifMatch()],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateNoteRequest" } } },
      },
      responses: mergeResponses([
        "200",
        {
          description: "Updated",
          content: { "application/json": { schema: { $ref: "#/components/schemas/NoteEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/notes/{id}/archive"] = {
    post: {
      ...sec("Notes"),
      summary: "Archive note",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Archived",
          content: { "application/json": { schema: { $ref: "#/components/schemas/NoteEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/contacts/{id}/notes"] = {
    get: {
      ...sec("Notes"),
      summary: "List contact notes",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Notes",
          content: { "application/json": { schema: { $ref: "#/components/schemas/NoteList" } } },
        },
      ]),
    },
  };

  P["/v1/crm/organizations/{orgId}/notes"] = {
    get: {
      ...sec("Notes"),
      summary: "List organization notes",
      parameters: orgId(),
      responses: mergeResponses([
        "200",
        {
          description: "Notes",
          content: { "application/json": { schema: { $ref: "#/components/schemas/NoteList" } } },
        },
      ]),
    },
  };

  P["/v1/crm/tasks"] = {
    get: {
      ...sec("Tasks"),
      summary: "List tasks",
      parameters: [
        { name: "status", in: "query", schema: { type: "string" } },
        { name: "assigneePrincipalId", in: "query", schema: { type: "string", format: "uuid" } },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Cursor" },
      ],
      responses: mergeResponses([
        "200",
        {
          description: "Tasks",
          content: { "application/json": { schema: { $ref: "#/components/schemas/TaskList" } } },
        },
      ]),
    },
    post: {
      ...sec("Tasks"),
      summary: "Create task",
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTaskRequest" } } },
      },
      responses: mergeResponses([
        "201",
        {
          description: "Created",
          content: { "application/json": { schema: { $ref: "#/components/schemas/TaskEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/tasks/{id}"] = {
    get: {
      ...sec("Tasks"),
      summary: "Get task",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Task",
          content: { "application/json": { schema: { $ref: "#/components/schemas/TaskEnvelope" } } },
        },
      ]),
    },
    patch: {
      ...sec("Tasks"),
      summary: "Update task",
      parameters: [...idParam(), ...ifMatch()],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateTaskRequest" } } },
      },
      responses: mergeResponses([
        "200",
        {
          description: "Updated",
          content: { "application/json": { schema: { $ref: "#/components/schemas/TaskEnvelope" } } },
        },
      ]),
    },
  };

  for (const action of ["complete", "cancel"]) {
    P[`/v1/crm/tasks/{id}/${action}`] = {
      post: {
        ...sec("Tasks"),
        summary: `${action.charAt(0).toUpperCase()}${action.slice(1)} task`,
        parameters: idParam(),
        responses: mergeResponses([
          "200",
          {
            description: `${action.charAt(0).toUpperCase()}${action.slice(1)}d`,
            content: { "application/json": { schema: { $ref: "#/components/schemas/TaskEnvelope" } } },
          },
        ]),
      },
    };
  }

  P["/v1/crm/search"] = {
    get: {
      ...sec("Search"),
      summary: "Search CRM entities",
      parameters: [
        { name: "q", in: "query", required: true, schema: { type: "string", minLength: 2 } },
        {
          name: "types",
          in: "query",
          schema: { type: "array", items: { type: "string" } },
          style: "form",
          explode: true,
        },
        { name: "limit", in: "query", schema: { type: "integer" } },
        { name: "cursor", in: "query", schema: { type: "string" } },
        { name: "status", in: "query", schema: { type: "string" } },
        { name: "owner", in: "query", schema: { type: "string" } },
        { name: "country", in: "query", schema: { type: "string" } },
        { name: "type", in: "query", schema: { type: "string" } },
      ],
      responses: mergeResponses([
        "200",
        {
          description: "Search results",
          content: { "application/json": { schema: { $ref: "#/components/schemas/SearchResultList" } } },
        },
      ]),
    },
  };

  P["/v1/crm/duplicates"] = {
    get: {
      ...sec("Duplicates"),
      summary: "List duplicate candidates",
      parameters: [
        { name: "status", in: "query", schema: { type: "string" } },
        { name: "entityType", in: "query", schema: { type: "string", enum: ["organization", "contact"] } },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Cursor" },
      ],
      responses: mergeResponses([
        "200",
        {
          description: "Duplicate candidates",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/DuplicateCandidateList" } },
          },
        },
      ]),
    },
  };

  P["/v1/crm/duplicates/{id}"] = {
    get: {
      ...sec("Duplicates"),
      summary: "Get duplicate candidate",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Duplicate candidate",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/DuplicateCandidateEnvelope" } },
          },
        },
      ]),
    },
  };

  P["/v1/crm/duplicates/{id}/review"] = {
    post: {
      ...sec("Duplicates"),
      summary: "Review duplicate candidate",
      parameters: idParam(),
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/ReviewDuplicateRequest" } } },
      },
      responses: mergeResponses([
        "200",
        {
          description: "Reviewed",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/DuplicateCandidateEnvelope" } },
          },
        },
      ]),
    },
  };

  P["/v1/crm/merges"] = {
    post: {
      ...sec("Merges"),
      summary: "Execute merge",
      description: "Requires `Idempotency-Key` header. Returns 201 on first execution, 200 on replay.",
      parameters: idempotency(),
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/ExecuteMergeRequest" } } },
      },
      responses: mergeResponses(
        [
          "201",
          {
            description: "Merge executed",
            content: { "application/json": { schema: { $ref: "#/components/schemas/MergeEnvelope" } } },
          },
        ],
        [
          "200",
          {
            description: "Idempotent replay",
            content: { "application/json": { schema: { $ref: "#/components/schemas/MergeEnvelope" } } },
          },
        ],
      ),
    },
  };

  P["/v1/crm/merges/{id}"] = {
    get: {
      ...sec("Merges"),
      summary: "Get merge record",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Merge record",
          content: { "application/json": { schema: { $ref: "#/components/schemas/MergeEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/imports"] = {
    post: {
      ...sec("Imports"),
      summary: "Create import batch",
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/CreateImportRequest" } } },
      },
      responses: mergeResponses([
        "201",
        {
          description: "Import batch created",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ImportBatchEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/imports/{id}"] = {
    get: {
      ...sec("Imports"),
      summary: "Get import batch",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Import batch",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ImportBatchEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/imports/{id}/validate"] = {
    post: {
      ...sec("Imports"),
      summary: "Validate import batch",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Validated",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ImportBatchEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/imports/{id}/execute"] = {
    post: {
      ...sec("Imports"),
      summary: "Execute import batch",
      description: "Requires `Idempotency-Key` header.",
      parameters: [...idParam(), ...idempotency()],
      responses: mergeResponses([
        "200",
        {
          description: "Committed (or idempotent replay)",
          content: { "application/json": { schema: { $ref: "#/components/schemas/ImportBatchEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/tags"] = {
    get: {
      ...sec("Tags"),
      summary: "List tags",
      parameters: [{ name: "includeArchived", in: "query", schema: { type: "string", enum: ["true"] } }],
      responses: mergeResponses([
        "200",
        {
          description: "Tags",
          content: { "application/json": { schema: { $ref: "#/components/schemas/TagList" } } },
        },
      ]),
    },
    post: {
      ...sec("Tags"),
      summary: "Create tag",
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTagRequest" } } },
      },
      responses: mergeResponses([
        "201",
        {
          description: "Created",
          content: { "application/json": { schema: { $ref: "#/components/schemas/TagEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/tags/{id}"] = {
    get: {
      ...sec("Tags"),
      summary: "Get tag",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Tag",
          content: { "application/json": { schema: { $ref: "#/components/schemas/TagEnvelope" } } },
        },
      ]),
    },
    patch: {
      ...sec("Tags"),
      summary: "Update tag",
      parameters: [...idParam(), ...ifMatch()],
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateTagRequest" } } },
      },
      responses: mergeResponses([
        "200",
        {
          description: "Updated",
          content: { "application/json": { schema: { $ref: "#/components/schemas/TagEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/tags/{id}/archive"] = {
    post: {
      ...sec("Tags"),
      summary: "Archive tag",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Archived",
          content: { "application/json": { schema: { $ref: "#/components/schemas/TagEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/tag-assignments"] = {
    get: {
      ...sec("TagAssignments"),
      summary: "List tag assignments",
      parameters: [
        { name: "tagId", in: "query", schema: { type: "string", format: "uuid" } },
        { name: "entityType", in: "query", schema: { type: "string" } },
        { name: "entityId", in: "query", schema: { type: "string", format: "uuid" } },
        { $ref: "#/components/parameters/Limit" },
        { $ref: "#/components/parameters/Cursor" },
      ],
      responses: mergeResponses([
        "200",
        {
          description: "Tag assignments",
          content: { "application/json": { schema: { $ref: "#/components/schemas/EntityTagList" } } },
        },
      ]),
    },
    post: {
      ...sec("TagAssignments"),
      summary: "Assign tag to entity",
      requestBody: {
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/AssignTagRequest" } } },
      },
      responses: mergeResponses([
        "201",
        {
          description: "Assigned",
          content: { "application/json": { schema: { $ref: "#/components/schemas/EntityTagEnvelope" } } },
        },
      ]),
    },
  };

  P["/v1/crm/tag-assignments/{id}"] = {
    delete: {
      ...sec("TagAssignments"),
      summary: "Remove tag assignment",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Removed",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/RemoveTagAssignmentResponse" } },
          },
        },
      ]),
    },
  };

  P["/v1/crm/external-identifiers/lookup/{systemKey}/{externalId}"] = {
    get: {
      ...sec("ExternalIdentifiers"),
      summary: "Lookup external identifier",
      parameters: [{ $ref: "#/components/parameters/SystemKey" }, { $ref: "#/components/parameters/ExternalId" }],
      responses: mergeResponses([
        "200",
        {
          description: "External identifier",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ExternalIdentifierEnvelope" } },
          },
        },
      ]),
    },
  };

  P["/v1/crm/external-identifiers"] = {
    post: {
      ...sec("ExternalIdentifiers"),
      summary: "Create external identifier",
      requestBody: {
        required: true,
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/CreateExternalIdentifierRequest" } },
        },
      },
      responses: mergeResponses([
        "201",
        {
          description: "Created",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ExternalIdentifierEnvelope" } },
          },
        },
      ]),
    },
  };

  P["/v1/crm/external-identifiers/{id}"] = {
    get: {
      ...sec("ExternalIdentifiers"),
      summary: "Get external identifier",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "External identifier",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ExternalIdentifierEnvelope" } },
          },
        },
      ]),
    },
    delete: {
      ...sec("ExternalIdentifiers"),
      summary: "Delete external identifier",
      parameters: idParam(),
      responses: mergeResponses([
        "200",
        {
          description: "Deleted",
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/ExternalIdentifierEnvelope" } },
          },
        },
      ]),
    },
  };

  return P;
}

export function buildSpec() {
  const spec = extractSpecObject();
  if (typeof spec.info?.description === "string") {
    spec.info.description = spec.info.description.replace(/\\n/g, "\n");
  }
  spec.paths = buildPaths();
  return spec;
}
