# H-203 — Option B Production recipient-PII implementation design specification

> **GOVERNANCE / DESIGN SPECIFICATION ONLY**  
> Implementation-ready technical contract for the already-approved H-203 **Option B** Production recipient-PII architecture.  
> **NOT** implementation authorization. **NOT** DPO/legal approval. **NOT** infrastructure approval.  
> **NOT** code, schema, SQL, migration 131, API, RBAC, provider, credential, send, or Production change.  
> Historical H-203 §25, §26, and §27.1–§27.9 are **not rewritten**.

**Date:** 2026-09-28.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Commit / push:** **NONE**.

**Authoritative sources (not reopened):**

- `docs/governance/h-203-commercial-core-programme-rfp-finance-development.md` §26 (Option B selected), §27.7 (D1–D7 recorded), §27.8 (H-131 §13 issued), §27.9 (Owner/POA D1–D4 **CLOSED**)
- `docs/governance/h-203-production-recipient-pii-dpo-infrastructure-validation-pack.md` (DPO/privacy and D4 infrastructure validation remain **OUTSTANDING**)
- `docs/governance/h-131-eos-personal-data-boundary-and-privacy-by-design.md` §13 (additional authorization **ISSUED** for this dedicated Production recipient-PII capability)

```text
H-203 OPTION B = APPROVED
IMPLEMENTATION DESIGN = PREPARED
PRODUCTION RECIPIENT-PII IMPLEMENTATION = NOT AUTHORIZED FOR EXECUTION
MIGRATION 131 EXECUTION = NOT AUTHORIZED
REAL EXTERNAL DELIVERY = NOT AUTHORIZED
PRODUCTION SEND = NOT AUTHORIZED
productionReady = false
```

---

## Unresolved external validation gates

These remain **outstanding**. This specification does **not** invent, infer, or record specialist approval.

| Gate | Status |
| --- | --- |
| D1 DPO/privacy validation | **OUTSTANDING** |
| D2 DPO/privacy validation | **OUTSTANDING** |
| D3 DPO/privacy validation | **OUTSTANDING** |
| D4 DPO/privacy validation | **OUTSTANDING** |
| D4 infrastructure validation | **OUTSTANDING** |

Owner/POA D1–D4 closure and H-131 §13 issuance do **not** close these gates.

---

## 1. Scope and purpose

Production recipient-PII is a **narrow, delivery-transaction capability**. It exists solely to support:

1. transmitting an **already-authorized** client-safe issued proposal (`DOC-*` bound to `ISS-*`) to **one** confirmed related recipient under a distinct **B2** send authorization;
2. **permitted retry** of that **same** authorized transmission (same `DEL-*`, same DOC, ISS, recipient identity, and hashes) while original B2 and S2 eligibility still hold;
3. **bounded** support/investigation necessary for **that** delivery transaction.

It is **not**:

- a CRM or contact master;
- a marketing database;
- a recipient directory or reusable address book;
- a general-purpose customer-data store;
- ISS/DOC/PDF content;
- a source for allowlist, notification, or CRM discovery.

Purpose limitation is architectural and Owner/POA-closed (D1/D5/§26.2). **D1 DPO/privacy validation remains OUTSTANDING.** Lawful-basis adoption of legitimate interests (with required balancing assessment; contract performance only where genuinely applicable) is **not** DPO approval.

---

## 2. Data model (conceptual — no SQL)

No physical schema, table names, or executable SQL are specified here. Identifiers below are **conceptual**. Physical names are deferred to a later authorized implementation increment.

### 2.1 Entities

