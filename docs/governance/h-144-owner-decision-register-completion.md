# H-144 — Complete H-143 Owner Decision Register

> **GOVERNANCE-ONLY CORRECTION / COMPLETION.** Not implementation, not UAT, not Production, not a PDPC conclusion, and not an Owner decision.  
> H-139, H-140, H-141, and H-142 were **not** overwritten. H-143 history is preserved; this file does **not** silently replace it.  
> Completing the register is **not** implementation authorization.

**Date:** 2026-09-22.  
**Purpose:** Correct the H-143 omission that the first H-143 grant tabulated only OD-01–OD-10 while H-142 contains OD-01–OD-16.

---

## Authority

| Record | Role |
| --- | --- |
| `docs/governance/h-142-residual-privacy-findings-owner-decision-register.md` | **Authoritative** for the 23 findings, the sixteen decision **questions**, **options**, and technical context |
| `docs/governance/h-143-owner-decision-gate-remediation-authorization.md` | H-143 gate record. **First increment** tabulated OD-01–OD-10 only. A later expansion of the same file attempted OD-01–OD-16 in place. That expansion does **not** erase the documented omission this H-144 corrects. |
| **This file (H-144)** | **Authoritative completion** of the sixteen-item Owner Decision Register coverage. Questions/options remain those of H-142. Status remains OPEN unless Owner-confirmed evidence exists (none found). |

There are not two competing question lists. There is one source (H-142) and one completion of gate coverage (H-144).

H-131, H-142, and H-143 are **not** treated as Owner confirmation of OD-01–OD-16.

---

## 1. Baseline

```text
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
branch: master
index: empty
porcelain before this increment: 624
```

Commands: `git rev-parse HEAD`; `git branch --show-current`; `git diff --cached --quiet`; `git status --porcelain`.

---

## 2. H-143 omission being corrected

H-143 PASS WITH FINDINGS. Its **first** mandated table covered only OD-01–OD-10. H-142 contains OD-01–OD-16. H-144 recovers OD-11–OD-16 from H-142 **verbatim** and publishes the complete sixteen-item register.

No Owner decisions were invented. No application, schema, migration, infrastructure, UAT, or Production action occurred.

---

## 3. OD-11 through OD-16 recovered from H-142 (verbatim questions and options)

### OD-11 Historical JSONB content

```text
Decision ID: OD-11
H-142 question (verbatim): How should historical JSONB (facts, addresses, audit snapshots) be treated?
H-142 options (verbatim): (a) leave; (b) review; (c) later treatment — no preference
Related finding(s): H142-DOC-04 (F2 / organization address JSONB; also OD-09); H142-DOC-12 (audit JSONB / historical documents / JSONB rows)
Technical consequence (H-142): (c) possible later migration
Commercial consequence (H-142): Unknown values
Migration implication (H-142): If (c)
UAT implication (H-142): Yes
Production implication (H-142): Yes
Current status: OPEN — OWNER DECISION REQUIRED
```

H-142 states why engineering cannot decide it unilaterally as “Same as OD-10”. That wording is preserved; it is **not** expanded into a new policy.

### OD-12 Migration 126

```text
Decision ID: OD-12
H-142 question (verbatim): Should a future forward-only migration retire stale import-batch CHECK values listing contact / supplier_contact?
H-142 options (verbatim): (a) leave CHECKs; (b) later authorize a migration to tighten CHECKs only; (c) later broader schema cleanup — no preference
Related finding(s): H142-IMP-01; H142-IMP-02
Technical consequence (H-142): (b) DROP/ADD CHECK; risk if leftover rows use retired tokens
Commercial consequence (H-142): Catalog hygiene vs no change to current API fail-closed
Migration implication (H-142): Yes if (b) or (c)
UAT implication (H-142): Yes if applied
Production implication (H-142): Yes if ever applied to Production
Current status: OPEN — OWNER DECISION REQUIRED
```

### OD-13 Compatibility residues

```text
Decision ID: OD-13
H-142 question (verbatim): Keep dead types/docs (SupContact, guestName shims, SupplierContactRecord JSON, manifest_entry type) or later clean them?
H-142 options (verbatim): (a) keep; (b) later cleanup increment — no preference
Related finding(s): H142-IMP-07; leftover WhatsApp/contact types on H142-NTF-09 are the same residue class
Technical consequence (H-142): (b) type/doc edits; not a person API reopen
Commercial consequence (H-142): Low if unwired
Migration implication (H-142): No for types
UAT implication (H-142): If UI types change
Production implication (H-142): No
Current status: OPEN — OWNER DECISION REQUIRED
```

