# E1-C01 Evidence Closure Action Plan

> **`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`**  
> **`E1: NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`PRODUCTION / UAT / HOSTING / DATABASE / INFRASTRUCTURE / MIGRATIONS / DEPLOYMENT: NOT AUTHORIZED`**

This plan converts [`adr-0006-e1-c01-evidence-closure-register.md`](adr-0006-e1-c01-evidence-closure-register.md) into **sequenced actions**. It does **not** replace:

- the Evidence Closure Register;
- the Human/DPO/Legal Review Pack;
- the formal E1-C01 attestation package.

Completing an action is **not** E1 approval, Production authorization, or legal attestation.

Formal determinations must be entered only in [`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md). This plan does **not** modify that package or its stale §7 `UNKNOWN` cells.

Counsel-review path in use: [`adr-0006-e1-c01-l01-l17-counsel-review.md`](adr-0006-e1-c01-l01-l17-counsel-review.md).  
Previously referenced `docs/governance/adr-0006-e1-c01-counsel-review.md` **does not exist**. This plan does **not** create that duplicate.

AI counsel-style analysis is **supporting material**, not the final human determination.

Proposed counsel-style determinations: [`adr-0006-e1-c01-proposed-counsel-determinations.md`](adr-0006-e1-c01-proposed-counsel-determinations.md) — category **D**, not category **E**. Architecture-dependent items remain **`DEFERRED — REQUIRES ACTUAL PRODUCTION TOPOLOGY / PROVIDER EVIDENCE`**.

---

## 1. Status preserved

| Item | Status |
| --- | --- |
| E1-C01 | **LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE** |
| E1 | **NOT APPROVED / BLOCKED BY MISSING EVIDENCE** |
| Production | **NOT AUTHORIZED** |
| UAT | **NOT AUTHORIZED** |
| Production hosting / database / infrastructure / migrations / deployment | **NOT AUTHORIZED** |
| Provider / region | **NOT SELECTED** |

Action statuses used: `NOT STARTED` · `READY FOR COLLECTION` · `AWAITING HUMAN/DPO/LEGAL` · `AWAITING EXTERNAL EVIDENCE` · `DEPENDENT ON PRODUCTION ARCHITECTURE` · `COMPLETE` · `BLOCKED`.

Not used: `APPROVED` · `COMPLIANT`. **No action is `COMPLETE`.**

---

## 2. Action categories

| Category | Meaning |
| --- | --- |
| **A — SEDMC INTERNAL EVIDENCE** | SEDMC can prepare without selecting Production infrastructure |
| **B — HUMAN/DPO/LEGAL DETERMINATION** | Qualified human reviewer must determine applicability or sufficiency |
| **C — EXTERNAL REGULATORY / PROVIDER EVIDENCE** | Regulator, vendor, or counterparty artefact. Collect **only if** a Category B determination establishes that it is required, or after a provider is later selected. Do **not** assume a permit, registration, or certificate is required until that determination exists |
| **D — PRODUCTION-ARCHITECTURE DEPENDENT** | Cannot be completed until an actual Production architecture is selected. This plan does **not** select it |

Some evidence IDs span categories (e.g. E-02: B then C; E-10: B then C/D). The matrix uses the **primary current action**, with the later category in Dependency.

---

## 3. Master action-plan matrix (E-01–E-32)

