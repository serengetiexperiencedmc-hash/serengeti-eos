# H-145 — POA Owner Decision Capture + Controlled Authorization

> **GOVERNANCE DECISION AND AUTHORIZATION ACTION.** Dev/Test only. Not unrestricted EOS development. Not UAT. Not Production. Not a PDPC, exemption, or legal conclusion.  
> H-142, H-143, H-144 completion, and the H-144 worksheet were **not** overwritten.  
> A prior H-145 increment on this same path recorded POA selections and applied the **minimum** OD-09 structural-key extension. **This increment expands the same file in place** to the capture/authorization field model required by this grant (stable OD selections retained).

**Date:** 2026-09-22.  
**Authority exercised:** Patrick Makundi / Commercial Director, under Owner-granted POA, deciding on behalf of Serengeti Experience DMC in the Company’s best interests, specifically to resolve H-142 Owner Decisions OD-01 through OD-16.

```text
OWNER DECISION CONFIRMED UNDER POA

Decision authority:
Patrick Makundi / Company Owner authority under POA

Decision basis:
Company best interests, commercial continuity,
privacy-by-design, data minimisation,
structural prevention of prohibited personal-data
reintroduction, minimum necessary change,
and preservation of historical evidence.
```

```text
COMMIT: NONE
PUSH: NONE
LIVE MIGRATION: NONE
UAT: NOT STARTED
PRODUCTION: NOT AUTHORIZED / NOT READY
PDPC: OPEN
EI-01: OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006: OPEN
DP-0006: OPEN
STOPPED AFTER H-145: YES
```

```text
EOS DATA BOUNDARY:
No personal-data system of record.

SEDMC REGULATORY STATUS:
Separate governance/legal question.
```

This action does **not** authorize: C11+ commercial capabilities; F2-I12; Path D; mailbox / Gmail / WhatsApp / Excel ingestion; FX providers; KPI history; revenue/profit reconstruction; booking commercial-facts expansion; new thresholds; 250k/20% rule adoption; production deployment; or Production infrastructure selection.

---

## A. Baseline

**Commands executed:**

```text
git rev-parse HEAD
git branch --show-current
git diff --cached --quiet
git status --porcelain
```

**Actual state at start of this capture increment:**

```text
HEAD: 75ee4c3aabdcf5974f6a589f8c36a0b98727edba
BRANCH: master
INDEX: empty
H-144: COMPLETE (register coverage + intake worksheet; worksheet selections remain blank by design)
PORCELAIN BEFORE this capture increment: 629
PORCELAIN expected at first H-145 start (H-144 complete): 626
OWNER DECISIONS (H-142 / H-144 worksheet): OPEN as source artefacts
OWNER DECISIONS (this H-145 file): CONFIRMED UNDER POA 16/16
IMPLEMENTATION AUTHORIZATION: Dev/Test, OD-09 leftover key-contract only (already applied in the first H-145 increment; not broadened here)
MIGRATION 126: NOT CREATED / NOT AUTHORIZED
```

Dirty worktree preserved. No reset, clean, stash, revert, discard, overwrite of unrelated work. No commit. No push. No live migration. No Production action.

**Sources read in order (not rewritten):**

| Role | Path |
| --- | --- |
| Primary authority | `docs/governance/h-142-residual-privacy-findings-owner-decision-register.md` |
| Intake worksheet | `docs/governance/h-144-owner-decision-worksheet.md` |
| Prior reconciliation | `docs/governance/h-143-owner-decision-gate-remediation-authorization.md` |
| Register coverage completion | `docs/governance/h-144-owner-decision-register-completion.md` |

H-142 remains authoritative for questions and options. The H-144 worksheet remains the intake artifact and was **not** filled or overwritten. H-145 is the POA confirmation record.

---

## B. Authority

The sixteen Owner decisions are resolved under the Owner’s POA, exercised by Patrick Makundi / Commercial Director for Serengeti Experience DMC.

H-142 stated that engineering could not choose these options unilaterally. That constraint applied to H-142, H-143, and H-144. H-145 is the authorized POA selection and Dev/Test authorization boundary.

No option was invented. No H-142 wording was altered. Existence of an option in H-142 is not treated as a prior Owner decision.

---

## C. OD-01 through OD-16

Every row below is:

```text
OWNER DECISION CONFIRMED UNDER POA
```

Rejected alternatives are listed in **Exact H-142 Options** and are **not** selected.

