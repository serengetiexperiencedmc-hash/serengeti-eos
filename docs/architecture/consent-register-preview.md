# P3 Consent Register — Stage 1 contract (approved)

> **CURRENT STATE (2026-08-26 Operator P3 CONSENT REGISTER PREVIEW AUTHORIZED — Dev/Test Preview PASS)**  
> **PRODUCT_STATE=FROZEN_DEVTEST** · **HEAD=`8fa8ddcb5c1c40715e5ba3fa3c7765c8bb08a4e9`** (ITE1 governance closure). ITE1 and E2 remain **CLOSED / ACCEPTED**.  
> This document is the **approved** Stage 1 architecture contract. Dev/Test implementation is **complete**. Dev/Test Preview was **authorized and executed** with **CONSENT_PREVIEW=PASS**. It is **not** commit or push authorization.  
> **CONSENT_UNDEFER=AUTHORIZED** · **CONSENT_STAGE1=APPROVED** · **CONSENT_STAGE1_APPROVAL=YES** · **CAPABILITY_ID=P3**  
> **CONSENT_IMPLEMENTATION=COMPLETE** · **CONSENT_PREVIEW=PASS** · **CONSENT_COMMIT=NOT_AUTHORIZED** · **CONSENT_PUSH=NOT_AUTHORIZED**  
> **UAT=NOT_AUTHORIZED** · **PRODUCTION=NOT_AUTHORIZED** · **ADR-0006=OPEN** · **EXECUTION_QUEUE=EMPTY** · **NEXT_INCREMENT=NONE_AUTHORIZED**  
> P1 and P2 remain **CLOSED**. This document does **not** reopen P1 or P2 and is **not** P1.x. Authority record: [`../governance/consent-register-authorized.md`](../governance/consent-register-authorized.md).

## Lifecycle status

| Field | Value |
| --- | --- |
| Increment ID | **P3** |
| Capability name | Consent Register |
| Family | privacy |
| Domain | Privacy (`privacy` — domain map 2.2 aggregate **Consent**) |
| Predecessor | I2 kernel (complete); P1 RoPA + DSR complete and **not** reopened; P2 DPIA complete and **not** reopened |
| Architecture status | Approved Stage 1 contract; Dev/Test implementation complete |
| Stage | Stage 1 |
| **STATUS** | **STAGE 1 APPROVED; IMPLEMENTATION COMPLETE; PREVIEW PASS; COMMIT NOT AUTHORIZED** |
| Implementation status | **COMPLETE** (Dev/Test) |
| Environment | Development/Test only |
| Persistence | In-memory `Store` is the Dev/Test SoR. Additive SQL `110_p3_consent_records.sql` (next unused after committed `109_ite1_it_endpoints.sql`; do **not** use local uncommitted PQL drafts). Live PostgreSQL UNVERIFIED. PostgreSQL is **not** established as a new system of record by this contract. |
| Runtime health increment | **P3** (`module` `consent-register`; must not replace P1 `/v1/privacy/health` or P2 `/v1/privacy/dpias/health`) |
| Production / UAT / AI | Not authorized |
| **CAPABILITY_ID** | **P3** |
| **CONSENT_UNDEFER** | **AUTHORIZED** |
| **STAGE_1_CREATED** | **YES** |
| **STAGE_1_STATUS** | **APPROVED** |
| **STAGE_1_APPROVED** | **YES** |
| **IMPLEMENTATION_AUTHORIZED** | **YES** (Dev/Test) |
| **PREVIEW** | **PASS** (Development/Test; executed) |
| **COMMIT** | **NOT_AUTHORIZED** |
| **PUSH** | **NOT_AUTHORIZED** |
| **UAT** | **NOT_AUTHORIZED** |
| **PRODUCTION** | **NOT_AUTHORIZED** |
| **ADR-0006** | **OPEN** |
| **EXECUTION_QUEUE** | **EMPTY** |
| **NEXT_INCREMENT** | **NONE_AUTHORIZED** |

