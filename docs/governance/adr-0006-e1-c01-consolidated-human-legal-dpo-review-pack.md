# E1-C01 Consolidated Human Legal / DPO Review Evidence Pack

> **Primary navigation document for the qualified human reviewer.**  
> **Does not replace the formal attestation package.**

> This document is a consolidated evidence-navigation and review-support pack. It is not a legal opinion, DPO attestation, regulatory approval, or Production authorization. Formal legal/privacy determinations must be recorded only by the qualified reviewer in the authoritative attestation package.

**Authoritative destination for formal determinations:**  
[`docs/governance/adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md)

> **`LEGAL COUNSEL DETERMINATION: COMPLETED — THOMAS NGULUMA — 15 SEPTEMBER 2026`**  
> **`LEGAL COUNSEL ATTESTATION: COMPLETED — A.T.N`**  
> **`DPO DETERMINATION: NOT ESTABLISHED BY THIS ATTESTATION`**  
> **`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`Production = NOT AUTHORIZED`**  
> **`UAT = NOT AUTHORIZED`**

Related companions (not this pack; not attestation):

| Companion | Role |
| --- | --- |
| [`adr-0006-e1-c01-human-legal-dpo-review-routing.md`](adr-0006-e1-c01-human-legal-dpo-review-routing.md) | Question IDs RQ-E*, external-request list XE-*, blank template |
| [`adr-0006-e1-c01-human-legal-dpo-review-pack.md`](adr-0006-e1-c01-human-legal-dpo-review-pack.md) | Earlier review companion / authority checklist |
| [`adr-0006-e1-c01-phase1-internal-evidence-audit.md`](adr-0006-e1-c01-phase1-internal-evidence-audit.md) | Read-only Phase 1 audit: **PASS WITH NON-BLOCKING OBSERVATIONS** |

AI counsel files are **AI COUNSEL ANALYSIS** only — not signed opinions, external counsel opinions, DPO determinations, or regulator decisions:

- [`adr-0006-e1-c01-counsel-style-legal-analysis.md`](adr-0006-e1-c01-counsel-style-legal-analysis.md)
- [`adr-0006-e1-c01-l01-l17-counsel-review.md`](adr-0006-e1-c01-l01-l17-counsel-review.md)
- [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) — proposed LA-01–LA-17 / L-01–L-17 counsel-style determinations + EA-01–EA-10 official sources; **not** human attestation

Counsel-review path in use: `adr-0006-e1-c01-l01-l17-counsel-review.md`. Filename `adr-0006-e1-c01-counsel-review.md` **does not exist**.

---

## 1. Executive review summary

### 1.1 Established internal facts

These are repository-supported **FACTS** or documented **gaps**, not legal conclusions.

| Fact | Where |
| --- | --- |
| SEDMC has recorded a **Tanzania-based DMC business position**; no registry extract is in the repository | E-01; company LA-01 |
| Dev seed `legalName: "Serengeti Experience DMC Ltd"` / Arusha `ARU` is **not** incorporation evidence | `apps/api/src/store.ts`; E-01 |
| EOS Dev/Test models cover CRM orgs/contacts, opportunities, RFPs, programmes (days/items), costing, approvals, commercial documents, suppliers/hotels/contracts, principals/credentials/sessions, audit events, HR certification register, privacy **register** capability (P1/P2/P3) | E-04 |
| Named delegates, passport, national ID, date of birth, health/accessibility, biometrics, and payment-card stores are **not** currently structured EOS processing (`pax_count` is an integer) | E-04; event forbidden keys |
| Commercial **document bytes** are **UNKNOWN** (Dev `LocalFsDocumentStorage`; Production object store **NOT SELECTED**) | E-04 P-DOC |
| Schema **can** store organisation/contact `country` and destination **text**; there is **no** Production data-subject census | E-05 |
| Target markets are recorded as company lists, not actual jurisdictions of data subjects | E-05; E-18 |
| Internal labels exist: architecture Public–Highly Restricted; company Restricted / Restricted+ | E-16 |
| Dev/Test: local/in-memory and Gate-B disposable PostgreSQL; Dev local password IdP; PostgreSQL is the **intended** durable SoR | E-05 Layer D; ADR-0006 governance |
| Production provider, region, backup, DR, IdP, email, monitoring, CDN/WAF, KMS, object storage: **NOT SELECTED** | Evidence register E-19–E-28 |
| P1 RoPA/DSR is a Dev/Test **register capability**, not a completed Production RoPA; software role key `dpo` ≠ DPO appointment | `092_p1_privacy_ropa_dsr.sql`; P1 authorization |
| Formal attestation attestor/determination fields: Legal Counsel **THOMAS NGULUMA** recorded 15TH SEPTEMBER 2026, A.T.N; DPO **NOT ESTABLISHED** | Attestation package |
| Phase 1 audit: **PASS WITH NON-BLOCKING OBSERVATIONS** | Phase 1 audit |

### 1.2 Company positions

From [`adr-0006-e1-c01-company-business-position.md`](adr-0006-e1-c01-company-business-position.md). These are **COMPANY POSITION**, not attested law.

- EOS is SEDMC’s internal commercial platform; SEDMC does not intend to transfer determination of EOS **business purposes** to a technology provider (LA-01).
- Tanzania PDPA is intended as a **primary consideration**; foreign hosting is not assumed to avoid TZ requirements (LA-02).
- Kenya is a significant destination/commercial market; destination ≠ automatic applicability (LA-03).
- Europe and the UK are source markets; GDPR/UK GDPR are **not automatic** (LA-04).
- Target markets include South Africa, Europe, Middle East, Canada, USA, Latin America (LA-05).
- **Preferred** Production primary geography: Tanzania, then other Africa, then EU/EEA or other if necessary — **preference ≠ selection** (LA-06).
- Backups/DR preferably in the same approved residency framework, with geographic separation (LA-07/LA-08).
- Warm standby only if justified (LA-09).
- Minimize unnecessary cross-border processing; document what remains (LA-10).
- Do not pre-select a transfer mechanism (LA-11).
- Restricted vs Restricted+ internal handling; Restricted+ preferably in the approved primary framework; Restricted+ failover **not** to an unapproved jurisdiction (LA-12–LA-14).
- Material subprocessors identifiable; **data portability** required as a business requirement (LA-15).
- Foreign support access controlled (LA-16).
- Logs / IdP / CDN / WAF / email in scope for placement review (LA-17).

### 1.3 Design intentions

**DESIGN INTENT** — not implemented Production controls.

- PostgreSQL as durable system of record.
- Soft-delete / later erasure workflow (`deleted_at`); C1 flags CRM retention/lawful basis before UAT with real contacts.
- Production backup/DR, encryption/KMS, WAF, Production IdP (ADR-0012/0013 **OPEN**).
- Crisis-command incident lifecycle (not a tested privacy-breach control).
- Event payloads: forbidden PII keys (enforced in Dev/Test catalogue).

### 1.4 AI counsel analysis

AI-generated counsel-style analysis of LA-01–LA-17 and L-01–L-17 exists. It is **AI COUNSEL ANALYSIS** (category **D**).

Proposed counsel-style determinations are recorded in [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) (LA **17/17**, L **17/17**, including explicit deferrals). Official legal-authority URLs EA-01–EA-10 are **`VERIFIED SOURCE`** (category **A**) and are **not** SEDMC compliance evidence.

It is **not** a signed legal opinion, external counsel opinion, DPO determination, regulator decision, or substitute for attestation §7 / §7A human fields.

Evidence categories must remain separate: **A** legal authority; **B** SEDMC factual; **C** company position; **D** AI counsel-style analysis; **E** human Legal/DPO determination; **F** provider/architecture evidence.

### 1.5 Human determination required (unresolved)

The qualified human must determine (non-exhaustive; see §2–§3):

- Legal entity, registered office, establishment (E-01 / LA-01).
- Tanzania PDPA applicability and PDPC registration trigger (E-02 / LA-02 / L-01).
- DPO / privacy-lead trigger under each applicable law (E-03 / L-02).
- Inventory completeness and personal vs corporate characterisation (E-04 / L-03).
- Legal geography vs target markets (E-05 / LA-05 / L-16).
- Controller / processor / joint-controller roles (E-06 / L-04).
- Transfer **framework rule** and later path-specific mechanisms (E-10 / LA-10–11 / L-07) — **no assumed PDPC permit**.
- Privacy-notice adequacy and lawful basis **where a basis is legally required** (E-12 / L-10).
- Retention/erasure including audit immutability and backups (E-13 / L-11).
- Jurisdiction-specific incident/breach notification mapping (E-15 / L-13).
- Statutory vs internal classification (E-16 / L-14).
- Whether DPIA/equivalent is required (E-17 / L-15).
- TZ / KE / EU/EEA / UK applicability; whether other markets need a deeper memo (E-18 / L-16).
- Placement **rules** for hosting/backup/DR/IdP/email/monitoring/CDN (LA-06–LA-09, LA-14–LA-17) **without selecting architecture**.
- Formal LA-01–LA-17 and L-01–L-17 attestation (E-31, E-32).

Cursor / AI **must not** complete these.

---

## 2. LA-01–LA-17 review table

Determination column (every row): **`LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED`**

Proposed counsel-style determinations were **adopted** by THOMAS NGULUMA, LEGAL COUNSEL, 15TH SEPTEMBER 2026, A.T.N. They do **not** fill a DPO Determination. Architecture-dependent locations remain unset.

Formal destination: attestation package **§7** for that LA ID (Human answer / Determination / Scope / Jurisdictions / Conditions / Supporting evidence / Attestor / Date). Attestor block: **§3**.

| LA ID | Legal question | Internal evidence | AI counsel analysis | Human determination required | External evidence | Architecture dependency | Formal attestation destination |
| --- | --- | --- | --- | --- | --- | --- | --- |
| LA-01 | Who is/are the controller(s) and place(s) of establishment for EOS Production processing? | E-01 placeholder (entity **MISSING**); E-06 factual candidates; company LA-01 **position** (Tanzania-based; SEDMC determines EOS business purposes). Dev seed is **not** proof. | Counsel-style analysis § LA-01 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Registry extract; registered office | Vendor roles later | Attestation §7 LA-01 |
| LA-02 | Does Tanzania PDPA apply, and with what registration/placement consequences? | Company LA-02 **position**; E-18 TZ screening (**no** applicability finding); E-01 establishment **not verified** | Counsel-style analysis § LA-02 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | PDPC registration **if** required; official texts for reviewer to verify | Location facts refine later | §7 LA-02 |
| LA-03 | Does Kenya DPA apply to actual EOS processing (not merely Kenya as destination)? | Company LA-03; E-18 KE; E-04 named delegates **FUTURE**; E-05 Layer C | Counsel-style analysis § LA-03 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Contracts/census if any | Transfers later | §7 LA-03 |
| LA-04 | Does GDPR and/or UK GDPR apply (offering / monitoring / establishment)? | Company LA-04/LA-05 source markets; E-18 EU/UK — offering/monitoring **not evidenced**; no EU/UK establishment evidenced | Counsel-style analysis § LA-04 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Marketing/contract geography if any | Transfers later | §7 LA-04 |
| LA-05 | What is the legal geography of data subjects vs clients vs destinations vs processing? | E-05 A–D; actual census **MISSING**; Layer D **NOT SELECTED** | Counsel-style analysis § LA-05 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Census if required | Layer D **yes** | §7 LA-05 |
| LA-06 | What Production primary-data geography is legally acceptable? (Company **prefers** Tanzania — not selected.) | Company LA-06 preference order; E-19 **NOT SELECTED** | Counsel-style analysis § LA-06 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` — **rules, not selection** | Vendor region evidence when candidates exist | **Yes** for verification of a chosen site | §7 LA-06 |
| LA-07 | What backup geography is legally acceptable? | Company LA-07; E-22 **NOT SELECTED**; Gate-B/C dumps excluded | Counsel-style analysis § LA-07 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` — rules only | Provider backup region docs later | **Yes** | §7 LA-07 |
| LA-08 | What DR/replica geography is legally acceptable? | Company LA-08; E-23 **NOT SELECTED**; lab ≠ DR jurisdiction | Counsel-style analysis § LA-08 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` — rules only | Provider DR docs later | **Yes** | §7 LA-08 |
| LA-09 | If warm standby is used, what geography is acceptable? | Company LA-09; no Production warm standby selected | Counsel-style analysis § LA-09 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` — rules only | Later if in scope | **Yes** if used | §7 LA-09 |
| LA-10 | How must extra-territorial / cross-border processing be treated? | Company LA-10 (minimize unnecessary transfers); E-09 empty | Counsel-style analysis § LA-10 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Path facts after topology | Paths **yes** | §7 LA-10 |
| LA-11 | What transfer mechanism/permit/safeguard is required (no universal tool)? | Company LA-11 (do not pre-select); no SCC/permit/IDTA in repo | Counsel-style analysis § LA-11 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Instrument **if** a path exists and law requires one — **do not assume PDPC permit** | Instruments **yes**; rule **now** | §7 LA-11 |
| LA-12 | How must Restricted personal data be placed and controlled? | E-16; E-04 current classes; company LA-12 | Counsel-style analysis § LA-12 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | File census | Placement **yes** | §7 LA-12 |
| LA-13 | How must Highly Restricted / Restricted+ be placed and controlled? | E-16; passport/health **not** structured; bytes UNKNOWN; company LA-13 | Counsel-style analysis § LA-13 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | File census | Placement **yes** | §7 LA-13 |
| LA-14 | Where may Restricted+ fail over? | Company LA-14: not to an **unapproved** jurisdiction; topology unset | Counsel-style analysis § LA-14 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` — constraint, not a region pick | Later DR offering | **Yes** | §7 LA-14 |
| LA-15 | How must subprocessors be identified, contracted, and exited (portability)? | Company LA-15; E-11 **MISSING**; no providers | Counsel-style analysis § LA-15 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | DPAs, subprocessor lists, location | **Yes** | §7 LA-15 |
| LA-16 | What controls apply to foreign admin/support access? | Company LA-16; E-29 countries unknown | Counsel-style analysis § LA-16 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` (standard now; countries later) | Vendor support geography | Countries **yes** | §7 LA-16 |
| LA-17 | How must logs, IdP, CDN/WAF, email, monitoring be placed? | Company LA-17; E-24–E-28 **NOT SELECTED**; ADR-0012/0013 OPEN | Counsel-style analysis § LA-17 | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` — rules only | Provider location docs later | **Yes** | §7 LA-17 |

---

## 3. L-01–L-17 review table

Determination column (every row): **`LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED`** (or explicit **deferral** for architecture-dependent items).

Proposed counsel-style L determinations (category **D**, now **adopted by Legal Counsel** with conditions) are recorded in [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) §4 and referenced in attestation §7A. Legal Counsel Determination/Attestor/Date are recorded. DPO fields remain **NOT ESTABLISHED**.

Counsel review: [`adr-0006-e1-c01-l01-l17-counsel-review.md`](adr-0006-e1-c01-l01-l17-counsel-review.md) — **FRAMEWORK-SOUND WITH CONDITIONS**; Legal Counsel rules **adopted**; DPO **NOT ESTABLISHED**. Preserve the listed corrections.

L-item formal destination: Legal Counsel determinations are recorded in attestation §7A. DPO Determination remains **NOT ESTABLISHED**. Combined Legal/DPO closure via E-32 remains incomplete. Do not invent a second signed instrument.

| L ID | Control/legal-readiness question | Supporting Phase 1 evidence | Counsel review | Human determination required | Evidence gap | Architecture dependency | Formal attestation destination |
| --- | --- | --- | --- | --- | --- | --- | --- |
| L-01 | Is PDPC registration required if PDPA applies? | E-18 TZ; company LA-02; no registration record | L-01: applicability **current**; certificate later if required | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | PDPC artefact if required | Low | E-02 / E-32; LA-02 |
| L-02 | Which laws require a DPO vs another privacy lead? | No appointment; P1 role key `dpo` ≠ appointment | **Do not equate** Tanzania registration DPO introduction with GDPR Art. 37 DPO | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Appointment **if** required | No for trigger | E-03 / E-32 |
| L-03 | Is a Production processing inventory/RoPA-equivalent in place? | E-04 draft from **models**; P1 capability ≠ Production RoPA | Distinguish **candidate classes** from **actual personal data**; inventory **not** completed as Production RoPA | Completeness review `PENDING…` | Recipients/locations; off-EOS processes; document bytes | Recipients/locations **yes** | E-04 / E-32 |
| L-04 | What are legal roles by activity? | E-06 **factual** matrix; legal column pending; no DPAs | Role is activity-specific; counsel “likely” is **not** a determination | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Contracts | Vendor rows **yes** | E-06 / LA-01 / E-32 |
| L-05 | Is there a Production data-flow map of actual components/geographies? | None; Dev topology ≠ Production | Cannot assess without actual architecture | **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**. **Not closed.** | Entire map | **Yes** | E-08; **architecture-dependent** |
| L-06 | Is there a per-path transfer register? | E-09 empty | Must capture **destination, recipient, purpose, duration, data, mechanism, safeguards** | Framework rule recorded; populated paths **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**. **Not closed.** | All path fields | **Yes** | E-09; L-07 |
| L-07 | What lawful mechanism applies per actual transfer? | E-10 no instrument in repo | Same path fields as L-06; **no universal tool**; **no assumed PDPC permit** | Rule `PENDING…`; instruments after destinations | Permits/SCCs/IDTA if required | Instruments **yes** | E-10 / LA-11 / E-32 |
| L-08 | Is there a Production subprocessor register? | E-11 empty | After candidates | **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**. **Not closed.** | Provider lists | **Yes** | E-11 |
| L-09 | Are contracts role-appropriate (DPA/controller–processor/joint, etc.)? | E-07 none found | Ordinary marketing-cloud terms **not** assumed sufficient; **role-appropriate** contracts | `PENDING…` when counterparties exist | Executed terms | **Yes** (counterparties) | E-07 / E-30 |
| L-10 | Is an adequate EOS privacy notice in place? | E-12 skeleton `DRAFT — NOT LEGALLY APPROVED` | Lawful basis **only where legally applicable**; recipients wait on vendors | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Entity, bases, recipients, transfers, rights, contact | Recipients **yes** | E-12 / E-32 |
| L-11 | Is retention/deletion defined (not indefinite)? | E-13 classes; periods **TBD**; deletion not implemented | **Category-specific** periods; backup overlay separate | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Legal/contract/tax periods | Backup **yes** | E-13 / E-32 |
| L-12 | Are Production TOMs implemented? | Design/Dev only; `productionReady` not claimed | After selected stack | After architecture | Implemented TOMs | **Yes** | E-14 |
| L-13 | Is there a documented, implemented, and (if claimed) tested personal-data incident process with law-specific notice? | E-15 **documented process** draft; implemented/tested **MISSING**; no unsourced clocks | Notification is **jurisdiction-specific** | Mapping `PENDING…` | Regulator mapping; tests; vendor clauses | Provider clauses **yes** | E-15 / E-32 |
| L-14 | Are sensitive/special-category (or equivalent) data correctly characterised and controlled? | E-16 internal ≠ statutory | **Internal classification ≠ statutory classification** | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Statutory mapping; file census | Census **partial** | E-16 / LA-12–13 / E-32 |
| L-15 | Is DPIA/equivalent required? | P2 register capability only; no Production screening record | CRM platform does **not** automatically require a GDPR-style DPIA | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Screening record | Full DPIA may need topology | E-17 / E-32 |
| L-16 | Have source markets been screened on **facts**, not the market list alone? | E-18 screening; E-05 layers | Screening **does not** mean a full memo for every country | `LEGAL COUNSEL CONFIRMED/ADOPTED — DPO NOT ESTABLISHED` | Establishment extract; census | Transfers refine | E-18 / LA-02–05 / E-32 |
| L-17 | Has the **actual** Production architecture been legally reviewed? | No architecture selected | **Depends on actual Production architecture** | **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**. **Not closed.** | Entire topology | **Yes — hard gate** | E-19–E-30 |

---

## 4. Review by legal subject

### A. Entity and establishment — E-01

| | |
| --- | --- |
| **Known** | Company Tanzania-based DMC **position**; branding; Dev seed strings; schema can store `legal_name`. |
| **Unknown** | Registered name, number, office, establishment as a legal fact. |
| **Reviewer must decide** | Legal entity and establishment for LA-01 / L-04. |
| **May request** | Registry extract; incorporation certificate; registered-office evidence. |

### B. Registration and DPO — E-02, E-03

| | |
| --- | --- |
| **Known** | Company intends TZ PDPA as a primary consideration; no PDPC certificate; no DPO appointment; P1 `dpo` is a **role key**. |
| **Unknown** | Whether registration/DPO are legally required under each applicable law. |
| **Reviewer must decide** | L-01 / L-02 triggers. **Do not equate** TZ PDPC DPO-introduction with GDPR DPO. |
| **May request** | PDPC record; appointment letter — **only if** determined required. |

### C. Processing inventory and roles — E-04, E-05, E-06

| | |
| --- | --- |
| **Known** | Modelled EOS activities; FUTURE categories; geography layers; factual role **candidates**. |
| **Unknown** | Production population; document contents; actual subject jurisdictions; legal roles; DPAs. |
| **Reviewer must decide** | Completeness, personal-data characterisation, legal roles. |
| **May request** | Off-EOS processing description; client/vendor contracts. |

### D. Cross-border processing — E-10, E-11, E-19–E-30

| | |
| --- | --- |
| **Known** | Company wants transfers minimised and documented; no Production paths; no providers. |
| **Unknown** | Every path field (destination, recipient, purpose, duration, data, mechanism, safeguards). |
| **Reviewer must decide** | Framework **rule** now; path tools later. Placement **constraints**, not a cloud pick. |
| **May request** | Nothing that can be verified until candidates exist (then location/DPA/subprocessor packs). |

### E. Privacy notice — E-12

| | |
| --- | --- |
| **Known** | Skeleton listing modelled processing; `DRAFT — NOT LEGALLY APPROVED`; omitted bases/DPO/providers/contacts. |
| **Unknown** | Legal bases, retention numbers, recipients, transfer tools, contact identity. |
| **Reviewer must decide** | What notice is required and whether/when it is adequate. Lawful basis **only where legally applicable**. |
| **May request** | Existing public notices; entity details after E-01. |

### F. Retention and erasure — E-13

| | |
| --- | --- |
| **Known** | Record classes; periods TBD; soft-delete is design; audit insert-only; document `deleted` ≠ destruction. |
| **Unknown** | Statutory/contract/tax periods; erasure vs immutability; backup TTL. |
| **Reviewer must decide** | Category-specific rules. |
| **May request** | Contracts; finance/tax advice; later backup vendor TTL. |

### G. Incident and breach — E-15

| | |
| --- | --- |
| **Known** | 12-step **documented process** draft; Production IR **NOT READY**; not tested. |
| **Unknown** | Applicable notification clocks/authorities; contractual notice. |
| **Reviewer must decide** | Jurisdiction-specific mapping. Do not apply unsourced “72-hour” rules from this pack. |
| **May request** | Contractual IR clauses; later vendor notice terms. |

### H. Data classification — E-16

| | |
| --- | --- |
| **Known** | Internal Restricted / Restricted+ / Highly Restricted; commercial confidentiality ≠ automatic statutory sensitive PD. |
| **Unknown** | Statutory characterisation; contents of uploaded files. |
| **Reviewer must decide** | Mapping under applicable law. **Internal ≠ statutory.** |
| **May request** | File-handling policy; sample classification of document kinds (not fabricated contents). |

### I. DPIA / privacy risk — E-17

| | |
| --- | --- |
| **Known** | P2 DPIA **register** exists in Dev/Test; no Production screening record. |
| **Unknown** | Whether a DPIA/equivalent is legally required. |
| **Reviewer must decide** | Screening outcome. |
| **May request** | None for a first screening note; full DPIA may wait on topology/sensitive-data facts. |

### J. Jurisdiction / applicability — E-18

| | |
| --- | --- |
| **Known** | Target markets; factual screening table; **no** law-applies conclusion. |
| **Unknown** | Actual offering/monitoring/establishment connecting factors. |
| **Reviewer must decide** | TZ, KE, EU/EEA, UK, and whether others need a deeper memo — **not** a full memo per country by default. |
| **May request** | E-01 extract; commercial geography evidence. |

### K. Formal legal/DPO attestation — E-31, E-32

| | |
| --- | --- |
| **Known** | Company positions 17/17 recorded; AI analysis recorded; human fields blank. |
| **Unknown** | All Determinations, attestor identity, date, signature. |
| **Reviewer must decide** | Complete attestation §3 and §7 (and L closures / deferrals). |
| **May request** | Whatever XE items they conclude are necessary. **AI must not sign.** |

---

## 5. External evidence checklist

Allowed statuses: `NOT REQUESTED` · `REQUESTED` · `RECEIVED — NOT VERIFIED` · `VERIFIED`.

Routing package listed these as `REQUESTED` for reviewer collection. **None is RECEIVED or VERIFIED** in the repository.

| Evidence | Why needed | Current status | Requested from | Verification method | Related question |
| --- | --- | --- | --- | --- | --- |
| Corporate registry extract | Legal entity | `REQUESTED` | SEDMC Legal / company secretary | Compare to E-01; reject branding/seed | LA-01, E-01 |
| Certificate / incorporation evidence | Legal personality | `REQUESTED` | SEDMC Legal | Certified copy / registry search | LA-01 |
| Registered-office evidence | Establishment | `REQUESTED` | SEDMC Legal | Address vs operating locations | LA-01, E-18 |
| PDPC registration evidence | L-01 if required | `REQUESTED` | SEDMC + PDPC **if** human says required | Official PDPC record | L-01, LA-02 |
| DPO appointment evidence | L-02 if required | `REQUESTED` | SEDMC **if** required | Appointment/introduction letter; not P1 role key | L-02 |
| Executed client DPAs | Roles / instructions | `REQUESTED` | SEDMC Legal / clients | Executed agreement vs activity | L-04, L-09 |
| Processor / subprocessor agreements | Vendor roles | `REQUESTED` | After provider exists | Executed DPA / role-appropriate terms | L-08, L-09, LA-15 |
| Provider data-location evidence | Transfers / L-17 | `REQUESTED` | After provider exists | Vendor region documentation | E-19–E-28 |
| Subprocessor list | L-08 | `REQUESTED` | After provider exists | Vendor list + flow-down | E-11 |
| Transfer documentation | L-06/L-07 | `REQUESTED` | After paths exist | Path register + instrument if required | LA-10, LA-11 |
| Retention obligations | L-11 | `REQUESTED` | Legal/Finance/contracts | Category-specific clauses | E-13 |
| Incident-response contractual obligations | L-13 | `REQUESTED` | Client/vendor contracts | Notice clauses | E-15 |
| DPIA | L-15 if required | `REQUESTED` | Privacy **if** required | Screening/DPIA document | E-17 |
| Regulatory correspondence | Context | `REQUESTED` | SEDMC Legal if any exists | Originals | E-02, E-18 |

---

## 6. Architecture-dependent items

The reviewer **may** set legal constraints and placement rules **now**. Compliance of a **named** provider/region **cannot** be verified until an architecture is proposed under a later governed decision.

This pack does **not** select or imply Tanzania hosting, African cloud, EU hosting, Tanzania backup, EU backup, African DR, warm standby, or any provider.

| ID | Cannot be finally verified until | Reviewer may do now |
| --- | --- | --- |
| E-08 | Production data-flow map exists | Define what the map must contain |
| E-09 | Actual transfer paths | Define path-register fields (destination, recipient, purpose, duration, data, mechanism, safeguards) |
| E-11 | Named subprocessors | Define register requirements |
| E-19 | Hosting jurisdiction selected | Accept/reject **preference** vs legal constraint; **do not select** |
| E-20 | Production PostgreSQL location | SoR location rules (Dev/Gate-B excluded) |
| E-21 | Production object storage | Document-store location rules |
| E-22 | Production backup | Backup residency rules |
| E-23 | Production DR | DR residency / Restricted+ failover rules |
| E-24 | Production IdP | IdP placement rules (ADR-0013 OPEN) |
| E-25 | Production email | Email placement rules |
| E-26 | Production monitoring | Log/monitor placement rules |
| E-27 | Production CDN/WAF | Edge placement rules |
| E-28 | Production KMS/secrets | Key-location rules (ADR-0012 OPEN) |
| E-29 | Support countries | Control **standard** (LA-16) |
| E-30 | Provider contracts | Contractual control requirements |
| L-05 | E-08 | Defer completion |
| L-17 | Actual selected architecture | Defer completion; hard gate |

---

## 7. Reviewer workflow

| Step | Action | Who |
| --- | --- | --- |
| **1** | Review factual evidence (Phase 1 artefacts, this pack, audit) | Human reviewer |
| **2** | Review company positions (LA-01–LA-17 company file) | Human reviewer |
| **3** | Review AI counsel analysis as **support only** | Human reviewer |
| **4** | Request missing external evidence (§5) | Human reviewer / SEDMC Legal |
| **5** | Make human legal/privacy determinations | **Qualified human only — not Cursor/AI** |
| **6** | Record determinations in the **formal attestation package** | Qualified human |
| **7** | Identify conditions/limitations | Qualified human |
| **8** | Identify architecture constraints (without selecting a provider/region) | Qualified human |
| **9** | Sign/date the formal attestation **where authorized** | **Qualified human only — not Cursor/AI** |
| **10** | Reconcile E1-C01 evidence status in the register (after human recording) | Governance owner + reviewer |

Cursor/AI does **not** complete Steps 5 or 9.

---

## 8. Blank review record

```
Review Question ID:
Determination:
Scope:
Conditions:
Supporting Evidence:
Legal Sources:
External Evidence:
Architecture Implications:
Follow-up Action:
Reviewer Name:
Reviewer Role:
Organization:
Qualification/Authority:
Date:
Signature:
Status:
```

All fields blank. Do not insert a fictitious reviewer. Prefer recording the same content in attestation §7.

---

## 9. Formal attestation boundary

**Authoritative location:** [`docs/governance/adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md)

