# H-203 — Option B Production recipient-PII implementation design consistency audit

> **GOVERNANCE / READ-ONLY AUDIT ONLY**  
> Inspects the prepared implementation design against the already-authorized H-203 / H-131 record.  
> **NOT** implementation authorization. **NOT** DPO/legal approval. **NOT** infrastructure approval.  
> **NOT** code, schema, SQL, migration 131, API, RBAC, provider, credential, send, or Production change.  
> Historical H-203 §25, §26, and §27.1–§27.10 are **not rewritten**.

**Date:** 2026-09-28.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Commit / push:** **NONE**.

**Audited artefact:** `docs/governance/h-203-production-recipient-pii-implementation-design-specification.md`

```text
AUDIT CONCLUSION = PASS WITH OPEN VALIDATION DEPENDENCY
IMPLEMENTATION DESIGN = PREPARED — READY FOR SPECIALIST VALIDATION REVIEW
PRODUCTION RECIPIENT-PII IMPLEMENTATION = NOT AUTHORIZED FOR EXECUTION
MIGRATION 131 EXECUTION = NOT AUTHORIZED
productionReady = false
```

---

## 1. Audit scope

Determine whether the prepared Option B Production recipient-PII **implementation design** is internally consistent with the authorized governance record and ready to proceed to **specialist validation review**.

This audit does **not**:

- close D1–D4 DPO/privacy validation;
- close D4 infrastructure validation;
- authorize implementation execution;
- invent specialist approvals, reviewer names, dates, or evidence.

Repository baseline at audit start: branch `master`; HEAD `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`; porcelain 769; index empty.

---

## 2. Source documents inspected

| Document | Use |
| --- | --- |
| `docs/governance/h-203-production-recipient-pii-implementation-design-specification.md` | Audited design |
| `docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` | §22 delivery rules; §23 Dev/Test mock; §26 Option B; §27.7 D1–D7 recorded; §27.8 §13 ISSUED; §27.9 D1–D4 CLOSED; §27.10 design PREPARED |
| `docs/governance/h-203-production-recipient-pii-dpo-infrastructure-validation-pack.md` | Outstanding DPO/infra checklists |
| `docs/governance/h-131-eos-personal-data-boundary-and-privacy-by-design.md` §13 | Change-control requirement against which §27.8 issuance is recorded |
| `packages/db/migrations/` | Confirm migration 131 absent; 130 present as Dev/Test mock |
| `apps/api/src/issued-proposal/delivery.ts` and `delivery-routes.ts` | Confirm current Dev/Test exposure and that `proposal:read:recipient_pii` is **not** implemented |

Application/schema/API/RBAC files were **inspected only**. They were **not** modified.

---

## 3. Decision-to-design consistency matrix

| Decision | Authoritative record | Design fidelity | Result |
| --- | --- | --- | --- |
| H-203 Option B | §26.1: erasable delivery-recipient record; DEL/DLA immutable without raw email; `R-*` tombstone | Design §2–§3: raw email only in dedicated erasable record tied to `DEL-*`; DEL/DLA/ISS/DOC/PDF/CRM/audit/logs must not retain raw email; 130 mock form must not be copied | **Consistent** |
| D1 | §27.9: `LEGITIMATE INTERESTS ADOPTED`; balancing assessment required; contract performance where genuinely applicable; DPO **OUTSTANDING** | Design §1: same lawful-basis direction; not claimed as DPO approval; D1 DPO marked **OUTSTANDING** | **Consistent** |
| D2 | §27.9: 30-day maximum after first of final attempt / cancellation / authorization expiry; documented hold; not implicit indefinite retention | Design §4.1: same triggers and hold rule; no backup duration invented; D2 DPO **OUTSTANDING** | **Consistent** |
| D3 | §27.9: erase raw email after retention; immutable DEL/DLA keep minimum non-PII tombstone; failed/cancelled/expired does not justify indefinite raw email | Design §4.2: verifiable erasure; tombstone contains no raw email; history integrity preserved; D3 DPO **OUTSTANDING** | **Consistent** |
| D4 | §27.9: no raw email in ordinary logs or immutable audit; backups/replicas documented PII-compatible lifecycle; restore must not silently reintroduce erased PII; no duration invented | Design §5: assessment categories only; restore/rehydration controls required; no product/region/duration invented; D4 DPO **and** infrastructure **OUTSTANDING** | **Consistent** |
| D5 | §27.7: org and named-person business addresses when explicit/confirmed/related; no CRM/allowlist discovery; one `To`; no CC/BCC; recipient change = new DEL+B2 | Design §1, §3, §8: same operating rules; not reopened as a DPO gate | **Consistent** |
| D6 | §27.8: H-131 §13 **ISSUED**; does not by itself authorize schema, send, 131 execution, or D1–D4 closure | Design §11–§12: §13 recorded as authorization **prerequisite satisfied**; implementation execution still **NOT AUTHORIZED** | **Consistent** (layering preserved) |
| D7 | §27.7: ordinary `proposal:read:proposal` must not expose raw recipient email; future dedicated `proposal:read:recipient_pii`; **not implemented** | Design §6–§7: Production ordinary read must not expose email; capability future/not authorized; current Dev/Test GET/LIST `recipientEmail` identified as **not** the Production contract | **Consistent** |