| ID | Exact H-142 Question | Exact H-142 Options | Selected Option | Decision Rationale | Findings Affected | Implementation Consequence |
| -- | -------------------- | ------------------- | --------------- | ------------------ | ----------------- | -------------------------- |
| OD-01 | May approved commercial CSV cells contain unstructured personal data, or must they be further constrained later? | (a) accept residual capability; (b) later process/policy only; (c) later technical constraint; (d) later stop storing csv_content — listed without preference | (a) accept residual capability | Person-entity imports already fail-closed (`contact` / `supplier_contact`). Header allowlists already reject person-domain column names. (d) would impair commercial organization/supplier import. (c) as a cell scanner would claim inspection that does not exist. Residual commercial-cell capability is documented honestly. Person-domain imports must not be recreated. | H142-IMP-05; H142-IMP-09 (keep fail-closed) | No new code. No scanner. No stop-storing `csv_content`. ALREADY SATISFIED. |
| OD-02 | How should historical import batches (if any exist in a catalog) be treated? | (a) leave in place; (b) Owner-authorized review extract; (c) later treatment migration — no preference | (a) leave in place | Historical evidence is retained. New person-type create/re-ingestion remains rejected. Deletion is not necessary for the approved contract. (c) would be irreversible data treatment without live-catalog evidence. | H142-IMP-06 | None. Do not delete. Do not invent a treatment migration. |
| OD-03 | How should historical outbox/allowlist/SES rows be treated? | (a) leave; (b) review extract; (c) later treatment — no preference | (a) leave | Same historical-evidence rule. Notification product remains. Bodies/recipients in leftover rows are residual exposure, not an authorization to build a person directory. | H142-NTF-04 (historical) | None. Do not delete historical outbox/allowlist/SES rows. |
| OD-04 | Who may be a notification recipient (individual address, shared mailbox, role, principal id only)? | (a) leave current allowlist/principal.email; (b) later policy restriction; (c) later redesign; (d) disable outbound email until specified — no preference | (a) leave current allowlist/principal.email | Preserves operational email and technical authentication identity. Does not invent an organizational-mailbox rule or a personal-recipient directory. (d) would remove a commercial/ops capability without a replacement. (c) is a redesign not required to keep person-domain APIs fail-closed. | H142-NTF-01; H142-NTF-06 | None. Keep H-141 allowlist / `principal.email`. Do not disable email. Do not create a recipient directory. |
| OD-05 | How long may notification records be kept? | (a) unspecified continue; (b) later defined period; (c) later drop fields — no period invented here | (a) unspecified continue | Inventing a retention period is not authorized by H-142 and is not required to prevent person-record creation. (c) would drop operational send evidence. | H142-NTF-04 | None. Do not invent a retention job or drop columns. |
| OD-06 | Must email outbox remain part of EOS, or may it later be reduced/removed? | (a) keep; (b) later reduce; (c) later remove — no preference | (a) keep | Outbox is required commercial/ops functionality. (b)/(c) would weaken commercial continuity. | H142-NTF-04 | None. Keep outbox. |
| OD-07 | May outbox/template/SES bodies retain message text? | (a) keep current persist; (b) later omit bodies; (c) later store ids only — no preference | (a) keep current persist | Current persist supports send audit/debug. HTTP already omits `bodyText`. Person-domain **keys** on allowlist/template remain rejected. (b)/(c) are product/schema changes not required now. Prose in bodies is a documented limitation, not claimed scanned. | H142-NTF-04; H142-NTF-06 | None. Keep persist. Do not weaken HTTP omit or key contract. |
| OD-08 | Is structural key/filename/MIME control the accepted DocumentStorage bar, or must content inspection be specified later? | (a) remain unscanned; (b) later specify inspection; (c) later restrict kinds — no preference, no scanner designed | (a) remain unscanned | Commercial files remain usable. Identity-document-labelled filenames remain rejected. (b) would invent DLP/OCR. (c) would risk restricting legitimate commercial kinds. Bytes are **not** claimed privacy-scanned. | H142-DOC-01; H142-DOC-11 | None. Keep H-140 structural bar. No scanner. |
| OD-09 | May notes, briefs, JSON strings, and similar prose remain semantically unrestricted aside from person-domain object keys? | (a) accept residual prose; (b) later structure fields; (c) later inspection — no preference | (a) accept residual prose | Commercial notes remain usable. Semantic inspection is not claimed. The question itself excepts person-domain object keys: those keys must remain rejected. (b) would redesign fields; (c) would invent a scanner. Leftover writes that never received the existing key contract (H142-DOC-10) are authorized to receive that **same** structural control only — not field restructuring. | H142-DOC-02; H142-DOC-04; H142-DOC-05; H142-DOC-10 | Dev/Test API only: apply existing `rejectPersonDomainContent` to leftover writes named in H142-DOC-10. No schema. No UI. No prose scanner. H-140 covered paths not rewritten. |
| OD-10 | How should already-stored documents be treated? | (a) leave; (b) review; (c) later treatment — no preference | (a) leave | Do not destroy historical DocumentStorage. Residual unknown file contents documented. New uploads remain structurally gated (OD-08). | H142-DOC-12 (documents); H142-DOC-01 historical | None. No deletion. |
| OD-11 | How should historical JSONB (facts, addresses, audit snapshots) be treated? | (a) leave; (b) review; (c) later treatment — no preference | (a) leave | Same as OD-10 for historical JSONB. New writes remain key-gated. (c) is not required and risks evidence loss. | H142-DOC-04; H142-DOC-12 | None for historical rows. |
| OD-12 | Should a future forward-only migration retire stale import-batch CHECK values listing contact / supplier_contact? | (a) leave CHECKs; (b) later authorize a migration to tighten CHECKs only; (c) later broader schema cleanup — no preference | (a) leave CHECKs | API already fail-closed. Person tables dropped in 125. CHECK tokens are catalog residue, not an executable person-data path. (b)/(c) are not necessary for the approved contract and are not additive-safe without leftover-row evidence. | H142-IMP-01; H142-IMP-02 | **MIGRATION 126: NOT REQUIRED FOR CURRENT AUTHORIZED REMEDIATION.** Do not create. Do not apply live. |
| OD-13 | Keep dead types/docs (SupContact, guestName shims, SupplierContactRecord JSON, manifest_entry type) or later clean them? | (a) keep; (b) later cleanup increment — no preference | (a) keep | Hygiene deletion is not required and would destroy historical/compatibility evidence. Types are not a write path and must not be rewired. | H142-IMP-07 | None. Keep types/docs. Do not reopen person APIs. |
| OD-14 | Retain retired supplier-contacts.csv and related docs as historical samples? | (a) retain labelled retired; (b) later delete if authorized — no preference; file not deleted in H-142 | (a) retain labelled retired | Sample remains labelled RETIRED and unwired. Deletion is unnecessary. Submitting `entityType=supplier_contact` remains rejected. | H142-IMP-04 | None. Do not delete the sample. |
| OD-15 | Does the RoPA processing-activity catalogue remain in intended scope as a non-identifying register? | (a) keep as now; (b) later change catalogue fields; (c) later remove — no preference | (a) keep as now | Non-identifying GRC catalogue is in commercial/governance scope. DSR/consent **identity** records remain outside the EOS personal-data boundary. (c) would remove a legitimate register. | H142-DOC-14 | None. Keep catalogue as now. |
| OD-16 | Required field-cache lifetime and whether device id/salt must be cleared on logout? | (a) keep current bind+clear blobs; (b) later clear salt; (c) later TTL enforce; (d) later disable cache — no preference | (a) keep current bind+clear blobs | Preserves H-141 principal-bound cache and logout/account-switch blob clear. (d) would impair field ops. (b)/(c) invent device/TTL policy not required now. No HR/profile subsystem. No IdP. | H142-FC-01; H142-FC-07 | None. Do not rewrite H-141. |

