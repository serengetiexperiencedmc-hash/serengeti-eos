# H-175 — Production Evidence-Collection Requirements Package

> **GOVERNANCE / EVIDENCE-REQUIREMENTS PREPARATION ONLY**  
> Prepares the evidence-collection **list and requirements package** authorized by H-174 **D03**.  
> **NOT** evidence collection. **NOT** sending of requests. **NOT** provider, legal, or commercial contact.  
> **NOT** Production implementation authorization. **NOT** GCP provisioning, replica creation, deployment, legal conclusion, commercial commitment, or DR test.  
> Historical ADR-0006, DP-0006, H-170, H-171, H-172, H-173, and H-174 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 669  
**Porcelain after this increment:** 670 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP / credentials / DNS / IAM / KMS:** **NONE**  
**Vendor contact / legal engagement / purchase / quotation:** **NONE**  
**Evidence requests sent:** **NONE**  
**Evidence collected:** **NONE**  
**Commit / push:** **NONE**  
**H-176:** **NOT CREATED**

```text
H-175 STATUS = COMPLETE — REQUIREMENTS PACKAGE PREPARED; COLLECTION NOT EXECUTED
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

H-174 D03 authorized **preparation** of this package. It did **not** authorize sending requests or treating any item as received. No repository evidence was found that collection has occurred. Nothing in this increment is marked RECEIVED or ACCEPTED.

---

## 1. Repository baseline (inspected)

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain at start | 669 (matches H-174 after-count) |
| H-174 path | `docs/governance/h-174-controlled-poa-decision-record.md` |
| H-174 status | **COMPLETE** |
| Evidence-preparation authorization (D03) | **YES** — preparation only |
| Evidence collection executed | **NO** |
| Production implementation authorized | **NO** |
| GCP resources | **NONE** |

---

## 2. Authoritative architecture

No new architecture is introduced or selected. H-169 remains the selected **direction**, not Production-approved (H-174 D02):

| Topic | Direction |
| --- | --- |
| Primary region | `africa-south1` |
| Secondary DR region | `europe-west1` |
| Cloud SQL edition | Enterprise Plus |
| DR mechanism | Advanced DR with designated DR replica |
| Machine-series pairing | N2 |
| RTO requirement | ≤ 4 hours |
| RPO requirement | ≤ 1 hour |
| Application DR | Active-passive **direction** |
| Database failover vs EOS failover | Cloud SQL failover is **not** complete EOS application failover |

Production implementation remains **NOT AUTHORIZED**. GCP resources remain **NONE**. DR testing remains **NOT PERFORMED**.

H-172 packs **E01–E10** remain the parent evidence classes. This increment **expands** them into requestable requirements. It does **not** collect them.

---

## 3. Evidence package register

**Evidence owner** for every row: **OPEN — OWNER ASSIGNMENT REQUIRED**. Names are **not** invented.

**Required date / freshness:** every artefact must carry an evidence date. Unless a later increment specifies otherwise, evidence used for a Production decision must be current at the time of that decision and refreshed if the provider product, contract, or EOS surface has changed. **No collection date exists** because nothing has been requested.

**Current status for every row:** **NOT REQUESTED** / **NOT COLLECTED**.

Evidence classes (see §9): (1) provider documentation; (2) provider-specific confirmation; (3) commercial quotation; (4) legal/contractual review; (5) implementation evidence; (6) runtime validation; (7) measured EOS RTO/RPO. H-169/H-170 already cite class (1) for some products; class (1) is **not** treated as (2), (5), (6), or (7).

| Evidence ID | Related P-item | Category | Exact evidence requested | Source/authority | Acceptance criteria | Dependencies | Follow-up governance gate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| EV-G01 | P01 | Governance | Written Production grant **or** continued deferral after H-171 §5 review | Owner/POA | Explicit scoped grant document; not inferred from architecture | H-171 §5; remaining P-items | Production-authorization increment (later) |
| EV-C01 | P02 | Commercial / operational | Named GCP billing entity, project-ownership model, support-arrangement **policy**, budget-control policy — **without** creating a project | Owner/POA + commercial | Named model and policy; not a live project | D01 deferral | Ownership/billing decision (later) |
| EV-T01 | P03 | Technical — PostgreSQL | EOS–Plus compatibility pack: supported PG versions vs EOS migrate/runtime (H-172 E02) | Engineering + provider docs (class 1) then EOS tests (class 5) | Dated test report against named versions; Dev/Test 16-class is **not** Production closure | ADR-0003 Dev-only | P03 version decision after review |
| EV-T02 | P03 / P15 | Technical — PostgreSQL | Extensions, collations, and database features used by EOS; upgrade/migration implications | EOS codebase inventory + Cloud SQL support matrix | Feature list mapped to Plus support; gaps recorded | EV-T01 | P03 / P15 |
| EV-T03 | P03 / P17 | Technical — PostgreSQL | Advanced DR prerequisites vs chosen PG version (designated replica, edition, private IP) | Provider docs (class 1) + later instance confirmation (class 2/5) | Prerequisites listed; version not selected here | H-169; EV-P01 | P03 then P17 |
| EV-T04 | P04 | Technical — workload | Workload inputs listed in §4.B. **No invented figures.** | Owner/ops + engineering (sources TBD) | Dated attributable measurements or Owner-accepted estimates labelled as estimates | None for **collection of inputs** | P04 sizing after review |
| EV-T05 | P04 | Technical — sizing | Sizing proposal derived from EV-T04 (vCPU/memory/storage). **Not selected here.** | Engineering after EV-T04 | Proposal cites EV-T04; N2 series remains the pairing constraint | EV-T04; H-169 N2 | P04 Owner confirmation |
| EV-T06 | P05 | Technical — connectivity | PSA vs PSC comparison pack (§4.C). **Path not selected.** | Network design (class 1 + design note) | Named differences, failover implications, write-endpoint conditions | H-169 write-endpoint conditions | P05 path decision |
| EV-T07 | P05 / P09 | Technical — connectivity | Application-to-database and cross-region DR connectivity design | Network design | Paths for `africa-south1` and `europe-west1` described; not built | EV-T06 | P05 / P09 |
| EV-T08 | P06 | Technical — encryption | Google-managed vs CMEK comparison (§4.D). **Product not selected.** H-159: CMEK not mandatory. | Security design (class 1) | Binary options, key-location/IAM/rotation **if** CMEK | H-159 | P06 direction |
| EV-T09 | P06 / P07 | Technical — KMS/secrets | Secrets storage, rotation, service identity, least privilege, break-glass (§4.D). ADR-0012 remains proposed-blocked. | Security design | Options without credentials being created | ADR-0012 | P07 |
| EV-T10 | P08 | Technical — identity | Corporate IdP facts, MFA capability, SSO, tenant existence. **Do not invent tenant.** | Corporate directory (class 2/external) | Attributable directory facts | HUM-05 NOT ESTABLISHED | P08 / ADR-0013 |
| EV-T11 | P08 | Technical — identity | IAM roles, service accounts, privileged access, access reviews, emergency access **design** (not configured) | Identity design | RACI of **roles**, not invented people | EV-T10; P13 | P08 |
| EV-A01 | P09 | Application DR | Active-passive Cloud Run DR package (§5). Distinct from database DR. | Application architecture | Package covers artefact, config, auth, dependencies; **not deployed** | P05, P07, P08, P10 | P09 design |
| EV-A02 | P10 | Application DR | Write-endpoint vs app-URL DNS/routing strategy (§5). **No DNS records.** | Application + DNS design | Written strategy; Cloud DNS API is later implementation | EV-T06 | P10 |
| EV-A03 | P09 / P20 | Application DR | Post-failover application validation criteria (startup, auth, events, email, logging) | Application architecture | Criteria defined **before** any test; test itself is P19/P20 | EV-A01, EV-A02 | P19 then P20 |
| EV-P01 | P14 / E01 | Provider | Provider-specific confirmation of Plus + Advanced DR + designated replica + N2 in **both** regions at create time | Provider (class 2) | Dated confirmation for `africa-south1` and `europe-west1`; generic docs insufficient | P01 for a real project | After implementation authorization |
| EV-P02 | P14 / E03 | Provider | Advanced DR prerequisites: designated replica, backup/PITR hygiene, HA recommendations, write-endpoint conditions | Provider (class 1 then 2) | Prerequisite list current at decision date | H-169/H-170 class-1 citations | P17 design |
| EV-P03 | P16 / E05 | Provider | Backup location `africa-south1`; PITR geography/WAL behaviour | Provider (class 1 then 5) | Direction already H-160/H-162; **applied** config is later | P01, P03, P04 | P16 |
| EV-P04 | P12 / E01 | Provider | Region availability and service limitations for the selected architecture | Provider (class 1 then 2) | Dated; distinguishes docs from confirmation | H-169 | Before instance create |
| EV-P05 | P17 | Provider | Failover and switchback behaviour; replica billed as standalone; backups not on replica until promotion | Provider (class 1 then 6) | Docs ≠ measured EOS RTO/RPO | EV-P02 | P19/P20 |
| EV-M01 | P12 / E07 | Commercial | Pricing-calculator **inputs** for categories in H-172 E07. **No totals invented.** | Commercial (class 3) | Inputs listed; outputs obtained only after later send-authorization | EV-T05; architecture | P12 |
| EV-M02 | P12 / E07 | Commercial | Quotation requirements: Plus primary, replica, HA, storage, backup/PITR, cross-region transfer, Cloud Run, network, logging, monitoring, KMS/secrets, support | Commercial (class 3) | Dated quotes covering listed categories | EV-M01 | P12 approval |
| EV-M03 | P02 / P12 | Commercial | Support arrangements (not 24/7 NOC inferred) | Commercial + Owner | Named support **policy**, not invented SLA hours | EV-C01 | P02 / P12 |
| EV-L01 | P11 / E08 | Legal / residency | Data categories that would enter the DR replica | Owner + Legal (inventory) | Category list; no PDPC/legal conclusion | H-157 EOS boundary | P11 review |
| EV-L02 | P11 / E08 | Legal / residency | Belgium residency; provider terms; DPA; subprocessors; transfer mechanisms; encryption; retention/deletion; backup/DR access; incident responsibilities; contractual support | Legal Counsel (class 4) | Written review; **no acceptance recorded here** | EV-L01; H-168/H-169 | P11 accept or refuse |
| EV-O01 | P13 / E09 | Operational | HUM-08 named RACI: service, database, application, on-call, escalation, incident authority, runbook owner, failover/switchover authority, post-failover validation, evidence custody, DR-test authorization | Owner/POA | Named people; **names not invented in this increment** | H-154 items 16–17 | P13 assignment |
| EV-O02 | P18 | Operational | Executable Production DR runbook covering H-170 runbook content | Runbook owner after EV-O01 | Approved runbook; not a substitute for P19/P20 | EV-O01; EV-A01 | P18 then P19 |
| EV-V01 | P19 | Validation | Separate written authorization for a controlled EOS DR test | Owner/POA | Explicit test grant; not inferred from architecture or provider docs | P01, P13, P17, P18, EV-A03 | P19 |
| EV-V02 | P20 / E10 | Validation | Measured EOS RTO ≤4h and RPO ≤1h from an authorized test | DR test owner | Dated measurements; provider docs **cannot** substitute | EV-V01 | Item 24 / readiness |

H-172 **E01–E10** map as: E01→EV-P01/EV-P04; E02→EV-T01/EV-T02; E03→EV-P02; E04→EV-T06/EV-T07; E05→EV-P03; E06→EV-T08/EV-T09; E07→EV-M01/EV-M02; E08→EV-L01/EV-L02; E09→EV-O01; E10→EV-V02.

---

## 4. Technical evidence

### A. PostgreSQL compatibility (EV-T01, EV-T02, EV-T03)

**Request (not sent):** evidence covering supported PostgreSQL versions on Cloud SQL Enterprise Plus; EOS migrate/runtime compatibility; extensions and database features in use; migration/upgrade implications; Plus compatibility; Advanced DR prerequisites for the version under consideration.

**Must not:** select the Production PostgreSQL version. ADR-0003 PostgreSQL 16 remains **Development SoR** only. Lab 16.15 is **not** a Production lock. Plus documentation that lists PG 12–18 is class (1), not EOS evidence.

**Acceptance:** dated feature/version matrix plus EOS test report against named candidate versions. Gaps remain OPEN.

### B. Workload and sizing (EV-T04, EV-T05)

**Required inputs (not invented):** expected transaction patterns; concurrent users/connections; database size and growth; peak operating periods; storage growth; backup/PITR requirements; performance and availability expectations (including RTO ≤4h / RPO ≤1h as **requirements**, not measurements).

**Must not:** invent workload figures or select instance sizes. N2 is the **series** pairing (H-169), not a vCPU/memory/storage selection.

**Acceptance:** attributable inputs; estimates labelled as estimates; sizing proposal cites those inputs.

### C. Connectivity (EV-T06, EV-T07)

**Request (not sent):** comparison of PSA and PSC; application-to-database connectivity; cross-region DR connectivity; access controls; TLS; operational complexity; failover implications (including write-endpoint conditions: Plus + private IP; PSA and PSC are distinct).

**Must not:** select PSA or PSC.

**Acceptance:** a design note that names differences and failover behaviour without implementing VPC, PSA, or PSC.

### D. Encryption, KMS, and secrets (EV-T08, EV-T09)

**Request (not sent):** Google-managed encryption vs CMEK; key ownership and rotation; key recovery implications; secrets storage; rotation; service identity; least privilege; break-glass access.

**Must not:** select an encryption or KMS product configuration, create keys, or create secrets. H-159: CMEK is **not** mandatory; the binary direction remains **OWNER/POA DECISION REQUIRED**.

**Acceptance:** options paper; if CMEK is later chosen, key location/IAM/rotation design is required **before** key creation.

### E. Identity and access (EV-T10, EV-T11)

**Request (not sent):** IdP compatibility; MFA; service accounts; IAM roles; privileged access; access reviews; emergency access.

**Must not:** create or configure identities, tenants, or MFA. Do not invent a corporate directory.

**Acceptance:** attributable corporate identity facts; then an IdP/MFA options paper. ADR-0013 remains `proposed — blocked for Production` until a later decision.

---

## 5. Application DR evidence (EV-A01, EV-A02, EV-A03)

Application DR is **distinct** from database DR. Cloud SQL failover does **not** automatically recover the complete EOS application.

**Requirements to prepare (not implement):**

- Cloud Run deployment strategy (active-passive behaviour);
- configuration replication;
- secrets availability in the DR path;
- database endpoint handling;
- write-endpoint strategy;
- DNS/routing;
- authentication;
- external dependencies;
- event and email transport;
- logging and monitoring;
- application startup and recovery;
- post-failover validation criteria.

**Must not:** deploy Cloud Run, create DNS, or claim that a database replica completes EOS DR.

**Acceptance:** written app-DR design covering the list above, still **not deployed**. Runtime proof is EV-V01/EV-V02 only.

---

## 6. Provider and commercial evidence (EV-P01–EV-P05, EV-M01–EV-M03)

**Prepare, do not send,** requirements for:

- provider-specific Enterprise Plus confirmation;
- Advanced DR prerequisites;
- designated DR replica support;
- supported PostgreSQL versions;
- connectivity;
- backup/PITR behaviour;
- failover and switchback;
- replication and transfer charges;
- region availability;
- service limitations;
- pricing calculator inputs;
- quotation requirements;
- support arrangements.

**Class distinction:** H-169/H-170 **provider documentation** is class (1). It is **not** provider-specific confirmation (2), **not** a quotation (3), and **not** EOS runtime evidence (6/7). Replica billed as a standalone instance and cross-region transfer charges are **known categories** (H-170/H-172); **amounts** remain unknown.

**Must not:** invent pricing, contact any external party, or obtain quotes during H-175.

**Acceptance (later):** dated class-(2) confirmation and class-(3) quotes covering H-172 E07 categories, reviewed before P12 approval.

---

## 7. Legal and residency evidence (EV-L01, EV-L02)

**Requirements for later review (not a legal conclusion):**

- data categories entering the DR replica;
- Belgium residency (`europe-west1` DR-only exception, H-168/H-169);
- provider terms;
- DPA;
- subprocessors;
- applicable transfer mechanisms;
- encryption;
- retention and deletion;
- backup/DR access;
- incident responsibilities;
- contractual support obligations.

**No legal conclusion or Belgium acceptance has been granted.** H-168 remains in-principle; H-169 refined the exception to DR-only `europe-west1`. No DPA is on file in this increment.

**Must not:** contact legal advisers or record acceptance/refusal here.

**Acceptance (later):** written Legal Counsel review, then Owner accept **or** refuse (H-173 P11).

---

## 8. Operational evidence (EV-O01, EV-O02)

**Requirements (roles, not names):**

- HUM-08 ownership;
- service owner;
- database owner;
- application owner;
- on-call roster;
- escalation path;
- incident authority;
- runbook owner;
- failover/switchover authority;
- post-failover validation;
- evidence custody;
- DR test authorization.

PDM remains recorded as an escalation path in prior governance; specialist posts remain **UNASSIGNED**. No 24/7 NOC is inferred.

**Must not:** invent names or assign operational ownership in this increment.

**Acceptance (later):** named RACI by Owner Session; then a runbook. A runbook is **not** a DR test.

---

## 9. Evidence acceptance rules

Evidence must be:

- attributable to a reliable source;
- dated;
- relevant to the exact decision;
- sufficiently specific;
- distinguishable from assumptions;
- reviewed before acceptance;
- traceable to its related governance item.

**Seven classes — do not collapse them:**

1. **Provider documentation** (generic public product pages). Already used in H-159–H-170 for architecture selection. **Not** measured EOS recovery.
2. **Provider-specific confirmation** (dated confirmation for SEDMC’s intended project/regions/edition).
3. **Commercial quotation** (calculator outputs and/or quotes).
4. **Legal/contractual review** (counsel/contract artefacts).
5. **Implementation evidence** (applied configuration on real resources after a later grant).
6. **Runtime validation** (controlled tests of configured systems).
7. **Measured EOS RTO/RPO evidence** (actual EOS measurements from an authorized DR test).

Provider documentation **must not** be treated as measured EOS recovery evidence. Receipt **must not** be treated as acceptance. Acceptance **must not** be treated as Production authorization.

---

## 10. Collection boundary

H-175 prepares **requirements only**.

It does **not** authorize:

- sending requests;
- contacting providers;
- obtaining quotes;
- legal engagement;
- procurement;
- GCP provisioning;
- Production implementation;
- database or DR replica creation;
- application deployment;
- migration;
- failover;
- switchover;
- DR testing.

A later governance increment must authorize any **actual** evidence-collection activity.

```text
No requests were sent.
No provider, legal adviser, or commercial partner was contacted.
No GCP resources were created.
No evidence is marked received or accepted.
Application / schema / migrations unchanged.
Production remains NOT AUTHORIZED / NOT READY.
```

Historical ADR-0006, DP-0006, H-170, H-171, H-172, H-173, and H-174 were **not rewritten**.

---

## 11. Final status

| Topic | State |
| --- | --- |
| H-174 | **COMPLETE** |
| Evidence package preparation | **COMPLETE** |
| Evidence collection | **NOT EXECUTED** |
| P01–P13 | **OPEN** |
| Production authorization | **NOT AUTHORIZED** |
| GCP resources | **NONE** |
| Production data | **NONE** |
| DR replica | **NOT CREATED** |
| DR test | **NOT PERFORMED** |
| Measured RTO | **NOT AVAILABLE** |
| Measured RPO | **NOT AVAILABLE** |
| Production readiness | **NOT READY** |
| Item 24 | **OPEN** |

No Production blocker is closed by preparing a requirements list. D01 deferral and D02 architecture direction remain as in H-174.

---

## 12. STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 669 → 670 |
| Files changed this increment | `docs/governance/h-175-production-evidence-collection-requirements-package.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-175
H-176 NOT CREATED
NEXT GATE (not executed): a later governance increment that explicitly
  authorizes actual evidence-collection activity (sending of approved
  questions/requests). Until that increment, no contact, quotes,
  provisioning, or Production grant. P01–P13 remain OPEN.
```
