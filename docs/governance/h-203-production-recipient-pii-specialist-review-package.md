# H-203 — Production recipient-PII specialist review package

> **SPECIALIST REVIEW PACKAGE ONLY**  
> Hand-off for **DPO/privacy** and **infrastructure** reviewers.  
> **NOT** implementation authorization. **NOT** DPO/legal approval. **NOT** infrastructure approval.  
> Does **not** answer specialist questions. Does **not** create a balancing assessment. Does **not** select a provider or backup product.  
> Historical H-203 §25–§27.13 are **not rewritten**. Owner/POA D1–D7 are **not reopened**.

**Date:** 2026-09-28.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Commit / push:** **NONE**.

**Supporting artefacts (do not replace this package):**

| Artefact | Role |
| --- | --- |
| `h-203-commercial-core-programme-rfp-finance-development.md` §26, §27.7–§27.13 | Authoritative decisions and successors |
| `h-203-production-recipient-pii-implementation-design-specification.md` | Prepared Option B design |
| `h-203-production-recipient-pii-implementation-design-consistency-audit.md` | Design consistent; validation still open |
| `h-203-production-recipient-pii-specialist-validation-handoff.md` | Detailed validation matrices |
| `h-203-production-recipient-pii-specialist-validation-gate-freeze-audit.md` | Gate frozen; specialist evidence required |
| `h-203-production-recipient-pii-dpo-infrastructure-validation-pack.md` | Earlier checklists (historical) |
| `h-131-eos-personal-data-boundary-and-privacy-by-design.md` §13 | Change-control; additional authorization **ISSUED** |

```text
SPECIALIST VALIDATION GATE = CORRECTLY FROZEN
THIS PACKAGE = REVIEW HANDOFF — NOT IMPLEMENTATION
DPO/PRIVACY = OPEN — SPECIALIST EVIDENCE REQUIRED
D4 INFRASTRUCTURE = OPEN — SPECIALIST EVIDENCE REQUIRED
productionReady = false
```

---

## 1. Executive context

H-203 is building the connected commercial core (Programme / RFP / Finance), including **internal** issued-proposal identity (`ISS-*`), client-safe documents (`DOC-*`), and a Dev/Test **mock** delivery chain (`DEL-*` / `DLA-*`). Real external delivery is **not** authorized.

**Why recipient PII:** Production Option B would hold the confirmed `To` address **only** long enough to execute an authorized B2 transmission of an already-generated client-safe PDF, permit eligible retry, and support bounded investigation of **that** delivery — not as CRM, marketing, or a contact directory.

**Architecture:** Option B is **APPROVED**. Implementation design is **PREPARED**. Consistency audit: **PASS WITH OPEN VALIDATION DEPENDENCY**. Specialist-validation gate: **CORRECTLY FROZEN**.

**This package** is for specialist review of outstanding DPO/privacy and D4 infrastructure questions. It does **not** authorize Migration 131, Production schema, RBAC, `proposal:read:recipient_pii`, credentials, send, or deployment.

---

## 2. Approved architecture

Do **not** treat this summary as a new decision.

- Raw recipient email exists **only** in a dedicated **erasable** delivery-recipient record tied to the `DEL-*` boundary.
- Delivery history remains `ISS-*` → `DOC-*` → `DEL-*` → `DLA-*`, plus distinct **B2** send authorization.
- `ISS-*`, `DOC-*`, PDF, CRM, and immutable audit events must **not** become recipient-PII stores.
- Immutable `DEL-*` / `DLA-*` must **not** retain raw email after erasure.
- After erasure, only the minimum **non-PII** tombstone/reference (`R-*` or equivalent) remains for historical integrity.
- Recipient **change** creates a **new** `DEL-*` and **new** B2 — not a mutation of immutable history.
- **Retry** may reuse the same frozen `DEL-*` (same DOC, ISS, recipient identity, hashes) under the original B2 if still eligible; failure is not delivery; `accepted_by_provider` is not mailbox delivery.
- Dev/Test migration 130 may still store mock email on insert-only DEL/DLA. That **form must not** be copied into Production.

