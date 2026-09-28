# H-144 — Owner Decision Worksheet

> **GOVERNANCE-ONLY OWNER DECISION PREPARATION.** Not implementation. Not UAT. Not Production. Not a PDPC conclusion.  
> Completing or signing this worksheet does **not** by itself authorize engineering.  
> H-142 is the authoritative source of questions and options. H-131, H-139–H-143, and existing software behaviour are **not** Owner decisions on OD-01–OD-16.  
> A prior H-144 artefact (`h-144-owner-decision-register-completion.md`) completed sixteen-item **register coverage**. **This file is the primary Owner Decision Worksheet** for intake. Those records do not compete on questions: both use H-142 wording. This worksheet is the interface for Owner selections.

**Owner named for confirmation:** Patrick Daniel Makundi.  
**Date / selections:** not completed in this increment.

```text
Completion of this worksheet does not authorize:

- application changes
- schema changes
- migration 126
- infrastructure changes
- UAT
- Production
```

Those actions require subsequent governance authorization after the Owner decisions are recorded.

---

## 1. Purpose

Create an unambiguous worksheet so the Owner can **explicitly** decide OD-01 through OD-16.

No option is preselected. No decision is inferred from application behaviour, engineering preference, commercial convenience, privacy assumption, or prior governance phases.

---

## 2. Current governance state

```text
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
BRANCH: master
INDEX: empty
PORCELAIN at H-144 worksheet start: 625

H-139: PASS WITH FINDINGS
H-140: PASS WITH FINDINGS
H-141: PASS WITH FINDINGS
H-142: PASS WITH FINDINGS  (authoritative OD wording)
H-143: PASS WITH FINDINGS  (decision gate; 16 OPEN)

OWNER DECISIONS CONFIRMED: 0
OWNER DECISIONS OPEN: 16

MIGRATION 126: NOT CREATED
AUTHORIZATION: NOT GRANTED
CURRENT APPLICATION: FAIL-CLOSED FOR DEDICATED RETIRED PERSON-DOMAIN PATHS
HISTORICAL CHECK CLEANUP: POTENTIALLY REQUIRES FUTURE MIGRATION

UAT: NOT STARTED
PRODUCTION: NOT AUTHORIZED / NOT READY
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
```

---

## 3. Owner decision instructions

1. Read each OD question and options as copied from H-142.
2. Select **one** option per OD, or record a later Owner-stated option in a subsequent authorised artefact (do not invent options here).
3. Fill `SELECTED OPTION` and the confirmation section. Leave blank until decided.
4. Existing software behaviour is **not** an approval of option (a) or any other option.
5. After selections are recorded as Owner decisions, a **later** governance increment must translate them into an authorization boundary before any implementation, migration, UAT, or Production work.

**No decision is preselected.**

---

## 4. Decision summary table

| ID | Decision | Status | Owner Selection |
| --- | --- | --- | --- |
| OD-01 | May approved commercial CSV cells contain unstructured personal data, or must they be further constrained later? | OPEN | — |
| OD-02 | How should historical import batches (if any exist in a catalog) be treated? | OPEN | — |
| OD-03 | How should historical outbox/allowlist/SES rows be treated? | OPEN | — |
| OD-04 | Who may be a notification recipient (individual address, shared mailbox, role, principal id only)? | OPEN | — |
| OD-05 | How long may notification records be kept? | OPEN | — |
| OD-06 | Must email outbox remain part of EOS, or may it later be reduced/removed? | OPEN | — |
| OD-07 | May outbox/template/SES bodies retain message text? | OPEN | — |
| OD-08 | Is structural key/filename/MIME control the accepted DocumentStorage bar, or must content inspection be specified later? | OPEN | — |
| OD-09 | May notes, briefs, JSON strings, and similar prose remain semantically unrestricted aside from person-domain object keys? | OPEN | — |
| OD-10 | How should already-stored documents be treated? | OPEN | — |
| OD-11 | How should historical JSONB (facts, addresses, audit snapshots) be treated? | OPEN | — |
| OD-12 | Should a future forward-only migration retire stale import-batch CHECK values listing contact / supplier_contact? | OPEN | — |
| OD-13 | Keep dead types/docs (SupContact, guestName shims, SupplierContactRecord JSON, manifest_entry type) or later clean them? | OPEN | — |
| OD-14 | Retain retired supplier-contacts.csv and related docs as historical samples? | OPEN | — |
| OD-15 | Does the RoPA processing-activity catalogue remain in intended scope as a non-identifying register? | OPEN | — |
| OD-16 | Required field-cache lifetime and whether device id/salt must be cleared on logout? | OPEN | — |

