#!/usr/bin/env python3
"""Generate crm-c1.yaml OpenAPI spec from route inventory."""
from pathlib import Path
import yaml

OUT = Path(__file__).resolve().parent / "crm-c1.yaml"

STD_ERRORS = {
    "400": {"$ref": "#/components/responses/BadRequest"},
    "401": {"$ref": "#/components/responses/Unauthorized"},
    "403": {"$ref": "#/components/responses/Forbidden"},
    "404": {"$ref": "#/components/responses/NotFound"},
    "409": {"$ref": "#/components/responses/Conflict"},
}

AUTH = [{"bearerAuth": []}]


def merge_responses(*extra):
    r = dict(STD_ERRORS)
    for code, val in extra:
        r[code] = val
    return r


def ok(desc, schema_ref, code="200"):
    return {code: {"description": desc, "content": {"application/json": {"schema": {"$ref": schema_ref}}}}}


def sec(*tags):
    return {"tags": list(tags), "security": AUTH}


def id_param(name="id", desc="Resource UUID"):
    return [{"$ref": "#/components/parameters/Id", "name": name, "description": desc}]


def org_id():
    return [{"$ref": "#/components/parameters/OrgId"}]


def if_match():
    return [{"$ref": "#/components/parameters/IfMatch"}]


def idempotency():
    return [{"$ref": "#/components/parameters/IdempotencyKey"}]


def limit_cursor(extra=None):
    params = [
        {"$ref": "#/components/parameters/Limit"},
        {"$ref": "#/components/parameters/Cursor"},
    ]
    if extra:
        params = extra + params
    return params