| Action ID | Evidence ID | Related L Item | Action Required | Category | Responsible Evidence Source | Dependency | Closure Criterion | Blocks E1? | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| AP-E01 | E-01 | L-04; LA-01 | Collect legal-entity / Tanzania establishment records (not branding). Route for human legal validation | A then B | SEDMC company records; Legal/DPO | None for collection | Authoritative entity/establishment evidence **plus** human legal validation | **Yes — current** | `READY FOR COLLECTION` |
| AP-E02 | E-02 | L-01 | Human determination whether PDPC registration is required. **If required**, obtain PDPC record covering Production activities | B then C | Legal/DPO; PDPC | B before C | Attested “required / not required”; if required, registration evidence | Applicability **current**; certificate **later** | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E03 | E-03 | L-02 | Human determination which laws require a DPO/privacy lead. **If required**, appoint/designate (do not invent identity now) | B then C | SEDMC; Legal/DPO; PDPC if applicable | B before appointment | Attested trigger; if required, appointment/introduction evidence | Trigger **current**; artefact **later** | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E04 | E-04 | L-03 | Prepare actual processing inventory (personal vs corporate) for CRM, RFPs, programmes, delegates, suppliers, hotels, employees, documents, audit, auth, support, logs | A | SEDMC privacy/ops | Recipients/locations later from D | Documented inventory of **actual intended Production processing**, not only a class list | Classes **current** | `READY FOR COLLECTION` |
| AP-E05 | E-05 | L-16; LA-05 | Map data-subject geography vs client geography vs programme destination (processing location later) | A then B | SEDMC commercial/privacy | Processing location = D | Documented map of those three layers; legal geography reviewed | **Partial — current** | `READY FOR COLLECTION` |
| AP-E06 | E-06 | L-04 | Draft factual role matrix (SEDMC controller / processor / client-controlled / possible joint-controller). Human legal validation of roles. Vendor rows later | A then B | SEDMC; Legal/DPO | Vendor rows = D/C | Factual matrix **plus** human validation of legal roles | SEDMC/client **current** | `READY FOR COLLECTION` |
| AP-E07 | E-07 | L-09 | Obtain executed DPAs / role-appropriate contracts once counterparties exist | C | SEDMC legal; counterparties | Provider selection (D) | Executed terms for material relationships | **Post-provider** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E08 | E-08 | L-05; L-17 | Produce Production data-flow map of actual components and geographies | D | Technical + vendors | Architecture selected | Map covering app, PG, object storage, backup, DR, email, IdP, monitoring, CDN/WAF, KMS, support, integrations, recipients, subprocessors | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E09 | E-09 | L-06 | Populate transfer register from the data-flow map | D | SEDMC privacy | AP-E08 | Per-path source, destination, recipient, category, subjects, purpose, framework, mechanism, safeguards, contract, retention, onward transfer | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E10 | E-10 | L-07 | Human determination of the **rule** (no universal mechanism; extra-territorial paths need a lawful tool). Path-specific instruments only after destinations exist | B then C/D | Legal/DPO; PDPC/vendors if required | Destinations = D | Framework rule attested now; per-path mechanism **if** a transfer exists and law requires one. **No** assumed PDPC permit | Rule **current**; instruments **later** | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E11 | E-11 | L-08 | Record Production subprocessors of selected offerings | D | Technical/commercial; vendors | Architecture selected | Register with service, role, data, geography, their subprocessors | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E12 | E-12 | L-10 | Draft EOS privacy notice from inventory (recipients/transfers TBD). Finalize after architecture | A then D | SEDMC | Recipients = D | Notice covering who, purposes, categories, basis **where required**, recipients, transfers, retention, rights, complaints, contact | **Production implementation** | `READY FOR COLLECTION` (draft) |
| AP-E13 | E-13 | L-11 | Document retention/deletion for legal, contractual, operational, audit (not indefinite). Backup overlay later | A then D | SEDMC | Backup overlay = E-22 | Written schedule + deletion intent for operational classes; backup overlay when backup exists | Policy **current-capable** | `READY FOR COLLECTION` |
| AP-E14 | E-14 | L-12 | Document and implement Production TOMs on the **selected** stack | D | Technical/security | Architecture selected | Architecture-specific TOMs evidenced as implemented, not merely planned | **Production implementation** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E15 | E-15 | L-13 | Write personal-data incident/breach playbook. Human mapping of notification duties. Testing later | A then B | SEDMC; Legal/DPO | Provider clauses = D | Documented process; attested notification mapping; tested process is a **later** implementation control | Playbook **internal**; mapping **current E1** | `READY FOR COLLECTION` |
| AP-E16 | E-16 | L-14 | Map Restricted / Highly Restricted / Restricted+ to statutory sensitive/special-category concepts; human review | A then B | SEDMC; Legal/DPO | File census = D | Written mapping **plus** qualified review. Internal class ≠ automatic statutory class | Characterisation **current** | `READY FOR COLLECTION` |
| AP-E17 | E-17 | L-15 | Document DPIA/privacy-risk **screening** for EOS Production; human determination whether DPIA/equivalent is required | B | SEDMC; Legal/DPO | Full DPIA may need more facts | Screening record **and** resulting determination. P2 register capability ≠ screening | Screening **current** | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E18 | E-18 | L-16 | Fact-specific screening TZ, KE, EU/EEA, UK, ZA, ME, CA, US, LATAM (not a full memo per country unless facts require) | A facts then B | Commercial facts; Legal/DPO | Transfer facts refine later | Documented screening from processing facts, not market list alone | TZ/KE/EU/UK **current** | `READY FOR COLLECTION` / `AWAITING HUMAN/DPO/LEGAL` |
| AP-E19 | E-19 | L-17; LA-06 | Record selected Production hosting jurisdiction **when** an architecture is chosen | D | Owner/commercial | **Do not select in this plan** | Evidenced jurisdiction of the chosen offering | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E20 | E-20 | L-05; L-17 | Record Production PostgreSQL location (not Dev/Gate-B) | D | Technical | Architecture selected | Production PG geography evidenced | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E21 | E-21 | L-05; L-17 | Record Production object/document storage provider, location, subprocessors (not `DocumentStorage` port / Dev FS) | D | Technical | Architecture selected | Provider + location + subprocessors | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E22 | E-22 | L-05; LA-07 | Record Production backup geography/provider (not Gate-B/C dumps) | D | Technical; ADR-0011 | Architecture selected | Production backup geography + provider | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E23 | E-23 | L-05; LA-08 | Record Production DR geography/provider (not lab site-failure) | D | Technical | Architecture selected | Production DR geography + provider | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E24 | E-24 | L-05; LA-17 | Record Production IdP and processing geography (not Dev local passwords; ADR-0013 OPEN) | D | Technical/IAM | Architecture selected | IdP product + geography | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E25 | E-25 | L-05; LA-17 | Record Production email provider, geography, subprocessors (not Dev SES) | D | Technical | Architecture selected | Provider + geography + subprocessors | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E26 | E-26 | L-05; LA-17 | Record Production monitoring/logging services and geographies | D | Technical/security | Architecture selected | Services + geographies | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E27 | E-27 | L-05; LA-17 | Record Production CDN/WAF providers and locations | D | Technical | Architecture selected | Providers + locations | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E28 | E-28 | L-05; LA-17 | Record Production KMS/secrets provider and geography (ADR-0012 OPEN; not env secrets) | D | Technical/security | Architecture selected | Provider + geography | **Architecture-dependent** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E29 | E-29 | L-12; LA-16 | Attest support-access **control standard** now (company LA-16). Record actual support countries after vendor exists | B (standard) then D (countries) | SEDMC; vendor; Legal | Vendor selected | Human view of required controls; later country list + contractual/security evidence | Standard **current**; countries **architecture-dependent** | `AWAITING HUMAN/DPO/LEGAL` (standard) / `DEPENDENT ON PRODUCTION ARCHITECTURE` (countries) |
| AP-E30 | E-30 | L-08; L-09; L-07 | Execute subprocessor transfer/contract controls for selected providers | C after D | Legal + vendors | AP-E07, AP-E11 | Executed flow-down, location, transfer tools for material subprocessors | **Post-provider** | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E31 | E-31 | LA-01–LA-17; all L | Qualified human completes LA-01–LA-17 in the **formal attestation package** | B | Qualified human reviewer | Phase 1 facts improve quality; some LA items remain conditional | Legal Counsel component **recorded** (THOMAS NGULUMA, 15TH SEPTEMBER 2026, A.T.N). DPO component **not established**. AI analysis ≠ DPO | **Yes — current** | `LEGAL COUNSEL COMPLETE` / `AWAITING DPO` |
| AP-E32 | E-32 | L-01–L-17 | Human closure of each L item that *can* be determined now; L-05/L-17 remain open until architecture | B | Qualified human reviewer | AP-E31; L-05/L-17 wait on D | Legal Counsel rules **adopted** with L-05/L-17 explicit deferral. DPO **not established**. Factual registers/maps not closed | Legal Counsel rule adoption **current**; L-17 **architecture-dependent** | `LEGAL COUNSEL COMPLETE` / `AWAITING DPO` / L-05/L-17 `DEPENDENT ON PRODUCTION ARCHITECTURE` |