---

## C.1 Second-pass audit

### Consistency

No selected option contradicts another. Historical leave (OD-02, OD-03, OD-10, OD-11) is consistent with OD-12 leave CHECKs and OD-13/OD-14 keep residue. OD-09 accepts residual **prose** while requiring person-domain **keys** to remain rejected; that is the H-142 question, not a silent (b) field redesign. OD-01 accepts residual **cells** while person-entity CSV remains fail-closed (OD-01 does not reopen IMP-09). OD-04/OD-16 keep technical identity without authorizing a personal-data profile.

### Commercial continuity

No selected option removes RFP, opportunity, programme, supplier company, rate, costing, proposal, Rate Identity, or commercial booking. OD-06 keeps outbox. OD-08 keeps commercial document kinds. OD-01 (a) keeps commercial `csv_content`. OD-16 (a) keeps field cache.

### Privacy boundary

No selected option authorizes reintroduction of CRM individual contacts, HR, supplier individuals, guest-level identity, DSR identity, consent identity, or unrestricted personal CSV imports. Fail-closed person-domain APIs remain. OD-14 retains a labelled retired sample, not a live import path.

### Historical evidence

No selected option requires deletion of historical rows, samples, types, or governance records. H-139–H-144 files are preserved. The H-144 worksheet is not overwritten.