spec = {
    "openapi": "3.1.0",
    "info": {
        "title": "Serengeti EOS CRM API (C1)",
        "version": "1.0.0",
        "description": (
            "CRM bounded context — Increment C1 (`/v1/crm/*`).\n"
            "Development/Testing only. Not production-ready.\n"
            "Authentication: bearer token (local IdP in Development).\n"
            "Optimistic concurrency: `If-Match` header (entity version integer) on PATCH where noted.\n"
            "Idempotency: `Idempotency-Key` header required on merge execute and import execute."
        ),
    },
    "servers": [{"url": "http://127.0.0.1:8080", "description": "Local Development"}],
    "tags": [
        {"name": "Health", "description": "Module health (Dev/Test)"},
        {"name": "Dev", "description": "Development/Testing diagnostics only"},
        {"name": "Catalogues"},
        {"name": "Organizations"},
        {"name": "OrganizationUnits"},
        {"name": "Contacts"},
        {"name": "Relationships"},
        {"name": "Activities"},
        {"name": "Accounts"},
        {"name": "Notes"},
        {"name": "Tasks"},
        {"name": "Search"},
        {"name": "Duplicates"},
        {"name": "Merges"},
        {"name": "Imports"},
        {"name": "Tags"},
        {"name": "TagAssignments"},
        {"name": "ExternalIdentifiers"},
    ],
    "paths": {},
    "components": {
        "securitySchemes": {
            "bearerAuth": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}
        },
        "parameters": {
            "Id": {
                "name": "id",
                "in": "path",
                "required": True,
                "schema": {"type": "string", "format": "uuid"},
            },
            "OrgId": {
                "name": "orgId",
                "in": "path",
                "required": True,
                "schema": {"type": "string", "format": "uuid"},
                "description": "Organization UUID",
            },
            "IfMatch": {
                "name": "If-Match",
                "in": "header",
                "required": False,
                "schema": {"type": "integer"},
                "description": "Expected entity version for optimistic concurrency",
            },
            "IdempotencyKey": {
                "name": "Idempotency-Key",
                "in": "header",
                "required": True,
                "schema": {"type": "string"},
                "description": "Client-supplied idempotency key",
            },
            "Limit": {
                "name": "limit",
                "in": "query",
                "required": False,
                "schema": {"type": "integer", "minimum": 1},
            },
            "Cursor": {
                "name": "cursor",
                "in": "query",
                "required": False,
                "schema": {"type": "string"},
            },
            "SystemKey": {
                "name": "systemKey",
                "in": "path",
                "required": True,
                "schema": {"type": "string"},
            },
            "ExternalId": {
                "name": "externalId",
                "in": "path",
                "required": True,
                "schema": {"type": "string"},
            },
        },
        "responses": {
            "Unauthorized": {
                "description": "Missing or invalid bearer token",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/UnauthenticatedError"}}
                },
            },
            "BadRequest": {
                "description": "Invalid request",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CrmError"}}},
            },
            "Forbidden": {
                "description": "Authorization denied",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CrmError"}}},
            },
            "NotFound": {
                "description": "Resource not found or not visible",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CrmError"}}},
            },
            "Conflict": {
                "description": "Conflict (version mismatch, duplicate, invalid state)",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CrmError"}}},
            },
        },
        "schemas": {
            "UnauthenticatedError": {
                "type": "object",
                "required": ["error"],
                "properties": {"error": {"type": "string", "enum": ["unauthenticated"]}},
            },
            "CrmError": {
                "type": "object",
                "required": ["error"],
                "properties": {
                    "error": {
                        "type": "string",
                        "enum": ["invalid_request", "forbidden", "not_found", "conflict"],
                    },
                    "reason": {"type": "string"},
                },
            },
            "Classification": {
                "type": "string",
                "enum": ["Public", "Internal", "Confidential", "Restricted", "HighlyRestricted"],
            },
            "CatalogueType": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "key": {"type": "string"},
                    "label": {"type": "string"},
                    "active": {"type": "boolean"},
                },
            },
            "CatalogueList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/CatalogueType"}}
                },
            },
            "CrmModuleHealth": {
                "type": "object",
                "properties": {
                    "module": {"type": "string", "enum": ["crm"]},
                    "increment": {"type": "string"},
                    "environment": {"type": "string", "enum": ["Development/Test"]},
                    "productionReady": {"type": "boolean", "enum": [False]},
                    "entities": {"type": "object", "additionalProperties": {"type": "integer"}},
                    "note": {"type": "string"},
                },
            },
            "OutboxEventList": {
                "type": "object",
                "required": ["items"],
                "properties": {"items": {"type": "array", "items": {"type": "object"}}},
            },
            "Organization": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "legalName": {"type": "string"},
                    "tradingName": {"type": "string"},
                    "organizationTypeId": {"type": "string", "format": "uuid"},
                    "country": {"type": "string"},
                    "region": {"type": "string"},
                    "market": {"type": "string"},
                    "website": {"type": "string"},
                    "domain": {"type": "string"},
                    "primaryEmail": {"type": "string"},
                    "primaryTelephone": {"type": "string"},
                    "address": {"type": "object", "additionalProperties": True},
                    "status": {
                        "type": "string",
                        "enum": [
                            "Prospect", "Engaged", "Qualified", "Active",
                            "Dormant", "Disqualified", "Archived",
                        ],
                    },
                    "dataQualityStatus": {"type": "string"},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                    "ownerPrincipalId": {"type": "string", "format": "uuid"},
                    "source": {"type": "string"},
                    "version": {"type": "integer"},
                    "mergedIntoId": {"type": "string", "format": "uuid"},
                    "archivedAt": {"type": "string", "format": "date-time"},
                    "createdAt": {"type": "string", "format": "date-time"},
                    "updatedAt": {"type": "string", "format": "date-time"},
                    "createdByPrincipalId": {"type": "string", "format": "uuid"},
                    "updatedByPrincipalId": {"type": "string", "format": "uuid"},
                },
            },
            "OrganizationList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/Organization"}}
                },
            },
            "OrganizationEnvelope": {
                "type": "object",
                "required": ["organization"],
                "properties": {"organization": {"$ref": "#/components/schemas/Organization"}},
            },
            "CreateOrganizationRequest": {
                "type": "object",
                "required": ["legalName", "organizationTypeId"],
                "properties": {
                    "legalName": {"type": "string"},
                    "tradingName": {"type": "string"},
                    "organizationTypeId": {"type": "string", "format": "uuid"},
                    "country": {"type": "string"},
                    "region": {"type": "string"},
                    "market": {"type": "string"},
                    "website": {"type": "string"},
                    "domain": {"type": "string"},
                    "primaryEmail": {"type": "string"},
                    "primaryTelephone": {"type": "string"},
                    "address": {"type": "object", "additionalProperties": True},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                    "ownerPrincipalId": {"type": "string", "format": "uuid"},
                    "source": {"type": "string"},
                },
            },
            "UpdateOrganizationRequest": {
                "type": "object",
                "properties": {
                    "legalName": {"type": "string"},
                    "tradingName": {"type": "string"},
                    "organizationTypeId": {"type": "string", "format": "uuid"},
                    "country": {"type": "string"},
                    "region": {"type": "string"},
                    "market": {"type": "string"},
                    "website": {"type": "string"},
                    "domain": {"type": "string"},
                    "primaryEmail": {"type": "string"},
                    "primaryTelephone": {"type": "string"},
                    "address": {"type": "object", "additionalProperties": True},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                    "ownerPrincipalId": {"type": "string", "format": "uuid"},
                    "source": {"type": "string"},
                },
            },
            "OrganizationTransitionRequest": {
                "type": "object",
                "required": ["to"],
                "properties": {
                    "to": {
                        "type": "string",
                        "enum": [
                            "Prospect", "Engaged", "Qualified", "Active",
                            "Dormant", "Disqualified", "Archived",
                        ],
                    },
                    "reason": {"type": "string"},
                },
            },
            "OrganizationUnit": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "organizationId": {"type": "string", "format": "uuid"},
                    "parentUnitId": {"type": "string", "format": "uuid"},
                    "name": {"type": "string"},
                    "unitType": {
                        "type": "string",
                        "enum": [
                            "division", "department", "branch",
                            "regional_office", "subsidiary", "business_unit",
                        ],
                    },
                    "createdAt": {"type": "string", "format": "date-time"},
                    "updatedAt": {"type": "string", "format": "date-time"},
                },
            },
            "OrganizationUnitList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/OrganizationUnit"}}
                },
            },
            "OrganizationUnitEnvelope": {
                "type": "object",
                "required": ["unit"],
                "properties": {"unit": {"$ref": "#/components/schemas/OrganizationUnit"}},
            },
            "CreateOrganizationUnitRequest": {
                "type": "object",
                "required": ["name", "unitType"],
                "properties": {
                    "name": {"type": "string"},
                    "unitType": {"type": "string"},
                    "parentUnitId": {"type": "string", "format": "uuid"},
                },
            },
            "UpdateOrganizationUnitRequest": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "unitType": {"type": "string"},
                    "parentUnitId": {"type": ["string", "null"], "format": "uuid"},
                },
            },
            "Contact": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "givenName": {"type": "string"},
                    "familyName": {"type": "string"},
                    "preferredName": {"type": "string"},
                    "jobTitle": {"type": "string"},
                    "department": {"type": "string"},
                    "email": {"type": "string"},
                    "telephone": {"type": "string"},
                    "mobile": {"type": "string"},
                    "country": {"type": "string"},
                    "timezone": {"type": "string"},
                    "language": {"type": "string"},
                    "status": {"type": "string", "enum": ["Active", "Inactive", "Archived"]},
                    "dataQualityStatus": {"type": "string"},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                    "communicationPreferences": {"type": "object", "additionalProperties": True},
                    "source": {"type": "string"},
                    "mergedIntoId": {"type": "string", "format": "uuid"},
                    "archivedAt": {"type": "string", "format": "date-time"},
                    "version": {"type": "integer"},
                    "createdAt": {"type": "string", "format": "date-time"},
                    "updatedAt": {"type": "string", "format": "date-time"},
                    "createdByPrincipalId": {"type": "string", "format": "uuid"},
                    "updatedByPrincipalId": {"type": "string", "format": "uuid"},
                },
            },
            "ContactList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/Contact"}}
                },
            },
            "ContactEnvelope": {
                "type": "object",
                "required": ["contact"],
                "properties": {"contact": {"$ref": "#/components/schemas/Contact"}},
            },
            "CreateContactRequest": {
                "type": "object",
                "required": ["givenName", "familyName"],
                "properties": {
                    "givenName": {"type": "string"},
                    "familyName": {"type": "string"},
                    "preferredName": {"type": "string"},
                    "jobTitle": {"type": "string"},
                    "department": {"type": "string"},
                    "email": {"type": "string"},
                    "telephone": {"type": "string"},
                    "mobile": {"type": "string"},
                    "country": {"type": "string"},
                    "timezone": {"type": "string"},
                    "language": {"type": "string"},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                    "communicationPreferences": {"type": "object", "additionalProperties": True},
                    "source": {"type": "string"},
                },
            },
            "UpdateContactRequest": {
                "allOf": [
                    {"$ref": "#/components/schemas/CreateContactRequest"},
                    {
                        "type": "object",
                        "properties": {
                            "status": {"type": "string", "enum": ["Active", "Inactive", "Archived"]}
                        },
                    },
                ]
            },
            "Relationship": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "relationshipTypeId": {"type": "string", "format": "uuid"},
                    "status": {
                        "type": "string",
                        "enum": [
                            "Unknown", "Identified", "Contacted", "Engaged", "Partner",
                            "Strategic", "Dormant", "Disqualified",
                        ],
                    },
                    "fromOrganizationId": {"type": "string", "format": "uuid"},
                    "toOrganizationId": {"type": "string", "format": "uuid"},
                    "fromContactId": {"type": "string", "format": "uuid"},
                    "toContactId": {"type": "string", "format": "uuid"},
                    "organizationUnitId": {"type": "string", "format": "uuid"},
                    "notes": {"type": "string"},
                    "version": {"type": "integer"},
                    "createdAt": {"type": "string", "format": "date-time"},
                    "updatedAt": {"type": "string", "format": "date-time"},
                    "createdByPrincipalId": {"type": "string", "format": "uuid"},
                    "updatedByPrincipalId": {"type": "string", "format": "uuid"},
                },
            },
            "RelationshipList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/Relationship"}}
                },
            },
            "RelationshipEnvelope": {
                "type": "object",
                "required": ["relationship"],
                "properties": {"relationship": {"$ref": "#/components/schemas/Relationship"}},
            },
            "CreateRelationshipRequest": {
                "type": "object",
                "required": ["relationshipTypeId"],
                "properties": {
                    "relationshipTypeId": {"type": "string", "format": "uuid"},
                    "contactId": {"type": "string", "format": "uuid"},
                    "organizationId": {"type": "string", "format": "uuid"},
                    "organizationUnitId": {"type": "string", "format": "uuid"},
                    "fromOrganizationId": {"type": "string", "format": "uuid"},
                    "toOrganizationId": {"type": "string", "format": "uuid"},
                    "notes": {"type": "string"},
                    "status": {"$ref": "#/components/schemas/Relationship/properties/status"},
                },
            },
            "UpdateRelationshipRequest": {
                "type": "object",
                "properties": {
                    "notes": {"type": "string"},
                    "organizationUnitId": {"type": ["string", "null"], "format": "uuid"},
                },
            },
            "RelationshipTransitionRequest": {
                "type": "object",
                "required": ["to"],
                "properties": {
                    "to": {"$ref": "#/components/schemas/Relationship/properties/status"},
                    "reason": {"type": "string"},
                },
            },
            "Activity": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "activityType": {"type": "string"},
                    "subject": {"type": "string"},
                    "occurredAt": {"type": "string", "format": "date-time"},
                    "organizationId": {"type": "string", "format": "uuid"},
                    "organizationUnitId": {"type": "string", "format": "uuid"},
                    "contactId": {"type": "string", "format": "uuid"},
                    "relationshipId": {"type": "string", "format": "uuid"},
                    "ownerPrincipalId": {"type": "string", "format": "uuid"},
                    "outcome": {"type": "string"},
                    "notes": {"type": "string"},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                    "version": {"type": "integer"},
                    "archivedAt": {"type": "string", "format": "date-time"},
                    "createdAt": {"type": "string", "format": "date-time"},
                    "updatedAt": {"type": "string", "format": "date-time"},
                    "createdByPrincipalId": {"type": "string", "format": "uuid"},
                    "updatedByPrincipalId": {"type": "string", "format": "uuid"},
                },
            },
            "ActivityList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/Activity"}},
                    "nextCursor": {"type": "string"},
                },
            },
            "ActivityEnvelope": {
                "type": "object",
                "required": ["activity"],
                "properties": {"activity": {"$ref": "#/components/schemas/Activity"}},
            },
            "CreateActivityRequest": {
                "type": "object",
                "required": ["activityType", "subject", "occurredAt"],
                "properties": {
                    "activityType": {"type": "string"},
                    "subject": {"type": "string"},
                    "occurredAt": {"type": "string", "format": "date-time"},
                    "contactId": {"type": "string", "format": "uuid"},
                    "organizationId": {"type": "string", "format": "uuid"},
                    "organizationUnitId": {"type": "string", "format": "uuid"},
                    "relationshipId": {"type": "string", "format": "uuid"},
                    "ownerPrincipalId": {"type": "string", "format": "uuid"},
                    "outcome": {"type": "string"},
                    "notes": {"type": "string"},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                },
            },
            "UpdateActivityRequest": {
                "type": "object",
                "properties": {
                    "activityType": {"type": "string"},
                    "subject": {"type": "string"},
                    "occurredAt": {"type": "string", "format": "date-time"},
                    "outcome": {"type": "string"},
                    "notes": {"type": "string"},
                },
            },
            "Account": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "organizationId": {"type": "string", "format": "uuid"},
                    "relationshipId": {"type": "string", "format": "uuid"},
                    "accountName": {"type": "string"},
                    "ownerPrincipalId": {"type": "string", "format": "uuid"},
                    "market": {"type": "string"},
                    "strategicClassification": {"type": "string"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "strategic"]},
                    "nextAction": {"type": "string"},
                    "status": {
                        "type": "string",
                        "enum": ["Prospect", "Active", "OnHold", "Closed", "Archived"],
                    },
                    "classification": {"$ref": "#/components/schemas/Classification"},
                    "version": {"type": "integer"},
                    "archivedAt": {"type": "string", "format": "date-time"},
                    "createdAt": {"type": "string", "format": "date-time"},
                    "updatedAt": {"type": "string", "format": "date-time"},
                    "createdByPrincipalId": {"type": "string", "format": "uuid"},
                    "updatedByPrincipalId": {"type": "string", "format": "uuid"},
                },
            },
            "AccountList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/Account"}},
                    "nextCursor": {"type": "string"},
                },
            },
            "AccountEnvelope": {
                "type": "object",
                "required": ["account"],
                "properties": {"account": {"$ref": "#/components/schemas/Account"}},
            },
            "CreateAccountRequest": {
                "type": "object",
                "required": ["organizationId", "accountName"],
                "properties": {
                    "organizationId": {"type": "string", "format": "uuid"},
                    "accountName": {"type": "string"},
                    "relationshipId": {"type": "string", "format": "uuid"},
                    "ownerPrincipalId": {"type": "string", "format": "uuid"},
                    "market": {"type": "string"},
                    "strategicClassification": {"type": "string"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "strategic"]},
                    "nextAction": {"type": "string"},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                },
            },
            "UpdateAccountRequest": {
                "type": "object",
                "properties": {
                    "accountName": {"type": "string"},
                    "market": {"type": "string"},
                    "strategicClassification": {"type": "string"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "strategic"]},
                    "nextAction": {"type": "string"},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                },
            },
            "AccountTransitionRequest": {
                "type": "object",
                "required": ["to"],
                "properties": {
                    "to": {
                        "type": "string",
                        "enum": ["Prospect", "Active", "OnHold", "Closed"],
                    }
                },
            },
            "ReassignAccountOwnerRequest": {
                "type": "object",
                "required": ["ownerPrincipalId"],
                "properties": {"ownerPrincipalId": {"type": "string", "format": "uuid"}},
            },
            "Note": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "body": {"type": "string"},
                    "entityType": {
                        "type": "string",
                        "enum": [
                            "organization", "organization_unit", "contact",
                            "relationship", "account", "activity",
                        ],
                    },
                    "entityId": {"type": "string", "format": "uuid"},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                    "version": {"type": "integer"},
                    "archivedAt": {"type": "string", "format": "date-time"},
                    "createdAt": {"type": "string", "format": "date-time"},
                    "updatedAt": {"type": "string", "format": "date-time"},
                    "createdByPrincipalId": {"type": "string", "format": "uuid"},
                    "updatedByPrincipalId": {"type": "string", "format": "uuid"},
                },
            },
            "NoteList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/Note"}},
                    "nextCursor": {"type": "string"},
                },
            },
            "NoteEnvelope": {
                "type": "object",
                "required": ["note"],
                "properties": {"note": {"$ref": "#/components/schemas/Note"}},
            },
            "CreateNoteRequest": {
                "type": "object",
                "required": ["body", "entityType", "entityId"],
                "properties": {
                    "body": {"type": "string"},
                    "entityType": {"$ref": "#/components/schemas/Note/properties/entityType"},
                    "entityId": {"type": "string", "format": "uuid"},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                },
            },
            "UpdateNoteRequest": {
                "type": "object",
                "properties": {"body": {"type": "string"}},
            },
            "Task": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "title": {"type": "string"},
                    "description": {"type": "string"},
                    "assigneePrincipalId": {"type": "string", "format": "uuid"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "urgent"]},
                    "dueAt": {"type": "string", "format": "date-time"},
                    "status": {
                        "type": "string",
                        "enum": ["Open", "InProgress", "Completed", "Cancelled", "Deferred"],
                    },
                    "relatedOrganizationId": {"type": "string", "format": "uuid"},
                    "relatedContactId": {"type": "string", "format": "uuid"},
                    "relatedAccountId": {"type": "string", "format": "uuid"},
                    "relatedActivityId": {"type": "string", "format": "uuid"},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                    "version": {"type": "integer"},
                    "completedAt": {"type": "string", "format": "date-time"},
                    "createdAt": {"type": "string", "format": "date-time"},
                    "updatedAt": {"type": "string", "format": "date-time"},
                    "createdByPrincipalId": {"type": "string", "format": "uuid"},
                    "updatedByPrincipalId": {"type": "string", "format": "uuid"},
                },
            },
            "TaskList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/Task"}},
                    "nextCursor": {"type": "string"},
                },
            },
            "TaskEnvelope": {
                "type": "object",
                "required": ["task"],
                "properties": {"task": {"$ref": "#/components/schemas/Task"}},
            },
            "CreateTaskRequest": {
                "type": "object",
                "required": ["title"],
                "properties": {
                    "title": {"type": "string"},
                    "description": {"type": "string"},
                    "assigneePrincipalId": {"type": "string", "format": "uuid"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "urgent"]},
                    "dueAt": {"type": "string", "format": "date-time"},
                    "relatedOrganizationId": {"type": "string", "format": "uuid"},
                    "relatedContactId": {"type": "string", "format": "uuid"},
                    "relatedAccountId": {"type": "string", "format": "uuid"},
                    "relatedActivityId": {"type": "string", "format": "uuid"},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                },
            },
            "UpdateTaskRequest": {
                "type": "object",
                "properties": {
                    "title": {"type": "string"},
                    "description": {"type": "string"},
                    "assigneePrincipalId": {"type": "string", "format": "uuid"},
                    "priority": {"type": "string", "enum": ["low", "medium", "high", "urgent"]},
                    "dueAt": {"type": "string", "format": "date-time"},
                    "status": {"$ref": "#/components/schemas/Task/properties/status"},
                },
            },
            "SearchResult": {
                "type": "object",
                "properties": {
                    "entityType": {
                        "type": "string",
                        "enum": ["organization", "contact", "account", "activity", "task"],
                    },
                    "entityId": {"type": "string", "format": "uuid"},
                    "displayLabel": {"type": "string"},
                    "matchedField": {"type": "string"},
                    "classification": {"$ref": "#/components/schemas/Classification"},
                },
            },
            "SearchResultList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/SearchResult"}},
                    "nextCursor": {"type": "string"},
                },
            },
            "DuplicateCandidate": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "entityType": {"type": "string", "enum": ["organization", "contact"]},
                    "entityIdA": {"type": "string", "format": "uuid"},
                    "entityIdB": {"type": "string", "format": "uuid"},
                    "score": {"type": "number"},
                    "detectionRule": {"type": "string"},
                    "matchReason": {"type": "string"},
                    "status": {
                        "type": "string",
                        "enum": [
                            "PotentialDuplicate", "UnderReview",
                            "ConfirmedDuplicate", "NotDuplicate",
                        ],
                    },
                    "detectedAt": {"type": "string", "format": "date-time"},
                    "reviewedAt": {"type": "string", "format": "date-time"},
                    "reviewedByPrincipalId": {"type": "string", "format": "uuid"},
                    "reviewReason": {"type": "string"},
                },
            },
            "DuplicateCandidateList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/DuplicateCandidate"}},
                    "nextCursor": {"type": "string"},
                },
            },
            "DuplicateCandidateEnvelope": {
                "type": "object",
                "required": ["candidate"],
                "properties": {"candidate": {"$ref": "#/components/schemas/DuplicateCandidate"}},
            },
            "ReviewDuplicateRequest": {
                "type": "object",
                "required": ["decision", "reason"],
                "properties": {
                    "decision": {"type": "string", "enum": ["confirm", "reject"]},
                    "reason": {"type": "string"},
                },
            },
            "MergeRecord": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "entityType": {"type": "string", "enum": ["organization", "contact"]},
                    "survivorId": {"type": "string", "format": "uuid"},
                    "mergedIds": {"type": "array", "items": {"type": "string", "format": "uuid"}},
                    "duplicateCandidateId": {"type": "string", "format": "uuid"},
                    "fieldResolutions": {"type": "object", "additionalProperties": True},
                    "reason": {"type": "string"},
                    "idempotencyKey": {"type": "string"},
                    "affectedCounts": {"type": "object", "additionalProperties": {"type": "integer"}},
                    "mergedAt": {"type": "string", "format": "date-time"},
                    "mergedByPrincipalId": {"type": "string", "format": "uuid"},
                },
            },
            "MergeEnvelope": {
                "type": "object",
                "required": ["merge"],
                "properties": {
                    "merge": {"$ref": "#/components/schemas/MergeRecord"},
                    "replay": {"type": "boolean"},
                },
            },
            "ExecuteMergeRequest": {
                "type": "object",
                "required": ["entityType", "survivorId", "duplicateIds", "reason"],
                "properties": {
                    "entityType": {"type": "string", "enum": ["organization", "contact"]},
                    "survivorId": {"type": "string", "format": "uuid"},
                    "duplicateIds": {
                        "type": "array",
                        "items": {"type": "string", "format": "uuid"},
                        "minItems": 1,
                        "maxItems": 1,
                    },
                    "fieldResolutions": {"type": "object", "additionalProperties": True},
                    "reason": {"type": "string"},
                    "duplicateCandidateId": {"type": "string", "format": "uuid"},
                    "expectedVersions": {
                        "type": "object",
                        "additionalProperties": {"type": "integer"},
                    },
                },
            },
            "ImportBatch": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "sourceSystem": {"type": "string"},
                    "entityType": {"type": "string", "enum": ["organization", "contact"]},
                    "mode": {"type": "string", "enum": ["create_only"]},
                    "status": {
                        "type": "string",
                        "enum": ["pending", "validated", "committed", "failed"],
                    },
                    "rowCount": {"type": "integer"},
                    "validCount": {"type": "integer"},
                    "invalidCount": {"type": "integer"},
                    "committedCount": {"type": "integer"},
                    "validationResults": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/ImportRowResult"},
                    },
                    "createdAt": {"type": "string", "format": "date-time"},
                    "validatedAt": {"type": "string", "format": "date-time"},
                    "committedAt": {"type": "string", "format": "date-time"},
                    "createdByPrincipalId": {"type": "string", "format": "uuid"},
                    "committedByPrincipalId": {"type": "string", "format": "uuid"},
                },
            },
            "ImportRowResult": {
                "type": "object",
                "properties": {
                    "rowNumber": {"type": "integer"},
                    "status": {
                        "type": "string",
                        "enum": ["valid", "invalid", "committed", "skipped"],
                    },
                    "errors": {"type": "array", "items": {"type": "string"}},
                    "entityId": {"type": "string", "format": "uuid"},
                    "warnings": {"type": "array", "items": {"type": "string"}},
                },
            },
            "ImportBatchEnvelope": {
                "type": "object",
                "required": ["batch"],
                "properties": {
                    "batch": {"$ref": "#/components/schemas/ImportBatch"},
                    "replay": {"type": "boolean"},
                },
            },
            "CreateImportRequest": {
                "type": "object",
                "required": ["sourceSystem", "entityType", "csv"],
                "properties": {
                    "sourceSystem": {"type": "string"},
                    "entityType": {"type": "string", "enum": ["organization", "contact"]},
                    "csv": {"type": "string", "description": "CSV content with header row"},
                },
            },
            "Tag": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "key": {"type": "string"},
                    "label": {"type": "string"},
                    "active": {"type": "boolean"},
                    "archivedAt": {"type": "string", "format": "date-time"},
                    "version": {"type": "integer"},
                    "createdAt": {"type": "string", "format": "date-time"},
                    "updatedAt": {"type": "string", "format": "date-time"},
                    "createdByPrincipalId": {"type": "string", "format": "uuid"},
                    "updatedByPrincipalId": {"type": "string", "format": "uuid"},
                },
            },
            "TagList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/Tag"}}
                },
            },
            "TagEnvelope": {
                "type": "object",
                "required": ["tag"],
                "properties": {"tag": {"$ref": "#/components/schemas/Tag"}},
            },
            "CreateTagRequest": {
                "type": "object",
                "required": ["key", "label"],
                "properties": {"key": {"type": "string"}, "label": {"type": "string"}},
            },
            "UpdateTagRequest": {
                "type": "object",
                "properties": {"label": {"type": "string"}},
            },
            "EntityTag": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "tagId": {"type": "string", "format": "uuid"},
                    "entityType": {
                        "type": "string",
                        "enum": [
                            "organization", "organization_unit", "contact",
                            "relationship", "account", "activity", "task",
                        ],
                    },
                    "entityId": {"type": "string", "format": "uuid"},
                    "createdAt": {"type": "string", "format": "date-time"},
                    "createdByPrincipalId": {"type": "string", "format": "uuid"},
                },
            },
            "EntityTagList": {
                "type": "object",
                "required": ["items"],
                "properties": {
                    "items": {"type": "array", "items": {"$ref": "#/components/schemas/EntityTag"}},
                    "nextCursor": {"type": "string"},
                },
            },
            "EntityTagEnvelope": {
                "type": "object",
                "required": ["assignment"],
                "properties": {"assignment": {"$ref": "#/components/schemas/EntityTag"}},
            },
            "AssignTagRequest": {
                "type": "object",
                "required": ["tagId", "entityType", "entityId"],
                "properties": {
                    "tagId": {"type": "string", "format": "uuid"},
                    "entityType": {"$ref": "#/components/schemas/EntityTag/properties/entityType"},
                    "entityId": {"type": "string", "format": "uuid"},
                },
            },
            "RemoveTagAssignmentResponse": {
                "type": "object",
                "required": ["removed"],
                "properties": {"removed": {"type": "boolean", "enum": [True]}},
            },
            "ExternalIdentifier": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "tenantId": {"type": "string", "format": "uuid"},
                    "systemKey": {"type": "string"},
                    "externalId": {"type": "string"},
                    "entityType": {"type": "string", "enum": ["organization", "contact"]},
                    "entityId": {"type": "string", "format": "uuid"},
                    "createdAt": {"type": "string", "format": "date-time"},
                    "createdByPrincipalId": {"type": "string", "format": "uuid"},
                },
            },
            "ExternalIdentifierEnvelope": {
                "type": "object",
                "required": ["externalIdentifier"],
                "properties": {
                    "externalIdentifier": {"$ref": "#/components/schemas/ExternalIdentifier"}
                },
            },
            "CreateExternalIdentifierRequest": {
                "type": "object",
                "required": ["entityType", "entityId", "systemKey", "externalId"],
                "properties": {
                    "entityType": {"type": "string", "enum": ["organization", "contact"]},
                    "entityId": {"type": "string", "format": "uuid"},
                    "systemKey": {"type": "string"},
                    "externalId": {"type": "string"},
                },
            },
        },
    },
}

