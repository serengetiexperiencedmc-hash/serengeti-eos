# GPTA-H-45 — F2 Implementation Execution Baseline

> **`F2 EXECUTION BASELINE — INSPECTION ONLY`**  
> **`NO APPLICATION / SCHEMA / MIGRATION / DATA / INFRASTRUCTURE CHANGE IN THIS STEP`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NO DEPLOYMENT`** · **`NO PROCUREMENT`** · **`NO UAT EXECUTION`**

**Date:** 2026-09-18.  
**Auditable timestamp:** **2026-09-18T15:48:00+03:00**.  
**HEAD at this record:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Working tree **DIRTY** (preserved).

H-16–H-44 historical bodies are **not rewritten**. No application code was changed in this step.

---

## 1. Authorization reference

```text
GPTA-H-44 STATUS = F2 IMPLEMENTATION AUTHORIZED
F0 = ACCEPTED WITH CONDITIONS
F1 = ACCEPTED WITH CONDITIONS
F2 = AUTHORIZED
IMPLEMENTATION = AUTHORIZED — C1–C10 DEV/TEST ONLY
OWNER F2 DECISION = AUTHORIZE F2
```

H-44 scope is **binding**. This baseline inspects and plans. It does **not** execute the increment.

**Capability numbering:** H-29 / H-34 / H-44 remain controlling:

| ID | Capability |
| --- | --- |
| C1 | CRM |
| C2 | Opportunity |
| C3 | RFP |
| C4 | Supplier rates |
| C5 | Programme / itinerary |
| C6 | Costing |
| C7 | Approval |
| C8 | Proposal |
| C9 | Booking |
| C10 | KPI / reporting |

The H-45 commissioning prompt listed a **shifted** C4–C9 mapping (programme as C4, costing/rates as C5, etc.). That mapping is **not** adopted. Latest approved governance (H-29/H-34/H-44) controls. Conflict recorded; no scope change.

---

## 2. Repository baseline

```text
Branch = master
HEAD = 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
Index = empty
Working tree = intentionally dirty
```

No reset, clean, stash, discard, checkout-over, rebase, amend, or deletion of untracked files was performed.

---

## 3. Dirty-tree inventory

Pre-existing dirty work is **Class A/B persistence, Gate B/E1-D harnesses, preview login, I4 outbox, and GPTA governance docs**. It must be preserved.

### Modified application / infra (representative)

| Cluster | Paths | Nature |
| --- | --- | --- |
| Class A/B persistence | `apps/api/src/persistence/*`, `durable.ts`, `store.ts`, `main.ts`, `ports/identity.ts` | Dual-path PG, recovery, Gate B |
| CRM (mixed) | `apps/api/src/crm/*.ts` | Persistence dual-path + CRM domain |
| Pipeline / RFP / programme / costing / approval | `pipeline/*`, `rfp/*`, `programme/*`, `costing/*`, `commercial-approval/*` | Dual-path + domain |
| Supplier | `apps/api/src/supplier/contracts.ts` | Mixed |
| Events / I4 | `outbox.ts`, `nats-transport.ts`, `transport-init.ts`, many `i4.*.test.ts` | Outbox / DLQ |
| Preview login | `apps/web/src/lib/eos-session.ts`, `eos-proxy.ts`, `EosSessionProvider.tsx`, `scripts/dev-preview.mjs` | Local preview |
| Infra / CI | `.env.example`, `.github/workflows/ci.yml`, `infra/compose/dev.yaml`, `packages/db/src/index.ts` | Dev/Test |
| Kernel (limited) | `packages/kernel/src/commercial-document.ts`, `ports.ts` | Document ports |

### Untracked application (Class A/B / Gate B / E1)

Includes `deployment-config.ts`, `devtest-http-controls.ts`, `devtest-token-secret.ts`, `infrastructure-contract.ts`, Gate B / E1-C / E1-D tests, persistence repositories (`opportunity-repository.ts`, `rfp-repository.ts`, `programme-repository.ts`, `costing-repository.ts`, `commercial-approval-repository.ts`, `durable.ts`, `startup-migrations.ts`, etc.), and `packages/db/migrations/123_cd_rfp_programme_relationship_constraints.sql`.

### Untracked governance

GPTA-H-01 through H-44 and ADR-0006 E1-* packs. **Not Class A/B code.**

**Constraint:** `eos_gateb` must **not** be repaired via unauthorized `migrate()` (historical 42P07). F2 execution must not DROP/migrate that database as a side effect.

---

## 4. Governance sources reviewed

Read / reconciled (not rewritten): H-25; H-27; H-29; H-31; H-34; H-35; H-36; H-38; H-41; H-42; H-43; H-44; H-18/H-28 evidence of current Dev/Test behaviour.

Where documents conflict, **latest approved decision wins**: H-44 authorization + H-43 constraints + H-38 Path B / M0 + H-36 design clarifications + H-25/H-27 rules.

---

## 5. C1–C10 implementation assessment

Inspection is of **HEAD + dirty tree**. Dev/Test existence ≠ operational fitness (H-28/H-35). H-28 demo chain is evidence of **current software**, not F2 completion.

### C1 CRM

**Existing:** Organizations, contacts, accounts, activities, tasks, tags, merge/import. `CrmAccount.market`, `strategicClassification`, `priority`, `nextAction`. `ownerPrincipalId`. Org types: `DEFAULT_CRM_ORGANIZATION_TYPE_KEYS` include `incentive_house`, `mice_agency`, `corporate` — **no `pco` / `event_agency`**. `CrmTask` related org/contact/account/activity — **not RFP/opportunity FKs**. Org `source` is CRM provenance, not AC-S.

**Files:** `packages/kernel/src/crm.ts` (clean vs HEAD); `apps/api/src/crm/*` (**mixed dirty**); `apps/api/src/persistence/crm.ts` (**mixed**).

**Gap vs F1:** PCO type; Market 15-value geographic list independent of buyer type; SOURCE ≠ CHANNEL as commercial facts; tasks bound to RFP/opportunity; DR-008 flags **out of scope** (`strategicClassification` visibility aid only).

### C2 Opportunity

**Existing:** `OppOpportunity` with `ownerPrincipalId`, `estimatedValue`, `expectedCloseDate`, stages `new_qualified` | `rfp_received` | `proposal_sent` | `negotiation` | `won` | `lost`. Create defaults `stage: "new_qualified"`. **No qualification status field. No LR-01–LR-12 catalogue.**

**Files:** `packages/kernel/src/opportunity.ts` (clean); `apps/api/src/pipeline/opportunity.ts`, `routes.ts` (**mixed**); `persistence/opportunity-repository.ts` (untracked Class A/B).

**Gap:** Qualification ≠ stage; owner at intake; loss primary + contributing + LR-12 explanation; transfer audit.

### C3 RFP

**Existing:** `RfpWorkflowStage`: intake → programme → costing → approval → proposal → sent → closed. **No clarification stage.** `RfpRecord.source` comment: “intake channel (email, portal, advisor, other)” — **collapses SOURCE and CHANNEL**. `receivedAt` distinct from `createdAt`. `assignedPrincipalId`. Versions exist.

**Files:** `packages/kernel/src/rfp.ts` (clean); `apps/api/src/rfp/*` (**mixed**); `persistence/rfp-repository.ts` (untracked).

**Gap:** Clarification stamps; SOURCE vs CHANNEL as separate facts; follow-up bound to RFP+opportunity; do not treat `RfpRecord.source` as AC-S.

### C4 Supplier rates

**Existing:** Rate types, currency, `validFrom`/`validTo`, season, `preferredInConflict` (silent preference). Expired rates remain selectable (H-28). Costing lines may lack `supplierRateId`.

**Files:** `apps/api/src/supplier/rates.ts` (not in dirty M list — relatively safer); `supplier/contracts.ts` (**mixed**); web `suppliers/page.tsx` (not dirty).

**Gap:** Recorded overlap resolution (H-36 F1-C-03); no silent `preferredInConflict`; expiry not silently current; sent snapshot; FX provider **out of scope**.

### C5 Programme

**Existing:** Programme identity linked to RFP; structured programme vs Office presentation. Dirty: `programme/programme.ts`, `routes.ts`.

**Gap:** Ensure identity chain; generation of client-facing Office docs remains Office (SoR). Relatively smaller gap.

### C6 Costing

**Existing:** Cost sheet totals, `marginFloorPercent` **defaults to 20** in `costing/sheet.ts`. Lines, currencies. Dirty: `costing/sheet.ts`, `routes.ts`.

**Gap:** 20% is **not** Owner rule (Path B). Sent snapshot; rate version or explicit ad-hoc; do not encode CPR-FLOOR.

### C7 Approval

**Existing:** `evaluateCommercialApprovalGate` uses `margin_floor` and `sell_threshold` with `DEFAULT_SELL_THRESHOLD_USD = 250_000`. Tests expect `sell_threshold`. **Conflicts with Path B / H-44.**

**Files:** `packages/kernel/src/commercial-approval.ts` (**clean vs HEAD — preferred first target**); `apps/api/src/commercial-approval/*` (**mixed**).

**Gap:** Replace numerical gates with H-27 qualitative categories + CD decision + audit. Do **not** keep 250k/20% as approved rule. Tests that assert `sell_threshold` must be remade as F2 evidence, not preserved as Owner rule.

### C8 Proposal

**Existing:** Proposal identity, `sentAt`, statuses including accepted/rejected, cost/sell/margin. Office PDF remains separate. Dirty: commercial-documents storage/service (**Class A/B mixed**).

**Gap:** Sender = opportunity owner after required approval; approved version; send ≠ approval; versioning for negotiation (F1-C-12).

### C9 Booking

**Existing:** Booking from accepted proposal; command-center rollup. Dirty: not all booking files in M list.

**Gap:** Origin FKs; win-time dimensions; closed-lost with LR catalogue (via C2); no live customer data; demo seed ≠ production.

### C10 KPI

**Existing:** Booking **command center** is C10 in current software (`c10-command-center.test.ts`). Domain J `/v1/analytics/commercial/*` is **outside** C1–C10 (H-18/H-29). Command center ≠ KPI pack.

**Gap:** KPI facts from structured events (qualified count, conversion, timestamps, SOURCE/CHANNEL, loss, owner). **Not** Domain J. **Not** C11+.

---

## 6. F2 implementation gap matrix

| Capability | Existing state | F1 requirement | Gap | Files affected | Dependencies | F2 action |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | Partial structure | OR-03+PCO; Market 15; SOURCE≠CHANNEL; follow-up bind | Partial | `kernel/crm.ts`; mixed `crm/*` | C2/C3 | Additive types first in **clean kernel** |
| C2 | Stage machine only | Qualification≠stage; LR-01–12; owner at intake | Missing facts | `kernel/opportunity.ts`; mixed `pipeline/*` | C1 | Additive qualification + loss |
| C3 | Workflow without clarification | Clarification stamps; SOURCE/CHANNEL split | Partial / conflicting | `kernel/rfp.ts`; mixed `rfp/*` | C2 | Additive facts; do not reuse `source` as AC-S |
| C4 | Rates + silent prefer | Recorded overlap; expiry; snapshot | Partial / conflicting | `supplier/rates.ts`; mixed `contracts.ts` | C6 | Controlled resolution; no silent overwrite |
| C5 | Programme identity | Structured programme | Small | mixed `programme/*` | C3 | Preserve chain; additive only |
| C6 | Sheet + default 20% floor | Snapshot; no Owner floor value | Conflicting default | mixed `costing/sheet.ts` | C4, C7 | Remove Owner-meaning of 20%; keep Path B |
| C7 | 250k / 20% gates | Path B qualitative + CD | **Conflicting** | **clean** `kernel/commercial-approval.ts`; mixed API | C6, C8 | Redesign gate **without** numerical CPR |
| C8 | Proposal + send | Send≠approval; versioning | Partial | proposal modules; mixed docs storage | C7 | Additive version/approval link |
| C9 | Booking + command center | Origin + loss/win facts | Partial | booking modules | C8, C2 | Additive; disposable data |
| C10 | Command center ≠ KPI pack | Facts from events | Missing as KPI pack | new/additive reporting from C1–C9 facts | C1–C9 | Derive; **not** Domain J |

Classifications used: already implemented / partially implemented / missing / conflicting / blocked by existing work / blocked by governance / not in F2 scope.

**Not in F2 scope:** Domain J analytics, I8 invoices, mailbox ingest, FX provider, DR-008 flag engine, numerical CPR, C11+, production.

---

## 7. Dirty-tree risk classification

| Target | Class | Strategy |
| --- | --- | --- |
| `packages/kernel/src/crm.ts`, `opportunity.ts`, `rfp.ts`, `commercial-approval.ts` | **A. Safe F2 target** (clean vs HEAD) | Prefer first edits: additive types/rules |
| `apps/api/src/supplier/rates.ts` | **A / low mix** (not in current M list) | Additive overlap recording |
| `apps/web` commercial pages (most not dirty) | **A** | UI after API facts exist |
| `apps/api/src/crm/*`, `pipeline/*`, `rfp/*`, `programme/*`, `costing/*`, `commercial-approval/*` | **B. Mixed** | Additive fields/routes only; do **not** rewrite dual-path persistence |
| `persistence/durable.ts`, Gate B/E1-D tests, `deployment-config.ts`, `devtest-*`, `startup-migrations.ts`, migration 123 | **C. Protected / high-risk** | **Do not modify** for F2 commercial facts |
| `eos-session.ts` / preview login | **C** | Unrelated; preserve |
| `eos_gateb` migrate() | **C / governance** | **Do not execute** |

**Minimum safe strategy:** kernel-first additive types → mixed API additive persistence of new fields on in-memory/preview path first → do not run `migrate()` on `eos_gateb` → do not rewrite Class A/B files.

This is **not** a stop-the-baseline governance blocker. It **is** a sequencing constraint.

---

## 8. Business-rule traceability

H-25 numbering controls. The commissioning prompt’s “OR-04 follow-up” is **OR-04-FU**; **OR-04** remains `NO NUMERICAL TARGET AUTHORIZED`.

| Rule | Current software | F2 |
| --- | --- | --- |
| OR-01 / OR-01-B | Not a structured qualification status | Add qualified / not_qualified / not_yet_assessed + conditions |
| OR-01-C owner timing | `ownerPrincipalId` / `assignedPrincipalId` exist; create path does not enforce intake-before-qualification | Enforce F1-C-01 |
| OR-01-D timing | No “before significant costing” control | Process + optional guard |
| OR-01-E evidence | Notes/attachments unstructured | Evidence refs |
| OR-01-F changes | Stage history only | Qualification audit |
| OR-02 LR-01–12 | `lost` stage only | Catalogue + primary + contributing + LR-12 text |
| OR-03 types | No `pco` seed key | Add PCO (and Event Agency if in H-25) |
| Market ≠ buyer | `market` free string | H-27 15-value list |
| OR-04 numerical | Intact as no Stage 1 targets in C10 | Keep; do not add targets |
| OR-04-FU follow-up | Tasks not RFP-bound | Bind next action to opportunity owner |
| OR-05 send | Proposal send exists | Owner after required approval |
| OR-06 exceptional | **250k/20%** | Path B categories + CD |
| OR-07 SOURCE/CHANNEL | Collapsed in `RfpRecord.source` | Split |
| OR-08 rates | Types/dates exist; silent prefer | F1-C-03 recorded resolution |

No new rules introduced.

---

## 9. SoR traceability

Approved model (H-29/H-34): EOS = structured facts; Office = documents; email/WhatsApp/phone = channels.

| Fact | Current | F2 |
| --- | --- | --- |
| Account / buyer type / market | Partial | Complete per H-27/H-25 |
| Qualification | Missing as fact | Required |
| SOURCE / CHANNEL | Collapsed | Split |
| Next action | Account `nextAction`; tasks unbound | Opportunity-owner bound |
| Programme / costing / approval / proposal / booking identity | Present in demo chain | Preserve + snapshots |
| Loss reason | Missing catalogue | Required |
| KPI facts | Command center / Domain J | Derive from C1–C9; not Domain J |
| Mailbox ingest | Not implemented | **Must not** implement (M0) |

---

## 10. F1 condition verification

| ID | Respect in current code | F2 requirement |
| --- | --- | --- |
| F1-C-01 | Not enforced as sequence | Owner at intake / before qualification |
| F1-C-03 | `preferredInConflict` silent | Recorded resolution |
| F1-C-04 / C-08 | **Violated** by 250k/20% | Path B only |
| F1-C-05 | Numerical finance-like gate, not CD category | CD / H-27 categories |
| F1-C-09 | `strategicClassification` exists | Visibility aid only; no DR-008 engine |
| F1-C-10 | No live FX provider found | Keep out of scope |
| F1-C-11 | N/A (process) | This baseline is not F2 evidence |
| F1-C-12 | `negotiation` stage exists | Versioning only; no C11+ module |

---

## 11. Migration boundary

```text
M0 = CONTROLLED COEXISTENCE / NO INGEST
```

Do not migrate historic Office/Excel; do not import mailbox; do not M3; do not production migrate; do not alter production data.

`apps/api/src/dev/seed-demo-data.ts` is **Dev/Test seed**, not authorized historic migration. Distinguish seed from M0 ingest (forbidden).

---

## 12. Proposed implementation sequence

1. **Kernel additive types** (clean files): qualification, loss catalogue, PCO, Market list, SOURCE/CHANNEL types, Path B approval categories.  
2. **C7 Path B** in clean `commercial-approval.ts` — remove Owner-meaning of 250k/20% (largest **conflict**).  
3. **C2/C3 additive facts** on mixed API via additive fields only; in-memory/preview path first.  
4. **C1 taxonomy + follow-up binding** additive.  
5. **C4 overlap recording** (prefer `rates.ts`).  
6. **C6 snapshot / stop treating 20% as Owner floor.**  
7. **C8/C9/C10** derive from facts.  
8. Tests as F2 evidence on disposable data.  
9. UAT later, separate evidence stream.

Do **not** start by rewriting `persistence/durable.ts` or running `eos_gateb` migrations.

---

## 13. Proposed implementation increments

### F2-I1 — Identity, taxonomy, qualification, Path B kernel (recommended next)

* **Purpose:** Foundational facts + stop illegal numerical approval gates at the kernel.  
* **Capabilities:** C1 (types/Market), C2 (qualification/loss types), C3 (SOURCE/CHANNEL types), C7 (Path B types).  
* **Files likely:** `packages/kernel/src/crm.ts`, `opportunity.ts`, `rfp.ts`, `commercial-approval.ts` (class A). Mixed API **deferred** except minimal wiring if required.  
* **Database:** **None in I1** (no migration this increment).  
* **API/UI:** None or read-only type export; UI later.  
* **Validation:** Kernel unit tests for catalogues, Path B (no 250k/20% as expected Owner rule).  
* **UAT:** Not in I1 (types only).  
* **Rollback:** Revert kernel additive commits when commit is later authorized.  
* **Scope risks:** Accidental schema/migration; touching dirty persistence; re-encoding 20%.

### F2-I2 — C2/C3 structured facts on preview/in-memory

Qualification status, loss catalogue persistence, SOURCE/CHANNEL split, clarification stamps, F1-C-01 owner rule. Mixed API additive only.

### F2-I3 — C7 Path B API + C6 snapshot (no CPR values)

### F2-I4 — C4 overlap recording + C8 send≠approval versioning

### F2-I5 — C1 follow-up binding + C9/C10 facts from chain

**C11+ not introduced. No migrations in this baseline step. No migrations in F2-I1.**

---

## 14. Test / evidence strategy

Future evidence (not claimed passed):

* Unit: catalogues, Path B, F1-C-01, overlap recording  
* Integration: identity chain on disposable data  
* API: new fields; rejection of collapsed SOURCE/CHANNEL  
* Workflow: qualification ≠ `new_qualified`  
* Business rules: OR-01–OR-08 as approved  
* Authorization: CD for exceptional categories  
* Supplier-rate: expiry/overlap  
* Snapshot: sent costing immutable  
* KPI: derived facts, not Domain J  
* Regression: do not break Class A/B persistence paths  
* UAT: separate stream (Patrick Makundi)

This baseline **did not** execute the implementation test suite.

---

## 15. UAT evidence model

```text
UAT Authority = Patrick Makundi
Technical Increment Owner = Patrick Makundi
Combined role = YES
```

Implementation evidence ≠ UAT acceptance. Design documents ≠ UAT. UAT must be executable/observable Dev/Test behaviour traced to H-29/H-34 ACs. **UAT not performed in this step.**

---

## 16. Risks / blockers

| Item | Class | Effect |
| --- | --- | --- |
| Mixed C1–C10 API + Class A/B persistence | Sequencing constraint | Additive-only; kernel-first |
| `eos_gateb` migrate() 42P07 | Protected | Do not migrate that DB |
| 250k/20% encoded + tests expect it | F2 in-scope **conflict** | Path B rewrite; tests are not Owner rules |
| Dirty preview login / I4 / Gate B | Protected | Do not touch |
| DR-008 / FX / ingest / C11+ / production | Governance | Stop if discovered as required |
| Commit/push | Not granted by H-44 | Still separate |

**No blocker requires stopping the baseline.** Next increment F2-I1 is **safe** if limited to clean kernel files and no migrations.

If F2-I1 were to require `eos_gateb` schema changes, **STOP** and raise a governance/Dev/Test persistence decision — do not silently migrate.

---

## 17. Exact next implementation action

**F2-I1:** Additive kernel types and Path B approval-category model in clean `packages/kernel` files (`crm.ts`, `opportunity.ts`, `rfp.ts`, `commercial-approval.ts`). No schema, no migration, no mixed-file rewrite, no `eos_gateb` migrate(), no UI required for I1, no UAT, no commit unless separately granted.

This H-45 step made **no** such code changes.

---

## Governance status

```text
GPTA-H-45 STATUS = F2 IMPLEMENTATION EXECUTION BASELINE COMPLETED

F2 = AUTHORIZED
IMPLEMENTATION = AUTHORIZED — C1–C10 DEV/TEST ONLY

C1–C10 = IN SCOPE
C11+ = OUT OF SCOPE
PRODUCTION = NOT AUTHORIZED
MIGRATION = M0 / NO INGEST
PROCUREMENT = NOT AUTHORIZED
SUPPLIER ENGAGEMENT = NOT AUTHORIZED
DR-008 = DEFERRED
FX PROVIDER = OUT OF SCOPE
NUMERICAL CPR = NOT AUTHORIZED

TECHNICAL INCREMENT OWNER = PATRICK MAKUNDI
UAT AUTHORITY = PATRICK MAKUNDI
COMBINED ROLE = YES

IMPLEMENTATION CHANGES IN THIS STEP = NONE
COMMIT = NOT PERFORMED
PUSH = NOT PERFORMED

NEXT IMPLEMENTATION INCREMENT = F2-I1 KERNEL IDENTITY / TAXONOMY / PATH B TYPES
```

---

## Validation

| Check | Result |
| --- | --- |
| HEAD / branch / empty index | `75ee4c3` / `master` / empty |
| Dirty tree preserved | **Yes** |
| No application/schema/migration/data/infra change | **Yes** |
| No tests executed as F2 evidence | **Yes** |
| C11+ / production / ingest / FX / DR-008 / numerical CPR not planned as in-scope | **Yes** |
| Numbering conflict with commissioning prompt recorded | **Yes** — H-29/H-34 numbering used |

**Files created or updated (documentation only):**

* Created: `docs/governance/gpta-h-45-f2-implementation-execution-baseline.md`
* Updated (additive pointers): `docs/governance/gpta-h-19-owner-business-rules-resolution.md`; `docs/governance/adr-0006-e1-next-action-dependency-register.md`; `docs/governance/adr-0006-e1-c-parallel-work-register.md`