---

## 5. OD-01 through OD-16

Option meanings below rest on H-142’s stated technical/commercial consequences. No option is labelled best, recommended, preferred, or correct.

### OD-01

**Decision ID:** OD-01  
**Exact question:** May approved commercial CSV cells contain unstructured personal data, or must they be further constrained later?  
**Exact options:** (a) accept residual capability; (b) later process/policy only; (c) later technical constraint; (d) later stop storing csv_content — listed without preference  
**Findings affected:** H142-IMP-05; remainder of H142-IMP-09 (person types already fail-closed)

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | no code |
| (b) | no code |
| (c) | possible validation/schema |
| (d) | schema/API change |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(a)(b) no code; (c) possible validation/schema; (d) schema/API change. No change authorized now.

COMMERCIAL CONSEQUENCE:
(a) residual capability remains; (c)(d) may affect organization/supplier import usability.

MIGRATION:
Only if Owner later chooses a schema option.

UAT:
Yes for operator import, if later changed.

PRODUCTION:
Yes for Production import, if later used.
```

**Current status:** OPEN

---

### OD-02

**Decision ID:** OD-02  
**Exact question:** How should historical import batches (if any exist in a catalog) be treated?  
**Exact options:** (a) leave in place; (b) Owner-authorized review extract; (c) later treatment migration — no preference  
**Findings affected:** H142-IMP-06

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | none |
| (b) | read-only evidence |
| (c) | schema/data change if later authorized |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(a) none; (b) read-only evidence; (c) schema/data change if later authorized. No treatment authorized now.

COMMERCIAL CONSEQUENCE:
Unknown contents until inspected.

MIGRATION:
Only if (c).

UAT:
Yes if UAT DB may contain leftovers.

PRODUCTION:
Yes if any Production catalog is later authorized.
```

**Current status:** OPEN

---

### OD-03

**Decision ID:** OD-03  
**Exact question:** How should historical outbox/allowlist/SES rows be treated?  
**Exact options:** (a) leave; (b) review extract; (c) later treatment — no preference  
**Findings affected:** H142-NTF-04 (historical rows)

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | leave rows |
| (b) | review extract |
| (c) | later treatment; may need later migration |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(c) may need later migration. No rewrite/delete authorized now.

COMMERCIAL CONSEQUENCE:
Bodies/recipients may identify people if rows exist.

MIGRATION:
Only if Owner later chooses structural treatment.

UAT:
Yes.

PRODUCTION:
Yes.
```

**Current status:** OPEN

---

### OD-04

**Decision ID:** OD-04  
**Exact question:** Who may be a notification recipient (individual address, shared mailbox, role, principal id only)?  
**Exact options:** (a) leave current allowlist/principal.email; (b) later policy restriction; (c) later redesign; (d) disable outbound email until specified — no preference  
**Findings affected:** H142-NTF-01; H142-NTF-06 (exports / inbox interpolation)

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | none |
| (b) | API/schema possible |
| (c) | API/schema possible |
| (d) | feature off |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(a) none; (b)(c) API/schema possible; (d) feature off. No recipient rule authorized now.

COMMERCIAL CONSEQUENCE:
Operational email vs individual identification.

MIGRATION:
Unknown until option chosen.

UAT:
Yes.

PRODUCTION:
Email provider if Production mail is used.
```

**Current status:** OPEN

---

### OD-05

