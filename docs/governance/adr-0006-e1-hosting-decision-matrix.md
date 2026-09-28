# E1 — Hosting Decision Matrix (Provider-Neutral Framework)

> **`NEUTRAL DECISION FRAMEWORK`**  
> **`NO RANKING`** · **`NO SCORES`** · **`NO WINNER`** · **`NO RECOMMENDATION`**  
> **`NO PROVIDER SELECTED`** · **`NO ARCHITECTURE SELECTED`** · **`NO GEOGRAPHY SELECTED`**  
> **`PRODUCTION / UAT / MIGRATION = NOT AUTHORIZED`**  
> **`E1-B = 0 TRANSMISSIONS — EVERY PROVIDER CELL = EVIDENCE REQUIRED / NOT RECEIVED`**  
> **`SEDMC is NOT Production Ready.`**

**Date:** 2026-09-17.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Canonical class letters:** [`adr-0006-e1-hosting-class-nomenclature-reconciliation.md`](adr-0006-e1-hosting-class-nomenclature-reconciliation.md) (A African managed, B EU/EEA managed, C Tanzania-controlled colo/local, D Hybrid).  
**Intake path:** E1-B3 receipt register + chain of custody + evaluation framework. Status vocabulary there remains **NOT RECEIVED** until an actual response exists.

This matrix evaluates **future** options against evidence categories. Cells are **not** filled with provider capability. Class columns A–D mean “this class **must be tested against the criterion**,” not “this class wins.”

---

## Status vocabulary (this matrix)

| Status | Meaning |
| --- | --- |
| **EVIDENCE REQUIRED** | SEDMC does not yet have the fact |
| **PROVIDER RESPONSE REQUIRED** | Needs an E1-B answer/artefact (currently **NOT RECEIVED**; 0 transmissions) |
| **HUMAN DECISION REQUIRED** | Patrick Makundi / Owner (or named Legal/DPO role) must decide; not a provider fact |
| **OPEN** | Known open governance item; no decision recorded |
| **VERIFIED** | Independently verified — **none** in this matrix today |
| **NOT APPLICABLE** | Criterion does not apply until a later topology exists; justification still required if a provider claims N/A |

Do **not** mark **VERIFIED** from marketing pages or from this preparation.

---

## Business vs technical recovery (preserved distinction)

**Business requirements (company / BCM; S2 sequence formally confirmed):**

| Item | Value | Status |
| --- | --- | --- |
| Jointly critical functions | Commercial/RFP and Programme Building | OPEN as Production topology; sequence **CONFIRMED** (S2) |
| Recovery order | Commercial → Programme Building → Operations → CRM → Finance → Procurement | **VERIFIED** as owner decision (sequence only) |
| Critical-function target | **≤ 3 hours** | Business requirement. **Not demonstrated technically.** |
| Overall target | **≤ 4 hours** | Business requirement. **Not demonstrated technically.** |
| Business data-loss tolerance | **Zero** tolerated loss of **critical business data** | Business requirement. **Not** technical RPO = 0. |

**Technical measurements:**

| Item | Value | Status |
| --- | --- | --- |
| Technical RTO | **NOT DEMONSTRATED** | Must not be filled with ≤3h/≤4h |
| Technical RPO | **NOT DEMONSTRATED** | Must not be filled with 0 |
| Lab PostgreSQL timings | Historical Dev/Test / lab only | **NOT APPLICABLE** as Production evidence |

**Evidence later required to demonstrate the business targets:** PE-20 restore tests; PE-21 PITR; PE-22/PE-42 DR/standby; PE-23/PE-24 provider RTO/RPO claims **independently tested** on the **selected** Production topology (which does not exist); failback test; document-store recovery; environment rebuild. Gate C / Production restore of real EOS state remains **NOT AUTHORIZED**.

---

## Legal / DPO facts (must not be overwritten)

| Item | Fact |
| --- | --- |
| DPO | **Wensley Shirima**, IT Manager, **OWNER-DESIGNATED** |
| Formal appointment evidence | **REQUIRED / NOT RECORDED** |
| Thomas Nguluma | **Legal Counsel only** (15TH SEPTEMBER 2026, A.T.N). **Not DPO.** |
| PDPC | **NOT ESTABLISHED** |
| Combined Legal/DPO | **INCOMPLETE** |
| Entity extract | **NOT VERIFIED** |

