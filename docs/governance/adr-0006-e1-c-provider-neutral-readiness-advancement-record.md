# E1-C — Provider-Neutral Production Readiness Advancement Record

> **`PROVIDER-NEUTRAL E1-C READINESS ADVANCED`**  
> **`E1-B PROVIDER EVIDENCE COLLECTION REMAINS PENDING`**  
> **`SEDMC IS NOT PRODUCTION READY`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`** · **`NO PRODUCTION GEOGRAPHY SELECTED`**  
> **`PRODUCTION = NOT AUTHORIZED`** · **`UAT = NOT AUTHORIZED`**  
> **`NO COMMIT`** · **`NO PUSH`** · **`NO TRANSMISSION`**

**Date:** 2026-09-17.  
**Stage:** E1-C provider-neutral advancement while E1-B responses are pending.  
**Authority:** Owner-confirmed parallel work is permitted for provider-neutral items. This record does **not** authorize Production, UAT, migrations, provider selection, or RFI transmission.

---

## 1. Purpose

Advance E1-C Production Readiness as far as is safely possible **without** selecting a provider, Production geography, or architecture; without authorizing Production, UAT, or migrations; without sending provider communications; without changing the frozen E1-B RFI/RFQ package; and without fabricating evidence or approvals.

Intended outcome: **Provider-neutral E1-C readiness advanced while E1-B provider evidence collection remains pending.**

This stage does **not** conclude that SEDMC is Production Ready.

---

## 2. Starting repository state

| Fact | Value |
| --- | --- |
| Repository | `serengetiexperiencedmc-hash/serengeti-eos` (local workspace) |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` **VERIFIED** |
| Working tree | Dirty before this stage (prior Class A/B application diffs + governance artefacts **preserved**) |
| Gate A | **APPROVED** |
| Gate B | **APPROVED** and verification closed (Dev/Test PostgreSQL SoR where `dbPool` is configured) |
| Migration Gate C | **OPEN / NOT AUTHORIZED FOR PRODUCTION** |
| Migration 123 | May exist / may have been executed only on disposable Dev/Test. **NOT** executed against Production this stage |
| E1 | **NOT APPROVED / BLOCKED** |
| ADR-0006 / DP-0006 | **OPEN — NOT APPROVED** |
| E1-B routing | **9 FULL-RFI / 2 SCOPE CLARIFICATION / 1 HOLD** |
| E1-B transmission | **AUTHORIZED TO SEND / PACKAGE READY / NOT YET TRANSMITTED** · **0 transmissions** |
| BCM sequence | Owner-confirmed **S2**: Commercial → Programme Building → Operations → CRM → Finance → Procurement/Suppliers |
| Technical RTO/RPO | **NOT DEMONSTRATED** |
| DPO | **Wensley Shirima**, IT Manager, **OWNER-DESIGNATED**. Formal appointment evidence **REQUIRED / NOT YET RECORDED**. Thomas Nguluma = Legal Counsel only |

---

## 3. Existing uncommitted changes discovered

Inspected `git status` **before** this stage's new edits. Prior uncommitted work was **not** discarded, reset, stashed, overwritten, or silently reformatted.

Classification of the pre-existing dirty tree (A–F):

| Class | Meaning | What was already present |
| --- | --- | --- |
| **A** | Existing pre-stage application change | Gate B dual-path persistence (opportunity/RFP/programme/costing/commercial-approval/commercial-documents); Class A Dev/Test HTTP controls, token-secret refusal, structured logging honesty, LocalFs recovery; Class B CRM same-TX outbox, `/ready` honesty, kernel `DocumentStorage.delete`, SoR inventory, disposable PG dump/restore harness (drill **BLOCKED** — `pg_dump`/`pg_restore` not on PATH) |
| **B** | Existing governance change | E1-B frozen pack + routing/transmission artefacts; E1-C gap registers/plans; E1-C01 legal/DPO packs; owner formal decision 2026-09-17 (Patrick Makundi / PDM); DPO designation record; E1-D Class A/B implementation/audit records; Gate B/C artefacts; E2 lab evidence |
| **C** | Safe provider-neutral E1-C work (already in tree, not invented this stage) | Class A/B items above; `/ready` `productionReady: false`; fail-closed CRM outbox when pool set |
| **D** | Provider-dependent | **None implemented as decided.** Hosting/KMS/IdP/CDN/WAF/PITR/DR geography remain unselected |
| **E** | Production-gated | Gate C remainder; Production migrate; Production credentials; Production monitoring — **not executed** |
| **F** | Unauthorized/ambiguous | Full-suite PG `migrate()` against already-provisioned `eos_gateb` remains a known **F1** test-environment exception from the Class A audit. This stage did **not** “fix” F1 by migrating Production or rewriting `schema.sql` as a Production path |

