# P2 DPIA Register — Stage 1 Preview

> **CURRENT STATE (2026-08-25 documentation hygiene)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`fdf2436b1655fbe70a18117e64f54cc101cb71ae`** (this HEAD **is** the P2 implementation commit)  
> P2 Stage 2 is **IMPLEMENTED / COMPLETE / CLOSED** for Development/Test (additive SQL `104_p2_privacy_dpias.sql`).  
> P1 remains **CLOSED**. No P1.x. No DPIA product, consent platform, DLP, or live erasure. ITR1 remains **CLOSED**. **EXECUTION_QUEUE=EMPTY** · **NEW_CAPABILITY_AUTHORIZED=NONE** · **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **PUSH=NOT_AUTHORIZED**  
> **CAPABILITY_SELECTED=YES** · **CAPABILITY=DPIA_REGISTER** · **CAPABILITY_ID=P2** · **STAGE_1_CREATED=YES** · **STAGE_1_APPROVED=YES** · **IMPLEMENTATION_AUTHORIZED=YES** (Dev/Test; Stage 2 complete)

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **P2** |
| Capability name | DPIA Register |
| Family | privacy |
| Predecessor | I2 kernel (complete); P1 Privacy RoPA + DSR complete and **not** reopened; I15 ERM complete and **not** reopened |
| Architecture status | This document is the P2 Stage 1 contract |
| Stage | Stage 1 |
| **STATUS** | **STAGE 1 APPROVED** |
| Implementation status | **IMPLEMENTED / COMPLETE** (Dev/Test) |
| Environment | Development/Test only |
| Persistence | In-memory `Store` + additive SQL `104_p2_privacy_dpias.sql`. ADR-0017 not reopened. Live PostgreSQL UNVERIFIED |
| Runtime health increment | `P2` |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **P2** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test; Stage 2 complete) |
| **EXECUTION_QUEUE** | **EMPTY** |

Authority: 2026-08-24 Operator / product-owner decision **PATH_B_SELECTED=YES / CANDIDATE=DPIA_REGISTER / FAMILY=PRIVACY / CAPABILITY_ID=P2 / DECISION=SELECT**, 2026-08-25 Operator **P2 STAGE_1_APPROVED=YES**, and [`p2-dpia-register-authorized.md`](../governance/p2-dpia-register-authorized.md). ID **P2** is assigned by the selection record. This Stage 1 document does **not** authorize implementation or reopen P1 / I15 / ITR1. This is not P1.x, not I15.x, not D1, not C11, not H1.x, and not a consent or DLP product.

**Stage 1 contract ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation authorization.**  
**Implementation authorization ≠ UAT authorization.**  
**UAT authorization ≠ Production authorization.**

The sections after this heading are the **approved** architecture contract. Implementation must not begin until a separate explicit execution instruction (`IMPLEMENTATION_AUTHORIZED=YES` / `ENVIRONMENT=DEVTEST`).

---

## Objective

Deliver a **Privacy** workspace surface where an authorised human can record **DPIA register rows**: a human label that a data-protection impact assessment **case exists**, or was cancelled.

P2 is **not** a DPIA product, not a legal opinion, not PDPA/GDPR interpretation, not lawful-basis determination, not residual-risk scoring, not a consent platform, not DLP, not live erasure, not a RoPA engine, not a DSR engine, and not AI mutation. It is not a redesign of P1 RoPA or DSR.

Domain map 2.2 names DPIA under `privacy` after Processing Activity and DSR. P1 shipped RoPA and DSR only and excluded a DPIA product. **P2 is the smaller approved-shape DPIA register only**. Stage 1 is approved. Stage 2 is **IMPLEMENTED / CLOSED** for Development/Test. UAT and Production remain unauthorized.

This is a **register**, not a privacy-compliance engine.

## Domain boundary

| Aggregate | Meaning | Must remain |
| --- | --- | --- |
| **P2 DPIA** | A human record that a **DPIA case exists** (or was cancelled) | New store `privacyDpias` |
| **P1 processing activity** | A RoPA register row | Closed — not reopened; no `activityId` on P2 |
| **P1 DSR** | A data-subject-request case label | Closed — not reopened; no `dsrId` on P2 |
| Consent / DLP / live erasure | Unimplemented products | Out of scope |
| Legal opinion | Determination / advice | Does not exist; must not be invented here |

