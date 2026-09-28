# H-203 — Production recipient-PII specialist-validation handoff

> **GOVERNANCE / SPECIALIST-VALIDATION HANDOFF ONLY**  
> Makes the outstanding DPO/privacy and D4 infrastructure gates **review-ready**.  
> **NOT** DPO/legal approval. **NOT** infrastructure approval. **NOT** implementation authorization.  
> Does **not** redesign Option B. Does **not** reopen Owner/POA D1–D7.  
> Historical validation pack checklists and H-203 §25–§27.11 are **not rewritten**.  
> Repository inspection is **not** specialist validation.

**Date:** 2026-09-28.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Commit / push:** **NONE**.

**Authoritative inputs (not reopened):**

1. `docs/governance/h-203-production-recipient-pii-implementation-design-specification.md`
2. `docs/governance/h-203-production-recipient-pii-implementation-design-consistency-audit.md`
3. `docs/governance/h-203-production-recipient-pii-dpo-infrastructure-validation-pack.md` (prior checklist; this handoff is the review-ready successor)
4. `docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` §26, §27.7–§27.11
5. `docs/governance/h-131-eos-personal-data-boundary-and-privacy-by-design.md` §13

```text
IMPLEMENTATION DESIGN = PREPARED
READY FOR SPECIALIST VALIDATION REVIEW = YES
DPO/PRIVACY = OPEN
D4 INFRASTRUCTURE = OPEN
PRODUCTION RECIPIENT-PII IMPLEMENTATION = NOT AUTHORIZED FOR EXECUTION
MIGRATION 131 EXECUTION = NOT AUTHORIZED
productionReady = false
```

---

## Status vocabulary (this handoff)

| Status | Meaning |
| --- | --- |
| `OPEN — DPO/PRIVACY REVIEW REQUIRED` | Specialist DPO/privacy review has **not** been supplied in the repository |
| `OPEN — INFRASTRUCTURE REVIEW REQUIRED` | Specialist infrastructure review has **not** been supplied in the repository |
| `VALIDATED — SPECIALIST EVIDENCE PRESENT` | Use **only** when an authorized specialist review with evidence is recorded here. **Not used in this increment.** |
| `BLOCKED — REQUIRED EVIDENCE MISSING` | Review cannot be completed until a named artefact/system exists; **not** a substitute for specialist approval |

Do **not** mark `VALIDATED` because the design is internally consistent. The consistency audit is **not** DPO or infrastructure validation.

`DPO/PRIVACY: OPEN`  
`D4 INFRASTRUCTURE: OPEN`

---

## 1. DPO/privacy validation matrix

Owner/POA D1–D4 are **CLOSED** as governance determinations. They are **not** DPO approval. D5 and D7 remain recorded operating rules and are **not** reopened. D6 H-131 §13 remains **ISSUED** and is **not** a DPO validation item.

### 1.1 D1 — Lawfulness / purpose

`DPO/PRIVACY: OPEN`

Owner/POA (do not reopen): legitimate interests adopted for the narrowly defined B2 transmission purpose; documented balancing assessment required; contract performance may apply where genuinely applicable.