This consolidated pack:

- does **not** copy completed-looking Determinations;
- does **not** fill attestor, date, or signature;
- does **not** alter the attestation package;
- does **not** treat stale attestation §7 `UNKNOWN` cells as current company positions or as human Determinations.

Attestation fields that remain for the human: §3 Attestor block; §7 every LA Human answer / Determination / Scope / Jurisdictions / Conditions / Supporting evidence / Attestor / Date.

---

## 10. Remaining package defects (read-only)

Recorded; not silently used to rewrite substance.

| ID | Type | Note |
| --- | --- | --- |
| D-01 | Duplicate navigation | Three review-support files exist (review pack, routing pack, this consolidated pack). **This file is primary navigation.** Others remain companions. Not a status contradiction. |
| D-02 | Stale pointer | Counsel-style analysis “Evidence-closure register” pointer **corrected** in this task to `adr-0006-e1-c01-evidence-closure-register.md`; Gate E1 sequence file retained as a separate link. |
| D-03 | Instrument structure | Attestation remains LA-01–LA-17 structured for **signed** fields. Legal Counsel determinations for LA-01–LA-17 and L-01–L-17 are now recorded. DPO fields remain **NOT ESTABLISHED**. This pack still does not invent a second signed attestation. |
| D-04 | Action-plan status | AP-E04–E18 remain `READY FOR COLLECTION` even though drafts exist; closure criteria unmet. Documented; not treated as “no draft”. |
| D-05 | Company PREPARED vs attestation COMPLETE | Label difference for 17/17 recorded company answers; not a legal determination. |

No defect found that implies legal clearance or Production authorization.

Unsupported legal statements: **none identified** in this pack’s own claims; AI counsel files remain labelled analysis.

---

## 11. Final governance status

`LEGAL COUNSEL ATTESTATION RECORDED — DPO NOT ESTABLISHED — POST-ATTESTATION RECONCILIATION COMPLETE — EVIDENCE COLLECTION REQUIRED`

and separately:

`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`

`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`

`Production = NOT AUTHORIZED`

`UAT = NOT AUTHORIZED`

> Readiness for human review is not legal clearance and does not authorize Production architecture, infrastructure, migration, deployment, or UAT.

---

## NEXT GOVERNANCE ACTION

`BEGIN EVIDENCE COLLECTION: LEGAL-ENTITY EXTRACT AND PDPC REGISTRATION STATUS; DPO EVIDENCE IF/WHEN APPOINTED; ARCHITECTURE REMAINS UNSELECTED.`