### OD-14 Sample CSV / documentation artifacts

```text
Decision ID: OD-14
H-142 question (verbatim): Retain retired supplier-contacts.csv and related docs as historical samples?
H-142 options (verbatim): (a) retain labelled retired; (b) later delete if authorized — no preference; file not deleted in H-142
Related finding(s): H142-IMP-04
Technical consequence (H-142): None for (a)
Commercial consequence (H-142): Sample contains person-shaped columns as a retired example
Migration implication (H-142): No
UAT implication (H-142): Operator awareness
Production implication (H-142): No
Current status: OPEN — OWNER DECISION REQUIRED
```

### OD-15 Non-identifying processing-activity catalogue

```text
Decision ID: OD-15
H-142 question (verbatim): Does the RoPA processing-activity catalogue remain in intended scope as a non-identifying register?
H-142 options (verbatim): (a) keep as now; (b) later change catalogue fields; (c) later remove — no preference
Related finding(s): H142-DOC-14
Technical consequence (H-142): (b)(c) later API/UI
Commercial consequence (H-142): GRC catalogue vs residual free-text titles
Migration implication (H-142): If fields change
UAT implication (H-142): Yes
Production implication (H-142): If Production GRC is used
Current status: OPEN — OWNER DECISION REQUIRED
```

### OD-16 Field-cache retention / device salt (discovered)

```text
Decision ID: OD-16
H-142 question (verbatim): Required field-cache lifetime and whether device id/salt must be cleared on logout?
H-142 options (verbatim): (a) keep current bind+clear blobs; (b) later clear salt; (c) later TTL enforce; (d) later disable cache — no preference
Related finding(s): H142-FC-01 (ops brief prose in the same cache is also H142-DOC-05 / OD-09)
Technical consequence (H-142): Client storage behaviour
Commercial consequence (H-142): Offline field ops vs leftover crypto material
Migration implication (H-142): No
UAT implication (H-142): Yes (browser)
Production implication (H-142): Yes to claim Production cache safety
Current status: OPEN — OWNER DECISION REQUIRED
```

**Recovery result:** All six items were present and unambiguous in H-142. Nothing was invented.

---

## 4. Complete sixteen-item Owner Decision Register

Questions and options are H-142 wording. Owner Decision is OPEN unless authoritative evidence says otherwise. **None found.**

| Decision | Question | H-142 Options | Owner Decision | Engineering Interpretation | Status |
| --- | --- | --- | --- | --- | --- |
| OD-01 | May approved commercial CSV cells contain unstructured personal data, or must they be further constrained later? | (a) accept residual capability; (b) later process/policy only; (c) later technical constraint; (d) later stop storing csv_content — listed without preference | OPEN — OWNER DECISION REQUIRED | No csv_content change authorized | OPEN |
| OD-02 | How should historical import batches (if any exist in a catalog) be treated? | (a) leave in place; (b) Owner-authorized review extract; (c) later treatment migration — no preference | OPEN — OWNER DECISION REQUIRED | No historical-batch treatment authorized | OPEN |
| OD-03 | How should historical outbox/allowlist/SES rows be treated? | (a) leave; (b) review extract; (c) later treatment — no preference | OPEN — OWNER DECISION REQUIRED | No historical notification-row treatment authorized | OPEN |
| OD-04 | Who may be a notification recipient (individual address, shared mailbox, role, principal id only)? | (a) leave current allowlist/principal.email; (b) later policy restriction; (c) later redesign; (d) disable outbound email until specified — no preference | OPEN — OWNER DECISION REQUIRED | No recipient-classification rule authorized | OPEN |
| OD-05 | How long may notification records be kept? | (a) unspecified continue; (b) later defined period; (c) later drop fields — no period invented here | OPEN — OWNER DECISION REQUIRED | No retention period or job authorized | OPEN |
| OD-06 | Must email outbox remain part of EOS, or may it later be reduced/removed? | (a) keep; (b) later reduce; (c) later remove — no preference | OPEN — OWNER DECISION REQUIRED | Outbox removal/reduction not authorized | OPEN |
| OD-07 | May outbox/template/SES bodies retain message text? | (a) keep current persist; (b) later omit bodies; (c) later store ids only — no preference | OPEN — OWNER DECISION REQUIRED | Body-column drop not authorized | OPEN |
| OD-08 | Is structural key/filename/MIME control the accepted DocumentStorage bar, or must content inspection be specified later? | (a) remain unscanned; (b) later specify inspection; (c) later restrict kinds — no preference, no scanner designed | OPEN — OWNER DECISION REQUIRED | No file-content scanner authorized | OPEN |
| OD-09 | May notes, briefs, JSON strings, and similar prose remain semantically unrestricted aside from person-domain object keys? | (a) accept residual prose; (b) later structure fields; (c) later inspection — no preference | OPEN — OWNER DECISION REQUIRED | No semantic prose ban/scanner authorized | OPEN |
| OD-10 | How should already-stored documents be treated? | (a) leave; (b) review; (c) later treatment — no preference | OPEN — OWNER DECISION REQUIRED | No stored-document treatment authorized | OPEN |
| OD-11 | How should historical JSONB (facts, addresses, audit snapshots) be treated? | (a) leave; (b) review; (c) later treatment — no preference | OPEN — OWNER DECISION REQUIRED | No historical JSONB treatment authorized | OPEN |
| OD-12 | Should a future forward-only migration retire stale import-batch CHECK values listing contact / supplier_contact? | (a) leave CHECKs; (b) later authorize a migration to tighten CHECKs only; (c) later broader schema cleanup — no preference | OPEN — OWNER DECISION REQUIRED | Migration 126 not granted; fail-closed already exists without it | OPEN |
| OD-13 | Keep dead types/docs (SupContact, guestName shims, SupplierContactRecord JSON, manifest_entry type) or later clean them? | (a) keep; (b) later cleanup increment — no preference | OPEN — OWNER DECISION REQUIRED | Type/doc cleanup not authorized | OPEN |
| OD-14 | Retain retired supplier-contacts.csv and related docs as historical samples? | (a) retain labelled retired; (b) later delete if authorized — no preference; file not deleted in H-142 | OPEN — OWNER DECISION REQUIRED | Sample deletion not authorized | OPEN |
| OD-15 | Does the RoPA processing-activity catalogue remain in intended scope as a non-identifying register? | (a) keep as now; (b) later change catalogue fields; (c) later remove — no preference | OPEN — OWNER DECISION REQUIRED | Catalogue change/removal not authorized | OPEN |
| OD-16 | Required field-cache lifetime and whether device id/salt must be cleared on logout? | (a) keep current bind+clear blobs; (b) later clear salt; (c) later TTL enforce; (d) later disable cache — no preference | OPEN — OWNER DECISION REQUIRED | Field-cache redesign not authorized | OPEN |