---

## A. Legal and regulatory

| Criterion | Status now | Class A–D | RFI Q-ID(s) | PE-ID(s) | Human dependency | Final decision gate |
| --- | --- | --- | --- | --- | --- | --- |
| Tanzania PDPA as design baseline | OPEN (LA-02 adopted as **rule**, not geography approval) | All | Q-C-*, Q-D-01–Q-D-08 | PE-10, PE-11, PE-12, PE-34 | Legal Counsel rules exist; PDPC/E-01 still human/external | E1 / DP-0006 approval after path-specific review |
| Kenya DPA where applicable | EVIDENCE REQUIRED (fact-specific) | All | Q-C-05, Q-N-09 | PE-11 | HUM-04 census | Path-by-path after topology |
| GDPR / UK GDPR where applicable | EVIDENCE REQUIRED (do not exclude; do not assume) | All; B does **not** auto-apply GDPR | Q-C-05, Q-N-09–Q-N-10 | PE-11 | HUM-04 / E-18 | Path-by-path after topology |
| Cross-border transfer | EVIDENCE REQUIRED; no universal mechanism | All | Q-C-05, Q-D-07–Q-D-08, Q-N-09 | PE-11, PE-35 | Legal after destinations exist | Transfer register before Production |
| Controller / processor roles | PROVIDER RESPONSE REQUIRED | All | Q-C-02, Q-N-02 | PE-46, PE-10 | Legal review of drafts | Contracting (not this matrix) |
| Subprocessor controls | PROVIDER RESPONSE REQUIRED | All | Q-A-06, Q-B-17, Q-C-03–Q-C-04, Q-D-06, Q-N-05 | PE-09 | Legal | Subprocessor register before Production |
| Government access | PROVIDER RESPONSE REQUIRED | All | Q-C-10 | PE-36 | Legal | GAP-SEU-04 before Production |
| Regulatory cooperation | PROVIDER RESPONSE REQUIRED | All | Q-C-12 | PE-10, PE-37 | Legal / DPO appointment evidence | Combined Legal/DPO |
| Deletion / retention | PROVIDER RESPONSE REQUIRED | All | Q-C-07–Q-C-08, Q-F-07–Q-F-08, Q-M-10, Q-N-07 | PE-38 | E-13 retention TBD | Before Production |
| Incident notification | PROVIDER RESPONSE REQUIRED | All | Q-C-09, Q-H-14, Q-N-06 | PE-18 | HUM-08 ops; DPO evidence | IR not Production-ready until owner+DPO+provider contacts |

---

## B. Data residency

Keep **hosting, processing, storage, backup, DR, support access, subprocessors** as separate cells. A Tanzania-hosted application does **not** make all processing Tanzanian (LA-17).

| Criterion | Status now | Class A–D | RFI Q-ID(s) | PE-ID(s) | Human dependency | Final decision gate |
| --- | --- | --- | --- | --- | --- | --- |
| Production primary location | OPEN / NOT SELECTED | All | Q-B-01, Q-D-01 | PE-03, PE-34 | HUM-10 geography | DP-0006 / E1 |
| Database location | OPEN / NOT SELECTED | All | Q-B-02, Q-E-* | PE-04, PE-43 | HUM-10 | DP-0006 / E1 |
| Object / document storage | OPEN / NOT SELECTED | All | Q-B-03, Q-F-01–Q-F-10 | PE-05, PE-44 | HUM-10 | DP-0006 / E1 |
| Backup location | OPEN / NOT SELECTED | All | Q-B-04, Q-D-03, Q-E-07 | PE-06, PE-19 | HUM-10 backup geography | ADR-0011 Production product TBD |
| DR location | OPEN / NOT SELECTED | All | Q-B-06, Q-D-04, Q-G-06 | PE-07, PE-22 | HUM-10 DR geography | GAP-DR-01 |
| Support-access geography | PROVIDER RESPONSE REQUIRED | All | Q-B-16, Q-D-05, Q-I-* | PE-08, PE-31 | HUM-10 support geography | LA-16 controls |
| Logging / monitoring geography | PROVIDER RESPONSE REQUIRED | All | Q-B-08–Q-B-09 | PE-16, PE-17 | HUM-10 | LA-17 per service |
| Restricted+ placement | EVIDENCE REQUIRED (internal label ≠ statutory) | All; failover rule LA-14 | Q-C-14, Q-D-02–Q-D-04 | PE-12, PE-34 | HUM-04 census + HUM-10 | GAP-RES-04 |
| Email / IdP / CDN / WAF / KMS geography | OPEN / may be NOT APPLICABLE | All | Q-B-10–Q-B-15, Q-B-13 | PE-39, PE-40, PE-41, PE-14, PE-48 | Separate human strategies below | Per-service L-17 |