Distinctness from P1 is **product identity** (codes, store, permissions, UI copy, exclusions), not extra fields. Do **not** add `activityId`, `dsrId`, lawful-basis, residual-risk, reviewer, or due-date fields merely to enlarge the distinction. Linkage or legal fields would turn P2 into a process or opinion engine.

Do **not** use store key `privacyDpia` (singular). P1 freeze tests require `"privacyDpia" in store` to remain `false`. The P2 key is **`privacyDpias`** (plural).

## Scope

| Deliverable | In scope |
| --- | --- |
| DPIA create / list / get / patch (while `open`) | Yes |
| DPIA codes `DPI-0001` unique per tenant | Yes |
| Statuses: `open` → `done`; `open` → `cancelled` (`done` and `cancelled` terminal) | Yes |
| Required `title`; optional `notes` | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Role `privacy.dpia` | Yes |
| Tenant-scoped `/v1/privacy/dpias/health` increment `P2` | Yes |
| Visible Privacy UI for the DPIA register | Yes — P1 RoPA and DSR remain those capabilities |
| P1 RoPA / DSR redesign | No |
| DPIA product / legal opinion / PDPA engine | No |
| Consent / DLP / live erasure | No |

Required field is **`title`**, matching ITR1/ITC1/ITP1/P1 activity registers (not a second `name` field).

Code prefix is **`DPI-`**, matching sibling noun prefixes (`RPA-`, `DSR-`), not the capability id `P2`. Repository search found no existing `DPI-` allocator.

No date fields. Sibling registers in this class do not require date labels. Dates must not be introduced as a review-due SLA, reminder, or automatic status driver.

## Domain model

**privacy_dpias** (runtime store key `privacyDpias` — not P1 `privacyProcessingActivities` / `privacyDsrCases`, not `privacyDpia` / `privacyRopa` / `privacyDsr` / `privacyConsent` / `privacyDlp`, not GRC keys, not SAMPLE keys)

- `dpiaCode` unique per tenant (`DPI-0001`)
- `title` required (max 200)
- optional `notes` (max 2000)
- `status`: `open` \| `done` \| `cancelled`
- timestamps + createdByPrincipalId / updatedByPrincipalId (not returned)

No `activityId`, `dsrId`, lawful-basis, residual-risk, reviewer-principal, due-date, legal-conclusion, or scheduler fields.

`done` means the human marked the **register row** complete. It is **not** a legal sign-off, residual-risk acceptance, or authority to process.

## Persistence / migration

No migration in this Stage 1 increment. Do not create SQL in the Stage 1 authoring task.

If implementation is later authorized:

- runtime source of record remains the existing Dev/Test **in-memory** `Store`;
- additive SQL only (new `privacy_dpias` table; do not `ALTER` `privacy_processing_activities` or `privacy_dsr_cases`);
- `UNIQUE (tenant_id, dpia_code)`;
- no foreign key to P1 tables;
- live PostgreSQL UNVERIFIED;
- intended filename if a migration is added later: `104_p2_privacy_dpias.sql` (after `103_itr1_itsm_releases.sql`);
- ADR-0017 **not** reopened.

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title (optional notes) | open |
| open | patch title / notes | open |
| open | patch status to `done` | done |
| open | patch status to `cancelled` | cancelled |
| done | patch | deny |
| cancelled | patch | deny |

Create always starts as `open`. A client-supplied create-time `status` must not bypass that rule (ITR1/ITC1/ITP1: create ignores client status and writes `open`).

No dedicated approve, reject, legal, opinion, assess, erase, consent, dlp, complete, or cancel endpoints. Lifecycle uses **PATCH status** only (same bounded surface as ITR1/ITC1/ITP1/H1; status names follow K2 `open` / `done` / `cancelled`). Illegal status change → `409` `invalid_transition`. Patch when `done` → `409` `done`. Patch when `cancelled` → `409` `cancelled`.

No P1 DSR-style SoD close. P2 is a thin register, not a second DSR.

## STOP rule

If implementation encounters pressure to add any of the following, **STOP** and return to governance. Do not silently expand this contract:

- legal opinion / PDPA / GDPR interpretation
- lawful-basis or residual-risk fields treated as conclusions
- `activityId` / `dsrId` linkage
- consent platform / DLP / live erasure
- scheduler / SLA / automation
- AI mutation
- P1 / I15 / GRC mutation
- UAT / Production
- ADR-0006 / 0012 / 0013 closure, or ADR-0017 reopen

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human (`AiAgent`, `Service`, or any non-Human) → `403`, reason `ai_actor`. No autonomous DPIA creation, legal conclusion, or closure.

