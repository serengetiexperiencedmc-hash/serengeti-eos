# ADR-0006 Gate A Design-Approval Record

> **`DESIGN APPROVAL RECORD — GATE A`**  
> **`GATE A — DESIGN APPROVAL`**  
> **`STATUS: APPROVED`**  
> **`NOT AN IMPLEMENTATION AUTHORIZATION`**  
> **`NOT A MIGRATION AUTHORIZATION`**  
> **`NOT A UAT AUTHORIZATION`**  
> **`NOT A PRODUCTION AUTHORIZATION`**

This record **records** Gate A — Design Approval of the Stage 6B persistence architecture as the **design baseline**.

**GATE A DECISION:**  
`APPROVED`

**Recorded decision:**

The Stage 6B persistence architecture is approved as the design baseline for subsequent Dev/Test implementation planning and execution, subject to the unresolved dependencies and governance controls identified in the Stage 6B package.

**This approval does not authorize Gates B–G.**

Governance recording note: the Gate A **status** is recorded from the authorized stakeholder instruction in the governing conversation. **Named personal signature, legal authority title, and handwritten date are not invented.** Blank attestation fields in §13 follow the Stage 1 convention (`adr-0006-owner-business-bcm-decision-pack.md`). Filling a name or signature block is reserved for the stakeholder; this file records **decision status only**.

---

# 1. Purpose

Record Gate A design approval of the Stage 6B persistence target architecture.

Gate A **is recorded as APPROVED** as the **design baseline** for subsequent Dev/Test implementation **planning** and for a later, **separate** Gate B request.

Gate A does **not** start coding, migrations, UAT, or Production work and does **not** authorize Gates B–G.

---

# 2. Scope

**In scope for Gate A (design only):**

- Target persistence architecture for jointly critical Commercial/RFP and Programme Building state (and required opportunity predecessor).
- Repository and transactional service boundaries.
- Fail-closed persistence; optimistic concurrency; per-request SQL reads.
- Durable security audit and business version history.
- Durable commercial document **metadata**; portable `DocumentStorage` for bytes (no provider selected).
- Atomic transaction boundaries; post-commit event publication.
- Additive-only future schema intent (no migration created by this record).
- Recovery/test **prerequisites** (not executed tests).
- Explicit separation of Gates A–G.

**Out of scope:**

- Hosting provider, region, or Production topology selection (ADR-0006 / DP-0006).
- Implementation, schema change, migration create/execute, cutover, UAT, Production.
- Approval of ADR-0006, DP-0006, ADR-0012, or ADR-0013.
- Inventing participant/rooming entities (Stage 6B: **REQUIRES DOMAIN DECISION**, does not block itinerary SoR).

---

# 3. Stage 6B document being presented for approval

**Document:** [`adr-0006-persistence-architecture-implementation-authorization.md`](adr-0006-persistence-architecture-implementation-authorization.md)

**Stage:** 6B  
**That document’s status:** `NOT AUTHORIZED` (implementation/migration/UAT/Production)

This Gate A record does **not** rewrite Stage 6B. The approved artefact is that Stage 6B package **as written**, including its unresolved dependencies and anti-patterns (no CRM fire-and-forget persist for jointly critical modules).

**Factual predecessor:** [`adr-0006-application-persistence-recovery-readiness.md`](adr-0006-application-persistence-recovery-readiness.md) (Stage 6A — **NOT DEMONSTRATED** application recovery).

---

# 4. Architecture baseline being considered

