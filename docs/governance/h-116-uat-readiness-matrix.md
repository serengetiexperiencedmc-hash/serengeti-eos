# H-116 — UAT readiness matrix

> **UAT PREPARATION ONLY** · **NOT UAT EXECUTION** · **NOT UAT SIGN-OFF**  
> **`NOT PRODUCTION` · `NOT H-81` · `NOT H-80 EXIT` · `NOT EOS ADOPTION` · `NOT GATE B`**  
> **`NO APPLICATION CODE` · `NO COMMIT` · `NO PUSH`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T19:30:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Engineering baseline:** [`h-115-final-engineering-completion-audit.md`](h-115-final-engineering-completion-audit.md) — `H-115 ENGINEERING SCOPE COMPLETE WITH DOCUMENTED LIMITATIONS`.  
**Intended execution target (not a formal UAT designation):** full-schema Dev/Test `127.0.0.1:5435/eos_h112_full` via API `127.0.0.1:18116`. See [`h-112-devtest-operator-runbook.md`](h-112-devtest-operator-runbook.md).

Status values used here: **IN SCOPE** · **GOVERNANCE-EXCLUDED** · **HUMAN DECISION**. “Testable in UAT?” is yes only where the software contract is already authorized.

Do not reopen H-115 engineering decisions. Do not treat unresolved commercial policy as a UAT software failure.

---

## Platform

| UAT Area | Requirement | Expected Behaviour | Evidence Source | Testable in UAT? | Preconditions | Exclusions | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Platform | Valid operator login | Carol Dev/Test login returns access token; `/v1/me` 200 with principal | H-112/H-114 live; D6-T5/T6 | Yes | Full-schema API running; bootstrap secrets from `.env.example` | Production IdP | IN SCOPE |
| Platform | Invalid login | Wrong password does not issue a usable session | Auth routes; existing login tests | Yes | Same | Do not lock Production accounts | IN SCOPE |
| Platform | Unauthenticated API | Commercial-facts and `/v1/me` without bearer → **401** `unauthenticated` | H-114; D6-T5; H-112 | Yes | API up | — | IN SCOPE |
| Platform | Unauthorized role | Alice finance cannot read/write supplier rate overlay → **403** | H-114 live Alice 403 | Yes | Carol-created rate exists | Do not invent new RBAC | IN SCOPE |
| Platform | Health / readiness | `GET /health` and `GET /ready` 200; `applicationReady: true` when DB reachable | H-112/H-114 | Yes | `eos_h112_full` reachable | Not a Production SLA probe | IN SCOPE |
| Platform | Environment identification | Startup log `namedBranch=H-112-FULL-SCHEMA-DEVTEST-API-STARTUP`, `mixedSqlDurable: true`; bounded flag unset | H-112 runbook | Yes | Opt-in env as runbook | Must not start against `eos` or `eos_gateb` | IN SCOPE |
| Platform | Full-schema database | Catalog `eos_h112_full` on `:5435`; `schema_migrations` present; mixed C-spine tables present | H-112 validation | Yes (observe, not migrate) | Container up | Do not migrate `eos`; do not designate this DB as formal UAT without human decision | IN SCOPE |
| Platform | Startup | `npx tsx src/main.ts` with H-112 full-schema env; listen `127.0.0.1:18116`; `EOS_SEED_DEMO=false` | H-112 runbook §5 | Yes | Secrets set; bounded flag cleared | Demo seed **false** | IN SCOPE |
| Platform | Shutdown | Authorized in-process path: bounded POST trigger is **bounded-only**. Full-schema: SIGTERM of Node process; port released. Wrapper `npx tsx` may exit 1 without `shutdown_completed` | H-106/D6-T5 POST class; H-112/H-114 wrapper finding; H-115 §16 | Yes, with documented limitation | Do not use Windows SIGINT experiment | Not Production drain | IN SCOPE |
| Platform | Operator runbook | Operators follow H-112 runbook; two environments never mixed | H-112 runbook | Yes (procedure) | Human operator | Not a Production runbook | IN SCOPE |