| Entity | Role | Mutability of raw email |
| --- | --- | --- |
| `ISS-*` | Issued proposal identity and frozen client-safe commercial snapshot | **Must not** retain raw recipient email |
| `DOC-*` | Issued client document identity, PDF artifact, content/artifact hashes | **Must not** retain raw recipient email |
| B2 authorization | Distinct attributable send-authorization act (principal, authority, time) bound to one `DEL-*` | **Must not** retain raw recipient email in immutable authorization/audit form |
| `DEL-*` | Immutable delivery authorization/history for one B2-authorized transmission | **Must not** retain raw recipient email |
| `DLA-*` | Immutable delivery **attempt** against a frozen `DEL-*` | **Must not** retain raw recipient email |
| Dedicated erasable recipient-PII record | The **only** designated Production store for raw recipient email, tied to that delivery | **Erasable**; subject to D2/D3 |
| `R-*` (or equivalent) non-PII tombstone/reference | Stable recipient-record identity for historical integrity after erasure | **Must not** contain raw email |

### 2.2 Ownership and tenant boundary

- Every entity above is **tenant-scoped**. Cross-tenant read or write is forbidden.
- The commercial file’s organization (`relatedOrganizationId` / equivalent) is the relatedness boundary for the recipient. Relatedness is **not** CRM-contact membership.
- The erasable PII record is owned by the **same tenant** as its `DEL-*`. It is **not** a shared contact object reusable across deliveries, accounts, or tenants.
- Operator/principal identity used for B2, confirmation, erasure, and PII read is existing technical identity — not a customer-master person record.

### 2.3 Cardinality

| Relationship | Cardinality | Notes |
| --- | --- | --- |
| Tenant → `DEL-*` | 1 : N | Tenant filter on every access |
| `ISS-*` → `DOC-*` | 1 : N | Existing issued-document chain |
| `DOC-*` → `DEL-*` | 1 : N | Same document may be authorized for later distinct deliveries |
| `DEL-*` → B2 authorization | 1 : 1 | One attributable send authorization per delivery |
| `DEL-*` → `R-*` | 1 : 1 | Delivery is bound to one recipient-record identity |
| `DEL-*` → live erasable PII record | 1 : 0..1 | Present while raw email is retained; absent after erasure |
| `DEL-*` → `DLA-*` | 1 : N | Attempts are insert-only history |
| `R-*` → raw email | 0..1 | Email lives in the erasable record, not on `R-*` after erasure |

A recipient **change** is **not** an update of the existing `DEL-*` or `R-*` email field. It is a **new** `DEL-*`, **new** B2, and **new** recipient-PII lifecycle.

### 2.4 Immutable versus erasable

**Immutable (no raw email):** `ISS-*`, `DOC-*`, PDF bytes/hashes, `DEL-*` commercial/delivery metadata, `DLA-*` attempt results, chained audit events, B2 authorization evidence.

**Erasable (raw email only here):** the dedicated delivery-recipient PII record.

**Surviving non-PII after erasure:** `R-*` identity; confirmation/erasure metadata that does not contain the address (for example conceptual `erased_at`, `erased_by_principal_id`); DOC/ISS/hashes; B2 principal/authority/time; attempt result and provider reference.

### 2.5 What may and may not retain raw email

| Store / artefact | Raw recipient email |
| --- | --- |
| Dedicated erasable recipient-PII record | **May**, for the D2 window only |
| `DEL-*` / `DLA-*` | **Must not** |
| `ISS-*` / `DOC-*` / PDF | **Must not** |
| Immutable audit events | **Must not** |
| Ordinary application logs | **Must not** |
| CRM / contacts / allowlist | **Must not** (not a source; not a copy destination) |
| Provider-side copies | Governed **separately** by provider retention/erasure; not a substitute for the EOS erasable boundary |
| Backups / replicas of the PII boundary | Must follow D4; **no duration invented here** |

Migration 130 Dev/Test mock may currently persist mock `recipient_email` on insert-only DEL/DLA. That **form must not** be copied into Production. Production form is Option B only.

---

## 3. Raw recipient-email lifecycle

```text
explicitly supplied
  → confirmed (relatedness + operator attestation)
  → stored in dedicated erasable boundary
  → used for authorized delivery / permitted retry
  → retention clock (D2)
  → erased (D3)
  → non-PII tombstone remains (R-*)
```

Binding rules:

- The address is **operator-supplied** at B2 time. No CRM discovery. No allowlist discovery. No auto-To from organization `primaryEmail`.
- Confirmation is operator attestation (principal + timestamp in a future implementation), **not** mailbox-ownership proof.
- **Recipient change** creates a **new `DEL-*` and new B2**. The previous recipient-PII record remains on **its own** D2/D3 retention/erasure clock. It is not rewritten onto the new delivery.
- Raw email **must not migrate** into `ISS-*`, `DOC-*`, PDF, CRM, immutable audit events, or ordinary logs.
- After erasure, `R-*` is **not** a sendable mailbox. Further transmission requires **re-supply and re-confirmation** under applicable B2/S2 rules (typically a new `DEL-*` + new B2).
- Provider-side copies, backups, replicas, and other derived copies are **not** erased merely by deleting the live EOS PII record; they are governed by their applicable retention/erasure controls (D3/D4). **DPO/privacy and D4 infrastructure validation remain OUTSTANDING.**

---

## 4. Retention and erasure

Owner/POA D2/D3 are **CLOSED** as governance policy. They are **not** DPO/legal approval.

### 4.1 Retention (D2)

- Maximum retention of raw recipient email: **30 days** after whichever occurs **first**:
  - final delivery attempt;
  - cancellation; or
  - expiry of delivery authorization.
- A **documented legal/support hold** may require longer retention. The hold **must** be documented and **must not** become an implicit indefinite-retention mechanism.
- Distinct from immutable DEL/DLA/audit retention (not set by this 30-day figure).
- **No backup-retention period is invented.**

`D2 DPO/PRIVACY VALIDATION: OUTSTANDING`

### 4.2 Erasure (D3)

- Raw recipient email **must** be erased after the applicable retention period (or when a hold ends and the clock has already expired).
- Erasure **must be verifiable** (evidence that the designated erasable boundary no longer holds the raw address).
- The tombstone (`R-*` or equivalent) **contains no raw email**.
- Erasure **must not** destroy required immutable delivery-history integrity (`DEL-*` / `DLA-*` / hashes / B2 evidence / provider reference).
- Failed, cancelled, or expired delivery **does not** justify indefinite raw-email retention.
- Erasure covers the **designated erasable recipient-PII storage boundary**. Provider-side copies, backups, replicas, and derived copies are addressed by **their** applicable controls — not by inventing a duration here.

`D3 DPO/PRIVACY VALIDATION: OUTSTANDING`

Retry after erasure cannot transmit from the tombstone. Re-supply + re-confirmation is required.

---

## 5. Backup / replica / restore design

Owner/POA D4 is **CLOSED** as governance direction. **No infrastructure is implemented or selected by this record.** No backup product, region, topology, or duration is invented.

### 5.1 Categories that must be assessed (when a Production store exists)

These are **assessment categories**, not asserted Production facts:

| Category | Design requirement |
| --- | --- |
| Primary erasable PII store | Subject to D2/D3 erasure |
| Database backups of that store | Documented PII-compatible retention/erasure; must not become indefinite PII |
| Replicas / HA copies | Same recipient-PII boundary; erasure/reconciliation applicable |
| Point-in-time recovery / snapshots | Restore must not silently recreate erased PII |
| Object/file backups (if any later hold PII) | Same rule; none authorized here |
| Provider-side copies | Separate provider controls; not EOS backup |
| Ordinary application logs | **Must exclude** raw recipient email |
| Immutable audit events | **Must exclude** raw recipient email |

### 5.2 Restore / rehydration

- Restoration **must not** silently reintroduce recipient PII that was previously erased.
- Rehydration procedures **must** include reconciliation/remediation controls for previously erased recipient PII (for example: detect restored raw email that the live tombstone says is erased; re-apply erasure or quarantine; do not re-expose via ordinary reads).
- Exact operational procedure is **future infrastructure work**, gated on validation.

`D4 DPO/PRIVACY VALIDATION: OUTSTANDING`  
`D4 INFRASTRUCTURE VALIDATION: OUTSTANDING`

---

## 6. Access control

### 6.1 Future permission boundary

`proposal:read:recipient_pii`