---

## 3. Owner/POA decisions requiring specialist validation

Owner/POA D1–D4 are **CLOSED** as governance determinations. They are **not** DPO or infrastructure approval. D5–D7 remain recorded operating rules (explicit related To; H-131 §13 issued; future `proposal:read:recipient_pii`) and are **not reopened** here.

| Decision | Owner/POA position | Specialist validation required |
| -------- | ------------------ | ------------------------------ |
| **D1** Lawful basis | Legitimate interests adopted for the narrowly defined **B2** transmission purpose. A documented **balancing assessment** is required. Contract performance may apply where genuinely applicable. | DPO/privacy: fitness of legitimate interests; balancing assessment; contract-performance applicability; purpose-limitation narrowness. **OPEN.** |
| **D2** Retention | Maximum **30-day** raw-email retention after whichever occurs first: final delivery attempt; cancellation; or expiry of delivery authorization. Documented legal/support hold may require longer and must not become implicit indefinite retention. Do **not** invent a different period. | DPO/privacy: 30-day defensibility; triggers; **retry vs clock**; hold exception; operational supportability. **OPEN.** |
| **D3** Erasure | Erase raw recipient email after the applicable retention period. Immutable DEL/DLA may retain only the minimum non-PII tombstone/reference. Failed/cancelled/expired delivery does not justify indefinite raw-email retention. | DPO/privacy: erasure lifecycle; whether `R-*` remains non-personal data; whether immutable history leaks personal data. **OPEN.** |
| **D4** Logs / backups / restore | No raw email in ordinary application logs or immutable audit events. Backups/replicas need a documented PII-compatible retention/erasure policy. Restore must not silently reintroduce erased PII. **No backup duration invented.** | **DPO/privacy** (privacy of logs/audit/backups/provider copies) **and** **infrastructure** (physical store, backup product, restore, verification). Both **OPEN.** |

---

## 4. DPO/privacy review questions

Do **not** invent answers. Blank fields mean **no specialist response has been recorded**.

### Q1. Is the stated legitimate-interest basis appropriate for the defined B2 transmission purpose?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED`

### Q2. What balancing assessment evidence is required?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED` (no balancing-assessment artefact in the repository)

### Q3. Is contract performance applicable in any identified scenarios?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED`

### Q4. Is the purpose limitation sufficiently narrow?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED`

### Q5. Is the 30-day maximum retention defensible and operationally supportable?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED`

### Q6. How should retries affect the retention clock?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED`

### Q7. Is the legal/support hold exception sufficiently defined?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED`

### Q8. Is the proposed erasure lifecycle appropriate?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED`

### Q9. Does the `R-*` tombstone constitute non-personal data?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED`

### Q10. Could any immutable history retain personal data indirectly?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED`

### Q11. Is the future `proposal:read:recipient_pii` access boundary appropriate?

(Implementation of that permission is **not** authorized by this package.)

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED`

### Q12. What privacy requirements apply to provider-side recipient data?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED` (no provider selected)

### Q13. What privacy requirements apply to backups and replicas?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — DPO/PRIVACY REVIEW REQUIRED`

---

## 5. Infrastructure review questions

Separate from §4. Do **not** invent a backup duration, product, or Production store. H-202 Production hosting remains **HOLD**.

### I1. What is the authoritative physical erasable storage boundary?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — INFRASTRUCTURE REVIEW REQUIRED`

### I2. What database/storage mechanism will contain raw recipient email?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — INFRASTRUCTURE REVIEW REQUIRED`

### I3. What backup system/product covers it?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — INFRASTRUCTURE REVIEW REQUIRED`

### I4. What is the documented backup retention policy?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — INFRASTRUCTURE REVIEW REQUIRED`

### I5. How are expired backups deleted?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — INFRASTRUCTURE REVIEW REQUIRED`

### I6. How are replicas handled?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — INFRASTRUCTURE REVIEW REQUIRED`