---

## C. Security

| Criterion | Status now | Class A–D | RFI Q-ID(s) | PE-ID(s) | Human dependency | Final decision gate |
| --- | --- | --- | --- | --- | --- | --- |
| Encryption at rest | PROVIDER RESPONSE REQUIRED | All | Q-E-10, Q-F-02, Q-H-01–Q-H-03 | PE-13 | None for offering; Legal for location of keys | GAP-SEU-02 |
| Encryption in transit | PROVIDER RESPONSE REQUIRED | All | Q-E-10, Q-F-02, Q-H-01 | PE-13 | None for offering | GAP-SEU-02 |
| Key management | OPEN (ADR-0012 blocked UAT/Prod) | All | Q-B-11, Q-E-11, Q-F-03, Q-H-04 | PE-14 | HUM-06 KMS strategy | ADR-0012 |
| Secrets management | OPEN (Dev env only) | All | Q-B-12, Q-H-05 | PE-48 | HUM-06 | ADR-0012 |
| MFA | OPEN (not in EOS; IdP unselected) | All | Q-H-06–Q-H-08, Q-I-07 | PE-15 | HUM-05 IdP; GAP-IDN-02 | ADR-0013 + Production IdP |
| Identity integration | OPEN (local-password-dev only) | All | Q-B-10, Q-M-08 | PE-15, PE-40 | HUM-05 IdP strategy | ADR-0013 |
| Privileged access | PROVIDER RESPONSE REQUIRED | All | Q-E-12, Q-H-06–Q-H-08, Q-I-* | PE-15, PE-31 | HUM-08 ops ownership | Production IAM |
| Audit logging | IMPLEMENTATION/TESTING in Dev; Production unproven | All | Q-E-13, Q-H-09–Q-H-10 | PE-16 | Retention human decision | GAP-OBS-01/02 |
| Security monitoring | PROVIDER RESPONSE REQUIRED | All | Q-B-09, Q-H-09–Q-H-16 | PE-17, PE-32 | HUM-08 | GAP-OBS-01 |
| Vulnerability management | PROVIDER RESPONSE REQUIRED | All | Q-H-15–Q-H-16, Q-J-03–Q-J-04 | PE-32 | HUM-08 | Before Production |

---

## D. Recovery