**Coverage: AP-E01–AP-E32 = 32/32. L-01–L-17 connected. No action `COMPLETE`.**

---

## 4. PHASE 1 — Foundational internal evidence

Work that can start **without** choosing Production infrastructure. Parallelizable among themselves.

| Action | Evidence | Prepare now | Closure criterion | Status |
| --- | --- | --- | --- | --- |
| AP-E01 | E-01 | Legal-entity / establishment file pack | Authoritative entity + establishment evidence (human validation is Phase 2) | `READY FOR COLLECTION` |
| AP-E04 | E-04 | Processing inventory | Actual documented inventory of relevant EOS processing, not merely proposed classes | `READY FOR COLLECTION` |
| AP-E05 | E-05 | Data-subject vs client vs destination map | Documented three-way distinction; not a market-list reprint | `READY FOR COLLECTION` |
| AP-E06 | E-06 | Factual controller/processor matrix (pre-vendor) | Activity-level factual matrix ready for legal validation | `READY FOR COLLECTION` |
| AP-E13 | E-13 | Retention requirements (operational/legal/contractual/audit) | Written schedule, not indefinite by default; backup overlay deferred | `READY FOR COLLECTION` |
| AP-E15 | E-15 | Incident/breach playbook | Documented process with roles; testing is a later gate | `READY FOR COLLECTION` |
| AP-E16 | E-16 | Internal-to-statutory classification draft | Written map of Restricted/Restricted+ vs candidate statutory classes for legal review | `READY FOR COLLECTION` |
| AP-E18 | E-18 | Source-market **facts** pack | Connecting-factor facts for TZ/KE/EU/UK plus screening notes for other listed markets | `READY FOR COLLECTION` |