This stage **added** provider-neutral application work on top of that tree (generic I4 outbox fail-closed; request/correlation header echo; `/health` no longer overwrites inbound correlation IDs) plus this record.

---

## 4. E1-C gaps reviewed

Sources (not rewritten as historical evidence):

- `adr-0006-e1-c-production-readiness-gap-register.md`
- `adr-0006-e1-c-gap-closure-classification.md`
- `adr-0006-e1-c-provider-evidence-dependency-register.md`
- `adr-0006-e1-c-security-readiness-gap-assessment.md`
- `adr-0006-e1-c-recovery-validation-plan.md`
- `adr-0006-e1-c-production-operations-readiness-plan.md`
- `adr-0006-e1-c-gap-closure-preparation-audit.md`
- `adr-0006-e1-c-human-decision-evidence-closure-matrix.md`
- `adr-0006-e1-c-human-decision-dependency-map.md`
- `adr-0006-e1-next-action-dependency-register.md`

Plus application/tests: `outbox.ts`, `observability.ts`, `server.ts` `/health` `/ready`, CRM same-TX, Class A HTTP/secrets, Class B recovery harness.

**Current classification (exactly one status per GAP ID).**  
CLOSED is used only where repository evidence actually exists. Historical classification documents that said “0 of 53 closed” are **not rewritten**; this table is the live reconciliation after the 2026-09-17 owner decision and this Dev/Test implementation.