| Item | Baseline |
| --- | --- |
| Jointly critical functions | Commercial/RFP intake and Programme Building (Stage 1) |
| CURRENT runtime SoR for those modules | Process-local in-memory `Store` (Stage 6A **OBSERVED**) |
| CURRENT RFP/programme PostgreSQL DDL | Exists (`016`, `017`, `122`); **unused** by runtime |
| CURRENT CRM/supplier/notification persist | Limited dual-write/hydrate; **not** RFP/programme SoR |
| Stage 4B | Laboratory PostgreSQL mechanisms only; RM-01 **OPEN** |
| Stage 5 | **DEFER / NOT READY** for ADR-0006/DP-0006 hosting selection |
| TARGET SoR (Stage 6B) | PostgreSQL 16-class durable SoR for opportunity, RFP, programme (days/items/versions), then sequenced costing/approval |
| TARGET application shape | Repositories + transactional services; no process-local authority for critical state |
| Hosting | **NOT SELECTED** — this design does not choose a provider or region |

---

# 5. Key architectural decisions (verified present in Stage 6B)

Inspection of Stage 6B confirms the following **TARGET** decisions are specified. They are **not** implemented.

| Decision | Stage 6B position |
| --- | --- |
| Durable SoR | PostgreSQL as proposed durable SoR for jointly critical Commercial/RFP/Programme state (ADR-0003 class; not a cloud vendor) |
| Data access | Repositories; services do not use process arrays as SoR |
| Writes | Fail-closed: persist failure **fails the API**; reject swallowed `persistXAfterCommit` for these modules |
| Concurrency | Optimistic locking on existing `version` fields (`UPDATE … WHERE version = $expected` → 409) |
| Reads | Per-request SQL (optional non-authoritative cache); **not** hydrate-all into `Store` as SoR |
| Security audit | Durable `audit_events` in the **same transaction** as the business write |
| Business version history | Distinct: `rfp_versions`, `prg_programme_versions`, `cost_sheet_versions`, `opp_stage_history` |
| Document metadata | Durable PostgreSQL `commercial_documents` |
| Document bytes | Portable `DocumentStorage` (`put`/`get`); **no** object-storage provider selected |
| Transactions | Atomic create/transition/version + audit + outbox insert |
| Events | Outbox in-transaction; **publish after commit** |
| Schema change style | Additive migration **after 122** only; do not rewrite `016`/`017`/`122` in place |
| Recovery tests | Prerequisites defined; **NOT YET TESTABLE**; **not executed** |
| Gate separation | A design ≠ B implementation ≠ C migrate execute ≠ D UAT ≠ E–G Production |

---

# 6. Known limitations and unresolved dependencies

Gate A, even if later approved, does **not** close these:

| Dependency | Status | Effect |
| --- | --- | --- |
| ADR-0006 hosting / residency | **proposed — blocked for Production** | No provider, region, or topology |
| DP-0006 | **OPEN — NOT APPROVED** | Same |
| E1 Legal/DPO | **OPEN** | Document byte location, backup copies, logs; participant PII if later added |
| E2 technical RTO/RPO | **PARTIALLY EVIDENCED** | Lab only until durable app state exists and is tested |
| E3 hosting capability | **OPEN** | No named candidate |
| E4 TCO | **OPEN** | No quotes; no implementation labour figures invented |
| ADR-0012 secrets | **proposed — blocked for UAT and Production** | Dev env secrets remain; Production secrets not chosen |
| ADR-0013 IdP | **proposed — blocked for Production** | Dev local password IdP remains |
| ADR-0017 | **accepted for Development** (phased persist; in-memory read SoR today) | Future module gates / cutover still require **separate** authorization (WP-14) |
| ADR-0011 Production backup product | **TBD** | Backup/PITR against real `rfp_*`/`prg_*` is a later WP, Dev/Test only unless otherwise authorized |
| Programme participant / rooming | **REQUIRES DOMAIN DECISION** | Does not block itinerary SoR |
| Programme–document FK | **REQUIRES DOMAIN DECISION** | Metadata via rfp/supplier/contract today |
| Item → supplier DATABASE FK vs label-only items | Initial **APPLICATION-LEVEL**; DB FK after supplier SoR | Stage 6B §8 |
| CRM read SoR still memory | Dual-write **PARTIAL** | Org FK to RFP deferred until CRM SoR cutover timing |
| PCI scope | **NOT ESTABLISHED** | Design: no raw CHD |
| Named stakeholder signatures (this Gate A) | **Blank** | Approval not recorded |