**Decision ID:** OD-05  
**Exact question:** How long may notification records be kept?  
**Exact options:** (a) unspecified continue; (b) later defined period; (c) later drop fields — no period invented here  
**Findings affected:** H142-NTF-04

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | continue without a period in repository |
| (b) | jobs or schema |
| (c) | jobs or schema; drop fields |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(b)(c) jobs or schema. No retention clock authorized now. No period is invented here.

COMMERCIAL CONSEQUENCE:
Retention vs operational audit of sends.

MIGRATION:
If columns change.

UAT:
Yes.

PRODUCTION:
Yes.
```

**Current status:** OPEN

---

### OD-06

**Decision ID:** OD-06  
**Exact question:** Must email outbox remain part of EOS, or may it later be reduced/removed?  
**Exact options:** (a) keep; (b) later reduce; (c) later remove — no preference  
**Findings affected:** H142-NTF-04 (product scope)

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | keep current product |
| (b) | substantial product change, out of H-142 |
| (c) | substantial product change, out of H-142 |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(b)(c) substantial product change, out of H-142. Removal not authorized now.

COMMERCIAL CONSEQUENCE:
Staff notification workflows.

MIGRATION:
If removed later.

UAT:
Yes.

PRODUCTION:
Yes.
```

**Current status:** OPEN

---

### OD-07

**Decision ID:** OD-07  
**Exact question:** May outbox/template/SES bodies retain message text?  
**Exact options:** (a) keep current persist; (b) later omit bodies; (c) later store ids only — no preference  
**Findings affected:** H142-NTF-04; H142-NTF-06

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | keep current persist |
| (b) | API/schema |
| (c) | API/schema |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(b)(c) API/schema. Dropping body columns not authorized now.

COMMERCIAL CONSEQUENCE:
Debugging vs personal prose in bodies.

MIGRATION:
Possibly later.

UAT:
Yes.

PRODUCTION:
Yes.
```

**Current status:** OPEN

---

### OD-08

**Decision ID:** OD-08  
**Exact question:** Is structural key/filename/MIME control the accepted DocumentStorage bar, or must content inspection be specified later?  
**Exact options:** (a) remain unscanned; (b) later specify inspection; (c) later restrict kinds — no preference, no scanner designed  
**Findings affected:** H142-DOC-01; H142-DOC-11

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | remain unscanned; no scanner designed |
| (b) | new product |
| (c) | policy + possible MIME/kind changes |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(b) new product; (c) policy + possible MIME/kind changes; (a) not a schema requirement. No scanner authorized now.

COMMERCIAL CONSEQUENCE:
Opaque commercial files vs inspection cost.

MIGRATION:
Not for (a).

UAT:
Yes.

PRODUCTION:
Object store if Production.
```

**Current status:** OPEN

---

### OD-09

**Decision ID:** OD-09  
**Exact question:** May notes, briefs, JSON strings, and similar prose remain semantically unrestricted aside from person-domain object keys?  
**Exact options:** (a) accept residual prose; (b) later structure fields; (c) later inspection — no preference  
**Findings affected:** H142-DOC-02; H142-DOC-04; H142-DOC-05; H142-DOC-10; ops-brief part of H142-FC-01

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | accept residual prose |
| (b) | later authorized engineering |
| (c) | later authorized engineering |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(b)(c) later authorized engineering. No semantic ban/scanner authorized now.

COMMERCIAL CONSEQUENCE:
Commercial writing vs residual personal-data capability.

MIGRATION:
If structured replacements.

UAT:
Yes.

PRODUCTION:
Yes.
```

**Current status:** OPEN

---

### OD-10

**Decision ID:** OD-10  
**Exact question:** How should already-stored documents be treated?  
**Exact options:** (a) leave; (b) review; (c) later treatment — no preference  
**Findings affected:** H142-DOC-12 (documents)

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | leave |
| (b) | review |
| (c) | storage/API change if later authorized |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(c) storage/API change if later authorized. No treatment authorized now.

COMMERCIAL CONSEQUENCE:
Unknown file contents.

MIGRATION:
Unknown.

UAT:
Yes.

PRODUCTION:
Yes.
```