| GAP ID | Status | Notes |
| --- | --- | --- |
| GAP-PER-01 | **PRODUCTION GATE** | Gate B dual-path is **DEV/TEST ONLY**. Process-local `Store` still exists when no pool. Production PG unselected. |
| GAP-PER-02 | **IMPLEMENTATION/TESTING** | CRM same-TX (Class B) + generic `commitWithOutbox` now **awaits** `persistOutboxInsert` when `dbPool` set (**DEV/TEST ONLY**). Production NATS / managed bus **unselected**. Generic I4 mutate remains in-memory (outbox insert is not same-TX with a PG domain write). |
| GAP-PER-03 | **BLOCKED BY PROVIDER EVIDENCE** | Kernel `delete` exists (Class B). Production object-store adapter **unselected**. |
| GAP-PER-04 | **PRODUCTION GATE** | Fail-closed proven in Dev/Test (Gate B + this stage’s generic outbox tests). Not Production runtime proof. |
| GAP-PER-05 | **PRODUCTION GATE** | Gate C remainder **NOT AUTHORIZED**. Migration 123 not executed against Production. |
| GAP-HST-01 | **BLOCKED BY PROVIDER EVIDENCE** | Host/region **UNSELECTED**. |
| GAP-HST-02 | **BLOCKED BY PROVIDER EVIDENCE** | Runtime product unnamed. |
| GAP-HST-03 | **BLOCKED BY PROVIDER EVIDENCE** | CU-10/11 SCOPE CLARIFICATION not sent; CU-05 HOLD. |
| GAP-RES-01 | **BLOCKED BY HUMAN EVIDENCE** | Tanzania preferred baseline ≠ approved jurisdiction. |
| GAP-RES-02 | **PRODUCTION GATE** | Production data-flow map needs topology. |
| GAP-RES-03 | **PRODUCTION GATE** | Transfer register empty; do not invent paths. |
| GAP-RES-04 | **BLOCKED BY PROVIDER EVIDENCE** | Restricted+ failover location unknown. |
| GAP-LEG-01 | **BLOCKED BY HUMAN EVIDENCE** | Entity extract not in repo. |
| GAP-LEG-02 | **BLOCKED BY HUMAN EVIDENCE** | PDPC **NOT ESTABLISHED**. |
| GAP-LEG-03 | **BLOCKED BY HUMAN EVIDENCE** | DPO **OWNER-DESIGNATED** (Wensley Shirima). Formal appointment evidence **REQUIRED / NOT YET RECORDED**. Not CLOSED. |
| GAP-LEG-04 | **BLOCKED BY HUMAN EVIDENCE** | Combined Legal/DPO **INCOMPLETE** (Counsel complete; appointment evidence + PDPC open). |
| GAP-LEG-05 | **BLOCKED BY PROVIDER EVIDENCE** | Production vendor DPAs absent. |
| GAP-LEG-06 | **PRODUCTION GATE** | L-17 connected services deferred until topology. |
| GAP-LEG-07 | **BLOCKED BY HUMAN EVIDENCE** | Privacy notice draft unpublished. |
| GAP-LEG-08 | **BLOCKED BY HUMAN EVIDENCE** | Census / applicability determination incomplete. |
| GAP-IDN-01 | **BLOCKED BY HUMAN EVIDENCE** | Production IdP unselected. |
| GAP-IDN-02 | **IMPLEMENTATION/TESTING** | MFA required; not implemented in EOS. Not claimed. |
| GAP-SEC-01 | **BLOCKED BY PROVIDER EVIDENCE** | Production KMS/secrets product unselected. Dev env secrets remain Dev. |
| GAP-SEC-02 | **BLOCKED BY PROVIDER EVIDENCE** | Backup key location unselected. |
| GAP-SEU-01 | **BLOCKED BY PROVIDER EVIDENCE** | WAF/CDN unselected. |
| GAP-SEU-02 | **BLOCKED BY PROVIDER EVIDENCE** | Production encryption envelope unverified. |
| GAP-SEU-03 | **BLOCKED BY PROVIDER EVIDENCE** | Provider support MFA/session logs. |
| GAP-SEU-04 | **BLOCKED BY PROVIDER EVIDENCE** | Government access disclosure pending PE/Q. |
| GAP-NET-01 | **PRODUCTION GATE** | Production DNS/TLS TBD. |
| GAP-NET-02 | **BLOCKED BY PROVIDER EVIDENCE** | CU-05 HOLD; no SEND. |
| GAP-OBS-01 | **BLOCKED BY PROVIDER EVIDENCE** | Production monitoring vendor **unselected**. Dev structured logs + header echo ≠ Production monitoring. |
| GAP-OBS-02 | **IMPLEMENTATION/TESTING** | Durable audit target PG; Dev Gate B path. Production durability unproven. |
| GAP-BKP-01 | **BLOCKED BY PROVIDER EVIDENCE** | Production backup product TBD. Lab dumps excluded. Disposable dump drill **BLOCKED** (tools not on PATH). |
| GAP-BKP-02 | **BLOCKED BY PROVIDER EVIDENCE** | PITR **not selected**. Do not claim RPO=0. |
| GAP-REC-01 | **PRODUCTION GATE** | Application recovery not demonstrated on Production SoR. |
| GAP-REC-02 | **PRODUCTION GATE** | Technical RTO/RPO **NOT DEMONSTRATED**. Business ≤3h/≤4h / zero-loss ≠ technical achievement. |
| GAP-REC-03 | **CLOSED** | Human sequence decision **VERIFIED** in `adr-0006-e1-owner-formal-decision-record.md`: **S2** / CD-01 / HUM-07 **CLOSED / FORMALLY CONFIRMED**. Historical BCM pack not rewritten. This does **not** close GAP-REC-01/02. |
| GAP-DR-01 | **BLOCKED BY PROVIDER EVIDENCE** | DR site unselected. |
| GAP-DR-02 | **IMPLEMENTATION/TESTING** | Failover procedures not written/tested for Production. Templates only. |
| GAP-DEP-01 | **PRODUCTION GATE** | UAT/Production deploy **NOT AUTHORIZED**. |
| GAP-DEP-02 | **CAN PROGRESS NOW** | Standing “do not lock Production IaC” rule still in force. **Not CLOSED** (DP-0006 still OPEN). |
| GAP-INF-01 | **CAN PROGRESS NOW** | No Production credentials created. Isolation maintained. **Not CLOSED** (isolated Production does not exist). |
| GAP-INF-02 | **BLOCKED BY PROVIDER EVIDENCE** | Production email product unselected. |
| GAP-OPS-01 | **BLOCKED BY HUMAN EVIDENCE** | Restore/on-call/backup owners not fully named. |
| GAP-OPS-02 | **BLOCKED BY HUMAN EVIDENCE** | Production IR draft; not Production-ready. |
| GAP-OPS-03 | **BLOCKED BY PROVIDER EVIDENCE** | Support SLA unknown. |
| GAP-GOV-01 | **PRODUCTION GATE** | ADR-0006 unapproved. |
| GAP-GOV-02 | **PRODUCTION GATE** | DP-0006 OPEN. |
| GAP-GOV-03 | **PRODUCTION GATE** | E1 **NOT APPROVED / BLOCKED**. |
| GAP-GOV-04 | **BLOCKED BY HUMAN EVIDENCE** | SEND confirmed; **0 transmissions**. Cursor does not send. |
| GAP-GOV-05 | **CAN PROGRESS NOW** | C/D letter swap documented. **Not CLOSED** until approval pack. |
| GAP-TCO-01 | **BLOCKED BY PROVIDER EVIDENCE** | No quotes. HUM-09 TCO-first / budget not fixed. |
| GAP-TCO-02 | **BLOCKED BY PROVIDER EVIDENCE** | Currency/tax/exit unknown. |