The design does **not** reinterpret or expand these decisions. Historical §26.6 (items still labelled OPEN) and historical §27.7 D6 (grant not issued **by that correction**) remain successor-superseded text and were **not** treated as current Owner/POA state.

---

## 4. Specialist-validation dependencies

The design correctly leaves these **outstanding** and does **not** represent them as completed:

| Dependency | Design marking | Pack alignment |
| --- | --- | --- |
| D1 DPO/privacy (lawful basis, balancing assessment, transparency, mailbox-class treatment) | OUTSTANDING | Pack §2 checklists OPEN |
| D2 DPO/privacy (30-day appropriateness, trigger/retry/hold, deletion verification) | OUTSTANDING | Pack §3 OPEN, including retry-vs-clock |
| D3 DPO/privacy (erasable boundary, verification, derived identifiers, provider copies) | OUTSTANDING | Pack §4 OPEN |
| D4 DPO/privacy (backup/replica/restore/holds) | OUTSTANDING | Pack §5 DPO OPEN |
| D4 infrastructure (backup locations, replicas, restore, rehydration) | OUTSTANDING | Pack §5 infrastructure OPEN |
| Retention/erasure **implementation capability** | Blocked / future | No job authorized |
| Documented backup/restore capability | Categories only; procedure future; no duration | H-202 hosting remains HOLD |
| Security/access-control implementation (`proposal:read:recipient_pii`) | Future; NOT authorized | Pack: unimplemented |

No reviewer names, dates, or specialist approvals were invented in the design or in this audit.

**Open validation points (not design contradictions; do not invent solutions here):**

- How retries interact with the D2 “final delivery attempt” clock (pack §3).
- Exact physical erasable storage boundary and whether any derived `R-*` identifier remains personal data (pack §4) — design follows Owner/POA “non-PII tombstone” language pending DPO validation.
- Concrete backup product, topology, restore runbook (pack §5 / H-202 HOLD).
- Provider-side retention/erasure controls (no provider selected).

---

## 5. Migration 131 design-boundary check

| Check | Evidence | Result |
| --- | --- | --- |
| No Migration 131 SQL file | `packages/db/migrations/131*` absent; latest 13x is `130_h203_issued_client_document_delivery.sql` | **Pass** |
| No executable SQL in the design | Design §2 and §10: conceptual identifiers only; “No SQL is provided” | **Pass** |
| Execution not authorized | `MIGRATION 131 EXECUTION: NOT AUTHORIZED` | **Pass** |
| Production schema not authorized | Design banner and §12; 130 mock form must not be promoted | **Pass** |
| Validation-conditional | §11: migration dependent on applicable DPO validation and D4 infrastructure; implementation **NOT AUTHORIZED** | **Pass** |

`MIGRATION 131 DESIGN: PREPARED` is a design-readiness label only. It is **not** execution authorization.

---

## 6. API/RBAC boundary check

| Check | Evidence | Result |
| --- | --- | --- |
| Production ordinary `proposal:read:proposal` must not expose raw email | Design §6–§7 | **Pass** (contract) |
| `proposal:read:recipient_pii` future/conceptual only | Design §6, §7.1, §12; capability string appears **only** in governance docs | **Pass** |
| No RBAC implementation authorized | Design: “Future work. NOT authorized” | **Pass** |
| No Production PII-read endpoint implemented | Repository grep: capability not in application code | **Pass** |
| Design existence ≠ access | Design §12 requires remaining validation **plus** explicit implementation-execution authorization | **Pass** |

**Repository fact (Dev/Test, unchanged by this audit):** `list`/`get` of `/v1/issued-proposal-document-deliveries` currently returns `recipientEmail` under `proposal:read:proposal` (`apps/api/src/issued-proposal/delivery.ts`). The design correctly records that this mock behaviour is **not** the Production contract. This audit does **not** change that behaviour.

---

## 7. Delivery-chain consistency check

Existing H-203 chain: `ISS → DOC → DEL → DLA` (plus distinct B2 authorization).