**Current status:** OPEN

---

### OD-11

**Decision ID:** OD-11  
**Exact question:** How should historical JSONB (facts, addresses, audit snapshots) be treated?  
**Exact options:** (a) leave; (b) review; (c) later treatment — no preference  
**Findings affected:** H142-DOC-04; H142-DOC-12 (JSONB/audit)  
**H-142 note preserved:** why engineering cannot decide unilaterally: “Same as OD-10”. That is H-142 wording, not a sequential wait.

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | leave |
| (b) | review |
| (c) | possible later migration |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(c) possible later migration. No JSONB treatment authorized now.

COMMERCIAL CONSEQUENCE:
Unknown values.

MIGRATION:
If (c).

UAT:
Yes.

PRODUCTION:
Yes.
```

**Current status:** OPEN

---

### OD-12

**Decision ID:** OD-12  
**Exact question:** Should a future forward-only migration retire stale import-batch CHECK values listing contact / supplier_contact?  
**Exact options:** (a) leave CHECKs; (b) later authorize a migration to tighten CHECKs only; (c) later broader schema cleanup — no preference  
**Findings affected:** H142-IMP-01; H142-IMP-02

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | leave CHECKs |
| (b) | DROP/ADD CHECK; risk if leftover rows use retired tokens |
| (c) | later broader schema cleanup |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(b) DROP/ADD CHECK; risk if leftover rows use retired tokens. Migration 126 is not created and not granted now. Dedicated person-domain create/import paths already fail-closed.

COMMERCIAL CONSEQUENCE:
Catalog hygiene vs no change to current API fail-closed.

MIGRATION:
Yes if (b) or (c) — future authorization condition only.

UAT:
Yes if applied.

PRODUCTION:
Yes if ever applied to Production.
```

**Current status:** OPEN

---

### OD-13

**Decision ID:** OD-13  
**Exact question:** Keep dead types/docs (SupContact, guestName shims, SupplierContactRecord JSON, manifest_entry type) or later clean them?  
**Exact options:** (a) keep; (b) later cleanup increment — no preference  
**Findings affected:** H142-IMP-07; type residue class of H142-NTF-09

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | keep |
| (b) | type/doc edits; not a person API reopen |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(b) type/doc edits; not a person API reopen. Cleanup not authorized now.

COMMERCIAL CONSEQUENCE:
Low if unwired.

MIGRATION:
No for types.

UAT:
If UI types change.

PRODUCTION:
No.
```

**Current status:** OPEN

---

### OD-14

**Decision ID:** OD-14  
**Exact question:** Retain retired supplier-contacts.csv and related docs as historical samples?  
**Exact options:** (a) retain labelled retired; (b) later delete if authorized — no preference; file not deleted in H-142  
**Findings affected:** H142-IMP-04

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | none (retain) |
| (b) | later delete if authorized |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
None for (a). Deletion not authorized now. File was not deleted in H-142.

COMMERCIAL CONSEQUENCE:
Sample contains person-shaped columns as a retired example.

MIGRATION:
No.

UAT:
Operator awareness.

PRODUCTION:
No.
```

**Current status:** OPEN

---

### OD-15

**Decision ID:** OD-15  
**Exact question:** Does the RoPA processing-activity catalogue remain in intended scope as a non-identifying register?  
**Exact options:** (a) keep as now; (b) later change catalogue fields; (c) later remove — no preference  
**Findings affected:** H142-DOC-14

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | keep as now |
| (b) | later API/UI |
| (c) | later API/UI |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
(b)(c) later API/UI. Catalogue change/removal not authorized now.

COMMERCIAL CONSEQUENCE:
GRC catalogue vs residual free-text titles.

MIGRATION:
If fields change.

UAT:
Yes.