### I7. What happens after restoring a backup containing previously erased recipient PII?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — INFRASTRUCTURE REVIEW REQUIRED`

### I8. How is silent PII reintroduction prevented?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — INFRASTRUCTURE REVIEW REQUIRED`

### I9. How is operational erasure verified?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — INFRASTRUCTURE REVIEW REQUIRED`

### I10. What recovery/runbook procedure applies?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — INFRASTRUCTURE REVIEW REQUIRED`

### I11. What monitoring/access logging protects the PII boundary?

(Must **not** place raw recipient email in ordinary application logs.)

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — INFRASTRUCTURE REVIEW REQUIRED`

### I12. What encryption/security controls apply?

- Specialist response:
- Evidence/reference:
- Reviewer:
- Date:
- Status: `OPEN — INFRASTRUCTURE REVIEW REQUIRED`

---

## 6. Provider-side questions

**Unresolved.** Do **not** select a provider. Real external delivery remains **NOT AUTHORIZED**.

| Topic | Status |
| --- | --- |
| Eventual provider selection | **Not selected** |
| Recipient-data retention at the provider | **Unresolved** |
| Provider deletion controls | **Unresolved** |
| Provider logging | **Unresolved** |
| Regional processing / transfer | **Unresolved** |
| DPA requirements | **Unresolved** |
| Suppression / bounce / complaint data | **Unresolved** |
| Whether provider-side copies create additional retention obligations | **Unresolved** |

---

## 7. Evidence required

| Evidence | Required reviewer | Status | Reference |
| -------- | ----------------- | ------ | --------- |
| Balancing assessment | DPO/privacy | `MISSING` / `OPEN` | None in repository |
| DPO/privacy review (D1–D4 privacy questions) | DPO/privacy | `OPEN` | This package §4; handoff §1 |
| Infrastructure review (D4 physical/backup/restore) | Infrastructure | `OPEN` | This package §5; handoff §2 |
| Backup architecture | Infrastructure | `MISSING` / `OPEN` | H-202 HOLD; none selected |
| Backup-retention policy | Infrastructure | `MISSING` / `OPEN` | Duration **not** invented here |
| Restore runbook (erased PII) | Infrastructure | `MISSING` / `OPEN` | None present |
| Erasure verification procedure | DPO/privacy + infrastructure | `MISSING` / `OPEN` | Design requires verifiable erasure; procedure not supplied |
| Provider privacy / DPA evidence | DPO/privacy (when provider selection is later **authorized**) | `MISSING` / `OPEN` | Provider **not** selected; send **not** authorized |

Do **not** mark `VALIDATED` because the design is internally consistent.

---

## 8. Sign-off

**Do not populate** with invented names, dates, approvals, or evidence.

### DPO/privacy

- Reviewer:
- Role:
- Date:
- Decision:
- Evidence:
- Conditions/comments:

### Infrastructure

- Reviewer:
- Role:
- Date:
- Decision:
- Evidence:
- Conditions/comments:

---

## 9. Gate logic

Specialist validation is a **prerequisite** but does **not itself authorize implementation**.

Even after successful specialist validation, a **separate governed authorization** is still required before:

- Migration 131 SQL creation or execution;
- Production schema changes;
- Production recipient-PII implementation;
- RBAC implementation;
- implementation of `proposal:read:recipient_pii`;
- Production deployment;
- provider credentials;
- real external delivery.

`proposal:read:recipient_pii` remains **unimplemented**. Migration 131 remains **absent**. Dev/Test delivery behaviour is **unchanged** by this package.

---

## 10. Current status

`IMPLEMENTATION DESIGN: PREPARED`

`READY FOR SPECIALIST VALIDATION REVIEW: YES`

`DPO/PRIVACY: OPEN — SPECIALIST EVIDENCE REQUIRED`

`D4 INFRASTRUCTURE: OPEN — SPECIALIST EVIDENCE REQUIRED`

`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED`

`MIGRATION 131 EXECUTION: NOT AUTHORIZED`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

`productionReady=false`

No application, schema, API, RBAC, provider, credential, send, or Production change. No commit. No push.