| Criterion | Status now | Class A–D | RFI Q-ID(s) | PE-ID(s) | Human dependency | Final decision gate |
| --- | --- | --- | --- | --- | --- | --- |
| Technical RTO | **NOT DEMONSTRATED** | All | Q-G-*, Q-E-08–Q-E-09 | PE-23, PE-20 | Owner **accepts** measured value vs ≤3h/≤4h | GAP-REC-01/02 — Production tests |
| Technical RPO | **NOT DEMONSTRATED** | All | Q-G-*, Q-E-04–Q-E-06 | PE-24, PE-21 | Owner **accepts** failure-model RPO; must not equal “business zero” automatically | GAP-REC-02 |
| Backup frequency | PROVIDER RESPONSE REQUIRED (ADR-0011 19:00 EAT is a **future Production** requirement, product TBD) | All | Q-E-07, Q-G-03, Q-H-03 | PE-19 | HUM-10 backup geography | ADR-0011 Production |
| PITR | PROVIDER RESPONSE REQUIRED; adoption **HUMAN DECISION REQUIRED** | All | Q-B-05, Q-E-05–Q-E-06, Q-G-04 | PE-21 | PITR adopt/qualify | GAP-BKP-02 |
| Restore time | PROVIDER RESPONSE REQUIRED; then **test** | All | Q-E-08–Q-E-09, Q-G-05 | PE-20, PE-23 | Owner acceptance | Production restore — NOT AUTHORIZED |
| Database recovery | PROVIDER RESPONSE REQUIRED | All | Q-E-03–Q-E-09, Q-E-16 | PE-20, PE-43 | — | Gate C remainder NOT AUTHORIZED |
| Document recovery | PROVIDER RESPONSE REQUIRED | All | Q-F-06–Q-F-10 | PE-05, PE-20, PE-44 | — | GAP-PER-03 |
| Environment recovery | EVIDENCE REQUIRED | All | Q-G-11–Q-G-12, Q-M-12 | PE-22, PE-47 | HUM-08 | GAP-REC-01 |
| Failover | PROVIDER RESPONSE REQUIRED; Production failover **NOT AUTHORIZED** | All | Q-G-09–Q-G-10, Q-J-10 | PE-22, PE-42 | Warm-standby decision | GAP-DR-02 |
| Failback | PROVIDER RESPONSE REQUIRED | All | Q-G-09–Q-G-10 | PE-22 | Same | GAP-DR-02 |
| Recovery testing | PROVIDER RESPONSE REQUIRED; lab ≠ Production | All | Q-E-09, Q-G-05, Q-G-11–Q-G-12 | PE-20, PE-22 | HUM-08 | GAP-REC-01 |
| Evidence quality | NOT RECEIVED (0 transmissions) | All | All G/E restore Qs | PE-20–PE-24 | Independent verification **after** receipt | E1-B3 VERIFIED (forbidden until verification occurs) |

---

## E. Architecture

| Criterion | Status now | Class A–D | RFI Q-ID(s) | PE-ID(s) | Human dependency | Final decision gate |
| --- | --- | --- | --- | --- | --- | --- |
| PostgreSQL durable SoR | Direction documented; Production instance **NOT SELECTED** | All | Q-E-01–Q-E-16 | PE-04, PE-43 | Architecture class later | GAP-PER-01 — do not promote Dev PG |
| Redis / search projections | Dev compose Redis only; Production product **UNSELECTED** | All | offering-dependent | — | Include/exclude in topology | NOT APPLICABLE until topology |
| Event transport | Dev in-memory-dev; Production NATS **UNSELECTED** | All | topology-dependent | — | Event-product later | ADR-0004 / GAP-PER-02 |
| Object / document storage | Dev LocalFs; Production adapter **UNSELECTED** | All | Q-F-01–Q-F-10 | PE-05, PE-44 | Object-store class | GAP-PER-03 |
| Application runtime | Dev local; Production runtime **UNSELECTED** | All | Q-B-01, Q-J-*, Q-K-* | PE-03, PE-26–PE-27 | GAP-HST-02 | DP-0006 |
| Portability | Requirement exists; unproven on a named offering | All | Q-E-15, Q-F-10, Q-M-01–Q-M-14 | PE-28, PE-29, PE-47 | Prefer portable PG/containers (Stage 1) — **not a selected stack** | Exit review before contract |
| Infrastructure-as-code | **Must not lock** until DP-0006 approved (GAP-DEP-02) | All | Q-M-* | PE-47 | DP-0006 approval | After approval only |
| Migration strategy | **NOT AUTHORIZED** | All | Q-L-01, Q-M-07–Q-M-08, Q-M-12 | PE-29, PE-47 | Gate C / owner | GAP-DEP-01 / GAP-PER-05 |

---

## F. Operations

