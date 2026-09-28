# H-203 — Production recipient-PII specialist-validation execution register

> **SPECIALIST VALIDATION EXECUTION GATE**  
> Makes DPO/privacy and infrastructure validation **operationally actionable**.  
> **NOT** implementation authorization. **NOT** DPO/legal approval. **NOT** infrastructure approval.  
> Does **not** answer Q1–Q13 or I1–I12. Does **not** invent specialist names, responses, or evidence.  
> Owner/POA D1–D7 are **not reopened**. Option B is **not redesigned**.

**Date:** 2026-09-28.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Commit / push:** **NONE**.

**Review source (authoritative questions):** `docs/governance/h-203-production-recipient-pii-specialist-review-package.md`  
This register tracks **execution of review**. It does **not** replace the review package.

---

## Specialist handoff instructions

Specialists must use the **review package** as the source of questions and context. For each assigned question they should:

1. Review the relevant question (package §4 for Stream A; package §5 for Stream B).
2. Provide evidence/reference (artefact, memo, or equivalent authorized specialist record).
3. Identify any conditions or remediation.
4. Identify themselves by **role and name**.
5. **Date** their review.
6. Record an **explicit decision** using the states in §3 of this register.

Do **not** create fake sign-offs. Design consistency and Owner/POA closure are **not** specialist validation.

Blank response / evidence / reviewer / date fields below mean **no specialist review has been recorded**.

---

## Status vocabulary

| State | Meaning |
| --- | --- |
| `OPEN — SPECIALIST EVIDENCE REQUIRED` | Initial and current state until authorized evidence is supplied |
| `UNDER REVIEW` | Named specialist has started review; decision not yet recorded |
| `VALIDATED` | Authorized specialist evidence addresses the question **without** remaining conditions |
| `VALIDATED WITH CONDITIONS` | Accepted subject to recorded conditions; **not** unconditional stream closure |
| `REMEDIATION REQUIRED` | Specialist requires change or further work before validation |
| `BLOCKED — EVIDENCE MISSING` | Review cannot complete until a named artefact/system exists |

Do **not** use `VALIDATED` or `VALIDATED WITH CONDITIONS` unless actual specialist evidence exists. **Not used in this increment.**

---

## Stream A — DPO / Privacy

**Responsible specialist role:** DPO / privacy reviewer (authorized).  
**Stream status:** `OPEN — SPECIALIST EVIDENCE REQUIRED`

| Question ID | Question | Required evidence | Responsible specialist role | Status | Specialist response | Evidence reference | Reviewer | Review date | Conditions/remediation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Q1 | Is the stated legitimate-interest basis appropriate for the defined B2 transmission purpose? | Authorized DPO/privacy analysis of lawful basis against the B2 purpose | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| Q2 | What balancing assessment evidence is required? | Balancing-assessment artefact and DPO/privacy view of adequacy | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| Q3 | Is contract performance applicable in any identified scenarios? | Authorized DPO/privacy determination on contract-performance applicability | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| Q4 | Is the purpose limitation sufficiently narrow? | Authorized DPO/privacy view of purpose limitation (send / retry / bounded support) | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| Q5 | Is the 30-day maximum retention defensible and operationally supportable? | Authorized DPO/privacy view of the Owner/POA 30-day maximum (do not invent a different period here) | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| Q6 | How should retries affect the retention clock? | Authorized DPO/privacy rule for retry vs “final delivery attempt” | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| Q7 | Is the legal/support hold exception sufficiently defined? | Authorized DPO/privacy view of hold mechanics (must not become indefinite retention) | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| Q8 | Is the proposed erasure lifecycle appropriate? | Authorized DPO/privacy view of erasure after applicable retention | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| Q9 | Does the `R-*` tombstone constitute non-personal data? | Authorized DPO/privacy analysis of tombstone / derived identifiers | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| Q10 | Could any immutable history retain personal data indirectly? | Authorized DPO/privacy view of DEL/DLA/audit/ISS/DOC/PDF leak risk | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| Q11 | Is the future `proposal:read:recipient_pii` access boundary appropriate? | Authorized DPO/privacy view of the dedicated PII-read boundary (implementation **not** authorized) | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| Q12 | What privacy requirements apply to provider-side recipient data? | Authorized DPO/privacy requirements for provider copies (provider **not** selected) | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| Q13 | What privacy requirements apply to backups and replicas? | Authorized DPO/privacy requirements for backup/replica copies (privacy stream; not product selection) | DPO/privacy | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |

---

## Stream B — Infrastructure

**Responsible specialist role:** Infrastructure reviewer (authorized).  
**Stream status:** `OPEN — SPECIALIST EVIDENCE REQUIRED`