---

## 5. Decision vs interpretation vs recommendation (all sixteen)

For every OD:

```text
Owner Decision:
OPEN — OWNER DECISION REQUIRED

Engineering Interpretation:
No implementation authorization exists.

Engineering Recommendation:
No engineering change should proceed until the Owner decision is recorded.
```

That block applies to **OD-01 through OD-16**. It is not a substitute for H-142’s option list. The Owner Decision field is **not** filled with a recommendation.

OD-12 additional interpretation (not a decision): historical CHECK residue may require a later migration **if** the Owner later confirms OD-12 (b) or (c); that is a future authorization condition, not H-144 permission.

---

## 6. Twenty-three H-142 findings mapped

No new findings.

| Finding ID | Finding description | Related OD | Current control | Current status | Future action | Authorization status |
| --- | --- | --- | --- | --- | --- | --- |
| H142-IMP-01 | CHECK lists `supplier_contact` | OD-12 | API fail-closed | Open | Later CHECK tighten only if OD-12 (b)/(c) confirmed | Not granted |
| H142-IMP-02 | CHECK lists `contact` on CRM import batches | OD-12 | API fail-closed | Open | Same | Not granted |
| H142-IMP-04 | Unwired retired sample CSV | OD-14 | Retired labelling; API reject | Controlled | Keep or later delete if OD-14 | Not granted |
| H142-IMP-05 | Generic commercial `csv_content` | OD-01 | Entity-type gate; HTTP omits csvContent | Deferred | After OD-01 | Not granted |
| H142-IMP-06 | Historical import batches | OD-02 | No unauthorized deletion | Open | After OD-02 | Not granted |
| H142-IMP-07 | Compatibility types / historical JSON | OD-13 | Unwired | Controlled | After OD-13 | Not granted |
| H142-IMP-08 | Kernel person-row parsers removed | **None** | Removal | Resolved | None | Closed historically; H-142 does not attach an OD |
| H142-IMP-09 | Person import create/validate/execute fail-closed | **None** to keep closed; CSV remainder is OD-01 | `person_domain_removed` | Controlled | Do not reopen | Keep existing control; not a new grant |
| H142-DOC-01 | Opaque file bytes | OD-08 | Auth/MIME/size/keys/filenames | Deferred | After OD-08 | Not granted |
| H142-DOC-02 | Free-text notes | OD-09 | Structural keys; contact entityType rejected | Deferred | After OD-09 | Not granted |
| H142-DOC-04 | F2 / address JSONB | OD-09, OD-11 | Structural keys on covered writes | Deferred | After OD-09 / OD-11 | Not granted |
| H142-DOC-05 | AI drafts / ops briefs / knowledge | OD-09 | Incomplete vs covered H-140 routes | Deferred | After OD-09 | Not granted |
| H142-DOC-10 | Writes without key contract | OD-09 | Auth/tenant as previously implemented | Deferred | After OD-09 scope | Not granted |
| H142-DOC-11 | Document metadata / filenames / MIME | OD-08 | Incomplete filename labelling | Controlled | After OD-08 | Not granted |
| H142-DOC-12 | Audit JSONB / historical documents / JSONB | OD-10, OD-11 | No unauthorized deletion | Open | After OD-10 / OD-11 | Not granted |
| H142-DOC-14 | RoPA processing-activity catalogue | OD-15 | Non-identifying catalogue | Controlled | After OD-15 | Not granted |
| H142-NTF-01 | Recipient email / allowlist | OD-04 | Auth/tenant/key contract | Open | After OD-04 | Not granted |
| H142-NTF-04 | Outbox bodies / failed sends / historical outbox | OD-03, OD-05, OD-06, OD-07 | Persist including fail; HTTP omits bodyText | Deferred | After those ODs | Not granted |
| H142-NTF-06 | Inbox email interpolation; templates; exports; SES payload | OD-04, OD-07 | Key contract on templates | Deferred | After OD-04 / OD-07 | Not granted |
| H142-NTF-09 | No WhatsApp outbound adapter | **None** to keep no adapter; types are OD-13 | No adapter | Controlled | Keep no adapter | Keep existing; types not granted via OD-13 |
| H142-LOG-03 | Named redaction incomplete | **None numbered in H-142 OD-01–OD-16** | REDACT_KEYS + query-stripped path | Controlled | No DLP invented | H-142 did not assign an OD; not inventing OD-17; no implementation grant |
| H142-FC-07 | IndexedDB / service worker not present | **None** | Mechanism not present | Resolved | None | Closed; H-142 does not attach an OD |
| H142-FC-01 | Field-cache principal / logout / switch | OD-16 (briefs also OD-09) | Principal bind; clear blobs; encryption; key reject | Controlled | After OD-16 | Not granted |