| Criterion | Status now | Class A–D | RFI Q-ID(s) | PE-ID(s) | Human dependency | Final decision gate |
| --- | --- | --- | --- | --- | --- | --- |
| SLA | PROVIDER RESPONSE REQUIRED | All | Q-I-*, Q-J-*, Q-N-* | PE-25 | HUM-09 budget vs hours | GAP-OPS-03 |
| Support model | PROVIDER RESPONSE REQUIRED | All | Q-I-01–Q-I-10 | PE-31 | HUM-08 | GAP-OPS-01 |
| Support geography | PROVIDER RESPONSE REQUIRED | All | Q-B-16, Q-D-05 | PE-08 | HUM-10 | LA-16 |
| Incident response | E-15 draft only | All | Q-C-09, Q-H-14, Q-N-06 | PE-18 | HUM-08; DPO evidence | GAP-OPS-02 |
| Monitoring | PROVIDER RESPONSE REQUIRED | All | Q-B-09, Q-H-09–Q-H-10 | PE-17 | HUM-08 | GAP-OBS-01 |
| Maintenance / patching | PROVIDER RESPONSE REQUIRED | All | Q-E-14, Q-J-03–Q-J-04 | PE-25, PE-31 | HUM-08 | Before Production |
| Operational ownership | HUMAN DECISION REQUIRED | All | — | — | HUM-08 restore/on-call/backup owners | GAP-OPS-01 |

---

## G. Commercial

All cost cells: **PROVIDER RESPONSE REQUIRED** and **HUMAN DECISION REQUIRED** (HUM-09 TCO-first / budget **not fixed**). Do not invent numbers.

| Criterion | Status now | RFI Q-ID(s) | PE-ID(s) | Human dependency | Final decision gate |
| --- | --- | --- | --- | --- | --- |
| Setup | PROVIDER RESPONSE REQUIRED | Q-L-01–Q-L-08 | PE-30 | HUM-09 | GAP-TCO-01 |
| Monthly / annual | PROVIDER RESPONSE REQUIRED | Q-L-* | PE-30 | HUM-09 | GAP-TCO-01 |
| Implementation / migration | PROVIDER RESPONSE REQUIRED; migration **NOT AUTHORIZED** | Q-L-01, Q-M-12 | PE-30, PE-29 | HUM-09 | Quotes ≠ authorization |
| Backup / DR / standby / bandwidth / egress / support / recovery testing | PROVIDER RESPONSE REQUIRED | Q-L-*, Q-G-*, Q-I-* | PE-30, PE-42 | HUM-09 | GAP-TCO-02 currency/tax/exit |
| Taxes / minimum commitments / termination / data retrieval | PROVIDER RESPONSE REQUIRED | Q-L-05–Q-L-07, Q-N-*, Q-M-* | PE-30, PE-33, PE-45, PE-29 | Finance / HUM-09 / HUM-14 signatory | Contracting — **not** this matrix |

Class columns A–D: **all** commercial rows apply to every class. No class is cheaper or more expensive in this file.

---

## H. Exit / portability

| Criterion | Status now | RFI Q-ID(s) | PE-ID(s) | Human dependency | Final decision gate |
| --- | --- | --- | --- | --- | --- |
| Data export | PROVIDER RESPONSE REQUIRED | Q-E-15, Q-F-10, Q-M-01–Q-M-14, Q-C-07 | PE-28, PE-29, PE-38 | Legal deletion/return | Before contract |
| PostgreSQL portability | PROVIDER RESPONSE REQUIRED | Q-E-15 | PE-28, PE-43 | Prefer portable SoR — not a vendor pick | DP-0006 |
| Container portability | EVIDENCE REQUIRED | Q-M-* | PE-47 | Do not lock IaC now | GAP-DEP-02 |
| Infrastructure portability | EVIDENCE REQUIRED | Q-M-* | PE-47 | DP-0006 | After approval |
| Contract exit | PROVIDER RESPONSE REQUIRED | Q-N-*, Q-L-05–Q-L-07 | PE-29, PE-33 | HUM-14 MSA signatory | Contracting |
| Deletion verification | PROVIDER RESPONSE REQUIRED | Q-C-07, Q-M-10 | PE-38 | Legal | Before Production |
| Migration assistance | PROVIDER RESPONSE REQUIRED; **migration NOT AUTHORIZED** | Q-M-07–Q-M-08, Q-M-12 | PE-29, PE-47 | Owner / Gate C | GAP-DEP-01 |

---

## Provider-evidence traceability (Task D)

Intake: preserve original → `RCPT-nnn` / `SUB-nnn` → receipt register → chain of custody → evaluation framework domains. **Receipt ≠ verification.** Current receipt register: **empty**.