P = spec["paths"]

# --- Health & Dev ---
P["/v1/crm/health"] = {
    "get": {
        **sec("Health"),
        "summary": "CRM module health (Dev/Test only)",
        "description": "Returns CRM module metadata and entity counts. Requires authentication only.",
        "responses": merge_responses(
            ("200", {
                "description": "Module health",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/CrmModuleHealth"}}
                },
            }),
        ),
    }
}

P["/v1/crm/dev/outbox-events"] = {
    "get": {
        **sec("Dev"),
        "summary": "List CRM outbox events (Dev/Test only)",
        "description": "Requires `events:read:operations` permission.",
        "parameters": [
            {
                "name": "limit",
                "in": "query",
                "schema": {"type": "integer", "minimum": 1, "maximum": 200},
            }
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Recent CRM outbox events",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/OutboxEventList"}}
                },
            }),
        ),
    }
}

# --- Catalogues ---
for path, tag, perm in [
    ("/v1/crm/organization-types", "Catalogues", "crm:read:organization"),
    ("/v1/crm/relationship-types", "Catalogues", "crm:read:relationship"),
    ("/v1/crm/activity-types", "Catalogues", "crm:read:activity"),
]:
    P[path] = {
        "get": {
            **sec(tag),
            "summary": f"List {path.split('/')[-1].replace('-', ' ')}",
            "description": f"Requires `{perm}` permission.",
            "responses": merge_responses(
                ("200", {
                    "description": "Catalogue items",
                    "content": {
                        "application/json": {"schema": {"$ref": "#/components/schemas/CatalogueList"}}
                    },
                }),
            ),
        }
    }