**Counts (live):** CLOSED 1 (GAP-REC-03 sequence only) · CAN PROGRESS NOW 3 · HUMAN EVIDENCE/DECISION 12 · PROVIDER EVIDENCE 20 · IMPLEMENTATION/TESTING 4 · PRODUCTION GATE 13 · NOT APPLICABLE 0.  
**Production-blocking gaps remain open.** SEDMC is **not** Production Ready.

---

## 5. Provider-neutral work identified

Safe to advance without knowing the Production provider (Gate B authorized Dev/Test):

| Item | Disposition |
| --- | --- |
| Generic I4 `commitWithOutbox` fire-and-forget `persistOutboxInsert` | **Implemented this stage** |
| Echo `x-correlation-id` / `x-request-id`; stop `/health` from minting a new correlation ID | **Implemented this stage** |
| CRM same-TX outbox, `/ready` honesty, Class A HTTP/secrets, LocalFs delete, SoR inventory, disposable recovery harness | **Already present** (Class A/B); preserved |
| Expand CRM/other SoRs to PostgreSQL | **Deferred** (Class B6 / not granted) |
| MFA, Helmet-as-Production, NATS product, Redis rate-limit, Production KMS | **Deferred** (provider- or product-dependent) |
| F1 `eos_gateb` migrate() vs empty `schema_migrations` | **Deferred** (not a provider-neutral Production fix; do not migrate Production) |

---

## 6. Work actually implemented

**IMPLEMENTED / DEV-TEST ONLY.** Does not constitute Production readiness.

1. **`commitWithOutbox` is async and fail-closed when `dbPool` is set.**  
   After domain mutate, the function **awaits** `persistOutboxInsert` before pushing to the in-memory outbox. Persist failure restores the in-memory snapshot and does not leave a published outbox row. Callers (I4 tests) updated to `await`.  
   Scope honesty: I4 generic mutate is still process-local (e.g. payments Map). This is **outbox durability**, not a full PG domain transaction.

2. **Observability header echo.**  
   `registerObservability` preserves inbound `x-correlation-id` / `x-request-id` or generates UUIDs, and sets both on the reply. `/health` now uses `getCorrelationId(req)` instead of `crypto.randomUUID()`, so liveness no longer overwrites inbound correlation. Structured logs still emit `productionReady: false`.

3. **Tests added:**  
   `apps/api/src/e1-c-provider-neutral.outbox.test.ts`  
   `apps/api/src/e1-c-provider-neutral.observability.test.ts`

No Production secrets, KMS, credentials, IaC, or provider communications were created.

---

## 7. Work deliberately deferred