Internal drafts exist (pointer-only; **status unchanged** — closure criteria still unmet):

| Action | Internal draft path |
| --- | --- |
| AP-E01 | [`adr-0006-e1-c01-e01-legal-entity-establishment.md`](adr-0006-e1-c01-e01-legal-entity-establishment.md) (placeholder; extract **MISSING**) |
| AP-E04 | [`adr-0006-e1-c01-e04-eos-processing-inventory.md`](adr-0006-e1-c01-e04-eos-processing-inventory.md) |
| AP-E05 | [`adr-0006-e1-c01-e05-data-subject-geography-map.md`](adr-0006-e1-c01-e05-data-subject-geography-map.md) |
| AP-E06 | [`adr-0006-e1-c01-e06-processing-role-matrix.md`](adr-0006-e1-c01-e06-processing-role-matrix.md) |
| AP-E12 | [`adr-0006-e1-c01-e12-eos-privacy-notice-draft.md`](adr-0006-e1-c01-e12-eos-privacy-notice-draft.md) |
| AP-E13 | [`adr-0006-e1-c01-e13-retention-requirements.md`](adr-0006-e1-c01-e13-retention-requirements.md) |
| AP-E15 | [`adr-0006-e1-c01-e15-personal-data-incident-response.md`](adr-0006-e1-c01-e15-personal-data-incident-response.md) |
| AP-E16 | [`adr-0006-e1-c01-e16-data-classification-legal-mapping.md`](adr-0006-e1-c01-e16-data-classification-legal-mapping.md) |
| AP-E18 | [`adr-0006-e1-c01-e18-source-market-applicability-screening.md`](adr-0006-e1-c01-e18-source-market-applicability-screening.md) |

Index / audit / routing: [`adr-0006-e1-c01-phase1-internal-evidence-index.md`](adr-0006-e1-c01-phase1-internal-evidence-index.md); [`adr-0006-e1-c01-phase1-internal-evidence-audit.md`](adr-0006-e1-c01-phase1-internal-evidence-audit.md); [`adr-0006-e1-c01-human-legal-dpo-review-routing.md`](adr-0006-e1-c01-human-legal-dpo-review-routing.md).

Also startable in parallel (not E1-mandatory to *finish* before human review, but useful): **AP-E12** draft privacy notice.

**None of these is marked complete.** Company positions and AI analysis are inputs, not Phase 1 closure. Draft artefacts do **not** close E1 items.

---

## 5. PHASE 2 — Human Legal/DPO determinations