# --- Organizations ---
P["/v1/crm/organizations"] = {
    "get": {
        **sec("Organizations"),
        "summary": "List organizations",
        "parameters": [
            {"name": "status", "in": "query", "schema": {"type": "string"}},
            {"name": "organizationTypeId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Organizations",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/OrganizationList"}}},
            }),
        ),
    },
    "post": {
        **sec("Organizations"),
        "summary": "Create organization",
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {"schema": {"$ref": "#/components/schemas/CreateOrganizationRequest"}}
            },
        },
        "responses": merge_responses(
            ("201", {
                "description": "Created",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/OrganizationEnvelope"}}
                },
            }),
        ),
    },
}

P["/v1/crm/organizations/{id}"] = {
    "get": {
        **sec("Organizations"),
        "summary": "Get organization",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Organization",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/OrganizationEnvelope"}}
                },
            }),
        ),
    },
    "patch": {
        **sec("Organizations"),
        "summary": "Update organization",
        "parameters": id_param() + if_match(),
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {"schema": {"$ref": "#/components/schemas/UpdateOrganizationRequest"}}
            },
        },
        "responses": merge_responses(
            ("200", {
                "description": "Updated",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/OrganizationEnvelope"}}
                },
            }),
        ),
    },
}

P["/v1/crm/organizations/{id}/transitions"] = {
    "post": {
        **sec("Organizations"),
        "summary": "Transition organization status",
        "parameters": id_param(),
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {"schema": {"$ref": "#/components/schemas/OrganizationTransitionRequest"}}
            },
        },
        "responses": merge_responses(
            ("200", {
                "description": "Transitioned",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/OrganizationEnvelope"}}
                },
            }),
        ),
    }
}