| Question ID | Question | Required evidence | Responsible specialist role | Status | Specialist response | Evidence reference | Reviewer | Review date | Conditions/remediation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| I1 | What is the authoritative physical erasable storage boundary? | Authorized description of the physical/logical erasable boundary | Infrastructure | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| I2 | What database/storage mechanism will contain raw recipient email? | Authorized store/mechanism identification (none implemented by this register) | Infrastructure | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| I3 | What backup system/product covers it? | Named backup product/system (none selected here) | Infrastructure | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| I4 | What is the documented backup retention policy? | Written backup retention policy (duration **not** invented here) | Infrastructure | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| I5 | How are expired backups deleted? | Authorized deletion/expiry mechanics for backups | Infrastructure | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| I6 | How are replicas handled? | Authorized replica/HA treatment vs erasure | Infrastructure | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| I7 | What happens after restoring a backup containing previously erased recipient PII? | Restore procedure addressing previously erased PII | Infrastructure | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| I8 | How is silent PII reintroduction prevented? | Authorized control for restore/rehydration | Infrastructure | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| I9 | How is operational erasure verified? | Operational verification method against the physical store | Infrastructure | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| I10 | What recovery/runbook procedure applies? | Recovery/runbook for the PII boundary | Infrastructure | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| I11 | What monitoring/access logging protects the PII boundary? | Monitoring/access-logging design that does **not** place raw email in ordinary logs | Infrastructure | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |
| I12 | What encryption/security controls apply? | Authorized encryption/security controls for the PII boundary | Infrastructure | `OPEN — SPECIALIST EVIDENCE REQUIRED` | | | | | |

---

## Closure criteria

Closure is **not** “the design is consistent” and **not** “the architecture appears feasible.”

### DPO/privacy stream — `CLOSED` only when

Authorized specialist evidence addresses the applicable questions concerning:

- lawful basis;
- balancing assessment;
- purpose limitation;
- retention;
- retry/retention interaction;
- legal/support hold;
- erasure;
- tombstone/non-personal-data treatment;
- immutable-history privacy;
- PII access boundary;
- provider-side privacy;
- backup/replica privacy.

`VALIDATED WITH CONDITIONS` or `REMEDIATION REQUIRED` on any applicable question **prevents** treating the stream as unconditionally closed. Missing evidence keeps the stream **OPEN**.

### Infrastructure stream — `CLOSED` only when

Authorized infrastructure evidence addresses the applicable questions concerning:

- physical erasable boundary;
- storage mechanism;
- backup product;
- backup retention;
- deletion/expiry;
- replicas;
- restore;
- prevention of silent PII reintroduction;
- operational erasure verification;
- recovery/runbook;
- monitoring/access logging;
- encryption/security controls.

`VALIDATED WITH CONDITIONS` or `REMEDIATION REQUIRED` on any applicable question **prevents** treating the stream as unconditionally closed. Missing evidence keeps the stream **OPEN**.

---

## Escalation rules

- A specialist **disagreement** with the approved design becomes a **governance finding** requiring Owner/POA review.
- A privacy/legal requirement that **conflicts with Option B** must **not** be silently resolved by engineering.
- An infrastructure limitation that **prevents** the approved erasure/restore model must **not** be worked around in code without governance review.
- **Missing evidence** keeps the relevant gate **OPEN**.
- A condition requiring **remediation** keeps the relevant gate from being treated as **unconditionally closed**.
- **Specialist approval does not itself authorize implementation.**

---

## Post-validation gate

Exact next sequence (none of these is performed by this register):

1. `DPO/PRIVACY VALIDATION` and `D4 INFRASTRUCTURE VALIDATION` must first be recorded **with actual evidence**.
2. Then: `VALIDATION ASSESSMENT`.
3. Then, if all required gates pass: `SEPARATE IMPLEMENTATION AUTHORIZATION`.

Only after that authorization may a **future** increment address:

- Migration 131 SQL;
- Production schema;
- recipient-PII implementation;
- `proposal:read:recipient_pii`;
- RBAC;
- deployment.

Real external delivery, Production send, and provider/SMTP/API credentials remain **separately unauthorized**.

---

## Current gate

`SPECIALIST VALIDATION EXECUTION GATE: OPEN`

`DPO/PRIVACY: OPEN — SPECIALIST EVIDENCE REQUIRED`

`D4 INFRASTRUCTURE: OPEN — SPECIALIST EVIDENCE REQUIRED`

`IMPLEMENTATION DESIGN: PREPARED`

`MIGRATION 131 DESIGN: PREPARED`

`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED`

`MIGRATION 131 EXECUTION: NOT AUTHORIZED`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

`productionReady=false`

No application, schema, API, RBAC, provider, credential, send, or Production change. No commit. No push.

**Successor:** `docs/governance/h-203-production-recipient-pii-specialist-validation-requests.md` (2026-09-28) **issues** Request A (DPO/privacy) and Request B (infrastructure). `REQUEST ISSUED` is **not** validation completed. This register’s question rows remain **OPEN — SPECIALIST EVIDENCE REQUIRED** until evidence is mapped under the evidence-submission protocol.