**23 findings. Count matches H-142.**

---

## 7. Migration 126

```text
MIGRATION 126:
NOT CREATED
NOT AUTHORIZED
```

```text
The application already fails closed on the relevant retired person-domain paths.

Historical CHECK residue may require a later migration.

Migration 126 requires Owner decision and separate engineering authorization before design or execution.
```

OD-12 remains OPEN. H-144 is not permission to design or execute 126. Migration 125 unmodified. No database migration run.

---

## 8. UAT, Production, external gates

```text
UAT: NOT STARTED
PRODUCTION: NOT AUTHORIZED / NOT READY
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
```

H-144 does not close these. H-143 governance is not UAT evidence. Dev/Test is not Production evidence.

---

## 9. Prior phase dispositions (not reopened)

```text
H-139 — PASS WITH FINDINGS
H-140 — PASS WITH FINDINGS
H-141 — PASS WITH FINDINGS
H-142 — PASS WITH FINDINGS
H-143 — PASS WITH FINDINGS
```

H-144 is a governance correction, not a repeat of those phases.

---

## 10. Commercial protection

While OD-01–OD-16 remain OPEN, H-144 does **not** authorize removal of:

- organizations
- opportunities
- RFPs
- programmes
- suppliers
- rates
- costing
- proposals
- Rate Identity
- commercial documents
- commercial notes
- notifications
- field operations

Existing fail-closed controls on retired person-domain APIs remain as previously accepted. Completing this register is **not** implementation authorization.

---

## 11. Final master state

```text
OWNER DECISIONS:
OD-01 through OD-16

CONFIRMED:
0

OPEN:
16

IMPLEMENTATION AUTHORIZATION:
not granted merely by completing H-144
```

---

## 12. Disposition

```text
H-144 STATUS: COMPLETE
FINAL DISPOSITION: PASS WITH FINDINGS
```

OD-11–OD-16 were recovered accurately from H-142. Owner decisions themselves remain unresolved.

```text
STOPPED AFTER H-144: YES
COMMIT: NONE
PUSH: NONE
LIVE MIGRATION: NONE
APPLICATION CHANGES: NONE
SCHEMA CHANGES: NONE
INFRASTRUCTURE CHANGES: NONE
```

Do not proceed automatically to H-145.
