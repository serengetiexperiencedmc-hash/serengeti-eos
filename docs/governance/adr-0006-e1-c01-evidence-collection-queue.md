# E1-C01 Evidence Collection Queue

> **`EVIDENCE COLLECTION QUEUE`**  
> **`THIS IS NOT LEGAL OPINION, DPO ATTESTATION, OR PRODUCTION AUTHORIZATION`**  
> **`E1-C01 = LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE`**  
> **`DPO DETERMINATION: NOT ESTABLISHED`**  
> **`COMBINED LEGAL/DPO: NOT COMPLETE`**  
> **`E1 = NOT APPROVED / BLOCKED BY MISSING EVIDENCE`**  
> **`Production = NOT AUTHORIZED`**  
> **`UAT = NOT AUTHORIZED`**  
> **`Migration = NOT AUTHORIZED`**  
> **`Deployment = NOT AUTHORIZED`**  
> **`PRODUCTION ARCHITECTURE: UNSELECTED`**

**Queue date (repository calendar):** 2026-09-16.  
**Companion register:** [`adr-0006-e1-c01-current-evidence-readiness-register.md`](adr-0006-e1-c01-current-evidence-readiness-register.md)  
**E-01 / PDPC receipt:** [`adr-0006-e1-c01-e01-pdpc-evidence-receipt.md`](adr-0006-e1-c01-e01-pdpc-evidence-receipt.md)  
**Entity-name reconciliation:** [`adr-0006-e1-c01-e01-entity-name-reconciliation.md`](adr-0006-e1-c01-e01-entity-name-reconciliation.md)  
**E-02 acquisition:** [`adr-0006-e1-c01-e02-pdpc-evidence-acquisition.md`](adr-0006-e1-c01-e02-pdpc-evidence-acquisition.md)  
**E-03 acquisition:** [`adr-0006-e1-c01-e03-dpo-evidence-acquisition.md`](adr-0006-e1-c01-e03-dpo-evidence-acquisition.md)

This queue tells SEDMC **what to collect next**. It does **not** invent artefacts, appoint a DPO, select a Production provider or region, or authorize UAT/Production.

Responsible parties are **roles/functions**, not invented personal names. THOMAS NGULUMA is recorded only as **LEGAL COUNSEL** where that is already evidenced. He is **not** assigned as DPO.

Legal Counsel rules LA-01–LA-17 and L-01–L-17 are **already adopted** and are not re-opened here except as collection dependencies.

---

## Collection pass result (2026-09-16)

Repository search for E-01 and E-02: **no authoritative document received or verified.** Company later supplied the legal-name **string** **Makundi Serengeti Experience DMC** as **COMPANY-PROVIDED FACT**. That does **not** move E-01 to VERIFIED.

| Queue ID | Result |
| --- | --- |
| Q-A-01 / Q-B-01 (E-01) | **Still COLLECT NOW — EXTERNAL / COMPANY** — **NOT VERIFIED**. Current company input: **Makundi Serengeti Experience DMC**. Outstanding: corporate/registry evidence. |
| Q-B-02 (E-02) | **Still COLLECT NOW — EXTERNAL** — **NOT VERIFIED**. Finding: **NO REGISTRATION EVIDENCE AVAILABLE** (not confirmed non-registration). |
| Q-C-01 (E-03) | **Still HUMAN/DPO ACTION** — **DPO APPOINTMENT NOT ESTABLISHED**. |

Receipt: [`adr-0006-e1-c01-e01-pdpc-evidence-receipt.md`](adr-0006-e1-c01-e01-pdpc-evidence-receipt.md)

**Final checkpoint (2026-09-16):** no new E-02/E-03 authoritative artefacts. E-02 remains **COLLECT NOW — EXTERNAL**. E-03 remains **HUMAN/DPO ACTION**. Externally/human-dependent; not closable by repository inference.

---

## VERIFIED

No E-01 or E-02 item is in this section. An acquisition checklist is **not** verification.

| ID | Evidence | Status |
| --- | --- | --- |
| — | — | **Empty** |

---

## How to read the columns

| Column | Meaning |
| --- | --- |
| Evidence required | The artefact to obtain. Not present unless stated. |
| Authoritative source | Where a genuine artefact would come from. |
| Responsible party | Function, not a named individual (unless already evidenced). |
| Dependency | What must exist first. |
| Blocks E1? | Absence prevents **E1 closure** (placement/legal-evidence gate). |
| Blocks Production? | Absence prevents Production authorization even if E1 later progresses. |