P["/v1/crm/organizations/{id}/archive"] = {
    "post": {
        **sec("Organizations"),
        "summary": "Archive organization",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Archived",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/OrganizationEnvelope"}}
                },
            }),
        ),
    }
}

# --- Organization units ---
P["/v1/crm/organizations/{orgId}/units"] = {
    "get": {
        **sec("OrganizationUnits"),
        "summary": "List organization units",
        "parameters": org_id(),
        "responses": merge_responses(
            ("200", {
                "description": "Units",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/OrganizationUnitList"}}
                },
            }),
        ),
    },
    "post": {
        **sec("OrganizationUnits"),
        "summary": "Create organization unit",
        "parameters": org_id(),
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {"schema": {"$ref": "#/components/schemas/CreateOrganizationUnitRequest"}}
            },
        },
        "responses": merge_responses(
            ("201", {
                "description": "Created",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/OrganizationUnitEnvelope"}}
                },
            }),
        ),
    },
}

P["/v1/crm/organization-units/{id}"] = {
    "get": {
        **sec("OrganizationUnits"),
        "summary": "Get organization unit",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Unit",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/OrganizationUnitEnvelope"}}
                },
            }),
        ),
    },
    "patch": {
        **sec("OrganizationUnits"),
        "summary": "Update organization unit",
        "parameters": id_param(),
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {"schema": {"$ref": "#/components/schemas/UpdateOrganizationUnitRequest"}}
            },
        },
        "responses": merge_responses(
            ("200", {
                "description": "Updated",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/OrganizationUnitEnvelope"}}
                },
            }),
        ),
    },
}