Do not introduce a new actor type, IdP, vault, break-glass mechanism, or production security dependency.

## API

Prefix `/v1/privacy/dpias`, consistent with P1 `/v1/privacy/activities` and `/v1/privacy/dsrs`. Do **not** attach P2 to `/v1/privacy/health`. P1 `/v1/privacy/health`, `/v1/privacy/activities*`, and `/v1/privacy/dsrs*` are not modified. JSON omits `tenantId` and `principalId`. Tenant id comes from the authenticated principal only.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/privacy/dpias/health` | `privacy:read:dpia` |
| GET | `/v1/privacy/dpias?q=&status=` | `privacy:read:dpia` |
| POST | `/v1/privacy/dpias` | `privacy:write:dpia` |
| GET | `/v1/privacy/dpias/:id` | `privacy:read:dpia` |
| PATCH | `/v1/privacy/dpias/:id` | `privacy:write:dpia` |

Health increment is `P2` (distinct from P1). Intended health shape follows ITR1: `module` `privacy-dpias`, `increment` `P2`, `status` `ok`, `dpias` count, `openDpias` count.

Do not add approve, reject, legal, opinion, assess, erase, consent, dlp, complete, cancel, bulk, or automation routes.

## RBAC

| Permission | Intent |
| --- | --- |
| `privacy:read:dpia` | Health + list/get |
| `privacy:write:dpia` | Create / patch (including human done / cancelled) |

`platform.admin` — both (additive seed only). Role `privacy.dpia` — both. Alice and partner — 403. At implementation time, Bob seed includes `privacy.dpia` so the architecture role is exercised.

Do not broaden:

- P1 permissions (`privacy:read:activity`, `privacy:write:activity`, `privacy:read:dsr`, `privacy:write:dsr`) or role `dpo`
- ITR1 / ITC1 / ITP1 / I11 permissions
- H1, GRC, crisis, operations, or HR permissions

Existing P1 activity/DSR permissions and role `dpo` are **not** reused for P2 write or P2-only read. DPIA write is **not** granted automatically to every P1 / `dpo` role.

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant DPIA id → 404. P1 isolation unchanged.

## Audit

P1 privacy services do **not** call `recordAudit`. P2 must match that sibling class (also ITR1/ITC1/ITP1). Do not introduce a new audit subsystem or a new hash-chain writer solely for P2. I0 audit/hash-chain remains available to other modules and is not redesigned here.

## UI

- `/commercial/dpia`
- Nav **Privacy → DPIA** (existing **Privacy → RoPA** and **Privacy → DSR** surfaces unchanged except optional additive links)
- Register DPIA (title + optional notes)
- Queue/list, optional filters consistent with O6/K2/H1/ITR1 registers (`q` / status), detail with done / cancel (from `open` via patch status)
- Open / done / cancelled badges; loading / empty / error / authorization-failure states
- Copy states this is a **DPIA register**, not a DPIA product, not legal interpretation, not consent, not DLP, not live erasure, and not a RoPA or DSR replacement
- P1 RoPA or DSR pages may add a link to DPIA; neither page is redesigned

Do not create DPIA wizards, residual-risk calculators, lawful-basis pickers, consent dashboards, or legal-opinion suites.

## Validation / failure

| Condition | Result |
| --- | --- |
| Unauthenticated | 401 |
| Missing permission | 403 |
| Non-human mutate | 403 `ai_actor` |
| Invalid / missing title | 400 `title_required` |
| Title longer than 200 | 400 `title_too_long` |
| Notes longer than 2000 | 400 `notes_too_long` |
| Illegal status change | 409 `invalid_transition` |
| Patch when done | 409 `done` |
| Patch when cancelled | 409 `cancelled` |

Allocated `DPI-####` codes are unique per tenant (generator + `UNIQUE (tenant_id, dpia_code)` if SQL is later added).

## Security

No tenant/principal ids in JSON. No file uploads. No IdP/vault/SIEM adapters. No legal AI. Human-only gates are server-enforced. Status is never treated as a legal sign-off, erasure, or scheduler. ADR-0006 / ADR-0012 / ADR-0013 remain OPEN and are not required for this Dev/Test contract.