| Item | Why deferred |
| --- | --- |
| Production cloud provider / region / backup / DR geography | **BLOCKED BY PROVIDER EVIDENCE** + Owner/Legal |
| Architecture option A–D | **UNSELECTED** |
| Production / UAT authorization | **PRODUCTION GATE** |
| Production migrations / migrate 123 on live DB | **NOT AUTHORIZED** |
| Warm standby, cross-border mechanism, provider KMS/secrets/IdP/CDN/WAF | Provider-dependent |
| Production PITR adoption | Architecture/provider dependent |
| Production TCO / hosting | Quotes pending; budget not fixed |
| MFA in EOS | Needs IdP; Class B2 not granted |
| NATS Production transport | ADR-0004 pending ADR-0006 |
| Helmet / distributed rate-limit | Not a Production substitute; Class A already documents Dev/Test limiter |
| F1 repair via `migrate()` on `eos_gateb` | Unsafe relative to Gate B isolation |
| Actual `pg_dump`/`pg_restore` drill | **BLOCKED** — tools not on PATH; no safe disposable target claimed |
| RFI transmission | Human action; Cursor does not send |
| Formal DPO appointment instrument / PDPC | **BLOCKED BY HUMAN EVIDENCE** |
| Frozen E1-B Q / PE / template edits | **Immutable** |

---

## 8. Tests executed and exact results

**DEV/TEST ONLY.** Full-suite PG `migrate()` against `eos_gateb` was **not** re-run (known F1 Class A audit exception). No Production recovery timing claimed.

| Command | Result |
| --- | --- |
| `npx tsc --noEmit -p tsconfig.json` (`apps/api`) | **PASS** (exit 0), twice (after outbox change; after `/health` fix) |
| `vitest` `e1-c-provider-neutral.outbox.test.ts` + `e1-c-provider-neutral.observability.test.ts` | **2 files / 4 tests PASS** |
| Class A + Class B: `e1-d-class-a.*.test.ts` (4 files) + `e1-d-class-b.*.test.ts` (4 files) | **8 files / 21 tests PASS** |
| `i4.outbox.test.ts` + `i4.hardening.test.ts` | **2 files / 12 tests PASS** |
| `i4.security.regression.test.ts` + `i4.performance.test.ts` | **2 files / 5 tests PASS** |
| `i4.2-consumer.test.ts` + `i4.3-consumer-replay.test.ts` + `i4.17-dlq-sla-digest-recipients.test.ts` | **3 files / 7 tests PASS** |
| `c1.11.atomicity.test.ts` + `crm.security.regression.test.ts` | **2 files / 26 tests PASS** |
| `i4.9`–`i4.14` DLQ tests | **6 files / 6 tests PASS** |
| `i4.15`, `i4.16`, `i4.19`–`i4.22` | **6 files / 10 tests PASS** |
| **Targeted total** | **31 files / 91 tests PASS** · **0 FAIL** |
| Full API suite / `EOS_RUN_PG_TESTS=1` migrate-on-`eos_gateb` | **NOT EXECUTED** this stage (F1 remains a known test-environment exception) |
| Disposable dump/restore actual drill | **NOT EXECUTED** — harness still reports tools not on PATH (**DEV/TEST ONLY**, not Production RTO) |

---

## 9. Gaps genuinely closed, with evidence

| GAP ID | Status | Evidence |
| --- | --- | --- |
| GAP-REC-03 (BCM sequence reconciliation / CD-01) | **CLOSED** | `adr-0006-e1-owner-formal-decision-record.md`: Patrick Makundi, Owner, PDM, 2026-09-17; **S2** formally confirmed; HUM-07 **CLOSED**. Technical RTO/RPO **not** closed. |

**This stage’s code changes close zero Production-blocking gaps.** GAP-PER-02 / GAP-OBS-01 remain open (Dev/Test advancement only).

---

## 10. Gaps remaining open

52 of 53 GAP IDs remain open (all except GAP-REC-03 sequence). See §4. Material Production blockers include GAP-PER-01/04/05, GAP-HST-01, GAP-RES-01–03, GAP-LEG-01–04, GAP-REC-01/02, GAP-DEP-01, GAP-GOV-01–04, GAP-TCO-01.

---

## 11. Provider-dependent items explicitly preserved

All remain **OPEN / UNSELECTED / NOT AUTHORIZED**:

Production cloud provider · Production region · backup jurisdiction · DR jurisdiction · warm standby · cross-border transfer mechanism · provider KMS · provider secrets manager · provider IdP · CDN/WAF provider · provider support geography · provider subprocessors · Production TCO · Production hosting · final DR topology · final backup architecture · Production PITR adoption.