# --- Contacts ---
P["/v1/crm/contacts"] = {
    "get": {
        **sec("Contacts"),
        "summary": "List contacts",
        "parameters": [
            {"name": "status", "in": "query", "schema": {"type": "string"}},
            {"name": "organizationId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"name": "email", "in": "query", "schema": {"type": "string"}},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Contacts",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ContactList"}}},
            }),
        ),
    },
    "post": {
        **sec("Contacts"),
        "summary": "Create contact",
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CreateContactRequest"}}},
        },
        "responses": merge_responses(
            ("201", {
                "description": "Created",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ContactEnvelope"}}},
            }),
        ),
    },
}

P["/v1/crm/contacts/{id}"] = {
    "get": {
        **sec("Contacts"),
        "summary": "Get contact",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Contact",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ContactEnvelope"}}},
            }),
        ),
    },
    "patch": {
        **sec("Contacts"),
        "summary": "Update contact",
        "parameters": id_param() + if_match(),
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/UpdateContactRequest"}}},
        },
        "responses": merge_responses(
            ("200", {
                "description": "Updated",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ContactEnvelope"}}},
            }),
        ),
    },
}

P["/v1/crm/contacts/{id}/archive"] = {
    "post": {
        **sec("Contacts"),
        "summary": "Archive contact",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Archived",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ContactEnvelope"}}},
            }),
        ),
    }
}

P["/v1/crm/contacts/{id}/relationships"] = {
    "get": {
        **sec("Relationships"),
        "summary": "List contact relationships",
        "parameters": id_param() + [
            {"name": "organizationId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"name": "status", "in": "query", "schema": {"type": "string"}},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Relationships",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/RelationshipList"}}
                },
            }),
        ),
    }
}

# --- Relationships ---
P["/v1/crm/relationships"] = {
    "get": {
        **sec("Relationships"),
        "summary": "List relationships",
        "parameters": [
            {"name": "contactId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"name": "organizationId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"name": "organizationUnitId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"name": "status", "in": "query", "schema": {"type": "string"}},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Relationships",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/RelationshipList"}}
                },
            }),
        ),
    },
    "post": {
        **sec("Relationships"),
        "summary": "Create relationship",
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {"schema": {"$ref": "#/components/schemas/CreateRelationshipRequest"}}
            },
        },
        "responses": merge_responses(
            ("201", {
                "description": "Created",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/RelationshipEnvelope"}}
                },
            }),
        ),
    },
}

P["/v1/crm/relationships/{id}"] = {
    "get": {
        **sec("Relationships"),
        "summary": "Get relationship",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Relationship",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/RelationshipEnvelope"}}
                },
            }),
        ),
    },
    "patch": {
        **sec("Relationships"),
        "summary": "Update relationship",
        "parameters": id_param() + if_match(),
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {"schema": {"$ref": "#/components/schemas/UpdateRelationshipRequest"}}
            },
        },
        "responses": merge_responses(
            ("200", {
                "description": "Updated",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/RelationshipEnvelope"}}
                },
            }),
        ),
    },
}

P["/v1/crm/relationships/{id}/transitions"] = {
    "post": {
        **sec("Relationships"),
        "summary": "Transition relationship status",
        "parameters": id_param(),
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {"schema": {"$ref": "#/components/schemas/RelationshipTransitionRequest"}}
            },
        },
        "responses": merge_responses(
            ("200", {
                "description": "Transitioned",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/RelationshipEnvelope"}}
                },
            }),
        ),
    }
}

P["/v1/crm/organizations/{orgId}/relationships"] = {
    "get": {
        **sec("Relationships"),
        "summary": "List organization relationships",
        "parameters": org_id() + [
            {"name": "contactId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"name": "status", "in": "query", "schema": {"type": "string"}},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Relationships",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/RelationshipList"}}
                },
            }),
        ),
    }
}

# --- Activities ---
activity_scoped_params = limit_cursor([
    {"name": "activityType", "in": "query", "schema": {"type": "string"}},
])

P["/v1/crm/activities"] = {
    "get": {
        **sec("Activities"),
        "summary": "List activities",
        "parameters": [
            {"name": "activityType", "in": "query", "schema": {"type": "string"}},
            {"name": "contactId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"name": "organizationId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"name": "organizationUnitId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"name": "relationshipId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"name": "occurredFrom", "in": "query", "schema": {"type": "string", "format": "date-time"}},
            {"name": "occurredTo", "in": "query", "schema": {"type": "string", "format": "date-time"}},
            {"name": "includeArchived", "in": "query", "schema": {"type": "string", "enum": ["true"]}},
            {"$ref": "#/components/parameters/Limit"},
            {"$ref": "#/components/parameters/Cursor"},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Activities",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ActivityList"}}},
            }),
        ),
    },
    "post": {
        **sec("Activities"),
        "summary": "Create activity",
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CreateActivityRequest"}}},
        },
        "responses": merge_responses(
            ("201", {
                "description": "Created",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ActivityEnvelope"}}},
            }),
        ),
    },
}

P["/v1/crm/activities/{id}"] = {
    "get": {
        **sec("Activities"),
        "summary": "Get activity",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Activity",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ActivityEnvelope"}}},
            }),
        ),
    },
    "patch": {
        **sec("Activities"),
        "summary": "Update activity",
        "parameters": id_param() + if_match(),
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/UpdateActivityRequest"}}},
        },
        "responses": merge_responses(
            ("200", {
                "description": "Updated",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ActivityEnvelope"}}},
            }),
        ),
    },
}

P["/v1/crm/activities/{id}/archive"] = {
    "post": {
        **sec("Activities"),
        "summary": "Archive activity",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Archived",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ActivityEnvelope"}}},
            }),
        ),
    }
}

for scoped_path in [
    "/v1/crm/contacts/{id}/activities",
    "/v1/crm/organizations/{orgId}/activities",
]:
    params = id_param() if "contacts" in scoped_path else org_id()
    P[scoped_path] = {
        "get": {
            **sec("Activities"),
            "summary": "List scoped activities",
            "parameters": params + activity_scoped_params,
            "responses": merge_responses(
                ("200", {
                    "description": "Activities",
                    "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ActivityList"}}},
                }),
            ),
        }
    }

for scoped_path in [
    "/v1/crm/relationships/{id}/activities",
    "/v1/crm/organization-units/{id}/activities",
]:
    P[scoped_path] = {
        "get": {
            **sec("Activities"),
            "summary": "List scoped activities",
            "parameters": id_param() + limit_cursor(),
            "responses": merge_responses(
                ("200", {
                    "description": "Activities",
                    "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ActivityList"}}},
                }),
            ),
        }
    }