| Decision criterion (summary) | RFI question ID(s) | Evidence requirement ID(s) | Human decision dependency | Final decision gate |
| --- | --- | --- | --- | --- |
| Legal/privacy/regulatory | Q-C-01–Q-C-14, Q-N-02, Q-N-09–Q-N-10 | PE-10, PE-11, PE-36, PE-37, PE-46 | E-01/E-02/E-03; Combined Legal/DPO | E1 close / contracting |
| Residency / geography | Q-B-01–Q-B-18, Q-D-01–Q-D-08, Q-F-04 | PE-03–PE-08, PE-12, PE-34, PE-35 | HUM-10 | DP-0006 / E1 |
| Cross-border | Q-C-05, Q-D-07–Q-D-08, Q-N-09 | PE-11, PE-35 | Legal after destinations | Transfer register |
| Subprocessors | Q-A-06, Q-B-17, Q-C-03–Q-C-04, Q-D-06, Q-N-05 | PE-09 | Legal | Production register |
| Government access | Q-C-10 | PE-36 | Legal | GAP-SEU-04 |
| Hosting / capacity / SLA | Q-B-01, Q-J-01–Q-J-10, Q-K-01–Q-K-10, Q-I-* | PE-03, PE-25–PE-27, PE-31 | HUM-08/09 | DP-0006 |
| PostgreSQL SoR | Q-E-01–Q-E-16 | PE-04, PE-43 | Architecture later | GAP-PER-01 |
| Backup | Q-B-04, Q-E-07, Q-F-06, Q-G-03, Q-H-03 | PE-06, PE-19 | HUM-10 backup geo | ADR-0011 |
| PITR | Q-B-05, Q-E-05–Q-E-06, Q-G-04 | PE-21 | PITR adoption | GAP-BKP-02 |
| DR / failover / standby | Q-B-06–Q-B-07, Q-G-06, Q-G-09–Q-G-12, Q-J-10 | PE-07, PE-22, PE-42 | HUM-10 DR; warm-standby | GAP-DR-01/02 |
| Restricted+ | Q-C-14, Q-D-02–Q-D-04 | PE-12, PE-34 | HUM-04 + HUM-10 | GAP-RES-04 |
| Encryption / KMS / secrets | Q-E-10–Q-E-11, Q-F-02–Q-F-03, Q-H-01–Q-H-05, Q-B-11–Q-B-12 | PE-13, PE-14, PE-48 | HUM-06 | ADR-0012 |
| Identity / MFA | Q-B-10, Q-E-12, Q-H-06–Q-H-08, Q-I-07, Q-M-08 | PE-15, PE-40 | HUM-05 | ADR-0013 |
| Logging / monitoring | Q-B-08–Q-B-09, Q-E-13, Q-H-09–Q-H-10 | PE-16, PE-17 | HUM-08 | GAP-OBS-01 |
| CDN / WAF | Q-B-14–Q-B-15, Q-H-12–Q-H-13 | PE-41 | CDN/WAF strategy | GAP-SEU-01 |
| IR | Q-C-09, Q-H-14, Q-N-06 | PE-18 | HUM-08; DPO evidence | GAP-OPS-02 |
| Deletion / retention | Q-C-07–Q-C-08, Q-F-07–Q-F-08, Q-M-10, Q-N-07 | PE-38 | E-13 | Before Production |
| Portability / exit | Q-E-15, Q-F-10, Q-M-01–Q-M-14 | PE-28, PE-29, PE-47 | HUM-14 | Contract |
| TCO | Q-L-01–Q-L-08 | PE-30, PE-45 | HUM-09 | GAP-TCO-01/02 |
| Technical RTO/RPO claims | Q-G-*, Q-E-08–Q-E-09 | PE-20, PE-23, PE-24 | Owner acceptance of **measured** values | GAP-REC-01/02 |
| Tanzania hosting capability | Q-D-01–Q-D-04 | PE-34 | HUM-10; preference ≠ approval | DP-0006 |
| Email geography (if in scope) | Q-B-13 | PE-39 | Email product later | GAP-INF-02 |
| Insurance / liability | Q-N-* | PE-45 | Legal / Finance | Contracting |