## Account

| UAT Area | Requirement | Expected Behaviour | Evidence Source | Testable in UAT? | Preconditions | Exclusions | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Account | Create | POST organization then account; 201; type catalogue ids from GET organization-types (PG ids after hydrate) | H-112 live | Yes | Full-schema; `EOS_SEED_DEMO=false` | Do not use process-local type UUIDs blindly | IN SCOPE |
| Account | Retrieve | GET account 200 | H-112 | Yes | Created account | — | IN SCOPE |
| Account | Account facts | GET/PUT `/v1/crm/accounts/:id/commercial-facts` | H-112 PUT/GET 200 | Yes | `crm:read/write:account` | G-08-B admin console | IN SCOPE |
| Account | Market | Overlay market independent of account type; legacy CRM market not F2-authoritative | H-112; I5 | Yes | Authorized PUT | Do not infer market from name/phone/email | IN SCOPE |
| Account | Account type | Overlay type independent of market; PCO ≠ event agency | H-112 | Yes | Authorized PUT | — | IN SCOPE |
| Account | Persistence | Sidecar `f2_account_facts`; `persistence.mode=f2_dp01_sidecar` | H-112 | Yes | Persist enabled on full-schema | Not mixed CRM market as F2 | IN SCOPE |
| Account | Restart survival | After process restart, GET facts returns recorded overlay | H-112 hydrate accounts≥1 | Yes | Controlled restart | Wrapper SIGTERM limitation | IN SCOPE |
| Account | Authorization | Unauthenticated 401; unauthorized 403 | Routes + D5 pattern | Yes | Alice or no token | — | IN SCOPE |

## Opportunity

| UAT Area | Requirement | Expected Behaviour | Evidence Source | Testable in UAT? | Preconditions | Exclusions | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Opportunity | Create | POST `/v1/pipeline/opportunities` 201; mixed SQL row (not Store-only) | H-112 mixed lookup | Yes | Org + account | — | IN SCOPE |
| Opportunity | Identity | Stable opportunity id/code; path id authoritative | D6-T6 409 | Yes | — | — | IN SCOPE |
| Opportunity | Owner | Owner exists before qualification; follow-up owner on facts | I2 / Day 2 | Yes | Carol principal | — | IN SCOPE |
| Opportunity | Next action | PUT facts with next-action description persists | D6-T5/T6 | Yes | — | — | IN SCOPE |
| Opportunity | Qualification | `qualificationStatus` independent of workflow `stage`; `new_qualified` is not qualification | D6-T5/T6 OR-01 | Yes | — | No 250k/20% F2 rule | IN SCOPE |
| Opportunity | Stage | Workflow stage remains mixed C2 field; not overwritten by qualification | H-112 | Yes | — | — | IN SCOPE |
| Opportunity | Commercial facts | GET/PUT `/v1/pipeline/opportunities/:id/commercial-facts` | D6-T5/T6; H-112 | Yes | Mixed-SQL lookup | — | IN SCOPE |
| Opportunity | Persistence | Sidecar `f2_opportunity_facts` | D6-T5 | Yes | — | — | IN SCOPE |
| Opportunity | Conflicting identifiers | Body `opportunityId` / `id` ≠ path → **409** `*_immutable` | D6-T6; H-112 | Yes | — | — | IN SCOPE |
| Opportunity | Authorization | 401 / 403 per `pipeline:read/write:opportunity` | Routes | Yes | — | — | IN SCOPE |

## RFP

