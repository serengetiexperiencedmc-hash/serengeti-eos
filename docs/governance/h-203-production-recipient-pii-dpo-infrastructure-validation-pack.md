# H-203 — Production recipient-PII DPO/privacy and infrastructure validation pack

> **GOVERNANCE / HUMAN VALIDATION PREPARATION ONLY**  
> Owner/POA D1–D4 determinations are **CLOSED** in H-203 §27.9. This pack still prepares **DPO/privacy** (D1–D4) and **D4 infrastructure** validation. D6 H-131 §13 is **issued** in §27.8.  
> **NOT** DPO approval. **NOT** legal advice. **NOT** infrastructure approval. **NOT** send, deployment, or migration-131-execution authorization.  
> H-203 §25, §26, and §27.1–§27.8 historical text are **not rewritten**.

**Date:** 2026-09-28.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Authoritative source:** `docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` §27.7 (Owner/POA D1–D7 recorded), §27.8 (H-131 §13 issued), §27.9 (Owner/POA D1–D4 **CLOSED**).  
**Application / schema / migration / API / RBAC / Production changes:** **NONE**.

```text
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

---

## 1. Purpose

This pack is for **human DPO/privacy and infrastructure review**. Owner/POA D1–D4 determinations are **CLOSED** in H-203 §27.9; those closures are **not** DPO, legal-counsel, or infrastructure approval. Reviewers tick or complete the checklists; this document does **not** answer those questions.

Explicitly:

- this is **not** DPO/legal approval;
- this is **not** infrastructure approval;
- this is **not** Production implementation authorization;
- this does **not** authorize migration 131;
- this does **not** authorize real external delivery.

Option B architecture remains **APPROVED**. Dev/Test mock DEL/DLA (migration 130) remains **not** Production authorization. H-202 Production hosting remains **HOLD**; this pack invents **no** backup product, region, or duration.

---

## 2. D1 — Lawful basis validation

**Owner/POA determination (CLOSED in §27.9; historically recorded in §27.7):** `LEGITIMATE INTERESTS ADOPTED` for the narrowly defined B2 transmission purpose; documented balancing assessment required; contract performance may apply where genuinely applicable. **Not** DPO or legal-counsel approval.

DPO/privacy reviewer — do **not** treat Cursor answers as yours:

- [ ] Is the proposed lawful basis appropriate for the stated processing purpose?
- [ ] Is the purpose sufficiently narrow?
- [ ] Is a balancing assessment required, and is it adequate if required?
- [ ] Are transparency / information requirements satisfied?
- [ ] Is any different treatment required for named-person versus organizational business addresses?

`OWNER/POA DECISION: CLOSED`

`DPO/PRIVACY VALIDATION: OUTSTANDING`

---

## 3. D2 — Retention validation

**Owner/POA determination (CLOSED in §27.9; historically recorded in §27.7):** `30-DAY MAXIMUM RAW-EMAIL RETENTION ADOPTED` after final delivery attempt, cancellation, or expiry of delivery authorization, whichever occurs first; a documented legal/support hold may require longer retention and must not become an implicit indefinite-retention mechanism. The 30-day figure is **not** legal/DPO approval.

DPO/privacy reviewer:

- [ ] Is the 30-day period appropriate?
- [ ] Is the trigger definition adequate (final attempt / cancellation / expiry)?
- [ ] How should retries be treated against that clock?
- [ ] How should failed / cancelled / expired deliveries be treated?
- [ ] How should legal/support holds work?
- [ ] What deletion verification is required?
- [ ] How should application records, backups, replicas, and provider-side retention relate?

`OWNER/POA DECISION: CLOSED`

`DPO/PRIVACY VALIDATION: OUTSTANDING`

---

## 4. D3 — Erasure validation

**Owner/POA determination (CLOSED in §27.9; historically recorded in §27.7):** `RAW RECIPIENT EMAIL ERASURE REQUIRED` after the applicable retention period; immutable DEL/DLA history may retain only the minimum non-PII tombstone/reference; failed/cancelled/expired delivery does not justify indefinite raw-email retention. **Not** DPO/legal approval.

DPO/privacy reviewer:

- [ ] What is the exact erasable storage boundary?
- [ ] What deletion verification is required?
- [ ] How must backups and replicas be treated?
- [ ] What restoration behavior is required?
- [ ] How do legal/support holds interact with erasure?
- [ ] Do any derived identifiers remain personal data?
- [ ] Do provider-side copies require separate treatment?

`OWNER/POA DECISION: CLOSED`

`DPO/PRIVACY VALIDATION: OUTSTANDING`

---

## 5. D4 — Backups / replicas / logs validation

**Owner/POA determination (CLOSED in §27.9; historically recorded in §27.7):** `PII-MINIMIZATION AND CONTROLLED BACKUP/RESTORE POLICY ADOPTED` — no raw recipient email in ordinary application logs or immutable audit events; backups/replicas require a documented retention/erasure policy compatible with the recipient-PII boundary; restoration must not silently reintroduce previously erased recipient PII; **no backup-retention duration is invented or hard-coded**. **Not** DPO/privacy or infrastructure approval. No infrastructure implementation is authorized by this record.

Repository-evidenced facts only (not Production configuration): H-202 Production infrastructure implementation remains **HOLD**; no Production backup product or replica topology is selected by this pack. Dev/Test observability redacts some email-shaped keys; that is **not** Production backup evidence.

### DPO/privacy

- [ ] Acceptable backup/replica treatment?
- [ ] Erasure expectations for those copies?
- [ ] Interaction with the raw-email retention clock?
- [ ] Restore implications?
- [ ] Legal/support holds?

### Infrastructure

- [ ] Backup locations (when a Production store exists)?
- [ ] Replica behavior?
- [ ] Retention configuration?
- [ ] Restore process?
- [ ] Rehydration controls?
- [ ] Evidence that erased PII cannot silently reappear without controlled remediation?

`OWNER/POA DECISION: CLOSED`

`DPO/PRIVACY VALIDATION: OUTSTANDING`

`INFRASTRUCTURE VALIDATION: OUTSTANDING`

---

## 6. D6 — H-131 §13 authorization

`OWNER/POA DECISION: H-131 §13 AUTHORIZATION ISSUED` (H-203 §27.8).

`H-131 §13 ADDITIONAL AUTHORIZATION: ISSUED`

Purpose: dedicated Production recipient-PII implementation contemplated by H-203 Option B.

This pack does **not** issue that grant. Owner/POA D1–D4 determinations are **CLOSED** in §27.9; this pack does **not** constitute DPO/legal approval of D1–D4, close D4 infrastructure validation, or authorize real external delivery, provider/SMTP/API credentials, Production sending, deployment, or migration 131 **execution**.

D5 and D7 remain recorded Owner/POA operating rules and are **not** reopened. `proposal:read:recipient_pii` remains **unimplemented**.

---

## 7. Decision recording template

Do **not** populate reviewer names, approval status, dates, or evidence in this increment.

| Decision | Owner/POA position | Reviewer | Validation result | Evidence/conditions | Date |
| -------- | -------------------------- | ---------------------------- | ----------------- | ------------------- | ---- |
| D1 | **CLOSED** (`LEGITIMATE INTERESTS ADOPTED`, §27.9) | DPO/privacy | OPEN | | |
| D2 | **CLOSED** (`30-DAY MAXIMUM RAW-EMAIL RETENTION ADOPTED`, §27.9) | DPO/privacy | OPEN | | |
| D3 | **CLOSED** (`RAW RECIPIENT EMAIL ERASURE REQUIRED`, §27.9) | DPO/privacy | OPEN | | |
| D4 | **CLOSED** (`PII-MINIMIZATION AND CONTROLLED BACKUP/RESTORE POLICY ADOPTED`, §27.9) | DPO/privacy + infrastructure | OPEN | | |
| D6 | §13 authorization **issued** (§27.8) for Option B recipient-PII | Owner | ISSUED (not DPO validation) | | |

---

## 8. Final gate

`DPO/PRIVACY/INFRASTRUCTURE VALIDATION PACK — OWNER/POA D1–D4 CLOSED; DPO/INFRA OUTSTANDING; NO DPO APPROVAL INFERRED`

`D1 OWNER/POA DECISION: CLOSED`

`D2 OWNER/POA DECISION: CLOSED`

`D3 OWNER/POA DECISION: CLOSED`

`D4 OWNER/POA DECISION: CLOSED`

`D1–D3 DPO/PRIVACY VALIDATION: OUTSTANDING`

`D4 DPO/PRIVACY VALIDATION: OUTSTANDING`

`D4 INFRASTRUCTURE VALIDATION: OUTSTANDING`

`D6 H-131 §13 AUTHORIZATION: ISSUED`

`PRODUCTION RECIPIENT-PII IMPLEMENTATION EXECUTION: NOT YET AUTHORIZED`

`MIGRATION 131 EXECUTION: NOT AUTHORIZED`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

`PRODUCTION SEND: NOT AUTHORIZED`

`PROVIDER/SMTP/API CREDENTIALS: NOT AUTHORIZED`

`PRODUCTION DEPLOYMENT: NOT AUTHORIZED`

`PRODUCTION: UNTOUCHED`

`productionReady=false`

No application, schema, API, RBAC, provider, credential, send, or Production change. No commit. No push.

**Successor:** `docs/governance/h-203-production-recipient-pii-specialist-validation-handoff.md` (2026-09-28) is the review-ready DPO/privacy and infrastructure **handoff**. This pack’s historical checklists are **not rewritten**. Specialist validation remains **OPEN**. Implementation execution remains **NOT AUTHORIZED**.