### Migration

OD-12 (a) does **not** require migration 126. No other OD requires it.

---

## D. Findings mapping (all 23)

No finding is dropped.

| Finding | Bucket after H-145 | Notes |
| --- | --- | --- |
| H142-IMP-01 | Controlled but remaining open | OD-12 (a) leaves CHECK. API fail-closed. |
| H142-IMP-02 | Controlled but remaining open | Same class as IMP-01. |
| H142-IMP-04 | Controlled but remaining open | OD-14 (a) retain labelled retired sample. |
| H142-IMP-05 | Deferred | OD-01 (a) residual commercial CSV cells; not scanned. |
| H142-IMP-06 | Deferred | OD-02 (a) leave historical batches; live catalog unknown. |
| H142-IMP-07 | Controlled but remaining open | OD-13 (a) keep dead types. |
| H142-IMP-08 | Closed (already Resolved; confirmed) | Kernel parsers remain absent. |
| H142-IMP-09 | Controlled but remaining open | Person import create/validate/execute remain fail-closed. |
| H142-DOC-01 | Deferred | OD-08 (a) remain unscanned. |
| H142-DOC-02 | Controlled but remaining open | OD-09 (a): keys rejected; prose unrestricted. |
| H142-DOC-04 | Controlled but remaining open | Keys on JSONB writes; values unrestricted; historical left (OD-11 a). |
| H142-DOC-05 | Controlled but remaining open | AI draft create key-gated; generated prose unscanned. |
| H142-DOC-10 | Closed by authorized Dev/Test key-contract extension | Leftover writes now use the existing structural key helper. Prose residual remains under DOC-02/05. |
| H142-DOC-11 | Controlled but remaining open | Filename/MIME structural bar (OD-08 a). |
| H142-DOC-12 | Deferred | OD-10/OD-11 (a) leave historical documents/JSONB. |
| H142-DOC-14 | Controlled but remaining open | OD-15 (a) keep RoPA catalogue. |
| H142-NTF-01 | Controlled but remaining open | OD-04 (a) leave allowlist/`principal.email`. |
| H142-NTF-04 | Controlled but remaining open | OD-03/05/06/07 (a): keep outbox, unspecified retention, persist bodies, leave historical. |
| H142-NTF-06 | Deferred | Inbox interpolation / exports / SES payload remain string surfaces. |
| H142-NTF-09 | Controlled but remaining open | No WhatsApp dispatch. Type residue kept (OD-13 a). |
| H142-LOG-03 | Controlled but remaining open | H-141 redaction preserved. Production logs not evidenced. |
| H142-FC-07 | Closed (already Resolved; confirmed) | IndexedDB / service-worker caches still not present. |
| H142-FC-01 | Controlled but remaining open | OD-16 (a) keep bind+clear. Browser UAT not started. |

```text
23 total
Closed: 3
Controlled but remaining open: 15
Deferred: 5
```

---

## E. Implementation authorization (Dev/Test only)

H-145 authorizes implementation **only** where a selected decision directly requires it. No new commercial capability is authorized by implication. No Production implementation. No UAT.

| OD | Required change | Domain | Schema? | API? | UI? | Tests? |
| -- | --------------- | ------ | ------- | ---- | --- | ------ |
| OD-01 | None (ALREADY SATISFIED; residual cells documented) | Import | No | No | No | Existing import regression only |
| OD-02 | None | Historical import batches | No | No | No | No |
| OD-03 | None | Historical outbox | No | No | No | No |
| OD-04 | None (keep allowlist/`principal.email`) | Notifications / auth | No | No | No | Existing H-141 |
| OD-05 | None | Notification retention | No | No | No | No |
| OD-06 | None (keep outbox) | Notifications | No | No | No | Existing H-141 |
| OD-07 | None (keep persist; keep HTTP omit) | Notifications | No | No | No | Existing H-141 |
| OD-08 | None (remain unscanned) | DocumentStorage | No | No | No | Existing H-140 |
| OD-09 | Apply existing `rejectPersonDomainContent` to leftover writes only (activity, task, AI draft create, proposal generate, costing sheet/line, supplier create/update, supplier content-block, programme item patch). Do not rewrite H-140 covered paths. Do not inspect prose. | CRM / AI / proposal / costing / supplier / programme | No | Yes (Dev/Test) | No | Yes (targeted) |
| OD-10 | None | Historical documents | No | No | No | No |
| OD-11 | None | Historical JSONB | No | No | No | Existing H-140 keys on new writes |
| OD-12 | None — do not create migration 126 | PG CHECK residue | No | No | No | Assert 126 absent |
| OD-13 | None | Compatibility types | No | No | No | Existing H-139 residual |
| OD-14 | None | Retired sample CSV | No | No | No | Existing H-139 residual |
| OD-15 | None | RoPA catalogue | No | No | No | Prior H-138 evidence |
| OD-16 | None (keep bind+clear; do not rewrite) | Field cache | No | No | No | Existing H-141 |