PRODUCTION:
If Production GRC is used.
```

**Current status:** OPEN

---

### OD-16

**Decision ID:** OD-16  
**Exact question:** Required field-cache lifetime and whether device id/salt must be cleared on logout?  
**Exact options:** (a) keep current bind+clear blobs; (b) later clear salt; (c) later TTL enforce; (d) later disable cache — no preference  
**Findings affected:** H142-FC-01

| Option | What it would mean technically (H-142) |
| --- | --- |
| (a) | keep current bind+clear blobs |
| (b) | client storage behaviour (clear salt) |
| (c) | client storage behaviour (TTL) |
| (d) | client storage behaviour (disable cache) |

```text
OWNER DECISION:
[OPEN — OWNER DECISION REQUIRED]

SELECTED OPTION:
[NOT YET SELECTED]

ENGINEERING CONSEQUENCE:
Client storage behaviour. Cache redesign not authorized now.

COMMERCIAL CONSEQUENCE:
Offline field ops vs leftover crypto material.

MIGRATION:
No.

UAT:
Yes (browser).

PRODUCTION:
Yes to claim Production cache safety.
```

**Current status:** OPEN

---

## 6. Decision dependencies

H-142 presents sixteen **separate** questions. It does **not** contain a statement of the form “OD-X depends on OD-Y”. **No sequential wait is invented here.**

Shared finding mappings (co-affected findings, not invented order):

```text
OD-01 → H142-IMP-05, H142-IMP-09 remainder → possible later CSV constraint/stop-store → engineering authorization; migration if schema; UAT; Production import
OD-02 → H142-IMP-06 → extract/treatment → engineering; migration if (c); external live catalog; UAT; Production catalog
OD-03 → H142-NTF-04 historical rows → extract/treatment → engineering; migration if structural; UAT; Production
OD-04 → H142-NTF-01, H142-NTF-06 → recipient rule / possible disable email → engineering; migration unknown; external email provider; UAT; Production
OD-05 → H142-NTF-04 → retention job/schema → engineering; migration if columns; UAT; Production
OD-06 → H142-NTF-04 product → keep/reduce/remove outbox → engineering; migration if removed; UAT; Production
OD-07 → H142-NTF-04, H142-NTF-06 → body persist/omit → engineering; migration possibly; UAT; Production
OD-08 → H142-DOC-01, H142-DOC-11 → remain unscanned / inspect / restrict kinds → engineering; external object store; UAT; Production
OD-09 → H142-DOC-02, DOC-04, DOC-05, DOC-10; brief part of FC-01 → prose policy → engineering; migration if structured; UAT; Production
OD-10 → H142-DOC-12 documents → leave/review/treatment → engineering; migration unknown; external catalogs; UAT; Production
OD-11 → H142-DOC-04, DOC-12 JSONB → leave/review/treatment → engineering; migration if (c); UAT; Production
OD-12 → H142-IMP-01, IMP-02 → leave CHECKs or later migration → migration authorization; UAT if applied; Production if migrated
OD-13 → H142-IMP-07; NTF-09 types → keep or cleanup types → engineering; UAT if UI types change
OD-14 → H142-IMP-04 → retain or later delete sample → engineering (docs only)
OD-15 → H142-DOC-14 → keep/change/remove catalogue → engineering; migration if fields; UAT; Production GRC
OD-16 → H142-FC-01 → cache lifetime/salt/TTL/disable → engineering; UAT browser; Production cache-safety claim
```

H-142 findings **without** an OD to keep current closed/absent behaviour: H142-IMP-08 (resolved parsers), H142-FC-07 (no IndexedDB/SW), H142-IMP-09 keep fail-closed, H142-NTF-09 keep no WhatsApp adapter, H142-LOG-03 (no numbered OD). Those are not Owner selections on this worksheet.

**Independence:** Each OD-01–OD-16 can be decided without waiting for another OD, because H-142 listed them as distinct questions. H-142’s phrase for OD-11 (“Same as OD-10”) describes why engineering cannot decide unilaterally; it is **not** recorded here as “OD-11 depends on OD-10”.

H-144 does **not** authorize the gates listed above.

---

## 7. Migration implications (collected)

```text
MIGRATION 126:
NOT CREATED