---

## A. COLLECT NOW — INTERNAL / COMPANY

Items SEDMC can pursue from its own records without selecting Production architecture.

| ID | Evidence required | Authoritative source | Responsible party | Dependency | Blocks E1? | Blocks Production? |
| --- | --- | --- | --- | --- | --- | --- |
| Q-A-01 (E-01) | Current legal-entity / establishment documents if held in company files. **Current company input (not verified):** Makundi Serengeti Experience DMC. **Outstanding:** corporate/registry extract | SEDMC corporate records | SEDMC company records / SEDMC Legal | None | **Yes** | **Yes** |
| Q-A-02 (E-04) | Completeness pass on EOS processing inventory: off-EOS personal-data processes; whether unstructured commercial files contain personal data | Internal operations / privacy | SEDMC privacy / operations | E-04 draft exists | Partial (classes) | **Yes** until Production RoPA-equivalent exists |
| Q-A-03 (E-05) | Actual client/contact geography census distinct from the **target-market list** | Commercial records (not schema capability) | SEDMC commercial / privacy | Do not use destination as subject jurisdiction | Partial (LA-05) | **Yes** if Production processes those subjects |
| Q-A-04 (E-06) | Factual confirmation of which activities SEDMC vs clients actually control today | Internal process owners | SEDMC operations + SEDMC Legal | Contracts (Q-B) refine later | **Yes** for SEDMC/client roles | **Yes** |
| Q-A-05 (E-07 existing paper) | Any **already executed** client, supplier, or employment agreements that contain data-protection clauses — if they exist in company files | SEDMC contract files | SEDMC Legal | None for existing paper; do not invent | May be **Yes** for current roles | **Yes** for those relationships |
| Q-A-06 (E-13) | Business, finance, and contractual **candidate** retention needs (still not statutory invention) | Finance, commercial, Legal | SEDMC Finance + SEDMC Legal + commercial | Do not invent PDPA/GDPR periods | Partial | **Yes** before live personal data |
| Q-A-07 (E-15) | Named internal incident owner, detection intake, and whether any tabletop has **actually** been run (record “none” if none) | Security / operations | SEDMC security | Monitoring vendor later | Partial (playbook) | **Yes** as implemented/tested control |
| Q-A-08 (E-16) | Inventory of which **internal** Restricted / Restricted+ classes are actually used in EOS today | Product + security | SEDMC product / security | E-04 | Partial | **Yes** for Production handling |
| Q-A-09 (E-18 facts) | Any evidenced offering/monitoring/establishment facts for TZ, KE, EU/EEA, UK, ZA, ME, CA, US, LATAM — or explicit “not evidenced” | Commercial / marketing / contracts | SEDMC commercial | Keep TARGET ≠ SUBJECT ≠ LAW | **Yes** for screening quality | **Yes** if those markets are live |

Do **not** collect a Production region or provider under Queue A.

---

## B. COLLECT NOW — EXTERNAL

Items that require a registry, regulator, or counterparty artefact. Collect only if the artefact **already exists or can be requested**. Do not fabricate it.

| ID | Evidence required | Authoritative source | Responsible party | Dependency | Blocks E1? | Blocks Production? |
| --- | --- | --- | --- | --- | --- | --- |
| Q-B-01 (E-01) | Authoritative legal-entity extract from the competent registry (not invented; registry not assumed). Reconcile to company-provided name **Makundi Serengeti Experience DMC** | Competent corporate registry / certified copy | SEDMC Legal | Q-A-01 if files incomplete | **Yes** | **Yes** |
| Q-B-02 (E-02) | SEDMC-specific PDPC registration/status artefact. Authoritative source: **PDPC** and SEDMC Legal files. Evidence required: confirmation/certificate/number/correspondence **if issued**, or a written status record. Verification: artefact must identify the company; EA-02 process page is **not** sufficient | PDPC / SEDMC Legal files | SEDMC Legal | Do not infer from EA-02 webpage, privacy drafts, `dpo` role, Legal Counsel adoption, or company-provided name | **Yes** while unknown | **Yes** if registration is required |
| Q-B-03 (E-03) | DPO appointment letter / designation / board authorization **if one already exists** | SEDMC governance records | SEDMC (company) | If none exists, move to Queue C — do **not** invent | **Yes** for combined Legal/DPO | **Yes** if appointment is required |
| Q-B-04 (E-07) | Executed DPAs / C2P terms from **existing** counterparties (clients, current suppliers) | Counterparties | SEDMC Legal | Counterparties must exist | Role evidence **Yes** | **Yes** for those flows |
| Q-B-05 (E-10 if already issued) | Any already-issued transfer permit or executed SCC/IDTA **if one exists today** | Regulator / counterparty files | SEDMC Legal | Do not invent; most paths wait for architecture (Queue E) | Only if a current path exists | **Yes** for any live transfer |