# --- Accounts ---
P["/v1/crm/accounts"] = {
    "get": {
        **sec("Accounts"),
        "summary": "List accounts",
        "parameters": [
            {"name": "organizationId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"name": "status", "in": "query", "schema": {"type": "string"}},
            {"name": "ownerPrincipalId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"$ref": "#/components/parameters/Limit"},
            {"$ref": "#/components/parameters/Cursor"},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Accounts",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/AccountList"}}},
            }),
        ),
    },
    "post": {
        **sec("Accounts"),
        "summary": "Create account",
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CreateAccountRequest"}}},
        },
        "responses": merge_responses(
            ("201", {
                "description": "Created",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/AccountEnvelope"}}},
            }),
        ),
    },
}

P["/v1/crm/accounts/{id}"] = {
    "get": {
        **sec("Accounts"),
        "summary": "Get account",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Account",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/AccountEnvelope"}}},
            }),
        ),
    },
    "patch": {
        **sec("Accounts"),
        "summary": "Update account",
        "parameters": id_param() + if_match(),
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/UpdateAccountRequest"}}},
        },
        "responses": merge_responses(
            ("200", {
                "description": "Updated",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/AccountEnvelope"}}},
            }),
        ),
    },
}

P["/v1/crm/accounts/{id}/transitions"] = {
    "post": {
        **sec("Accounts"),
        "summary": "Transition account status",
        "parameters": id_param(),
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {"schema": {"$ref": "#/components/schemas/AccountTransitionRequest"}}
            },
        },
        "responses": merge_responses(
            ("200", {
                "description": "Transitioned",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/AccountEnvelope"}}},
            }),
        ),
    }
}

P["/v1/crm/accounts/{id}/archive"] = {
    "post": {
        **sec("Accounts"),
        "summary": "Archive account",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Archived",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/AccountEnvelope"}}},
            }),
        ),
    }
}

P["/v1/crm/accounts/{id}/reassign-owner"] = {
    "post": {
        **sec("Accounts"),
        "summary": "Reassign account owner",
        "parameters": id_param(),
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {"schema": {"$ref": "#/components/schemas/ReassignAccountOwnerRequest"}}
            },
        },
        "responses": merge_responses(
            ("200", {
                "description": "Reassigned",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/AccountEnvelope"}}},
            }),
        ),
    }
}

P["/v1/crm/organizations/{orgId}/accounts"] = {
    "get": {
        **sec("Accounts"),
        "summary": "List organization accounts",
        "parameters": org_id(),
        "responses": merge_responses(
            ("200", {
                "description": "Accounts",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/AccountList"}}},
            }),
        ),
    }
}

# --- Notes ---
P["/v1/crm/notes"] = {
    "get": {
        **sec("Notes"),
        "summary": "List notes",
        "parameters": [
            {"name": "entityType", "in": "query", "schema": {"type": "string"}},
            {"name": "entityId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"$ref": "#/components/parameters/Limit"},
            {"$ref": "#/components/parameters/Cursor"},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Notes",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/NoteList"}}},
            }),
        ),
    },
    "post": {
        **sec("Notes"),
        "summary": "Create note",
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CreateNoteRequest"}}},
        },
        "responses": merge_responses(
            ("201", {
                "description": "Created",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/NoteEnvelope"}}},
            }),
        ),
    },
}

P["/v1/crm/notes/{id}"] = {
    "get": {
        **sec("Notes"),
        "summary": "Get note",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Note",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/NoteEnvelope"}}},
            }),
        ),
    },
    "patch": {
        **sec("Notes"),
        "summary": "Update note",
        "parameters": id_param() + if_match(),
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/UpdateNoteRequest"}}},
        },
        "responses": merge_responses(
            ("200", {
                "description": "Updated",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/NoteEnvelope"}}},
            }),
        ),
    },
}

P["/v1/crm/notes/{id}/archive"] = {
    "post": {
        **sec("Notes"),
        "summary": "Archive note",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Archived",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/NoteEnvelope"}}},
            }),
        ),
    }
}

P["/v1/crm/contacts/{id}/notes"] = {
    "get": {
        **sec("Notes"),
        "summary": "List contact notes",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Notes",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/NoteList"}}},
            }),
        ),
    }
}

P["/v1/crm/organizations/{orgId}/notes"] = {
    "get": {
        **sec("Notes"),
        "summary": "List organization notes",
        "parameters": org_id(),
        "responses": merge_responses(
            ("200", {
                "description": "Notes",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/NoteList"}}},
            }),
        ),
    }
}

# --- Tasks ---
P["/v1/crm/tasks"] = {
    "get": {
        **sec("Tasks"),
        "summary": "List tasks",
        "parameters": [
            {"name": "status", "in": "query", "schema": {"type": "string"}},
            {"name": "assigneePrincipalId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"$ref": "#/components/parameters/Limit"},
            {"$ref": "#/components/parameters/Cursor"},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Tasks",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/TaskList"}}},
            }),
        ),
    },
    "post": {
        **sec("Tasks"),
        "summary": "Create task",
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CreateTaskRequest"}}},
        },
        "responses": merge_responses(
            ("201", {
                "description": "Created",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/TaskEnvelope"}}},
            }),
        ),
    },
}

P["/v1/crm/tasks/{id}"] = {
    "get": {
        **sec("Tasks"),
        "summary": "Get task",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Task",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/TaskEnvelope"}}},
            }),
        ),
    },
    "patch": {
        **sec("Tasks"),
        "summary": "Update task",
        "parameters": id_param() + if_match(),
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/UpdateTaskRequest"}}},
        },
        "responses": merge_responses(
            ("200", {
                "description": "Updated",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/TaskEnvelope"}}},
            }),
        ),
    },
}

for action in ["complete", "cancel"]:
    P[f"/v1/crm/tasks/{{id}}/{action}"] = {
        "post": {
            **sec("Tasks"),
            "summary": f"{action.capitalize()} task",
            "parameters": id_param(),
            "responses": merge_responses(
                ("200", {
                    "description": action.capitalize() + "d",
                    "content": {"application/json": {"schema": {"$ref": "#/components/schemas/TaskEnvelope"}}},
                }),
            ),
        }
    }

# --- Search ---
P["/v1/crm/search"] = {
    "get": {
        **sec("Search"),
        "summary": "Search CRM entities",
        "parameters": [
            {"name": "q", "in": "query", "required": True, "schema": {"type": "string", "minLength": 2}},
            {
                "name": "types",
                "in": "query",
                "schema": {"type": "array", "items": {"type": "string"}},
                "style": "form",
                "explode": True,
            },
            {"name": "limit", "in": "query", "schema": {"type": "integer"}},
            {"name": "cursor", "in": "query", "schema": {"type": "string"}},
            {"name": "status", "in": "query", "schema": {"type": "string"}},
            {"name": "owner", "in": "query", "schema": {"type": "string"}},
            {"name": "country", "in": "query", "schema": {"type": "string"}},
            {"name": "type", "in": "query", "schema": {"type": "string"}},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Search results",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/SearchResultList"}}
                },
            }),
        ),
    }
}

# --- Duplicates ---
P["/v1/crm/duplicates"] = {
    "get": {
        **sec("Duplicates"),
        "summary": "List duplicate candidates",
        "parameters": [
            {"name": "status", "in": "query", "schema": {"type": "string"}},
            {"name": "entityType", "in": "query", "schema": {"type": "string", "enum": ["organization", "contact"]}},
            {"$ref": "#/components/parameters/Limit"},
            {"$ref": "#/components/parameters/Cursor"},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Duplicate candidates",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/DuplicateCandidateList"}}
                },
            }),
        ),
    }
}