| UAT Area | Requirement | Expected Behaviour | Evidence Source | Testable in UAT? | Preconditions | Exclusions | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| RFP | Create | POST `/v1/rfps` 201 linked to opportunity | H-112 | Yes | Opportunity exists | Mailbox ingest | IN SCOPE |
| RFP | SOURCE | Overlay `primarySource` from OR-07 SOURCE catalogue only | D6-T6 Referral | Yes | — | Not inferred from CHANNEL or legacy `rfp.source` | IN SCOPE |
| RFP | CHANNEL | Overlay `channel` from OR-07 CHANNEL catalogue; **SOURCE ≠ CHANNEL** | D6-T6 Email | Yes | — | Email is CHANNEL not SOURCE | IN SCOPE |
| RFP | Receipt timestamp | Explicit ISO `receivedAt` only; not synthesized from createdAt | Day 3 tests | Yes | Tester supplies ISO or leaves blank | No mailbox receipt entity | IN SCOPE |
| RFP | First-response timestamp | Explicit ISO; not PUT-now; not inferred from receivedAt | Day 3 tests | Yes | Optional | Negative interval rejected | IN SCOPE |
| RFP | Clarification | Status independent; events require type + `eventAt` | Day 3 | Yes | Do not invent events | — | IN SCOPE |
| RFP | Qualification link | Opportunity qualification remains independent of RFP workflow stage | H-112 | Yes | — | `qualification ≠ workflow stage` | IN SCOPE |
| RFP | Path B | GET/PUT `/v1/rfps/:id/path-b-approval`; categories qualitative | H-112 PUT `required: true` | Yes | — | Not KPI/revenue/profit; no 250k/20% | IN SCOPE |
| RFP | Persistence | Sidecar `f2_rfp_facts` and `f2_path_b` | D6-T5; H-112 | Yes | — | — | IN SCOPE |
| RFP | Authorization | 401/403 `rfp:read/write:rfp` | Routes | Yes | — | — | IN SCOPE |

## Programme

| UAT Area | Requirement | Expected Behaviour | Evidence Source | Testable in UAT? | Preconditions | Exclusions | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Programme | Create | POST `/v1/programmes` 201 with rfpId | H-112 | Yes | RFP exists | Office documents are not identity | IN SCOPE |
| Programme | Opportunity/RFP relationship | Facts show `rfpId` / `opportunityId`; `rfpObserved` true when RFP exists | H-112 | Yes | Mixed FKs | G-06-B ≠ freeze | IN SCOPE |
| Programme | Identity trace | Costing/proposal observed as trace only; sell price not revenue | H-112 `sellPriceTreatedAsRevenue: false` | Yes | — | Profit/revenue undefined | IN SCOPE |
| Programme | Persistence | Sidecar `f2_programme_facts` | H-112 | Yes | — | — | IN SCOPE |
| Programme | Authorization | 401/403 programme permissions | Routes | Yes | — | — | IN SCOPE |

## Commercial facts (cross-cutting)

| UAT Area | Requirement | Expected Behaviour | Evidence Source | Testable in UAT? | Preconditions | Exclusions | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Commercial facts | GET | Authenticated GET 200; `persistence` meta present | H-112/H-114 | Yes | Entity exists | — | IN SCOPE |
| Commercial facts | PUT | Authorized PUT 200; unauthorized 403 | D6-T6; H-114 | Yes | — | — | IN SCOPE |
| Commercial facts | Persistence | Sidecar JSONB; `mode=f2_dp01_sidecar` on full-schema | Persist tests | Yes | — | Not mixed C-spine as F2 SoR | IN SCOPE |
| Commercial facts | Hydration | Startup `f2_dp01_commercial_facts_hydrate` counts include written maps | H-114 rates:1 | Yes | Restart | — | IN SCOPE |
| Commercial facts | Restart | GET after restart matches last authorized PUT | H-112/H-114 | Yes | — | Process-local Store is not mixed SoR | IN SCOPE |
| Commercial facts | No inferred timestamps | Blank receipt/first-response stay blank | Day 3; D6-T6 left blank | Yes | Testers must not invent | Mailbox ingest | IN SCOPE |
| Commercial facts | No invented history | Clarification events only when explicitly posted | Day 3 | Yes | — | — | IN SCOPE |
| Commercial facts | Sidecar/mixed separation | Overlay fields distinct from mixed; divergence displayed | H-114 TZS vs USD | Yes | Rate overlay | No invented precedence | IN SCOPE |

## Path B