If the answer is “no such document exists”, **record the absence**. Do not create a placeholder certificate.

### E-01 / E-02 still missing — acquisition detail

| ID | Current company input | Outstanding authoritative evidence | Authoritative source | Acquisition action | Verification requirement | Production relevance |
| --- | --- | --- | --- | --- | --- | --- |
| Q-A-01 / Q-B-01 | **Makundi Serengeti Experience DMC** (COMPANY-PROVIDED FACT) | Corporate/registry evidence sufficient to establish the legal entity and relevant registration details | SEDMC company files; competent corporate registry (not assumed by name) | Obtain original or certified copy; file against E-01. Keep E-01 in **COLLECT NOW — EXTERNAL / COMPANY**. Do **not** move to VERIFIED on the name string alone | Confirm issuing authority and entity name **as printed**. Do not accept seed `legalName` **Serengeti Experience DMC Ltd** or branding as the extract | **E1 and Production blocker** |
| Q-B-02 | — (name does **not** prove registration) | SEDMC-specific PDPC status artefact | **PDPC**; SEDMC Legal files | Keep in **COLLECT NOW — EXTERNAL**. See [`adr-0006-e1-c01-e02-pdpc-evidence-acquisition.md`](adr-0006-e1-c01-e02-pdpc-evidence-acquisition.md) | Artefact must identify the company. Public process page ≠ registration. Checklist ≠ evidence. Do not convert silence into “not registered” | **E1 blocked while unknown**; **Production blocker if registration is required** |

Responsible party: **SEDMC Legal** / **SEDMC company records** (functions). THOMAS NGULUMA remains Legal Counsel only (not DPO). E-03 remains **HUMAN/DPO ACTION** — see [`adr-0006-e1-c01-e03-dpo-evidence-acquisition.md`](adr-0006-e1-c01-e03-dpo-evidence-acquisition.md). Do **not** assign a DPO.

---

## C. HUMAN/DPO ACTION

DPO determination is **NOT ESTABLISHED**. These items wait for a DPO **if/when appointed**, or remaining qualified-human privacy action that is **not** a re-attestation of LA/L by Legal Counsel.

THOMAS NGULUMA remains **LEGAL COUNSEL ONLY**.

| ID | Evidence required | Authoritative source | Responsible party | Dependency | Blocks E1? | Blocks Production? |
| --- | --- | --- | --- | --- | --- | --- |
| Q-C-01 (E-03) | **Company decision/action required** (whether to appoint). **Appointment evidence required if appointed** (letter/designation/board authorization; named individual). **Regulatory evidence if applicable** (PDPC introduction/notification artefact). Do **not** assign a DPO here. P1 `dpo` ≠ appointment | Authorized company decision + law; company records; PDPC **if** that process applies | SEDMC (company); SEDMC Legal | L-02 rule adopted; appointment first if a DPO is named later | **Yes** (combined instrument) | **Yes** if required |
| Q-C-02 (E-31 DPO) | DPO determinations for LA-01–LA-17 **if** the combined instrument requires DPO | Appointed DPO | Qualified DPO if/when appointed | Appointment first | **Yes** for combined Legal/DPO | Combined completion expected before Production |
| Q-C-03 (E-32 DPO) | DPO view of L-01–L-17 remaining artefacts (not a second Legal Counsel attestation) | Appointed DPO | Qualified DPO if/when appointed | Appointment first; L-05/L-17 still architecture | **Yes** for combined | **Yes** |
| Q-C-04 (E-15 mapping) | Jurisdiction-specific notification mapping once applicable law facts exist | SEDMC Legal; DPO if/when appointed | SEDMC Legal; DPO if appointed | E-18 facts; E-03 | Partial | **Yes** as Production IR |
| Q-C-05 (E-16 statutory) | Remaining statutory sensitive/special-category characterisation | SEDMC Legal; DPO if/when appointed | SEDMC Legal; DPO if appointed | Internal ≠ statutory already adopted | Partial | **Yes** |
| Q-C-06 (E-17) | Production DPIA / privacy-risk **screening record** (not a fabricated DPIA product) | SEDMC Legal; DPO if/when appointed | SEDMC Legal; DPO if appointed | P2 register ≠ DPIA | **Yes** (screening) | Full DPIA if triggered **Yes** |
| Q-C-07 (E-12 legal) | Legal adequacy review of the privacy notice **after** entity, roles, recipients, and retention exist | SEDMC Legal; DPO if/when appointed | SEDMC Legal; DPO if appointed | E-01, E-07, E-13, architecture for recipients | No (implementation) | **Yes** before public/Production notice |