**No scores. No rankings. No inferred provider capability.** Every PE/Q row is **NOT RECEIVED**.

---

## Human-decision dependency map (Task E)

Decision owner unless noted: **Patrick Makundi, Owner (PDM)**. Legal Counsel (Thomas Nguluma) advises; **does not** select hosting. DPO owner-designation (Wensley Shirima) **does not** replace formal appointment evidence.

| Item | Current status | Evidence required | Decision owner | Prerequisite | Downstream impact |
| --- | --- | --- | --- | --- | --- |
| Hosting class (A–D) | **OPEN / UNSELECTED** | E1-B responses; this matrix filled from **verified** evidence | Owner | Nomenclature confirmation (§recon); provider evidence | DP-0006 option; IaC lock window; GAP-DEP-02 |
| Production geography | **NOT SELECTED** | PE-03 plus Legal path review | Owner + Legal | Class; E-01/E-02 as needed for identity/privacy completeness | Transfers; latency; TCO |
| Backup geography | **NOT SELECTED** | PE-06, PE-19 | Owner + Legal | Primary geography; LA-07 | ADR-0011; transfers |
| DR geography | **NOT SELECTED** | PE-07, PE-22 | Owner + Legal | Whether DR is used; LA-08/LA-14 | GAP-DR-01; Restricted+ copies |
| Warm standby | **NOT SELECTED** (not legally automatic — LA-09) | PE-42 | Owner | DR/HA evidence; cost | Topology; TCO |
| Budget | **NOT YET FIXED** (TCO-first) | Quotes PE-30 | Owner / Finance | Quotes exist (0 transmissions) | GAP-TCO-01; contracting |
| Acceptable TCO envelope | **HUMAN DECISION REQUIRED** | Quotes + tax/exit fields | Owner | HUM-09 | Which classes remain affordable |
| Cross-border posture | **OPEN** (rules exist; destinations do not) | PE-11, PE-35; census HUM-04 | Owner + Legal | Destinations | Transfer instruments |
| Restricted+ placement | **OPEN** | Census + copy locations | Owner + Legal | HUM-04; topology | Failover legality |
| Support geography | **NOT SELECTED** | PE-08, PE-31 | Owner + Legal | LA-16 | Foreign access controls |
| KMS strategy | **OPEN** (ADR-0012) | PE-14, PE-48 | Owner / IT | Hosting class | Encryption envelope |
| IdP strategy | **OPEN** (ADR-0013) | PE-15, PE-40; current-state HUM-05 | Owner / IT | Corporate IdP inventory | MFA; GAP-IDN-01/02 |
| CDN / WAF strategy | **OPEN** | PE-41 | Owner / IT | Whether edge is in topology | GAP-SEU-01; possible transfer |
| PITR adoption | **OPEN** | PE-21 | Owner / IT | Failure model; Legal for WAL location | GAP-BKP-02; RPO design |
| Final architecture | **UNSELECTED** | Completed matrix + Legal/DPO completeness as required for the chosen paths | Owner | Class + geographies + evidence | ADR-0006 / DP-0006 / E1 |
| Production authorization | **NOT AUTHORIZED** | All of the above plus Gate C remainder | Owner | DP-0006 approved; E1 approved | UAT/deploy/migrate still separate gates |
| Canonical C/D letters | Reconciliation **PREPARED** | This sprint’s recon file | Owner | None (no provider needed) | GAP-GOV-05 at pack time |
| RFI actual send | **AUTHORIZED / NOT TRANSMITTED** | Send artefacts | Patrick Makundi as named sender | Execution sheet | GAP-GOV-04; all PROVIDER RESPONSE rows |

Do **not** treat any row as decided by this matrix.

---

## What this matrix must not be used for

- Selecting, ranking, scoring, or recommending a provider or class  
- Claiming technical RTO/RPO  
- Authorizing Production, UAT, or migration  
- Filling cells from public marketing  

**Next use:** after **actual** E1-B responses are received and registered under E1-B3, copy answers into intake — still without scoring — then present a later owner pack.

**SEDMC is NOT Production Ready.**