Authority: 2026-08-26 Operator **PRODUCT OWNER DECISION — UNDEFER CONSENT REGISTER + AUTHORIZE STAGE 1** (`CAPABILITY=CONSENT_REGISTER`, `CONSENT_UNDEFER=AUTHORIZED`); 2026-08-26 Operator **GOVERNANCE ACTION — ASSIGN P3 TO CONSENT REGISTER AND PREPARE STAGE 1 APPROVAL RECORD** (`CAPABILITY_ID=P3`, `STAGE_1_APPROVED=YES`); 2026-08-26 Operator **P3 IMPLEMENTATION AUTHORIZATION — CONSENT REGISTER** (`CONSENT_IMPLEMENTATION=AUTHORIZED`, Dev/Test only). ID **P3** is the privacy-family identifier after P1 and P2. Committed `master` uniqueness re-check found no existing `P3`. It is **not** P1, **not** P1.x, **not** P2, **not** P2.x, **not** C2, **not** C11, and **not** I24. This document does **not** authorize Preview, commit, push, UAT, Production, hosting, or ADR-0006 closure, and does **not** reopen P1 / P2 / ITE1 / E2 / ITA1 / ITL1 / I11 / ITC1 / ITP1 / ITR1 / E1 / I15.

**Undefer ≠ Stage 1 approval.**  
**Stage 1 contract ≠ Stage 1 approval.**  
**Stage 1 approval ≠ implementation authorization.**  
**Implementation complete ≠ Preview authorization.**  
**Preview ≠ UAT.**  
**UAT ≠ Production.**

The sections after this heading are the **approved** architecture contract. They are not an implementation queue.

```text
CONSENT_UNDEFER = AUTHORIZED
CONSENT_STAGE1 = APPROVED
CONSENT_STAGE1_APPROVAL = YES
CAPABILITY_ID = P3
CONSENT_IMPLEMENTATION = COMPLETE
CONSENT_PREVIEW = PASS
CONSENT_COMMIT = NOT_AUTHORIZED
CONSENT_PUSH = NOT_AUTHORIZED
UAT = NOT_AUTHORIZED
PRODUCTION = NOT_AUTHORIZED
ADR_0006 = OPEN
NEXT_INCREMENT = NONE_AUTHORIZED
EXECUTION_QUEUE = EMPTY
```

---

## Objective

Deliver a **Privacy** workspace surface where an authorised human can record **Consent Register rows**: a human catalogue that a consent **record exists**, or was cancelled.

**Consent Register = catalogue/governance record of consent-register rows.**  
**Consent Register ≠ consent-management platform.**

The register is an **existence/case catalogue only**. It must **not** determine whether consent is legally valid or sufficient. It must **not** obtain, collect, notice, sign, cookie-track, market-preference, auto-withdraw, auto-enforce, or store proof of consent.

Domain map 2.2 names **Consent** under `privacy` after ProcessingActivity, DSR, and DPIA, owned by DPO. P1 shipped RoPA + DSR only and excluded a consent-management platform. P2 shipped the DPIA register and excluded a consent platform. This undefer is the bounded **Consent Register** leftover noun — not a CMP, not P1.x, and not a P2 DPIA `consent` subroute.

---

## Domain boundary

| Aggregate | Meaning | Must remain |
| --- | --- | --- |
| **Consent Register** | A human record that a consent **register row exists** (or was cancelled) | New store (`consentRecords`) |
| **P1 Processing activity** | RoPA register row | Closed — not reopened; **no** `activityId` |
| **P1 DSR** | DSR case register row | Closed — not reopened; **no** `dsrId` |
| **P2 DPIA** | DPIA case register row | Closed — not reopened; **no** `dpiaId` |

**P1** records that a processing activity or DSR case exists.  
**P2** records that a DPIA case exists.  
**Consent Register** records that a consent **catalogue row** exists.

Do **not** add subject identity, evidence, notice content, channel, grant/withdraw timestamps, cookie/device identifiers, marketing flags, lawful-basis conclusions, or P1/P2 foreign keys merely to enlarge the distinction. Those fields would turn this into a consent-management or evidence system.

Do **not** use store key `privacyConsent` (singular). P1 and P2 regressions require that key to remain **absent**. Do **not** restore P1 “consent tables”. Do **not** add `consent` subroutes under P1 `/v1/privacy/activities*`, `/v1/privacy/dsrs*`, `/v1/privacy/health`, or P2 `/v1/privacy/dpias*`.

---

## Scope