Do **not** complete Queue C by relabelling THOMAS NGULUMA as DPO.

---

## D. WAIT FOR PRODUCTION ARCHITECTURE

Do **not** collect by assumption. Tanzania preference is **not** a selected location.

| ID | Evidence required | Authoritative source | Responsible party | Dependency | Blocks E1? | Blocks Production? |
| --- | --- | --- | --- | --- | --- | --- |
| Q-D-01 (E-08 / L-05) | Production data-flow map of actual components and geographies | Actual topology | Technical (later) | Architecture selected under a **separate** governed decision | Architecture-dependent (not current E1 map closure) | **Yes — hard** |
| Q-D-02 (E-19) | Selected Production hosting country/region | Architecture decision + vendor evidence | Owner/commercial/technical (later) | Separate governed decision | Architecture-dependent | **Yes** |
| Q-D-03 (E-20) | PostgreSQL Production location | Selected offering | Technical (later) | Architecture | Architecture-dependent | **Yes** |
| Q-D-04 (E-21) | Object-storage provider/location | Selected offering | Technical (later) | Architecture | Architecture-dependent | **Yes** |
| Q-D-05 (E-22) | Backup provider/location and TTL | Selected offering | Technical (later) | Architecture; ADR-0011 TBD | Architecture-dependent | **Yes** |
| Q-D-06 (E-23) | DR location | Selected offering | Technical (later) | Architecture | Architecture-dependent | **Yes** |
| Q-D-07 | Warm-standby location if used | Selected offering | Technical (later) | Architecture; LA-09 not automatically mandatory | Architecture-dependent | **Yes if used** |
| Q-D-08 (E-24) | Production IdP product and geography | Selected offering | Technical/IAM (later) | ADR-0013; architecture | Architecture-dependent | **Yes** |
| Q-D-09 (E-25) | Production email provider/geography | Selected offering | Technical (later) | Architecture | Architecture-dependent | **Yes** |
| Q-D-10 (E-26) | Monitoring/logging services and geographies | Selected offering | Technical/security (later) | Architecture | Architecture-dependent | **Yes** |
| Q-D-11 (E-27) | CDN / WAF providers and locations | Selected offering | Technical (later) | Architecture | Architecture-dependent | **Yes** |
| Q-D-12 (E-28) | KMS/secrets provider and geography | Selected offering | Technical/security (later) | ADR-0012; architecture | Architecture-dependent | **Yes** |
| Q-D-13 (L-17) | Legal review of the **actual** Production topology | Actual topology + Legal Counsel / DPO as applicable | SEDMC Legal; DPO if appointed | Q-D-01–Q-D-12 | Architecture-dependent hard gate | **Yes — hard** |

This queue **must not** select the architecture.

---

## E. WAIT FOR PROVIDER SELECTION

After (not instead of) a later architecture/provider decision.

| ID | Evidence required | Authoritative source | Responsible party | Dependency | Blocks E1? | Blocks Production? |
| --- | --- | --- | --- | --- | --- | --- |
| Q-E-01 (E-11) | Populated Production subprocessor register | Selected vendors’ lists | Technical/commercial (later) | Provider selection | Architecture-dependent | **Yes** |
| Q-E-02 (E-09) | Per-path transfer register (destination, recipient, purpose, duration, data, mechanism, safeguards) | Topology + vendors | SEDMC privacy (later) | E-08 | Architecture-dependent | **Yes** |
| Q-E-03 (E-10 instruments) | Path-specific SCC/IDTA/permit/other mechanism **if** required for actual paths | Vendor + SEDMC Legal + regulator if applicable | SEDMC Legal (later) | Actual paths; do not invent | Architecture-dependent | **Yes** |
| Q-E-04 (E-30) | Provider DPAs, location commitments, flow-down, support-access countries | Selected vendors | SEDMC Legal (later) | Provider selection | Post-provider | **Yes** |
| Q-E-05 (E-29 countries) | Production admin/support countries | Vendor access model | Technical + vendor + SEDMC Legal (later) | Provider selection | Control standard already adopted | **Yes** for actual countries |
| Q-E-06 (E-14) | Production TOMs against the selected stack | Selected stack + SEDMC security | Technical/security (later) | Architecture | Production implementation | **Yes** |