| ID | Question the reviewer must validate | Reviewer type | Evidence required | Expected decision/output | Current status |
| --- | --- | --- | --- | --- | --- |
| D1-Q1 | Is the approved legitimate-interest basis appropriate for the narrowly defined B2 transmission purpose? | DPO/privacy | Owner/POA D1 record (§27.9); design §1 purpose limitation; applicable privacy analysis | Accept / reject / condition the lawful-basis direction | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D1-Q2 | Is a documented balancing assessment required, and is an adequate assessment present? | DPO/privacy | Balancing-assessment document (not present in this repository increment) | Assessment accepted / inadequate / still required | `BLOCKED — REQUIRED EVIDENCE MISSING` (no balancing-assessment artefact) **and** `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D1-Q3 | Is contract performance applicable in any relevant processing context? | DPO/privacy | Stated processing contexts (B2 send / retry / bounded support); no invented legal memo | Applicable / not applicable / mixed, with conditions | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D1-Q4 | Is the stated purpose limitation sufficiently narrow (authorized send, permitted retry, bounded support of that delivery — not CRM/directory/marketing)? | DPO/privacy | Design §1; Option B §26.2 | Sufficient / too broad / conditions | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |

Do **not** treat Cursor or repository inspection as the balancing assessment.

### 1.2 D2 — Retention

`DPO/PRIVACY: OPEN`

Owner/POA (do not reopen; do **not** invent a different period): 30-day **maximum** raw-email retention after whichever occurs first — final delivery attempt, cancellation, or expiry of delivery authorization — subject to a documented legal/support hold that must not become implicit indefinite retention.

| ID | Question the reviewer must validate | Reviewer type | Evidence required | Expected decision/output | Current status |
| --- | --- | --- | --- | --- | --- |
| D2-Q1 | Is the 30-day maximum appropriate for raw recipient email? | DPO/privacy | Owner/POA D2; design §4.1; no alternative period invented here | Accept / reject / condition the 30-day maximum | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D2-Q2 | Are the triggers (final attempt / cancellation / authorization expiry) adequate? | DPO/privacy | Design §4.1; H-203 delivery-state vocabulary | Adequate / needs refinement | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D2-Q3 | How does **retry** interact with the D2 retention clock? | DPO/privacy | Design does **not** answer this; pack/audit recorded it as open | Written rule for retry vs “final attempt” | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D2-Q4 | Is the documented legal/support-hold exception supportable, without becoming indefinite retention? | DPO/privacy | Hold-control description (not implemented; not invented) | Accept / condition hold mechanics | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D2-Q5 | Is the proposed lifecycle legally and operationally supportable (including failed/cancelled/expired/completed delivery)? | DPO/privacy | Design §3–§4; D3 interaction | Supportable / not supportable / conditions | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |

### 1.3 D3 — Erasure

`DPO/PRIVACY: OPEN`

Owner/POA (do not reopen): raw recipient email must be erased after the applicable retention period; immutable DEL/DLA may retain only the minimum non-PII tombstone/reference; failed/cancelled/expired delivery does not justify indefinite raw-email retention.

| ID | Question the reviewer must validate | Reviewer type | Evidence required | Expected decision/output | Current status |
| --- | --- | --- | --- | --- | --- |
| D3-Q1 | Is physical/logical erasure of raw recipient email after the applicable retention point required and adequate as specified? | DPO/privacy | Design §4.2; Option B §26.5 | Accept erasure requirement / conditions | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D3-Q2 | Is the exact **physical/logical erasable storage boundary** acceptable? | DPO/privacy | Design is conceptual only; no Production schema | Boundary definition accepted / insufficient | `OPEN — DPO/PRIVACY REVIEW REQUIRED` (boundary not physically instantiated) |
| D3-Q3 | Does the proposed `R-*` tombstone remain **non-personal data** under the applicable privacy analysis? | DPO/privacy | Design asserts non-PII per Owner/POA D3; **no specialist analysis present** | Tombstone is / is not personal data, with reasons | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D3-Q4 | Treatment of cancelled, expired, failed, and completed deliveries — no indefinite raw-email retention? | DPO/privacy | Design §4.2, §9 | Accept / condition | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D3-Q5 | Does any immutable history (DEL/DLA/audit/ISS/DOC/PDF) accidentally preserve personal data (raw email)? | DPO/privacy | Design §2.5, §8; Dev/Test 130 mock is **not** Production form | Confirm Production form excludes raw email from immutable stores / identify leak | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D3-Q6 | Erasure verification — what evidence is required that the erasable boundary no longer holds the address? | DPO/privacy | Design requires verifiable erasure; no operational procedure exists | Verification standard | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |

### 1.4 D4 — Privacy controls (not infrastructure)

`DPO/PRIVACY: OPEN`

Keep this **separate** from §2 infrastructure validation. Owner/POA D4 privacy direction is closed; specialist privacy review is not.

| ID | Question the reviewer must validate | Reviewer type | Evidence required | Expected decision/output | Current status |
| --- | --- | --- | --- | --- | --- |
| D4P-Q1 | Prohibition of raw recipient email from ordinary application logs — adequate? | DPO/privacy | Design §5, §8 | Accept / condition | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D4P-Q2 | Prohibition from immutable audit events — adequate? | DPO/privacy | Design §2.4, §8 | Accept / condition | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D4P-Q3 | Access-control boundary for raw recipient PII (tenant isolation; not ordinary `proposal:read:proposal` in Production) | DPO/privacy | Design §6; D7 | Accept / condition | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D4P-Q4 | Is future `proposal:read:recipient_pii` an appropriate dedicated permission? (implementation **not** authorized) | DPO/privacy | Design §6–§7; D7 | Appropriate / too wide / too narrow / other control required | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D4P-Q5 | Provider-side recipient-data implications (privacy) | DPO/privacy | **No provider selected**; design says provider receives To only for the authorized send | Privacy conditions for any future provider | `BLOCKED — REQUIRED EVIDENCE MISSING` (no provider) **and** `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| D4P-Q6 | Backup/replica implications **from the privacy perspective** (not product selection) | DPO/privacy | Design §5; no backup duration invented | Privacy-compatible backup/restore rules | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |

---

## 2. Infrastructure validation matrix

`D4 INFRASTRUCTURE: OPEN`

H-202 Production hosting remains **HOLD**. No Production backup product, replica topology, or duration is selected. Dev/Test log redaction is **not** Production backup evidence. Do **not** invent a backup duration. Do **not** claim any backup system satisfies erasure without evidence.

| ID | Question the reviewer must validate | Reviewer type | Evidence required | Expected decision/output | Current status |
| --- | --- | --- | --- | --- | --- |
| D4I-Q1 | Physical storage boundary for the erasable recipient record (when a Production store exists) | Infrastructure | Production store design (none authorized) | Boundary accepted / insufficient | `BLOCKED — REQUIRED EVIDENCE MISSING` **and** `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| D4I-Q2 | What backup product/system is authoritative? | Infrastructure | Named product/system (none selected) | Named system or explicit “none yet” with conditions | `BLOCKED — REQUIRED EVIDENCE MISSING` **and** `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| D4I-Q3 | Documented backup retention and deletion/expiry mechanics (compatible with recipient-PII boundary) | Infrastructure | Written backup retention/erasure policy (**duration not invented here**) | Policy accepted / missing | `BLOCKED — REQUIRED EVIDENCE MISSING` **and** `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| D4I-Q4 | Replica / HA copy behavior vs erasure | Infrastructure | Replica topology (none selected) | Compatible / incompatible / conditions | `BLOCKED — REQUIRED EVIDENCE MISSING` **and** `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| D4I-Q5 | Restore procedure after recipient-email erasure | Infrastructure | Restore/rehydration runbook (none present) | Procedure accepted / missing | `BLOCKED — REQUIRED EVIDENCE MISSING` **and** `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| D4I-Q6 | Prevention of silently reintroducing erased PII on restore/rehydration | Infrastructure | Design §5.2 requirements; no implemented control | Control design accepted / insufficient | `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| D4I-Q7 | Operational erasure verification (infrastructure evidence) | Infrastructure | Verification method against the physical store | Method accepted / missing | `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| D4I-Q8 | Recovery/runbook requirements for the PII boundary | Infrastructure | Operational runbook (none present) | Runbook accepted / missing | `BLOCKED — REQUIRED EVIDENCE MISSING` **and** `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| D4I-Q9 | Encryption/security controls where applicable | Infrastructure | Future Production store/crypto design (none authorized) | Controls accepted / deferred with conditions | `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| D4I-Q10 | Monitoring and access logging for the PII boundary (without placing raw email in ordinary logs) | Infrastructure | Monitoring/audit design | Accept / condition | `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |

---

## 3. Explicit open questions (do not answer by inference)

These remain **unanswered**. This handoff **formalizes** them; it does **not** resolve them.

| # | Open question | Owner of review | Status |
| --- | --- | --- | --- |
| OQ-1 | How does retry interact with the D2 retention clock? | DPO/privacy | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| OQ-2 | What is the exact physical erasable storage boundary? | DPO/privacy + infrastructure | `OPEN — DPO/PRIVACY REVIEW REQUIRED` and `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| OQ-3 | Does the `R-*` tombstone remain non-personal data under the applicable privacy analysis? | DPO/privacy | `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| OQ-4 | What backup product/system is authoritative? | Infrastructure | `BLOCKED — REQUIRED EVIDENCE MISSING` and `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| OQ-5 | What is the documented backup retention policy? | Infrastructure (privacy-compatible rules also DPO) | `BLOCKED — REQUIRED EVIDENCE MISSING` and `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| OQ-6 | What is the restore procedure after recipient-email erasure? | Infrastructure | `BLOCKED — REQUIRED EVIDENCE MISSING` and `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| OQ-7 | How is erased PII prevented from being silently reintroduced? | Infrastructure (privacy implications also DPO) | `OPEN — INFRASTRUCTURE REVIEW REQUIRED` |
| OQ-8 | What recipient data is retained by the eventual external delivery provider? | DPO/privacy (depends on a selected provider) | `BLOCKED — REQUIRED EVIDENCE MISSING` and `OPEN — DPO/PRIVACY REVIEW REQUIRED` |
| OQ-9 | What provider-side retention/deletion controls will be required? | DPO/privacy + future provider governance | `BLOCKED — REQUIRED EVIDENCE MISSING` and `OPEN — DPO/PRIVACY REVIEW REQUIRED` |

---

## 4. Sign-off boundary

**Do not populate** name, date, decision, or evidence with invented values. Blank fields below mean **no specialist review has been recorded**.

### 4.1 DPO / privacy

| Field | Value |
| --- | --- |
| Reviewer name / role | |
| Review date | |
| Decision | |
| Evidence / reference | |
| Comments | |

Overall DPO/privacy result for this increment: `DPO/PRIVACY: OPEN`

### 4.2 Infrastructure

| Field | Value |
| --- | --- |
| Reviewer name / role | |
| Review date | |
| Decision | |
| Evidence / reference | |
| Comments | |

Overall infrastructure result for this increment: `D4 INFRASTRUCTURE: OPEN`

---

## 5. Gate logic

Specialist validation passing does **not**, by itself, authorize implementation.

After specialist validation, a **separate governed implementation authorization** is still required before:

- Migration 131 SQL creation or execution;
- Production schema changes;
- Production recipient-PII implementation;
- RBAC implementation;
- implementation of `proposal:read:recipient_pii`;
- Production deployment.

Still separately unauthorized (not closed by this handoff or by a future specialist pass alone):

- real external delivery;
- Production send;
- provider / SMTP / API credentials;
- Production deployment.

`proposal:read:recipient_pii` remains **unimplemented**. Migration 131 remains **absent**. Dev/Test delivery behaviour is **unchanged**.

---

## 6. Governance status

`IMPLEMENTATION DESIGN: PREPARED`

`READY FOR SPECIALIST VALIDATION REVIEW: YES`

`D1–D4 DPO/PRIVACY VALIDATION: OUTSTANDING`

`D4 INFRASTRUCTURE VALIDATION: OUTSTANDING`

`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED FOR EXECUTION`

`MIGRATION 131 EXECUTION: NOT AUTHORIZED`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

`productionReady=false`

No application, schema, API, RBAC, provider, credential, send, or Production change. No commit. No push.