---

# 7. Relationship to ADR-0006 and DP-0006

Stage 5 recorded **DEFER / NOT READY** for selecting a Production hosting architecture.

Gate A is **narrower**: it is only about the **application persistence design** that must exist before application-level RTO/RPO of jointly critical modules can be tested.

| Record | Effect of this Gate A file | Effect if Gate A is later human-approved |
| --- | --- | --- |
| ADR-0006 | **Unchanged** — still proposed, blocked for Production | **Still unchanged** unless a separate ADR update is authorized |
| DP-0006 | **Unchanged** — OPEN, not approved | **Still unchanged** |
| Stage 5 | Remains **DEFER / NOT READY** for hosting selection | Unchanged |
| Provider / region / topology | **NOT SELECTED** | **NOT SELECTED** |

A persistence design baseline does **not** select African, EU/EEA, Tanzania-controlled, or hybrid **hosting**. Hosting must later **support** PostgreSQL + backup/PITR + future HA; that is E3/ADR-0006 work.

---

# 8. Explicit separation of Gates A–G

As defined in Stage 6B §18. **Gates B–G are not granted by this record.** Gate A **status** is **APPROVED** (design only).

| Gate | Meaning | Status now |
| --- | --- | --- |
| **A** Design approval | Accept Stage 6B as design baseline | `APPROVED` |
| **B** Dev/Test implementation | Code repositories/services in Dev/Test | **NOT AUTHORIZED** |
| **C** Migration execution | Apply new additive SQL on Dev/Test PG | **NOT AUTHORIZED** |
| **D** UAT | UAT of persisted modules | **NOT AUTHORIZED** |
| **E** Production implementation | Production persistence code path | **NOT AUTHORIZED** |
| **F** Production migration | Production DDL | **NOT AUTHORIZED** |
| **G** Production deployment | Deploy | **NOT AUTHORIZED** |

Gate A approval is **not** Gate B.

---

# 9. Recorded Gate A decision

**Recorded decision:**

> The Stage 6B persistence architecture is approved as the design baseline for subsequent Dev/Test implementation planning and execution, subject to the unresolved dependencies and governance controls identified in the Stage 6B package.

**This approval does not authorize Gates B–G.** It does not authorize Dev/Test implementation, migration execution, UAT, Production implementation, Production migration, or Production deployment.

**GATE A DECISION:**  
`APPROVED`

Named §13 signature blocks remain blank (not fabricated).

---

# 10. Consequences of recorded design approval

**Because Gate A status is recorded as APPROVED** (named signature still blank):

1. Stage 6B becomes the **design baseline** for persistence of jointly critical Commercial/RFP/Programme (and opportunity predecessor).  
2. Subsequent work must follow fail-closed persist, optimistic locking, per-request SQL SoR, durable audit + version history, portable document storage, additive migrations after 122, and Gates B–G separation.  
3. Owner/IT may **request** Gate B (Dev/Test implementation) as a **separate** record.  
4. WP-01 design is accepted as the model; WP-02–WP-16 remain **NOT STARTED / NOT AUTHORIZED** until their gates.  
5. ADR-0006, DP-0006, E1–E4, Production, UAT, implementation, and migration statuses remain as they are unless separately changed.

**If Gate A is recorded as NOT APPROVED or APPROVED WITH CONDITIONS:** those conditions must be written in §13; no implementation is implied.

**Prior state:** Gate A was `PENDING HUMAN APPROVAL` until this recording. Stage 6B is now the **approved design baseline**, not an implementation authorization.

---

# 11. Items that remain NOT AUTHORIZED

Regardless of a future Gate A signature:

- Dev/Test implementation (Gate B)  
- Creating or executing migrations (Gate C; creating SQL files is implementation-adjacent and is **not** authorized here)  
- UAT (Gate D)  
- Production implementation, migration, deployment (Gates E–G)  
- Persistence cutover / Store SoR retirement (WP-14)  
- Provider, region, topology selection  
- HA/DR/backup product implementation  
- Live Production PII in Dev/Test  
- ADR-0006 / DP-0006 approval  

**CURRENT STATUS (this record):** all of the above **NOT AUTHORIZED**. Gate A design approval: **APPROVED**. **This approval does not authorize Gates B–G.**

---

# 12. Required conditions before Gate B

Do **not** grant Gate B in this document. Gate A is recorded as **APPROVED** (status). Before Gate B should be **granted**:

1. Gate A design approval is recorded (this file: **APPROVED**). A separate Gate B package must exist and be authorized on its own.  
2. Gate B scope is limited to **Development/Test** (Stage 6B: WP-03–WP-11, WP-15 as applicable; **not** Production).  
3. Migration **execution** remains a **separate Gate C** (schema files vs apply).  
4. Fail-closed persist and no memory SoR for in-scope modules remain mandatory in the Gate B request.  
5. Unresolved E1 document-location / participant-PII items that Gate B would touch are either out of that slice or explicitly deferred with Legal awareness.  
6. ADR-0006 still does **not** authorize Production by virtue of Gate B.  
7. A Gate B record exists (or is created) as a distinct authorization — **not** inferred from Gate A.

Stage 6B recommended sequence: seek **A** before any **B**. This record implements the A **instrument** only.

---

# 13. Governance sign-off

Follows Stage 1 attestation convention. **Named signature fields are not populated by this task** (not fabricated). Decision **status** is recorded as **APPROVED** per the authorized stakeholder instruction in the governing conversation.

## Gate A — Owner / authorized design authority

I confirm that I have reviewed Stage 6B (`adr-0006-persistence-architecture-implementation-authorization.md`) and this Gate A record, and that the decision marked below is the recorded Gate A outcome.

Name:

`________________`

Role:

`________________`

Decision:

`APPROVED`

(Named signatory not recorded.)

Conditions (if any):

`________________`

Date:

`________________`

Signature / confirmation:

`________________`

## Gate A — IT / architecture reviewer (if required by Owner)

Name:

`________________`

Role:

`________________`

Decision:

`REVIEWED — NO OBJECTION / REVIEWED — CONDITIONS / NOT ENDORSED`

Date:

`________________`

Signature / confirmation:

`________________`

## Legal / DPO awareness (documents / PII overlay — not legal approval of hosting)

Name:

`________________`

Role:

`________________`

Note: awareness ≠ E1 closure. E1 remains `OPEN` unless a separate Legal record says otherwise.

Date:

`________________`

Signature / confirmation:

`________________`

---

# 14. Governance status

E1: `OPEN — REQUIRES LEGAL/DPO VALIDATION`  
E2: `PARTIALLY EVIDENCED — NOT PRODUCTION CLOSED`  
E3: `OPEN — HOSTING EVIDENCE IN PROGRESS`  
E4: `OPEN — TCO EVIDENCE INCOMPLETE`  

ADR-0006: `PROPOSED — BLOCKED FOR PRODUCTION`  
DP-0006: `OPEN — NOT APPROVED`  

Gate A: `APPROVED` — design baseline only; **does not authorize Gates B–G**  
Gates B–G: `NOT AUTHORIZED`  

Provider / region / topology: **NOT SELECTED**  
Implementation / migration / UAT / Production deployment: **NOT AUTHORIZED**

---

## Validation (this record)

- Stage 6B was inspected against the Gate A checklist; the listed TARGET decisions are present in Stage 6B and remain unimplemented.  
- Gate A **status** is recorded as APPROVED from the governing conversation; named signature was not fabricated.  
- This approval does not authorize Gates B–G.  
- ADR-0006 and DP-0006 are not modified by this file.  
- This file does not authorize implementation, migration, UAT, or Production.