| UAT Area | Requirement | Expected Behaviour | Evidence Source | Testable in UAT? | Preconditions | Exclusions | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Path B | Retrieval | GET path-b-approval 200 | H-112; D6-T6 GET | Yes | RFP exists | — | IN SCOPE |
| Path B | Mutation | PUT categories; qualitative requirement may become `required: true` | H-112 | Yes | Write permission | Not mixed `evaluateCommercialApprovalGate` rewrite | IN SCOPE |
| Path B | Persistence | Sidecar `f2_path_b` | Persist tests; H-112 | Yes | — | — | IN SCOPE |
| Path B | Authorization | 401/403 | Routes | Yes | — | — | IN SCOPE |
| Path B | No KPI/revenue/profit promotion | Categories remain exceptional-approval labels | H-112; G-07-A | Yes (assert absence) | — | KPI history / revenue / profit | GOVERNANCE-EXCLUDED as models; IN SCOPE as negative checks |

## Rate Identity (H-114 overlay only)

| UAT Area | Requirement | Expected Behaviour | Evidence Source | Testable in UAT? | Preconditions | Exclusions | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rate Identity | Five source classes | PUT accepts only I1 `SUPPLIER_RATE_SOURCE_CLASSES` | I6; H-114 | Yes | Mixed C4 rate parent | Sixth class | IN SCOPE |
| Rate Identity | Five OR-08 types | PUT accepts only I1 `SUPPLIER_RATE_TYPE_KEYS` | I6; H-114 | Yes | Mixed unit type is not OR-08 | `per_room_per_night` as F2 type | IN SCOPE |
| Rate Identity | Supplier ownership | Overlay `supplierId` / code / legal name; identityId ≠ supplierId | H-114 | Yes | — | Supplier identity ≠ rate identity | IN SCOPE |
| Rate Identity | Original currency | ISO 4217 overlay currency authoritative | H-114 TZS | Yes | — | FX | IN SCOPE |
| Rate Identity | Validity observation | `validFrom`/`validTo`; state current/future/expired at `at` | I6; H-114 | Yes | — | Expired live-proposal use | IN SCOPE |
| Rate Identity | Append-only versionIdentity | New integer version 200; prior rows remain | H-114 | Yes | — | Mutating a written version | IN SCOPE |
| Rate Identity | Duplicate version 409 | Same versionIdentity → **409** `version_identity_exists` | H-114 live | Yes | — | — | IN SCOPE |
| Rate Identity | Amount not identity | `amountIsNotIdentity: true`; extra amount in body ignored | H-114 | Yes | Mixed amount 250 USD | Amount-as-identity controls | IN SCOPE |
| Rate Identity | Overlay persistence | Row in `f2_rate_identities` | H-114 sidecar SELECT | Yes | — | Mixed `sup_rates` rewrite | IN SCOPE |
| Rate Identity | Overlay hydration | GET after restart returns overlay | H-114 | Yes | — | — | IN SCOPE |
| Rate Identity | Overlay/mixed divergence | Overlay TZS vs mixed USD both visible; no winner | H-114 | Yes | — | Overlay/mixed precedence | IN SCOPE |
| Rate Identity | Winner / preferred / ranking | Must **not** appear as F2 controls | H-114 exclusions | Yes as negative | Legacy C4 prefer may exist labelled non-F2 | Implementing winner | GOVERNANCE-EXCLUDED |
| Rate Identity | Live-proposal freeze / CostSheetVersion | Must not freeze-on-send | H-114; G-06-B | Yes as negative | — | Freeze policy | GOVERNANCE-EXCLUDED |
| Rate Identity | Expired live-use / public-for-sale / FX | Must not invent rules | H-113/H-114 | Yes as negative | Observation only | Those policies | GOVERNANCE-EXCLUDED |

---

## How to use this matrix in UAT

1. Execute only **IN SCOPE** rows as software tests.
2. Record **GOVERNANCE-EXCLUDED** rows as “not judged — policy undefined,” not as defects.
3. **HUMAN DECISION** rows (formal environment designation, tester appointment) are not software tests.
4. Bounded `127.0.0.1:5432/eos` is **out of UAT execution scope** except as a negative control (do not migrate it).
