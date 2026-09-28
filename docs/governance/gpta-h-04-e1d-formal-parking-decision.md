# GPTA-H-04 — E1-D Formal Parking Decision

> **`OWNER DECISION RECORD — NOT AN IMPLEMENTATION AUTHORIZATION`**  
> **`NO IMPLEMENTATION`** · **`NO COMMIT`** · **`NO PUSH`** · **`NOTHING STAGED`**  
> **`NO UAT`** · **`NO REMEDIATION`**  
> **`NA-A-23 IS NOT CREATED`**  
> **`PARKING IS NOT ABANDONMENT`**

**HEAD inspected:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`.  
**Working tree:** **DIRTY** — preserved exactly as found.

---

## 1. Owner decision

**`OWNER DECISION = PARK E1-D`**

Meaning of this decision:

* E1-D is **formally parked / deferred**.
* Existing E1-D implementation work in the dirty working tree is **preserved**.
* Parking is **NOT abandonment**.
* No existing E1-D implementation is authorized for **further development** by this decision.
* **No commit** is authorized.
* **No push** is authorized.
* **No UAT** is authorized by this decision.
* **No remediation** is authorized by this decision.
* **No reopening** of protected or paused workstreams is authorized.
* **No Production** activity is authorized.

`PARKING DOES NOT CREATE FUTURE IMPLEMENTATION AUTHORIZATION.`  
`PARKING DOES NOT CREATE COMMIT AUTHORIZATION.`  
`PARKING DOES NOT CREATE PUSH AUTHORIZATION.`  
`PARKING DOES NOT CREATE UAT AUTHORIZATION.`

A future reopening must be **separately authorized**.

---

## 2. Decision date

**Date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T21:54:00+03:00**.

This record follows GPTA-H-03 (`FORMAL PARKING/DEFERMENT DECISION REQUIRED`) and records the Owner selection of Outcome C. It does **not** rewrite GPTA-H-03. GPTA-H-02 Owner OPTIONS A–D remain **unselected** as a commit-scope package; this decision does **not** grant GPTA-H-02 commit or push.

---

## 3. Governance basis

Authoritative assessment: [`gpta-h-03-e1d-closure-remediation-decision-readiness.md`](gpta-h-03-e1d-closure-remediation-decision-readiness.md).

Also reconciled: [`gpta-h-02-owner-commit-scope-decision-package.md`](gpta-h-02-owner-commit-scope-decision-package.md) (`OWNER DECISION PACKAGE READY — NO VALID COMMIT SCOPE ESTABLISHED`); Class A implementation record and post-implementation audit; narrow Class B authorization, implementation record, reconciliation, and audit.

Factual basis (evidence only; no added interpretation):

* E1-D is **not closed**.
* Class A exists but is **uncommitted**.
* Focused Class A tests are **11/11 PASS**.
* Class A has a **test-environment exception**.
* Class B **narrow** Dev/Test slice is **authorized** (`AUTHORIZED — DEV/TEST ONLY` for NB1–NB5).
* Broader Class B **umbrella** is **not granted** (`PREPARED — NOT GRANTED`).
* NB1–NB4 are **closed** for their authorized slices.
* NB5 drill remains **incomplete**.
* F1 remains an **Owner/governance decision**.
* UAT evidence is **absent**.
* Mixed/protected callers prevent a **coherent standalone commit**.
* **No bounded remediation scope** was established.
* Formal parking is **viable**.

---

## 4. E1-D current state

| Item | Status at parking |
| --- | --- |
| E1-D programme | **NOT CLOSED** — now **FORMALLY PARKED / DEFERRED** |
| Class A | **COMPLETE WITH TEST-ENVIRONMENT EXCEPTION** (working tree, uncommitted) |
| Class A focused tests | **11/11 PASS** |
| Full API suite | **600 PASS / 21 FAIL** classified **F1** — not claimed green |
| Narrow Class B | **PARTIAL** slice; NB1–NB4 closed; NB5 blocked |
| Umbrella Class B | **PREPARED — NOT GRANTED** |
| Class C–F | **Open** (provider / human / Gate C / Production) — **not advanced** |
| GPTA-H-02 | **NO VALID COMMIT SCOPE ESTABLISHED**; commit/push **NOT GRANTED** |
| GPTA-H-03 | Assessment complete; Owner now records **PARK** |

---

## 5. Parked scope

The following **existing** E1-D artefacts remain in the dirty tree and are **parked** (preserved, not further developed under this decision):

### Class A

* `apps/api/src/devtest-http-controls.ts`
* `apps/api/src/devtest-token-secret.ts`
* four Class A tests:
  * `apps/api/src/e1-d-class-a.devtest-http.test.ts`
  * `apps/api/src/e1-d-class-a.token-bootstrap.test.ts`
  * `apps/api/src/e1-d-class-a.observability.test.ts`
  * `apps/api/src/e1-d-class-a.localfs-recovery.test.ts`
* associated E1-D Class A records:
  * `docs/governance/adr-0006-e1-d-class-a-dev-test-implementation-record.md`
  * `docs/governance/adr-0006-e1-d-class-a-post-implementation-audit.md`

Class A mixed **callers** (`main.ts`, `server.ts`, `.env.example`, `infra/compose/dev.yaml`) are **not** absorbed into parked E1-D scope; they remain **outside** (see §10).

### Class B

* **Parked:** the **authorized narrow Dev/Test slice** (NB1–NB5 grant `AUTHORIZED — DEV/TEST ONLY`), including:
  * `apps/api/src/persistence/sor-inventory.ts`
  * `docs/governance/adr-0006-e1-d-class-b-sor-inventory.md`
  * `apps/api/src/persistence/disposable-pg-recovery.ts`
  * `apps/api/src/e1-d-class-b.crm-same-tx.test.ts`
  * `apps/api/src/e1-d-class-b.inventory-storage.test.ts`
  * `apps/api/src/e1-d-class-b.ready.test.ts`
  * `apps/api/src/e1-d-class-b.pg-dump-restore.test.ts`
  * narrow Class B authorization / implementation / reconciliation / audit records
* **Not parked as granted work:** the **broader Class B umbrella** remains **`PREPARED — NOT GRANTED`**. MFA, Helmet, NATS, SoR expansion, and Production `/ready` are **not** authorized by parking and are **not** converted into parked-but-granted scope.

Kernel/CRM/`server.ts` **callers** used by NB2–NB4 remain **outside** parked E1-D scope as mixed/protected files (see §10). Their prior authorized **slice status** is recorded in §6; parking does **not** authorize further edits to those files.

---

## 6. NB1–NB5 status

| Item | Status at parking |
| --- | --- |
| **NB1** | **CLOSED** for authorized SoR **inventory** (not expansion) |
| **NB2** | **CLOSED** for authorized Dev/Test `DocumentStorage.delete` port |
| **NB3** | **CLOSED** for authorized Dev/Test `/ready` honesty contract |
| **NB4** | **CLOSED** for authorized CRM mutation+outbox TX (live PG not proven; residual I4 path out of scope) |
| **NB5** | **`HARNESS EXISTS ≠ DRILL COMPLETED`**. **`DRILL NOT RUN`** because `pg_dump`/`pg_restore` are unavailable on PATH (`BLOCKED — NO SAFE DISPOSABLE POSTGRESQL TARGET AVAILABLE`). This decision does **not** run or repair the drill. |

---

## 7. F1 status

**Unchanged.** Pre-existing `eos_gateb` `42P07` (`relation "tenants" already exists`) test-environment defect. Not classified as an E1-D Class A/B regression. Must **not** DROP `eos_gateb`.

**`F1 = OWNER/GOVERNANCE DECISION REQUIRED`**

This parking decision **does not** accept, waive, or remediate F1.

---

## 8. UAT status

**EVIDENCE NOT FOUND.** Class A/B audits are **not** UAT. Governing Dev/Test grants **excluded** UAT.

**`UAT AUTHORIZATION = NOT GRANTED`**

This parking decision **does not** authorize UAT.

---

## 9. Mixed dependency status

GPTA-H-02 / GPTA-H-03 stand: named Class A helpers/tests and Class B artefacts **cannot** form a coherent standalone commit because required callers remain mixed/protected (`main.ts`, `server.ts`, kernel ports, CRM/persistence, E1-C imports of the token helper, configuration overlays).

Parking **does not** split, absorb, or restage those callers. Mixed-file resolution remains a **future reopen** condition.

---

## 10. Explicit exclusions

The following remain **outside** the parked E1-D scope and **must not** be absorbed into it. Their current governance states are **unchanged**:

* `apps/api/src/main.ts`
* `apps/api/src/server.ts`
* login/preview web work
* persistence / Gate B overlay
* E1-C portability work
* SQL `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql`
* `.env.example`
* `apps/web/src/lib/eos-session.ts`
* unresolved mixed callers (`package.json`, `ci.yml`, and other unresolved provenance files as recorded in GPTA-H-02 SET C)
* unrelated governance work (E1-B packs, hosting/capacity, GPTA-H-01 HOLD records, etc., remain their own records)
* Production infrastructure
* Production deployment / migration
* procurement
* facility selection
* E1-B RFI
* GPTA-H-01 Path B
* CD successor / C11+
* SEO / website / paid media / LinkedIn

---

## 11. Working-tree preservation requirements

The existing **dirty working tree remains preserved**.

This decision does **not**:

* clean it
* revert it
* delete it
* stage it
* split it
* move it
* rename it
* commit it

Purpose: preserve evidence and implementation state for a **future separately authorized** decision.

---

## 12. Reopening conditions

Before E1-D may be reopened, **all of the following must be separately decided/granted** as applicable. Existing records do **not** establish a mandatory completion **order** among these items.

1. Explicit Owner decision to **reopen E1-D**.
2. **Named** implementation scope (exact paths / increment ID).
3. Explicit authorization for **any remediation**.
4. Resolution or **acceptance decision** for F1.
5. **UAT** decision and evidence requirements.
6. Decision on **NB5** restore-drill requirements (existing narrow grant still forbids provisioning dump tools; drill remains unrun).
7. Resolution of **mixed-file** dependencies.
8. Explicit **commit-scope** decision.
9. Separate **commit** authorization.
10. Separate **push** authorization where applicable.

`PARKING DOES NOT CREATE FUTURE IMPLEMENTATION AUTHORIZATION.`  
`PARKING DOES NOT CREATE COMMIT AUTHORIZATION.`  
`PARKING DOES NOT CREATE PUSH AUTHORIZATION.`  
`PARKING DOES NOT CREATE UAT AUTHORIZATION.`

---

## 13. Global governance state

**Unchanged** by this parking record:

| Item | Status |
| --- | --- |
| E1-C | **CONTROLLED PAUSE** |
| NA-A-22 | **OPEN** |
| GPTA-H-01 | **CLOSED — PATH B ON HOLD** |
| `NEXT_INCREMENT` | **NONE_AUTHORIZED** |
| E1-B RFI | **CONTROLLED PAUSE** |
| Production | **NOT AUTHORIZED** |
| Procurement | **NOT AUTHORIZED** |
| Stage 1 | **NOT APPROVED / NOT COMPLETE** |
| CAP-GATE-01 | **NOT COMPLETE** |
| Commit | **NOT GRANTED** |
| Push | **NOT GRANTED** |

E1-D programme: **NOT CLOSED**; now **FORMALLY PARKED / DEFERRED**.

---

## 14. Future Owner decision queue

**Unranked. Unselected.** Remaining Owner decisions after parking E1-D:

* whether / when to reopen E1-D
* whether to require UAT
* F1 treatment
* NB5 future drill decision
* future commit-scope authorization
* future commit authorization
* future push authorization
* E1-C evidence / dependency decisions
* NA-A-22 validator decision
* any future separately named implementation increment

This list does **not** prioritize, schedule, or authorize any item.

---

## 15. No-authorization statements

**`IMPLEMENTATION AUTHORIZATION = NONE NEW`**  
**`UAT AUTHORIZATION = NOT GRANTED`**  
**`COMMIT AUTHORIZATION = NOT GRANTED`**  
**`PUSH AUTHORIZATION = NOT GRANTED`**

`PARKING DOES NOT CREATE FUTURE IMPLEMENTATION AUTHORIZATION.`  
`PARKING DOES NOT CREATE COMMIT AUTHORIZATION.`  
`PARKING DOES NOT CREATE PUSH AUTHORIZATION.`  
`PARKING DOES NOT CREATE UAT AUTHORIZATION.`

No NA-A-23 is created. No Production, procurement, facility, E1-B send, Path B, E1-C resume, Stage 1, or CAP-GATE-01 change is granted.

---

## 16. Final parking status

**`E1-D = FORMALLY PARKED / DEFERRED`**

`GPTA-H-04 STATUS = E1-D FORMALLY PARKED / DEFERRED`

`IMPLEMENTATION AUTHORIZATION = NONE NEW`  
`UAT AUTHORIZATION = NOT GRANTED`  
`COMMIT AUTHORIZATION = NOT GRANTED`  
`PUSH AUTHORIZATION = NOT GRANTED`