AUTHORIZATION:
NOT GRANTED

CURRENT APPLICATION:
FAIL-CLOSED FOR DEDICATED RETIRED PERSON-DOMAIN PATHS

HISTORICAL CHECK CLEANUP:
POTENTIALLY REQUIRES FUTURE MIGRATION
```

Possible later migration **only if** the Owner later selects a schema-bearing option (notably OD-12 (b)/(c); also OD-01 (c)/(d), OD-02 (c), OD-03 (c), OD-05 (c), OD-06 (c), OD-07 (b)/(c), OD-11 (c), and similar H-142 “if schema” notes). That is visibility, not authorization.

---

## 8. UAT implications (collected)

```text
UAT: NOT STARTED
```

H-142 marks UAT as relevant for most ODs if later implemented (operator import, live leftovers, notifications, documents, browser cache, GRC). H-144 does not start UAT and does not treat this worksheet as UAT evidence.

---

## 9. Production implications (collected)

```text
PRODUCTION: NOT AUTHORIZED / NOT READY
```

H-142 marks Production evidence for import, catalogs, email provider, object store, log/cache-safety claims, and any Production migrate. H-144 does not authorize Production.

---

## 10. Commercial implications (collected)

While decisions remain OPEN, this worksheet does **not** authorize removal of organizations, opportunities, RFPs, programmes, suppliers, rates, costing, proposals, Rate Identity, commercial documents, commercial notes, notifications, or field operations.

H-142 notes possible later commercial effects: organization/supplier import usability (OD-01); unknown historical contents (OD-02, OD-03, OD-10, OD-11); staff notification workflows (OD-04–OD-07); opaque files vs inspection (OD-08); commercial writing vs residual prose capability (OD-09); catalog hygiene vs fail-closed (OD-12); low impact if types unwired (OD-13); retired sample (OD-14); GRC catalogue (OD-15); offline field ops vs device salt (OD-16).

Existing fail-closed person-domain APIs remain as previously accepted. They are not converted into a policy selection on this sheet.

---

## 11. Explicit statement that no decision is preselected

```text
SELECTED OPTION for OD-01 through OD-16: [NOT YET SELECTED]
OWNER DECISION for OD-01 through OD-16: [OPEN — OWNER DECISION REQUIRED]
```

The presence of current software behaviour, H-131’s EOS-not-personal-data-SoR boundary, or H-139–H-143 PASS WITH FINDINGS does **not** select option (a) or any other option.

---

## 12. Signature / confirmation section

Do **not** fill Date or Decisions in this increment.

```text
I confirm that the selections recorded for OD-01 through OD-16 represent the Owner's decisions for the EOS privacy/remediation boundary.

Owner:
Patrick Daniel Makundi

Date:
[TO BE COMPLETED]

Decisions:
[TO BE COMPLETED]
```

---

## 13. Next-step rules after decisions are supplied

After the Owner records selections in an authorised subsequent artefact:

1. Record each as `DECIDED — OWNER CONFIRMED` with the selected H-142 option letter (or a later Owner-stated option explicitly labelled as such).
2. A later governance increment must write the resulting **authorization boundary**, including which commercial capabilities remain required.
3. If any selected option needs schema change, a **separate** migration design/review is required **before** any `126_` file is created.
4. Implementation, UAT, and Production remain independently gated and are **not** started by signing this worksheet.
5. PDPC, EI-01, ADR-0006, and DP-0006 remain OPEN until their own evidence processes close them.

---

## 14. Disposition

```text
H-144 STATUS: COMPLETE
FINAL DISPOSITION: PASS WITH FINDINGS
OWNER DECISIONS: 16 OPEN
IMPLEMENTATION: NOT AUTHORIZED
```

This worksheet prepares the decision interface; it does not make the decisions.

```text
STOPPED AFTER H-144: YES
COMMIT: NONE
PUSH: NONE
LIVE MIGRATION: NONE
```