| Deliverable | In scope (Stage 1 approved) |
| --- | --- |
| Consent-register create / list / get / patch (while `open`) | Yes |
| Codes unique per tenant with prefix **`CNS-`** | Yes |
| Statuses: `open` → `done`; `open` → `cancelled`; those two terminal | Yes |
| Required `title`; optional `notes` | Yes |
| Human-only mutate (deny `AiAgent` / non-Human) | Yes |
| Dedicated store, API, health, UI, permissions, role | Yes |
| In-memory Dev/Test SoR if implementation is later authorized | Yes |
| Additive SQL only if a later implementation gate authorizes it | Yes (not in this authoring pass) |
| Consent-management platform / capture / notices / signatures | No |
| Cookie / device / browser / marketing preferences | No |
| Automated grant/withdraw/enforcement / expiry | No |
| Legal validity / lawful-basis conclusions | No |
| Evidence blobs / notice versions / provider IDs | No |
| `activityId` / `dsrId` / `dpiaId` / P1 or P2 mutation | No |
| UAT / Production / ADR-0006 closure | No |

Required field is **`title`**, matching ITA1/ITL1/ITR1/P2/ITE1 registers.

### Approved code prefix

**`CNS-`** (example `CNS-0001`).

- Not the capability id `P3`.
- Not P1/P2 codes (`DPI-` is P2).
- Committed `CON-` appears on supplier **contract** import refs; `CST-` is **costing**. Those must not be reused.
- Repository search of committed `master` found **no** `CNS-` allocator and no `/v1/consents` collection.

This prefix is **approved** as part of Stage 1. It does not authorize implementation.

No date fields. Dates must not be introduced as grant, withdraw, expiry, notice, or automatic status drivers.

Do **not** use statuses `granted`, `withdrawn`, `expired`, `valid`, `invalid`, `enrolled`, `collected`, `enforced`, `in_progress`, or P1 DSR `closed`. This catalogue uses only **`open` / `done` / `cancelled`** so membership is not mistaken for legal consent state.

---

## Domain model (conceptual; approved)

**consent_records** (runtime store key **`consentRecords`**)

- Not P1 `privacyProcessingActivities` / `privacyDsrCases`
- Not P2 `privacyDpias`
- Not reserved-absent `privacyConsent` / `privacyRopa` / `privacyDsr` / `privacyDpia` / `privacyDlp`
- Not SAMPLE keys

- `id`
- `consentCode` unique per tenant (`CNS-0001`) — name is a **register code**, not proof of consent
- `title` required (max 200)
- optional `notes` (max 2000)
- `status`: `open` \| `done` \| `cancelled`
- timestamps + createdByPrincipalId / updatedByPrincipalId (not returned)

JSON omits `tenantId` and `principalId`. Create/get/patch wrap as `{ consent: ... }` (catalogue row, not a captured consent artefact). List wraps as `{ items }` (ITA1/ITL1/P2/ITE1 pattern).

No `activityId`, `dsrId`, `dpiaId`, subject email/name/id, cookie ID, device/browser identifier, notice version, signature, evidence blob, channel, grant/withdraw timestamps, marketing flag, provider ID, or lawful-basis field.

`done` means the human marked the **register row** complete. It is **not** legally valid consent, not collected consent, not withdrawn consent, and not enforced consent.

---

## Persistence / migration

Additive SQL was created at implementation authorization:

- runtime source of record remains the existing Dev/Test **in-memory** `Store`;
- additive SQL only (new `consent_records` table; do **not** `ALTER` `privacy_processing_activities`, `privacy_dsr_cases`, or `privacy_dpias`);
- `UNIQUE (tenant_id, consent_code)`;
- no foreign key to P1 or P2 tables;
- live PostgreSQL UNVERIFIED;
- filename **`110_p3_consent_records.sql`** (next unused after committed `109_ite1_it_endpoints.sql`); do **not** use local uncommitted PQL drafts (`109_pql1_rfp_briefs.sql`, `110`–`115`);
- ADR-0017 **not** reopened.

---

## Workflow

| From | Action | To |
| --- | --- | --- |
| (none) | create with title (optional notes) | open |
| open | patch title / notes | open |
| open | patch status to `done` | done |
| open | patch status to `cancelled` | cancelled |
| done | patch | deny |
| cancelled | patch | deny |

Create always starts as `open`. A client-supplied create-time `status` must not bypass that rule.

No dedicated collect, notice, sign, grant, withdraw, enforce, cookie, prefer, erase, consent-capture, or CMP endpoints. Lifecycle uses **PATCH status** only. Illegal status change → `409` `invalid_transition`. Patch when `done` → `409` `done`. Patch when `cancelled` → `409` `cancelled`.

---

## STOP rule

If implementation later encounters pressure to add any of the following, **STOP** and return to governance. Do not silently expand this contract:

- consent-management platform / collection / preference centre
- notices / signatures / affirmative capture / subject-facing workflows
- cookie / device / browser identifiers
- marketing flags or preference state
- automated grant, withdraw, expiry, or enforcement
- legal-validity or lawful-basis conclusions
- evidence blobs / notice versions / provider IDs / external CMP
- DLP / live erasure / automated privacy-rights processing
- `activityId` / `dsrId` / `dpiaId` / P1 or P2 mutation or subroutes
- restore of store key `privacyConsent`
- scheduler / SLA / automation / AI mutation
- UAT / Production
- ADR-0006 / 0012 / 0013 closure, or ADR-0017 reopen
- hosting, residency, Production DB, or provider infrastructure decisions

---

## Human-only mutation

Create and patch require `actorType === "Human"`. Non-Human (`AiAgent`, `Service`, or any non-Human) → `403`, reason `ai_actor`. No autonomous consent-register creation, capture, withdrawal, or enforcement.

Do not introduce a new actor type, IdP, vault, break-glass mechanism, or CMP connector. Do not reopen ADR-0012 or ADR-0013.

---

## API

New collection **`/v1/consents`**. This is a **sibling register**, not an extension of P1 or P2.

Do **not** attach this capability to `/v1/privacy/health`, `/v1/privacy/activities`, `/v1/privacy/dsrs`, `/v1/privacy/dpias`, or `/v1/privacy/dpias/:id/consent`. P1 and P2 routes are not modified.

JSON omits `tenantId` and `principalId`. Tenant id comes from the authenticated principal only.

| Method | Path | Permission |
| --- | --- | --- |
| GET | `/v1/consents/health` | `consent:read:register` |
| GET | `/v1/consents?q=&status=` | `consent:read:register` |
| POST | `/v1/consents` | `consent:write:register` |
| GET | `/v1/consents/:id` | `consent:read:register` |
| PATCH | `/v1/consents/:id` | `consent:write:register` |

Health shape: `module` `consent-register`, `increment` **P3**, `status` `ok`, `consents` count, `openConsents` count. Do **not** use P1 or P2 as this increment.

Do not add collect, notice, sign, grant, withdraw, enforce, cookie, prefer, erase, cmp, activity, dsr, dpia, bulk, or automation routes.

Committed `master` has no `/v1/consents` collection. P1/P2 tests that assert `"privacyConsent" in store` is `false` remain correct for P1/P2 and must stay true of that **reserved** key.

---

## RBAC

| Permission | Intent |
| --- | --- |
| `consent:read:register` | Health + list/get |
| `consent:write:register` | Create / patch (including human done / cancelled) |

`platform.admin` — both (additive seed only, if implementation is later authorized). Role **`consent.register`** — both. Alice and partner — 403.

Do **not** reuse or broaden:

- P1 permissions (`privacy:read:activity`, `privacy:write:activity`, `privacy:read:dsr`, `privacy:write:dsr`) or role `dpo`
- P2 permissions (`privacy:read:dpia`, `privacy:write:dpia`) or role `privacy.dpia`
- ITE1 / E2 / ITA1 / ITL1 / I11 permissions or roles

Do not create implementation permissions in source code in this Stage 1 authoring pass.

---

## Tenant isolation

Tenant-scoped. Missing / wrong-tenant id → 404. P1 / P2 isolation unchanged. No cross-tenant administrative behaviour.

---

## Audit

Sibling registers in this class (ITA1/ITL1/ITR1/P2/ITE1) do **not** call `recordAudit` on the register service. This contract must match that class if implementation is later authorized. Do not introduce a new audit subsystem in this authoring pass.

---

## UI

- Route **`/commercial/consents`**
- Nav **Privacy → Consents** (P1 **Privacy → RoPA** / **Privacy → DSR** and P2 **Privacy → DPIA** remain unchanged)
- Register a row (required title + optional notes); list; open detail; mark `done` or `cancelled` while `open`
- Copy states this is a **Consent Register**, never a consent-management platform, preference centre, cookie banner, notice manager, or legal-validity engine; not a P1 or P2 replacement

Do not add capture widgets, notice editors, signature pads, cookie toggles, marketing-preference matrices, or evidence upload.

Do not create UI files in this Stage 1 authoring pass.

---

## Testing (FUTURE — when implementation is authorized)

Do **not** create or modify tests in this Stage 1 authoring task.