This is the approved Owner/POA direction (D7) for any **future** controlled Production PII read.

| Rule | Requirement |
| --- | --- |
| Ordinary `proposal:read:proposal` | **Must not** expose raw recipient email in **Production** |
| Scope | Narrowly the recipient-PII record for that delivery / `R-*`; not CRM; not a tenant-wide directory |
| Tenant isolation | Mandatory |
| Attribution | Every PII read attributable to an authorized principal |
| Roles | **No new role** invented unless the existing authorization model later requires it. Prefer a **capability** on existing staff identities |
| Implementation | **Future work. NOT authorized by this specification.** |

Dev/Test mock GET/LIST of deliveries may currently return `recipientEmail` under `proposal:read:proposal`. That is **not** the Production contract.

Write/queue/send remains existing `proposal:write:proposal` **and** B2 authority (`ceo_md` / `commercial_director`; Dev/Test `platform.admin` is **not** a Production send authority). PII **read** is not granted by ordinary proposal read.

`proposal:read:recipient_pii` remains **unimplemented**.

---

## 7. API contract (conceptual — no code)

Existing Dev/Test staff family (migration 130 mock; **not** Production send):

- `POST/GET /v1/issued-proposal-document-deliveries`
- `POST /v1/issued-proposal-document-deliveries/:id/attempts`

**No client, public, portal, or download delivery routes.** Staff `GET …/issued-proposal-documents/:id/content` remains internal retrieval, not client delivery.

### 7.1 Future Production operations

All of the following are **future implementation work** unless noted as already present in Dev/Test mock form. **None is authorized for Production execution by this document.**

| Operation | Conceptual behavior | Status |
| --- | --- | --- |
| Create/confirm recipient | Operator supplies exact To; relatedness check; confirmation attestation; persist **only** in erasable PII boundary | **Future implementation** |
| Create `DEL-*` | Fail-closed eligibility (tenant, DOC, ISS, hashes, client-safe, B2, related confirmed recipient, S2); bind `R-*`; **do not** write raw email onto immutable DEL | Dev/Test mock exists in a **non-Option-B form**; Production Option B form is **future** |
| Create `DLA-*` / execute attempt | Insert-only attempt; provider receives To **only** for that authorized send transaction from the live PII record (or equivalent transient authorized payload); persist result **without** raw email | Dev/Test mock exists; Production real provider is **NOT AUTHORIZED** |
| Retry under existing B2 | New `DLA-*` on same frozen `DEL-*` if B2/S2/eligibility still hold and live PII still present | **Future Production**; mock retry rules already recorded in §22.6 |
| Cancel | Cancel remaining eligibility; start D2 clock from cancellation if that is the first applicable trigger; do not keep raw email indefinitely | **Future implementation** |
| Erase/anonymize after retention | Remove raw email from erasable boundary; leave `R-*` tombstone; verifiable; do not rewrite DLA history | **Future implementation** |
| Controlled PII read | Dedicated `proposal:read:recipient_pii`; tenant-scoped; attributable | **Future implementation; NOT authorized** |
| Normal delivery read/list | Metadata without raw email (`DEL-*`/`DLA-*`/`R-*` status, hashes, attempt result). Ordinary `proposal:read:proposal` | Production contract **future**; current Dev/Test exposure of email is **not** Production |

No public/client recipient-PII endpoints. No PATCH of immutable DEL/DLA. Recipient correction = cancel + new DEL + new B2.

---

## 8. Security and privacy boundary

| Control | Requirement |
| --- | --- |
| PDF | No raw recipient email |
| `ISS-*` / `DOC-*` | No raw recipient email |
| Immutable audit events | No raw recipient email |
| Ordinary logs | No raw recipient email |
| CRM discovery | Forbidden |
| Allowlist discovery | Forbidden |
| CC / BCC | Forbidden |
| Recipients | **One `To` only** |
| Recipient change | New `DEL-*` + new B2 |
| Tenant isolation | Mandatory |
| Access | Minimum necessary; Production raw email only via future `proposal:read:recipient_pii` |
| Provider | Receives the recipient **only** for the authorized send transaction; not as a contact-sync or directory feed |
| Named-person vs organizational mailbox | Both **may** be permitted when explicitly supplied/confirmed and related (D5). Not a CRM person store |