---

## F. LEGAL/PRIVACY FOLLOW-UP

Follow-up that is neither DPO appointment nor architecture selection. Legal Counsel LA/L rules are already adopted; these are **artefact** follow-ups.

| ID | Evidence required | Authoritative source | Responsible party | Dependency | Blocks E1? | Blocks Production? |
| --- | --- | --- | --- | --- | --- | --- |
| Q-F-01 | File E-01 extract against LA-01 conditions (entity still **MISSING** as evidence despite adopted controller framework) | Corporate extract + SEDMC Legal | SEDMC Legal | Q-A-01 / Q-B-01 | **Yes** | **Yes** |
| Q-F-02 | Record PDPC status against L-01 (required vs not required vs registered) without claiming registration | PDPC artefact or documented absence | SEDMC Legal | Q-B-02 | **Yes** while unknown | **Yes** if required |
| Q-F-03 | Complete E-12 notice fields that remain blank (entity, bases where legally applicable, retention, rights, contacts) **after** facts exist | SEDMC Legal | SEDMC Legal | E-01, E-13, E-07, architecture for recipients | No as draft | **Yes** as Production notice |
| Q-F-04 | Convert E-13 TBD periods into approved schedule **without inventing** unused statutes | SEDMC Legal + Finance | SEDMC Legal + Finance | Q-A-06; E-18 | Partial | **Yes** |
| Q-F-05 | Deeper country memos **only if** Q-A-09 later evidences actual subjects/offering/monitoring (ZA, ME, CA, US, LATAM, etc.) | SEDMC Legal | SEDMC Legal | Actual facts; not the target list alone | Only if facts arise | **Yes** if those markets are live |
| Q-F-06 | Align E-06 legal column with executed contracts once Q-B-04 / Q-E-04 exist | Contracts + SEDMC Legal | SEDMC Legal | Contracts | **Yes** for roles | **Yes** |

---

## What this queue must not do

- Select a Production provider, country, region, PostgreSQL location, object store, backup, DR, warm standby, IdP, email, monitoring, CDN, WAF, KMS, or subprocessor set.
- Appoint THOMAS NGULUMA as DPO.
- Invent BRELA numbers, PDPC registration, DPAs, SCCs/IDTA, permits, retention periods, or breach-test reports.
- Authorize UAT, Production, migration, or deployment.
- Re-litigate LA-01–LA-17 or L-01–L-17 Legal Counsel adoption.

---

## Suggested collection order (non-architecture)

1. **E-01 legal-entity extract** (Q-A-01 / Q-B-01)  
2. **PDPC registration status** (Q-B-02)  
3. **Existing contracts** (Q-A-05 / Q-B-04)  
4. **Internal inventory/census/retention inputs** (Q-A-02, Q-A-03, Q-A-06)  
5. **DPO evidence if/when appointed** (Queue C)  
6. **Architecture and provider artefacts** only after a **separate** governed architecture decision (Queues D–E)

---

## Governance status (current)

| Item | Status |
| --- | --- |
| E1-C01 | **LEGAL COUNSEL ATTESTATION COMPLETED — POST-ATTESTATION RECONCILIATION COMPLETE** |
| DPO | **NOT ESTABLISHED** |
| Combined Legal/DPO | **NOT COMPLETE** |
| E1 | **NOT APPROVED / BLOCKED BY MISSING EVIDENCE** |
| UAT / Production / Migration / Deployment | **NOT AUTHORIZED** |
| Production architecture | **UNSELECTED** |

**Exact next governed action:** obtain **SEDMC-specific PDPC registration/status evidence** (E-02, COLLECT NOW — EXTERNAL) and complete the **E-03 company decision / appointment-evidence path** (HUMAN/DPO ACTION) without appointing a DPO in the repository. Keep E-01 extract outstanding. Do not select architecture.

**STOP.**