- 401 unauthenticated; 403 RBAC (Alice/partner); 403 `ai_actor`; tenant isolation
- Create / list / get / patch while `open`; `open` → `done`; `open` → `cancelled`
- Terminal records reject further patch; illegal status `409`
- Generated codes unique per tenant (`CNS-0001`, then `CNS-0002`)
- Forbidden engine subroutes (`collect`, `notice`, `sign`, `grant`, `withdraw`, `enforce`, `cookie`, `cmp`, …) return 404
- Nested P1/P2 consent subroutes remain 404; P1 `/v1/privacy/health` increment remains `P1`; P2 `/v1/privacy/dpias/health` increment remains `P2`
- Store key `consentRecords` present only after a later implementation; **`privacyConsent` remains absent**
- JSON must not contain `tenantId` or `principalId`
- Dedicated role `consent.register` has only the Consent permission pair; `dpo` / `privacy.dpia` do not gain them

---

## Exclusions / non-goals

- Consent management; capture; collection; preference centre; notices; signatures; affirmative evidence
- Subject-facing workflows; cookie IDs; device/browser identifiers; marketing flags/preferences
- Automated grant/withdraw/enforcement; expiry/auto-withdraw
- Legal validity conclusions; lawful-basis conclusions
- Evidence blobs; notice versions; provider IDs; external CMP integrations
- DLP; live erasure; automated privacy-rights processing
- ProcessingActivity / RoPA / DSR / DPIA relationships; `activityId` / `dsrId` / `dpiaId`
- Mutation of P1 or P2; consent subroutes under P1/P2; restore of `privacyConsent`
- P1.x; P1 reopen; P2 reopen
- SAMPLE; I21–I23; EMCOMMS; EXER; CAL; PO; SUCC; I20X; EXT; payroll; Dataset / Data Governance
- O7; PQL; UEM/MDM
- UAT; Production; ADR-0006 hosting/residency; live PostgreSQL as SoR; new vendors

---

## Verification limitations

This Stage 1 authoring pass creates **no** application source, tests, SQL, or UI. It does **not** start runtimes or perform live verification. Live PostgreSQL UNVERIFIED. Preview is **not** authorized.

---

## Rollback / containment

If implemented later: additive migration only; disable by not registering routes. New module only. Do not roll back or alter P1/P2 schema or behaviour to “make room” for Consent Register.

---

## Dependencies

I0 kernel patterns (tenancy / RBAC / human actor). P1 and P2 are **closed siblings**, not write dependencies. No new vendors, CMP providers, identity providers, discovery tools, infrastructure, or live database dependencies. ADR-0006 / 0012 / 0013 remain OPEN and unused by this Dev/Test contract. ADR-0017 not reopened. DP-0006 remains pending; this contract does not consume RFI answers. Uncommitted O7 / PQL / DP-0006 working-tree material is not authority.

---

## Governance / authority matrix

```text
CAPABILITY = CONSENT_REGISTER
CAPABILITY_ID = P3
CAPABILITY_NAME = Consent Register
STAGE = 1
STATUS = STAGE_1_APPROVED_IMPLEMENTATION_COMPLETE_PREVIEW_PASS
CONSENT_UNDEFER = AUTHORIZED
CONSENT_STAGE1 = APPROVED
STAGE_1_CREATED = YES
STAGE_1_STATUS = APPROVED
STAGE_1_APPROVED = YES
CONSENT_STAGE1_APPROVAL = YES
IMPLEMENTATION_AUTHORIZED = YES
CONSENT_IMPLEMENTATION = COMPLETE
CONSENT_PREVIEW = PASS
CONSENT_COMMIT = NOT_AUTHORIZED
CONSENT_PUSH = NOT_AUTHORIZED
UAT = NOT_AUTHORIZED
PRODUCTION = NOT_AUTHORIZED
ADR_0006 = OPEN
HOSTING_OPTION_SELECTED = NO
EXECUTION_QUEUE = EMPTY
NEXT_INCREMENT = NONE_AUTHORIZED
NEW_CAPABILITY_AUTHORIZED = NONE
PATH_B_GENERAL_AUTO_SELECTION = PAUSED
```

Approved Stage 1 fields: code prefix `CNS-`; store key `consentRecords`; API `/v1/consents`; health `/v1/consents/health` (`increment=P3`, `module=consent-register`); UI `/commercial/consents`; permissions `consent:read:register` / `consent:write:register`; role `consent.register`; lifecycle `open` / `done` / `cancelled`.

Next gate: **PREVIEW PASS — COMMIT AUTHORIZATION STILL REQUIRED**. This is not commit, push, UAT, Production, or ADR-0006 closure. Preview PASS does not authorize commit.