Place before a qualified reviewer using the Review Pack, Phase 1 routing package ([`adr-0006-e1-c01-human-legal-dpo-review-routing.md`](adr-0006-e1-c01-human-legal-dpo-review-routing.md)), and AI analysis as **support only**. Record answers **only** in [`docs/governance/adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md).

| Action | Evidence | L / LA | Question for the human | Status |
| --- | --- | --- | --- | --- |
| AP-E01 | E-01 | LA-01; L-04 | Controller(s) and place(s) of establishment | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E02 | E-02 | L-01; LA-02 | Does PDPA apply, and is PDPC registration required? | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E03 | E-03 | L-02 | Which laws require a DPO/privacy lead? | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E06 | E-06 | L-04; LA-01 | Legal roles (controller / processor / joint-controller) | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E10 | E-10 | L-07; LA-11 | Transfer-mechanism **rule**; no universal tool | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E16 | E-16 | L-14; LA-12/13 | Statutory vs internal classification | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E17 | E-17 | L-15 | Is a DPIA/equivalent required on current facts? | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E18 | E-18 | L-16; LA-03/04/05 | TZ / Kenya / GDPR / UK GDPR (and screening of other markets) | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E29 | E-29 | LA-16 | Sufficiency of the foreign-support **control standard** | `AWAITING HUMAN/DPO/LEGAL` |
| AP-E31 | E-31 | LA-01–LA-17 | Formal LA determinations + identity, role, date, signature | `LEGAL COUNSEL COMPLETE` / `AWAITING DPO` |
| AP-E32 | E-32 | L-01–L-17 | Formal L closures **or** explicit deferral of L-05/L-17 | `LEGAL COUNSEL COMPLETE` / `AWAITING DPO` |

Phase 1 artefacts improve Phase 2 quality. Phase 2 may still record `REQUIRES FURTHER REVIEW` where facts are incomplete. That is a human act, not AI completion.

---

## 6. PHASE 3 — Regulatory / external evidence

Collect **after** Phase 2 says the artefact is required, and/or after a provider exists. **Do not invent. Do not assign an unselected provider.**

| Action | Evidence | Collect if / when | Status |
| --- | --- | --- | --- |
| AP-E02 (C) | E-02 | Phase 2 says PDPC registration **is required** | `AWAITING HUMAN/DPO/LEGAL` (until then) |
| AP-E03 (C) | E-03 | Phase 2 says appointment/PDPC introduction **is required** | `AWAITING HUMAN/DPO/LEGAL` (until then) |
| AP-E10 (C) | E-10 | A real extra-territorial path exists **and** Phase 2/law requires a permit or other instrument | `DEPENDENT ON PRODUCTION ARCHITECTURE` for the path |
| AP-E07 | E-07 | Counterparties selected | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| AP-E11 / AP-E30 | E-11, E-30 | Offerings selected | `DEPENDENT ON PRODUCTION ARCHITECTURE` |
| Vendor location / subprocessor lists | E-19–E-28 | Offerings selected | `DEPENDENT ON PRODUCTION ARCHITECTURE` |

External certifications are **not** assumed required.

---

## 7. PHASE 4 — Production architecture evidence

Deferred until a Production architecture is **separately** selected. This plan does **not** select hosting, cloud, region, backup, DR, IdP, email, CDN/WAF, or KMS.

| Action | Why it depends on actual architecture |
| --- | --- |
| AP-E08 / L-05 | Flows and geographies do not exist until components exist |
| AP-E09 / L-06 | Transfer paths are derived from the map |
| AP-E11 / L-08 | No `CANDIDATE — NOT SELECTED` offering today |
| AP-E19 | Hosting jurisdiction is the selected offering’s region, not the Tanzania **preference** |
| AP-E20 | Production PostgreSQL ≠ Gate-B/Dev |
| AP-E21 | Production object store ≠ Dev `LocalFsDocumentStorage` |
| AP-E22 | Production backup ≠ Gate-B/C dumps |
| AP-E23 | Production DR ≠ lab site-failure tests |
| AP-E24 | ADR-0013 OPEN; Dev IdP is not Production |
| AP-E25 | Dev SES is not Production email |
| AP-E26–E28 | Monitoring, CDN/WAF, KMS not selected (ADR-0012 OPEN) |
| AP-E29 (countries) | Support geography is a vendor fact |
| AP-E30 | Contracts attach to named providers |
| L-17 | Final legal/privacy review of the **actual** topology |

---

## 8. Dependency graph

**Sequential spine**

```
Company factual evidence (Phase 1: E-01, E-04, E-05, E-06, E-13, E-15, E-16, E-18)
        ↓
Human/DPO/legal applicability determinations (Phase 2: E-01/02/03/06/10/16/17/18/29/31/32)
        ↓
Regulatory/external evidence WHERE Phase 2 establishes it is required (Phase 3)
        ↓
Production architecture candidate (separate later decision — not this plan)
        ↓
Architecture-specific data-flow / transfer / subprocessor assessment (Phase 4: E-08/09/11/19–30)
        ↓
Final L-01–L-17 legal/DPO review including L-17 (AP-E32 on actual topology)
        ↓
E1-C01 closure
        ↓
E1 decision (still not Production authorization)
```

**Genuine parallel work**

- All Phase 1 internals in parallel.
- Draft notice (AP-E12) in parallel with Phase 1.
- Phase 2 may start on questions that do not need a full inventory (e.g. LA-06 preference vs approval; “no universal transfer mechanism”), but establishment/roles/applicability are stronger after Phase 1.
- Phase 4 must **not** start as implementation; commercial **candidate recording** (`CANDIDATE — NOT SELECTED`) is E1-C03 in the evidence-closure package and remains a **later human/commercial** step, not provider selection in this plan.

---

## 9. Closure criteria (major items)

| ID | Closure requires |
| --- | --- |
| **E-01** | Authoritative SEDMC legal-entity and Tanzania establishment evidence, plus required human legal validation |
| **E-02** | Human determination whether registration is required; **if required**, PDPC evidence covering the activities |
| **E-03** | Human determination of DPO/privacy-lead trigger; **if required**, appointment/designation evidence (identity not invented here) |
| **E-04** | Actual documented processing inventory of relevant EOS processing, not a proposed class list |
| **E-05** | Documented data-subject vs client vs destination geography (processing location when architecture exists) |
| **E-06** | Factual processing-role matrix plus human/legal validation of legal roles |
| **E-10** | Attested per-jurisdiction/per-path mechanism **rule**; path instruments only when a transfer exists |
| **E-16** | Mapping of SEDMC internal classifications to applicable statutory categories, with qualified Legal/DPO review |
| **E-17** | Documented DPIA/privacy-risk screening **and** the resulting determination |
| **E-18** | Documented jurisdictional screening from actual processing facts, not merely target markets |
| **E-31 / E-32** | Human determination, identity, qualification/role, date, and signature/attestation in the **formal package** |
| **Architecture-dependent items** | Actual Production architecture **plus** evidence from the selected providers |

---

## 10. WHAT MUST BE CLOSED BEFORE E1 CAN CLOSE?

### Mandatory legal/evidence prerequisites (current E1)

- Phase 1 packs for E-01, E-04, E-05, E-06, E-16, E-18 (sufficient for review, even if later refined)
- Phase 2 human determinations: E-01, E-02 applicability, E-03 trigger, E-06, E-10 rule, E-16, E-17 screening, E-18 TZ/KE/EU/UK, E-31, E-32 (with L-05/L-17 explicitly deferred if architecture is unset)
- Formal attestation in [`adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md)