| Rule | Design | Result |
| --- | --- | --- |
| Recipient identity belongs to the delivery boundary | `DEL-*` 1:1 `R-*`; erasable PII 1:0..1 live record; not CRM | **Consistent** |
| Recipient change = new DEL + new B2 | Design §2.3, §3, §8, §9 | **Consistent** |
| Retry under original B2 if eligible | Same frozen DEL, new DLA; live PII still required | **Consistent** with §22.6 |
| Cancel/expiry/failure ≠ indefinite raw email | D2 clock; D3 erasure; tombstone not sendable | **Consistent** |
| Accepted attempt remains historical after erasure | Design §9; DLA not rewritten | **Consistent** |
| Failure ≠ delivery; `accepted_by_provider` ≠ mailbox delivery | Design §9 | **Consistent** |
| S2 supersession | Queued re-check; old DOC blocked unless renewed named B2 | **Consistent** |

---

## 8. Authorization contamination check

Searched the design for language that could be read as authorizing execution.

| Topic | Design language | Contamination? |
| --- | --- | --- |
| Migration 131 execution | `MIGRATION 131 EXECUTION: NOT AUTHORIZED` | **No** |
| Production schema / application change | Explicitly not authorized; no SQL | **No** |
| Real email / SMTP / provider / credentials / deployment | Real provider **NOT AUTHORIZED**; no credentials; `productionReady=false` | **No** |
| Recipient-PII implementation | `NOT AUTHORIZED FOR EXECUTION`; gated on DPO/infra **plus** later explicit execution authorization | **No** |
| `proposal:read:recipient_pii` implementation | “Future implementation; NOT authorized”; remains unimplemented | **No** |
| H-131 §13 “authorization prerequisite satisfied” | Means the §13 **grant exists** (per §27.8), not that code may be written now | **No** — layered with execution denial |
| `MIGRATION 131 DESIGN: PREPARED` / `IMPLEMENTATION DESIGN: PREPARED` | Readiness for specialist review, not a build permit | **No** |

**Layer distinction to keep (not a contradiction, not a correction):** historical §27.8 still says Production recipient-PII implementation is **authorized in principle, subject to remaining gates**. §27.9 / the design / this audit state **execution is not authorized**. Readers must not collapse “in principle” or “design prepared” into execution.

**Unresolved wording (not an architecture change, not invented here):** design §7.1 “from the live PII record (or equivalent transient authorized payload)” describes provider handoff at send time. It does **not** reopen Option D (EOS never stores the To). Specialist review may still ask for a single preferred handoff description.

---

## 9. Findings

**PASS WITH OPEN VALIDATION DEPENDENCY**

| Class | Finding |
| --- | --- |
| PASS | Option B architecture is preserved without contradiction. |
| PASS | Owner/POA D1–D7 are reflected without expansion or DPO-approval inference. |
| PASS | Migration 131 remains absent; no executable schema is specified. |
| PASS | API/RBAC/PII-read remain unimplemented; design does not grant access. |
| PASS | Delivery-chain, retry, cancel, and historical-accepted-attempt rules match H-203. |
| PASS | No authorization contamination requiring correction of the design. |
| PASS WITH OPEN VALIDATION DEPENDENCY | D1–D3 DPO/privacy, D4 DPO/privacy, and D4 infrastructure remain **OUTSTANDING**. Retry-clock, exact erasable boundary / derived-identifier status, backup/restore capability, and provider-side copies remain specialist questions. |
| CONTRADICTION / CORRECTION REQUIRED | **None identified.** |

The design is **ready to proceed to specialist validation review**. It is **not** ready for implementation execution.

---

## 10. Recommended governance state after audit

`H-203 OPTION B: APPROVED`

`OWNER/POA D1–D7: CLOSED/RECORDED`

`H-131 §13: AUTHORIZATION ISSUED`

`IMPLEMENTATION DESIGN: PREPARED`

`IMPLEMENTATION DESIGN CONSISTENCY AUDIT: PASS WITH OPEN VALIDATION DEPENDENCY`

`READY FOR SPECIALIST VALIDATION REVIEW: YES`

`D1–D3 DPO/PRIVACY VALIDATION: OUTSTANDING`

`D4 DPO/PRIVACY VALIDATION: OUTSTANDING`

`D4 INFRASTRUCTURE VALIDATION: OUTSTANDING`

`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED FOR EXECUTION`

`MIGRATION 131: NOT AUTHORIZED FOR EXECUTION`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

`PRODUCTION SEND: NOT AUTHORIZED`

`PROVIDER/SMTP/API CREDENTIALS: NOT AUTHORIZED`

`PRODUCTION DEPLOYMENT: NOT AUTHORIZED`

`proposal:read:recipient_pii: NOT IMPLEMENTED`

`productionReady=false`

No application, schema, API, RBAC, provider, credential, send, or Production change. No commit. No push.
