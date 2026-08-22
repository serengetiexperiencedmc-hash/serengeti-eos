# 11. CMDB Architecture

## 11.1 Scope

The CMDB is the authorised inventory of **configuration items (CIs)** and their relationships, used by ITSM, change, incident, vulnerability, BCM, and the knowledge graph.

It is not a spreadsheet dump and not auto-discovered truth without reconciliation.

## 11.2 CI classes (initial)

| Class | Examples |
| --- | --- |
| BusinessService | EOS Web, MICE quoting, Field sync |
| TechnicalService | API, Postgres, NATS, IdP |
| Application | eos-api, eos-web, workers |
| Database | eos_oltp, audit replica |
| Host / Cluster | TBD by deployment ADR |
| NetworkZone | Edge, app, data, management |
| Endpoint | Laptops, phones (UEM Phase 3) |
| Integration | Email connector, AI provider |
| KnowledgeSource | Prompt set, SOP corpus |
| AiSystem | Orchestrator, named agents |

## 11.3 Attributes

Every CI: unique name, class, owner, custodian, environment, criticality, classification, source of truth, lifecycle state (`planned | active | maintenance | retired`), RTO/RPO if service-level, links to BIA.

## 11.4 Relationships

`runs_on`, `depends_on`, `connects_to`, `backed_up_by`, `monitored_by`, `owned_by`, `provides`.

Change and incident processes must update or verify CI relationships. Unlinked production systems are a control exception.

## 11.5 Discovery (Phase 3)

Discovery is **advisory**. Human or approved automation reconciles into the CMDB. AI may suggest CIs from telemetry; it does not create authoritative CIs at autonomy < 3.