---

## 9. Failure and retry semantics

Preserve existing H-203 rules (not reopened):

- **Failure is not delivery.**
- **`accepted_by_provider` is not equivalent to mailbox delivery.**
- Retry **may** reuse the same DOC + ISS + recipient under the **original B2** if still eligible (same frozen `DEL-*`, new `DLA-*`).
- Changing recipient, document, or artifact/hash **requires a new `DEL-*` and new B2**.
- Superseded ISS/DOC **blocks** transmission of old documents unless a **new B2** explicitly names that older DOC (S2). Queued unsent deliveries are re-checked at send time.
- Historical accepted attempts remain **historical** (not rewritten; not “undone” by later supersession or erasure).
- Idempotency must be durable and **must not** require a live email column on the immutable DEL row.
- After erasure, retry cannot use the tombstone as To.

---

## 10. Migration 131 design boundary

Intended purpose of **future** migration 131 (conceptual only):

- **Additive** Production recipient-PII architecture for Option B.
- Dedicated erasable store for raw recipient email, bound to `DEL-*` / `R-*`.
- Compatible with **immutable** DEL/DLA history (no requirement to mutate 130 insert-only mock rows into Production PII).
- Compatible with approved **tenant** and **access** boundary.
- Designed around D2 (30-day max + documented hold), D3 (verifiable erasure + non-PII tombstone), and D4 (no raw email in logs/audit; backup/restore must not silently rehydrate erased PII).
- **Must not** promote migration 130’s mock `recipient_email`-on-DEL form into Production.
- **Must not** be executed by this record.

No SQL is provided. No migration file is created.

`MIGRATION 131 DESIGN: PREPARED`  
`MIGRATION 131 EXECUTION: NOT AUTHORIZED`

---

## 11. Validation-dependent items

Do **not** convert outstanding validation into approval.

| Design area | Owner/POA | DPO/privacy | Infrastructure | Implementation |
| --- | --- | --- | --- | --- |
| Lawful basis | CLOSED | OUTSTANDING | N/A | Blocked |
| Retention | CLOSED | OUTSTANDING | As applicable | Blocked |
| Erasure | CLOSED | OUTSTANDING | As applicable | Blocked |
| Backup/restore | CLOSED | OUTSTANDING | OUTSTANDING | Blocked |
| PII permission | CLOSED | N/A unless required by validation | N/A | Not authorized |
| H-131 §13 | ISSUED | N/A | N/A | Authorization prerequisite satisfied |
| Migration 131 | Direction established | Dependent on applicable validation | Dependent on D4 | NOT AUTHORIZED |

---

## 12. Implementation gate

`H-203 OPTION B: APPROVED`

`OWNER/POA D1–D7: CLOSED/RECORDED`

`H-131 §13: AUTHORIZATION ISSUED`

`D1–D3 DPO/PRIVACY VALIDATION: OUTSTANDING`

`D4 DPO/PRIVACY VALIDATION: OUTSTANDING`

`D4 INFRASTRUCTURE VALIDATION: OUTSTANDING`

`IMPLEMENTATION DESIGN: PREPARED`

`PRODUCTION RECIPIENT-PII IMPLEMENTATION: NOT AUTHORIZED FOR EXECUTION`

`MIGRATION 131: NOT AUTHORIZED FOR EXECUTION`

`REAL EXTERNAL DELIVERY: NOT AUTHORIZED`

`PRODUCTION SEND: NOT AUTHORIZED`

`productionReady=false`

This specification does **not** authorize writing schema, APIs, RBAC, jobs, backups, providers, credentials, or executing migration 131. The smallest later implementation increment remains gated on remaining DPO/privacy and D4 infrastructure validation **plus** an explicit implementation-execution authorization.

No application, schema, API, RBAC, provider, credential, send, or Production change. No commit. No push.