**Not authorized by this table:** C11+; F2-I12; Path D; mailbox/Gmail/WhatsApp/Excel ingestion; FX providers; KPI history; revenue/profit reconstruction; booking commercial-facts expansion; new thresholds; 250k/20% rule; Production deploy; Production infrastructure.

### E.1 Application files already changed under the first H-145 increment (OD-09 only)

This capture increment does **not** add further application files.

| File | Why (first increment; retained) |
| --- | --- |
| `apps/api/src/crm/activity.ts` | OD-09 leftover key reject on create/update |
| `apps/api/src/crm/task.ts` | OD-09 leftover key reject on create/update |
| `apps/api/src/ai/drafts.ts` | OD-09 leftover key reject on `createAiDraft` |
| `apps/api/src/proposal/proposal.ts` | OD-09 leftover key reject on `generateProposal` |
| `apps/api/src/costing/sheet.ts` | OD-09 leftover key reject on cost sheet/line |
| `apps/api/src/supplier/supplier.ts` | OD-09 leftover key reject on company create/update |
| `apps/api/src/supplier/content-blocks.ts` | OD-09 leftover key reject on content-block write |
| `apps/api/src/programme/programme.ts` | OD-09 leftover key reject on `patchProgrammeItem` |
| `apps/api/src/h145-owner-authorized-structural-keys.test.ts` | Targeted Dev/Test evidence |
| `docs/governance/h-145-owner-decision-authorization.md` | This record (expanded in place) |

H-140 and H-141 implementations were **not** rewritten (**ALREADY SATISFIED**).

---

## F. Migration 126

OD-12 selected **(a) leave CHECKs**.

1. Do selected OD-01–OD-16 require it? **No.**
2. Does current schema residue create a meaningful executable person-data contradiction? **No** for the API (fail-closed; tables dropped in 125). CHECK text is catalog hygiene.
3. Is the migration necessary to enforce the approved contract? **No.**
4. Can it be additive and safe without leftover-row evidence? **Not established.**
5. Would it destroy historical evidence? **Risk if leftover rows used retired tokens.**

```text
MIGRATION 126:
NOT REQUIRED FOR CURRENT AUTHORIZED REMEDIATION
NOT CREATED
LIVE MIGRATION: NOT AUTHORIZED
Migration 125: unmodified
```

---

## G. Validation

This capture increment added **no** further application/schema change. Targeted Dev/Test evidence from the first H-145 increment remains:

Type checks:

```text
npm run typecheck -w @sedmc/web     PASS
npm run typecheck -w @sedmc/api     PASS
npm run typecheck -w @sedmc/kernel  PASS
npm run typecheck -w @sedmc/db      PASS
```

Targeted vitest (`apps/api`): 12 files / 69 tests / all passed (`h145`, `h140`, `h139` residual, `h139` import, `h141`, `c1.accounts-notes-tasks`, `c4.import`, `c2.pipeline`, `c3.rfp`, `c5.programme`, `c6.costing`, `c8.proposal`).

```text
Full suite: NOT RUN
UAT: NOT STARTED
COMMERCIAL REGRESSION: PASS (targeted files above)
Booking / Rate Identity dedicated suites: NOT RUN (not modified)
```

---

## H. Remaining gates

```text
UAT:
NOT STARTED unless separately authorized

PRODUCTION:
NOT AUTHORIZED / NOT READY

PDPC:
OPEN unless independently evidenced

EI-01:
OPEN / REQUIRES OWNER EVIDENCE REVIEW

ADR-0006:
OPEN

DP-0006:
OPEN
```

`productionReady` remains false. SoR remains Office / Excel / mail / WhatsApp / phone.

---

## I. Stop

Stop after H-145.

```text
COMMIT: NONE
PUSH: NONE
LIVE MIGRATION: NONE
PRODUCTION INFRASTRUCTURE: UNTOUCHED
STOPPED AFTER H-145: YES
```

Do not start H-146. Do not convert this authorization into the broader Commercial Department OS roadmap.