## Testing (FUTURE — when implementation is authorized)

Do **not** create or modify tests in this Stage 1 authoring task. The following is an implementation-time / validation requirement only.

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation (wrong-tenant id 404)
- Creation, listing, retrieval, patch while `open`; `open` → `done`; `open` → `cancelled`
- Terminal records reject further patch (`409` `done` / `cancelled`); illegal status `409` `invalid_transition`
- Generated codes unique per tenant (`DPI-0001`, then `DPI-0002`)
- Forbidden engine subroutes (`approve`, `legal`, `opinion`, `erase`, `consent`, `dlp`, `assess`, …) return 404
- JSON must not contain `tenantId` or `principalId`
- Dedicated role `privacy.dpia` has only the P2 permission pair; `dpo` does not gain P2 perms
- Kernel allocator/status helpers analogous to `packages/kernel/src/itsm-releases.test.ts`
- Web typecheck
- Regression: P1 health remains `increment=P1`; store keys `privacyDpia` / `privacyRopa` / `privacyDsr` / `privacyConsent` / `privacyDlp` remain absent; ITR1 health remains `ITR1`; G1–G5, I15, I17, C9/C10 unchanged
- At implementation time, do **not** flip P1's `"privacyDpia" in store` freeze — P2 uses `privacyDpias`

## Acceptance criteria (when implementation is authorized)

1. Carol can register a DPIA and mark it done or cancelled from **Privacy → DPIA**.
2. Alice and partner cannot read DPIA APIs.
3. Health increment is `P2`. P1 health remains `P1`. ITR1 health remains `ITR1`.
4. P1 RoPA/DSR rows and behaviour are unchanged.
5. Store key is `privacyDpias`. P1 keys and forbidden singular `privacyDpia` are not reused.
6. P1 remains closed. I15 remains closed. ITR1 remains closed. SAMPLE remains deferred.

## Exclusions

- DPIA product; legal opinions; PDPA/GDPR interpretation engines
- Lawful-basis determination; residual-risk scoring as a legal conclusion
- Consent-management platform; DLP; live erasure / production deletion
- `activityId` / `dsrId` linkage; RoPA/DSR redesign
- SLA engine; scheduling engine; automated execution
- P1 mutation; I15 mutation; GRC mutation
- ITR1 / ITC1 / ITP1 / I11 mutation
- Procurement; payroll; HR; crisis command
- SAMPLE; I21–I23; EMCOMMS; EXER; CAL; PO; SUCC; I20X; EXT
- Corporate IdP; vault; SIEM; live regulatory feeds; external providers
- P1 reopen; I15 reopen
- Numeric placeholder IDs P1.x / I15.x / H1.x / H2 / O7 / K3 / G6 / ITR1.x / I3.38 / I4.35 / I20.23 / PG.30 / C11 / D1

## Verification limitations

Live PostgreSQL UNVERIFIED. Preview process restart is verification infrastructure only. A stale process returning 404 is not a P2 defect. Signed-in Dev/Test browser verification on `/commercial/dpia` (create `DPI-0001` done / `DPI-0002` cancelled; RoPA and DSR still load) is complete for this Stage 2 close-out.

## Rollback / containment

If implemented later: additive migration only; disable by not registering routes. New module only. Do not roll back or alter P1 schema or behaviour to “make room” for P2.

## Dependencies

I0 kernel patterns (tenancy/RBAC). No P1 write dependency. No new vendors, external services, identity providers, legal-opinion engines, infrastructure, or live database dependencies. ADR-0006 / 0012 / 0013 remain OPEN and unused by this Dev/Test contract. ADR-0017 not reopened.

## Governance / authority matrix

```text
CAPABILITY_SELECTED=YES
CAPABILITY_ID=P2
STAGE_1_CREATED=YES
STAGE_1_APPROVED=YES
IMPLEMENTATION_AUTHORIZED=YES
ENVIRONMENT=DEVTEST
STAGE_2=COMPLETE_CLOSED_DEVTEST
EXECUTION_QUEUE=EMPTY
UAT=NOT_AUTHORIZED
PRODUCTION=NOT_AUTHORIZED
PUSH=NOT_AUTHORIZED
```

Operator next steps: commit only if separately requested. Do not infer UAT, Production, or push. Stage 2 complete for Development/Test is not an execution queue.