E1-B routing unchanged: **9 FULL-RFI / 2 SCOPE CLARIFICATION / 1 HOLD**. Historical 11-provider SEND set remains **superseded**.

---

## 12. Human evidence still required

| Item | Status |
| --- | --- |
| Formal DPO appointment instrument | **REQUIRED / NOT YET RECORDED** |
| PDPC registration / status artefact | **NOT ESTABLISHED** |
| Legal entity extract (E-01) | **NOT VERIFIED** |
| Named RFI recipients | **NOT ESTABLISHED** |
| Actual RFI transmission artefacts | **0 transmissions** |
| Production ops/on-call/restore owners (remainder of HUM-08) | **NOT ESTABLISHED** |
| HUM-09 budget | **TCO-FIRST / BUDGET NOT YET FIXED** |
| E1 Owner approval | **NOT APPROVED / BLOCKED** |

Owner already recorded: Patrick Makundi / PDM / 2026-09-17; named sender; S2 BCM; DPO **designation** of Wensley Shirima.

---

## 13. Production gates still open

| Gate | Status |
| --- | --- |
| Production authorization | **NOT AUTHORIZED** |
| UAT authorization | **NOT AUTHORIZED** |
| Migration Gate C | **OPEN / NOT AUTHORIZED FOR PRODUCTION** |
| ADR-0006 | **OPEN** |
| DP-0006 | **OPEN** |
| E1 | **NOT APPROVED / BLOCKED** |
| Technical RTO/RPO | **NOT DEMONSTRATED** |
| Production deploy / credentials / DNS | **NOT AUTHORIZED** |

---

## 14. E1-B transmission state unchanged

| Fact | Status |
| --- | --- |
| Questionnaire hash | `6CE0CD974232988236BE67A169E1E660AB29A127625C01A90378B736231FA2BE` **VERIFIED UNCHANGED** |
| Provider Evidence Requirements hash | `44C73163E7332C0FF995F774BC2716A35FF904410D6E4CDD008A720A987E583E` **VERIFIED UNCHANGED** |
| Response Template hash | `47FAA8E7F700DC04678686FDC938C5894AFB705E2E99172182020B3539DCFAE7` **VERIFIED UNCHANGED** |
| Routing | 9 FULL-RFI / 2 SCOPE CLARIFICATION / 1 HOLD |
| Package | **READY TO SEND** |
| Transmissions | **0** · **NOT YET TRANSMITTED** |
| Cursor send | **NOT PERFORMED** (prohibited) |

Mandatory transmittal sentence **unchanged**: RFI/RFQ issuance is an information-gathering and market-evidence activity only; responses will be subject to a separate governed evaluation and do not constitute provider or architecture selection, contracting, Production approval, or deployment authorization.

---

## 15. Git status

HEAD remains `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` on `master`. Working tree remains dirty: prior Class A/B application diffs and prior governance artefacts **preserved**, plus this stage’s provider-neutral outbox/observability edits, new E1-C tests, this record, and additive pointers on the parallel-work register, next-action register, and gap-closure classification. **No commit. No push.** Full `git status` is in the stage completion report section K.

---

## 16. Exact next governed action

1. **Human (Patrick Makundi)** executes the **already authorized** E1-B RFI/RFQ transmission **outside Cursor**, per `adr-0006-e1-b-final-transmission-execution-sheet.md`, to the **9 FULL-RFI** and **2 SCOPE CLARIFICATION** recipients. **Do not transmit to CU-05 (HOLD).** Record artefacts in `adr-0006-e1-b-transmission-evidence-register.md`.
2. **In parallel (no wait required for provider replies):** collect remaining **human** artefacts (formal DPO appointment evidence; PDPC; entity extract; named recipients if not on the official routes).
3. **Do not** select a provider, geography, or architecture; **do not** authorize Production/UAT; **do not** execute Production migrations.
4. Further application work remains limited to **provider-neutral Dev/Test** items that are separately authorized. This record does **not** grant Class B expansion, NATS product selection, or F1 schema repair on `eos_gateb`.

**E1 remains NOT APPROVED / BLOCKED.**  
**SEDMC is not Production Ready.**