A full E1 **owner hosting decision** also needs remaining E1-Cxx items (candidates, quotes, IdP/KMS placement) from [`adr-0006-e1-evidence-closure-package.md`](adr-0006-e1-evidence-closure-package.md). Those are **not** executed by this plan.

### Architecture-dependent prerequisites

- E-08, E-09, E-11, E-19–E-30, L-05, L-17 — needed before treating a **specific** topology as legally reviewed; not an excuse to select architecture in this document

### Provider-specific evidence

- E-07, E-30, vendor location/subprocessor schedules, any permit/instrument for **named** paths

### Production implementation controls (later gates — not E1)

- Implemented Production TOMs (E-14)
- Published notice with final recipients (E-12 finalize)
- Tested breach process
- Operational deletion including backup overlay
- PDPC certificate / DPO letter **if** Phase 2 required them, as Production-processing prerequisites (L-01/L-02), distinct from writing E1 placement **rules**
- Cloud deploy, Production database, migrations, application deploy, UAT, cutover, backup/DR cutover

---

## 11. E1 is not Production implementation

E1 evidence closure does **not** authorize:

- cloud deployment;
- Production database deployment;
- migrations;
- application deployment;
- UAT;
- Production cutover;
- backup cutover;
- DR cutover.

Those remain separate governed decisions.

---

## 12. Formal attestation

Final human Legal/DPO determinations must be entered in:

[`docs/governance/adr-0006-e1-c01-legal-dpo-attestation-package.md`](adr-0006-e1-c01-legal-dpo-attestation-package.md)

This action plan does **not** fill determination, attestor, qualification, date, or signature fields.

---

## 13. Documentation integrity

| Path | Record |
| --- | --- |
| `docs/governance/adr-0006-e1-c01-l01-l17-counsel-review.md` | **Exists** — counsel-review artefact |
| `docs/governance/adr-0006-e1-c01-counsel-review.md` | **Does not exist** — not created here |

---

## 14. Authorization boundary

**E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE**  
**E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE**  
**PRODUCTION = NOT AUTHORIZED**  
**UAT = NOT AUTHORIZED**

**Database contacted: NO**  
**Technical files changed: NONE** (this file only)  
**Git commit / push / PR / merge: NO**

**STOP.**