P["/v1/crm/duplicates/{id}"] = {
    "get": {
        **sec("Duplicates"),
        "summary": "Get duplicate candidate",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Duplicate candidate",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/DuplicateCandidateEnvelope"}}
                },
            }),
        ),
    }
}

P["/v1/crm/duplicates/{id}/review"] = {
    "post": {
        **sec("Duplicates"),
        "summary": "Review duplicate candidate",
        "parameters": id_param(),
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {"schema": {"$ref": "#/components/schemas/ReviewDuplicateRequest"}}
            },
        },
        "responses": merge_responses(
            ("200", {
                "description": "Reviewed",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/DuplicateCandidateEnvelope"}}
                },
            }),
        ),
    }
}

# --- Merges ---
P["/v1/crm/merges"] = {
    "post": {
        **sec("Merges"),
        "summary": "Execute merge",
        "description": "Requires `Idempotency-Key` header. Returns 201 on first execution, 200 on replay.",
        "parameters": idempotency(),
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/ExecuteMergeRequest"}}},
        },
        "responses": merge_responses(
            ("201", {
                "description": "Merge executed",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/MergeEnvelope"}}},
            }),
            ("200", {
                "description": "Idempotent replay",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/MergeEnvelope"}}},
            }),
        ),
    }
}

P["/v1/crm/merges/{id}"] = {
    "get": {
        **sec("Merges"),
        "summary": "Get merge record",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Merge record",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/MergeEnvelope"}}},
            }),
        ),
    }
}

# --- Imports ---
P["/v1/crm/imports"] = {
    "post": {
        **sec("Imports"),
        "summary": "Create import batch",
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CreateImportRequest"}}},
        },
        "responses": merge_responses(
            ("201", {
                "description": "Import batch created",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/ImportBatchEnvelope"}}
                },
            }),
        ),
    }
}

P["/v1/crm/imports/{id}"] = {
    "get": {
        **sec("Imports"),
        "summary": "Get import batch",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Import batch",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/ImportBatchEnvelope"}}
                },
            }),
        ),
    }
}

P["/v1/crm/imports/{id}/validate"] = {
    "post": {
        **sec("Imports"),
        "summary": "Validate import batch",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Validated",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/ImportBatchEnvelope"}}
                },
            }),
        ),
    }
}

P["/v1/crm/imports/{id}/execute"] = {
    "post": {
        **sec("Imports"),
        "summary": "Execute import batch",
        "description": "Requires `Idempotency-Key` header.",
        "parameters": id_param() + idempotency(),
        "responses": merge_responses(
            ("200", {
                "description": "Committed (or idempotent replay)",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/ImportBatchEnvelope"}}
                },
            }),
        ),
    }
}

# --- Tags ---
P["/v1/crm/tags"] = {
    "get": {
        **sec("Tags"),
        "summary": "List tags",
        "parameters": [
            {"name": "includeArchived", "in": "query", "schema": {"type": "string", "enum": ["true"]}},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Tags",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/TagList"}}},
            }),
        ),
    },
    "post": {
        **sec("Tags"),
        "summary": "Create tag",
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/CreateTagRequest"}}},
        },
        "responses": merge_responses(
            ("201", {
                "description": "Created",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/TagEnvelope"}}},
            }),
        ),
    },
}

P["/v1/crm/tags/{id}"] = {
    "get": {
        **sec("Tags"),
        "summary": "Get tag",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Tag",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/TagEnvelope"}}},
            }),
        ),
    },
    "patch": {
        **sec("Tags"),
        "summary": "Update tag",
        "parameters": id_param() + if_match(),
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/UpdateTagRequest"}}},
        },
        "responses": merge_responses(
            ("200", {
                "description": "Updated",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/TagEnvelope"}}},
            }),
        ),
    },
}

P["/v1/crm/tags/{id}/archive"] = {
    "post": {
        **sec("Tags"),
        "summary": "Archive tag",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Archived",
                "content": {"application/json": {"schema": {"$ref": "#/components/schemas/TagEnvelope"}}},
            }),
        ),
    }
}

# --- Tag assignments ---
P["/v1/crm/tag-assignments"] = {
    "get": {
        **sec("TagAssignments"),
        "summary": "List tag assignments",
        "parameters": [
            {"name": "tagId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"name": "entityType", "in": "query", "schema": {"type": "string"}},
            {"name": "entityId", "in": "query", "schema": {"type": "string", "format": "uuid"}},
            {"$ref": "#/components/parameters/Limit"},
            {"$ref": "#/components/parameters/Cursor"},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "Tag assignments",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/EntityTagList"}}
                },
            }),
        ),
    },
    "post": {
        **sec("TagAssignments"),
        "summary": "Assign tag to entity",
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": {"$ref": "#/components/schemas/AssignTagRequest"}}},
        },
        "responses": merge_responses(
            ("201", {
                "description": "Assigned",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/EntityTagEnvelope"}}
                },
            }),
        ),
    },
}

P["/v1/crm/tag-assignments/{id}"] = {
    "delete": {
        **sec("TagAssignments"),
        "summary": "Remove tag assignment",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Removed",
                "content": {
                    "application/json": {
                        "schema": {"$ref": "#/components/schemas/RemoveTagAssignmentResponse"}
                    }
                },
            }),
        ),
    }
}

# --- External identifiers ---
P["/v1/crm/external-identifiers/lookup/{systemKey}/{externalId}"] = {
    "get": {
        **sec("ExternalIdentifiers"),
        "summary": "Lookup external identifier",
        "parameters": [
            {"$ref": "#/components/parameters/SystemKey"},
            {"$ref": "#/components/parameters/ExternalId"},
        ],
        "responses": merge_responses(
            ("200", {
                "description": "External identifier",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/ExternalIdentifierEnvelope"}}
                },
            }),
        ),
    }
}

P["/v1/crm/external-identifiers"] = {
    "post": {
        **sec("ExternalIdentifiers"),
        "summary": "Create external identifier",
        "requestBody": {
            "required": True,
            "content": {
                "application/json": {"schema": {"$ref": "#/components/schemas/CreateExternalIdentifierRequest"}}
            },
        },
        "responses": merge_responses(
            ("201", {
                "description": "Created",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/ExternalIdentifierEnvelope"}}
                },
            }),
        ),
    }
}

P["/v1/crm/external-identifiers/{id}"] = {
    "get": {
        **sec("ExternalIdentifiers"),
        "summary": "Get external identifier",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "External identifier",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/ExternalIdentifierEnvelope"}}
                },
            }),
        ),
    },
    "delete": {
        **sec("ExternalIdentifiers"),
        "summary": "Delete external identifier",
        "parameters": id_param(),
        "responses": merge_responses(
            ("200", {
                "description": "Deleted",
                "content": {
                    "application/json": {"schema": {"$ref": "#/components/schemas/ExternalIdentifierEnvelope"}}
                },
            }),
        ),
    },
}

# Write output
op_count = sum(len(methods) for methods in P.values())
path_count = len(P)

class Dumper(yaml.SafeDumper):
    pass


def represent_bool(dumper, data):
    return yaml.ScalarNode("tag:yaml.org,2002:bool", "true" if data else "false")


Dumper.add_representer(bool, represent_bool)

with OUT.open("w", encoding="utf-8") as f:
    yaml.dump(spec, f, Dumper=Dumper, sort_keys=False, allow_unicode=True, width=120, default_flow_style=False)

print(f"Wrote {OUT}")
print(f"Paths: {path_count}, Operations: {op_count}")
