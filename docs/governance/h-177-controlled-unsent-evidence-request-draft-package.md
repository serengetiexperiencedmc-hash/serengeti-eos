# H-177 — Controlled Unsent Evidence-Request Draft Package

> **GOVERNANCE / UNSENT INTERNAL REQUEST-DRAFT PACKAGE ONLY**  
> Transforms H-175 evidence requirements into reviewable, unsent request drafts under H-176 (“preparing unsent internal request drafts: AUTHORIZED WITH CONDITIONS”).  
> **NOT** authorization to contact anyone. **NOT** outbound communication. **NOT** a procurement or legal instruction. **NOT** an issued quotation request. **NOT** evidence, evidence acceptance, or Production approval.  
> Historical ADR-0006, DP-0006, H-170, H-171, H-172, H-173, H-174, H-175, and H-176 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 671  
**Porcelain after this increment:** 672 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP / credentials / DNS / IAM / KMS:** **NONE**  
**Vendor contact / legal engagement / purchase / quotation:** **NONE**  
**Evidence requests sent:** **NONE**  
**Evidence collected / received / accepted:** **NONE**  
**External connectors invoked:** **NONE**  
**Commit / push:** **NONE**  
**H-178:** **NOT CREATED**

```text
H-177 STATUS = COMPLETE — UNSENT DRAFTS PREPARED; SEND NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

Lifecycle preserved (no later stage is inferred from a draft):

`requirement → draft → approval to send → sending → response received → evidence verification → evidence acceptance → implementation authorization → implementation → validation → Production readiness`

H-177 performs **draft preparation only**.

---

## 1. Repository baseline (inspected)

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain at start | 671 (matches H-176 after-count) |
| H-175 | `docs/governance/h-175-production-evidence-collection-requirements-package.md` — **COMPLETE** |
| H-176 | `docs/governance/h-176-controlled-external-evidence-collection-authorization.md` — **COMPLETE** |
| H-176 send authorization | **NOT AUTHORIZED** |
| Requests sent | **NONE** |
| Evidence received / accepted | **NONE** |
| Production implementation | **NOT AUTHORIZED** |

---

## 2. Authoritative architecture and H-176 controls

Selected **direction** (not implemented, not Production-approved):

| Topic | Direction |
| --- | --- |
| Primary | `africa-south1` (Johannesburg) |
| Secondary | `europe-west1` (Belgium) |
| Cloud SQL | Enterprise Plus |
| DR | Advanced DR with designated DR replica |
| Pairing | N2 |
| RTO | ≤ 4 hours — **business acceptance requirement**, not a measurement |
| RPO | ≤ 1 hour — **business acceptance requirement**, not a measurement |
| Application DR | Active-passive **direction** |
| Cloud SQL failover | **Not** complete EOS application failover |

H-176: draft preparation **AUTHORIZED WITH CONDITIONS**. Approving for send, sending, receiving, negotiating, quoting, accepting legal terms, purchasing, and Production implementation remain **NOT AUTHORIZED**.

Placeholders used wherever a person, address, account, or DNS name would otherwise be invented:

- `[SENDER TO BE APPOINTED]`
- `[RECIPIENT TO BE APPOINTED]`
- `[CHANNEL TO BE APPROVED]`
- `[PRODUCTION DNS NAME TO BE DETERMINED]`
- `[GCP PROJECT ID TO BE DETERMINED]`
- `[BILLING ACCOUNT TO BE DETERMINED]`

---

## 3. Draft package (H177-D01 through H177-D15)

Parent evidence IDs remain those in H-175. Sub-bullets in draft bodies are **draft-request components**, not new accepted EV-IDs.

Every draft below has:

- Intended recipient: `[RECIPIENT TO BE APPOINTED]`
- Proposed sender: `[SENDER TO BE APPOINTED]`
- Proposed channel: `[CHANNEL TO BE APPROVED]`
- Governance status: **UNSENT — DRAFT ONLY**
- H-176 control state: send **NOT AUTHORIZED**

---

### H177-D01 — Governance / Production authorization evidence

**Purpose:** Request documentation of Production implementation authority, applicable Owner/POA decision records, and authorization boundaries for P01.

**Related:** P01; EV-G01; H-175 §3 EV-G01; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for Production-authorization documentary evidence (unsent draft)

**Draft body:**

Please supply documentary evidence, if it exists, of any Owner/POA Production implementation grant for Serengeti Experience DMC EOS. Governance currently records: H-174 D01 — Production implementation remains deferred and unauthorized; H-171 §5 conditions are unsatisfied; architecture selection (H-169) is not a Production grant.

Please confirm or provide:

1. Whether a written Production grant exists, and if so its exact scope and date.
2. If no grant exists, confirmation that implementation remains deferred (not a permanent cancellation).
3. The named accountable authority for any future grant (`[SENDER TO BE APPOINTED]` / Owner/POA — not to be guessed).
4. The authorization boundaries that remain in force (no GCP provisioning, replica, migration, failover, or DR test without a later explicit grant).

Do not treat architecture selection as a grant. Do not implement anything in response to this draft.

**Evidence requested:** Written Production grant **or** recorded continued deferral after H-171 §5 review (EV-G01).

**Acceptance condition:** Explicit scoped grant document, or explicit continued deferral; not inferred from H-169–H-177. Receipt ≠ acceptance. Acceptance ≠ implementation.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D02 — GCP ownership / billing / commercial account evidence

**Purpose:** Request named GCP account/project ownership model, billing ownership, and procurement route **without** creating a project.

**Related:** P02; EV-C01, EV-M03; H-175 §3; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for GCP ownership, billing, and support-policy evidence (unsent draft)

**Draft body:**

Please supply the organizational ownership information required for a future GCP Production hosting arrangement. No GCP project is to be created in response. Identifiers remain `[GCP PROJECT ID TO BE DETERMINED]` and `[BILLING ACCOUNT TO BE DETERMINED]`.

Please confirm or provide:

1. Intended GCP account / project **ownership model** (not a live project).
2. Billing-account **ownership model**.
3. Responsible commercial and technical account-owner **roles** (names not invented).
4. Procurement / contracting route.
5. Support-arrangement **policy** (EV-M03). Do not infer a 24/7 NOC.
6. Budget-control policy.

H-158 recorded hosting **direction** only. No project, billing account, or named owner is on file.

**Evidence requested:** Named ownership/billing model and support/budget policy without a live project (EV-C01, EV-M03).

**Acceptance condition:** Named model and policy; not a live project; names only if authoritatively supplied later. Receipt ≠ acceptance.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D03 — PostgreSQL compatibility evidence

**Purpose:** Request provider and engineering confirmation of supported PostgreSQL versions and EOS compatibility implications. **Do not select a Production version.**

**Related:** P03 (P15 related); EV-T01, EV-T02, EV-T03; H-175 §4.A; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for PostgreSQL / Cloud SQL Enterprise Plus compatibility evidence (unsent draft)

**Draft body:**

Please supply compatibility evidence for running EOS on Cloud SQL for PostgreSQL **Enterprise Plus** with Advanced DR (designated replica) between `africa-south1` and `europe-west1`. This is a **proposed** architecture, not an implemented instance.

Please distinguish: (1) documented provider capability; (2) proposed EOS architecture; (3) EOS-specific implementation; (4) measured EOS test result. Items (3) and (4) do not exist.

Please confirm or provide:

1. PostgreSQL versions supported on Cloud SQL Enterprise Plus for the intended regions (class-1 documentation and, later, class-2 confirmation).
2. Compatibility with EOS current migrate/runtime requirements. ADR-0003 PostgreSQL 16 is **Development SoR** only. Lab 16.15 is **not** a Production lock. Dev/Test 16-class is **not** Production closure.
3. Extensions, collations, and database features used by EOS, mapped to Plus support; gaps recorded (EV-T02).
4. Upgrade/migration implications.
5. Advanced DR prerequisites versus candidate versions (designated replica, edition, private IP) (EV-T03).
6. Any version constraints that must be resolved **before** Production implementation.

Do **not** select the Production PostgreSQL version in the reply until Owner/POA decides after review. Do not claim compatibility is already confirmed.

**Evidence requested:** EOS–Plus compatibility pack; feature/version matrix; Advanced DR version prerequisites (EV-T01–EV-T03).

**Acceptance condition:** Dated attributable matrix plus EOS test report against **named candidate** versions; gaps remain OPEN. Provider docs (class 1) ≠ EOS tests (class 5).

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D04 — Workload and sizing evidence

**Purpose:** Request workload inputs needed to size CPU, memory, storage, and connections. **Do not invent measurements or select sizes.**

**Related:** P04; EV-T04, EV-T05; H-175 §4.B; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for workload inputs and sizing-evidence pack (unsent draft)

**Draft body:**

Please supply attributable workload inputs, or Owner-accepted estimates **labelled as estimates**, sufficient to prepare a later sizing proposal. N2 is the **machine-series pairing** (H-169), not a vCPU/memory/storage selection. No instance size is selected.

Please confirm or provide, if available:

1. Expected transaction patterns.
2. Concurrent users / connections.
3. Database size and growth.
4. Peak operating periods.
5. Storage growth.
6. Backup/PITR **requirements** (not applied config).
7. Performance and availability expectations. RTO ≤ 4 hours and RPO ≤ 1 hour are **business acceptance requirements**, not measured results.
8. HA/DR capacity implications of a designated replica billed as a standalone instance (category only; no prices).

Planning assumptions in prior governance (architecture selected; RTO/RPO as requirements) remain **assumptions requiring confirmation**, not Production measurements. Do not manufacture missing figures. Do not convert planning assumptions into measured Production requirements.

**Evidence requested:** Workload input pack (EV-T04); later sizing proposal citing that pack (EV-T05) — proposal not requested as a selected size.

**Acceptance condition:** Dated attributable measurements or labelled estimates; sizing proposal (when later prepared) must cite EV-T04. No invented numbers.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D05 — Connectivity / networking evidence

**Purpose:** Request PSA versus PSC comparison and application-to-database / cross-region DR connectivity options. **Path not selected.**

**Related:** P05; EV-T06, EV-T07; H-175 §4.C; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for PSA vs PSC and DR-path connectivity evidence (unsent draft)

**Draft body:**

Please supply a connectivity options pack for EOS Production **direction**: Cloud Run to Cloud SQL Enterprise Plus; Advanced DR designated replica; primary `africa-south1`; secondary `europe-west1`. Nothing is to be configured.

Write-endpoint documentation (H-169/H-170) records: Plus + private IP; **PSA and PSC are distinct**. Neither path is selected.

Please confirm or provide:

1. Comparison of Private Service Access versus Private Service Connect for this topology.
2. Application-to-Cloud-SQL connectivity options.
3. Regional networking for both regions.
4. DNS requirements (names remain `[PRODUCTION DNS NAME TO BE DETERMINED]`).
5. Firewall / network controls and required network dependencies.
6. TLS requirements (design only).
7. Operational complexity and failover implications, including write-endpoint conditions.
8. Cross-region DR connectivity design (described, not built) (EV-T07).

Do **not** select PSA or PSC in a manner that is treated as an Owner decision unless Owner/POA later records it. Do not configure VPC, PSA, PSC, or DNS.

**Evidence requested:** PSA vs PSC comparison pack; app-to-DB and DR-region path design note (EV-T06, EV-T07).

**Acceptance condition:** Named differences and failover behaviour without implementing network resources.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D06 — Encryption / CMEK evidence

**Purpose:** Request Google-managed encryption versus CMEK options. **No product selected. No keys created.**

**Related:** P06; EV-T08; H-175 §4.D; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for Cloud SQL encryption (Google-managed vs CMEK) options evidence (unsent draft)

**Draft body:**

Please supply an options paper for Cloud SQL encryption: Google-managed keys versus customer-managed encryption keys (CMEK). H-159 records that CMEK is **not** mandatory and that the choice **REQUIRES OWNER DECISION**. No encryption product is selected. No DPA, security approval, or KMS arrangement is asserted to exist.

Please confirm or provide:

1. Implications of Google-managed encryption versus CMEK for the selected regions.
2. If CMEK were later chosen: key-management requirements, KMS ownership **roles**, key location requirements, key lifecycle/rotation, and key recovery implications.
3. Interaction with Advanced DR / designated replica (design only).

Do not create keys. Do not select the encryption product. Do not state that a security approval exists.

**Evidence requested:** Binary options paper; CMEK key-location/IAM/rotation design **only if** CMEK is later chosen (EV-T08).

**Acceptance condition:** Options recorded; product selection is a later P06 Owner decision.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D07 — Secrets / KMS evidence

**Purpose:** Request secrets-storage and KMS/Secret Manager options. ADR-0012 remains proposed-blocked. **No secrets or credentials created.**

**Related:** P07; EV-T09; H-175 §4.D; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for secrets-management and KMS options evidence (unsent draft)

**Draft body:**

Please supply an options paper for Production secrets storage, rotation, service identity, least privilege, and break-glass access. ADR-0012 remains `proposed — blocked for UAT and Production`. Secret Manager in `africa-south1` was recorded in H-159 as a **feasible candidate**, not an ADR-0012 closure.

Please confirm or provide:

1. Secrets-management approach options (including Vault versus cloud KMS/Secret Manager).
2. Secret Manager / KMS integration requirements (design only).
3. Rotation, service identity, least privilege, and break-glass **design**.
4. Operational responsibility **roles** (names not appointed).

Do not create secrets, credentials, or keys. Do not claim ADR-0012 is closed.

**Evidence requested:** Secrets/KMS options without credentials (EV-T09).

**Acceptance condition:** Options paper; ADR-0012 Production-ready **or** controlled deferral is a later P07 decision.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D08 — Identity / access / MFA evidence

**Purpose:** Request corporate IdP facts, MFA, and access-model **design**. HUM-05 directory is **NOT ESTABLISHED**. **Do not invent a tenant.**

**Related:** P08; EV-T10, EV-T11; H-175 §4.E; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for Production identity, MFA, and access-model evidence (unsent draft)

**Draft body:**

Please supply attributable corporate identity facts required for Production IdP/MFA decisions. ADR-0013 remains `proposed — blocked for Production`. HUM-05 corporate directory is **NOT ESTABLISHED**. Do not invent a tenant, domain, or IdP product as a fact.

Please confirm or provide, if they exist:

1. Production identity provider **facts** (what directory exists, if any).
2. MFA capability and SSO facts.
3. Administrative access model (design).
4. Least-privilege and service-account **requirements** (design, not configured).
5. Privileged access, access reviews, emergency/break-glass **design**.
6. Ownership and operational responsibility **roles**.

Do not create accounts. Do not assign roles. Do not claim IdP/MFA readiness.

**Evidence requested:** Attributable directory facts (EV-T10); IAM/service-account/emergency-access design of **roles** (EV-T11).

**Acceptance condition:** Attributable identity facts; then IdP/MFA options. Names of people only if later authoritatively supplied.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D09 — Application DR design evidence

**Purpose:** Request review of application-side DR requirements corresponding to the selected architecture. **Do not claim the application currently supports regional failover.**

**Related:** P09; EV-A01, EV-A03; H-175 §5; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for application-side DR design evidence (unsent draft)

**Draft body:**

Please review and confirm application-side DR **requirements** for the selected **direction** (not implemented):

- Primary: `africa-south1` (Johannesburg)
- Secondary: `europe-west1` (Belgium)
- Database: Cloud SQL Enterprise Plus
- DR: Cloud SQL Advanced DR with designated DR replica
- Application DR: active-passive **direction**
- Business acceptance requirements (not measurements): RTO ≤ 4 hours; RPO ≤ 1 hour

Cloud SQL failover is **not** complete EOS application failover. Do not claim the application currently supports regional failover. Do not claim RTO/RPO have been demonstrated.

Please confirm or provide a written app-DR package covering:

1. Active/passive Cloud Run topology (not deployed).
2. Failover handling and application startup in the secondary region.
3. Connection-string / configuration handling and write-path behaviour.
4. DNS / application endpoint transition (`[PRODUCTION DNS NAME TO BE DETERMINED]`).
5. Secret availability in the DR path (no secrets created).
6. External dependency handling, including event and email transport.
7. Logging and monitoring in the DR path.
8. Operator actions, failback/switchback procedure, and rollback considerations.
9. Post-failover validation **criteria** (startup, auth, events, email, logging) — criteria only; no test (EV-A03).

**Evidence requested:** Written app-DR design, still not deployed (EV-A01); post-failover validation criteria (EV-A03).

**Acceptance condition:** Package covers the list above. Runtime proof is EV-V01/EV-V02 only and is **not** authorized.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D10 — Provider / Google Cloud capability evidence

**Purpose:** Request authoritative provider documentation and, later, provider-specific confirmation for unresolved Production prerequisites. **Architecture is selected, not implemented.**

**Related:** P14 (related to P10/P11 context); EV-P01, EV-P02, EV-P03, EV-P04, EV-P05; H-175 §6; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for Cloud SQL Enterprise Plus / Advanced DR provider confirmation (unsent draft)

**Draft body:**

Please supply provider evidence for the **proposed** EOS Production architecture. Distinguish in every answer:

1. Documented provider capability (class 1).
2. Proposed EOS architecture (H-169 direction).
3. EOS-specific implementation (does **not** exist).
4. Measured EOS test result (does **not** exist).

Selected direction (not implemented): primary `africa-south1`; secondary `europe-west1`; Enterprise Plus; Advanced DR; designated DR replica; N2 pairing; RTO ≤ 4 hours and RPO ≤ 1 hour as **business requirements**, not measurements.

Please confirm or provide:

1. Enterprise Plus + Advanced DR + designated replica + N2 availability in **both** regions (class 2 at create time; class 1 already cited in H-169/H-170 is not instance confirmation) (EV-P01).
2. Advanced DR prerequisites: designated replica, backup/PITR hygiene, HA recommendations, write-endpoint conditions (EV-P02).
3. Backup location `africa-south1` and PITR geography/WAL behaviour (H-160/H-162 **direction**; applied config is later) (EV-P03).
4. Region availability and service limitations (EV-P04).
5. Failover and switchback behaviour; replica billed as standalone; backups not configurable on replica until promotion (EV-P05). Provider docs ≠ measured EOS RTO/RPO.
6. Supported PostgreSQL versions (informational for P03; version **not** selected here).
7. Connectivity options at provider level (PSA vs PSC remain **unselected**).

Do not create a project, instance, or replica. Generic documentation is not EOS evidence.

**Evidence requested:** EV-P01 through EV-P05 as dated class-1 and (later) class-2 artefacts.

**Acceptance condition:** Dated confirmation distinguishing the four categories. Class 1 ≠ class 2 ≠ class 6/7.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D11 — Write endpoint / DNS / failover evidence

**Purpose:** Request Production endpoint and DNS/failover **strategy**. **No DNS records. No invented DNS names.**

**Related:** P10; EV-A02; H-175 §5 / write-endpoint; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for write-endpoint, DNS, and failover-strategy evidence (unsent draft)

**Draft body:**

Please supply a written strategy for Production database write-endpoint handling versus application URL DNS/routing. No DNS records are to be created. The Production name remains `[PRODUCTION DNS NAME TO BE DETERMINED]`.

H-169 recorded direction to use the Cloud SQL write endpoint **where documented conditions are met** (Plus + private IP). Application DNS remains OPEN. PSA versus PSC is **not** selected (see H177-D05).

Please confirm or provide:

1. Production endpoint strategy.
2. DNS ownership **role** (not a named person unless later appointed).
3. DNS TTL considerations (design).
4. Application endpoint failover mechanism.
5. Write-endpoint transition and client connection behaviour.
6. Failover and switchback procedure (design).
7. Operational ownership **roles**.

Do not invent DNS names. Do not create Cloud DNS records.

**Evidence requested:** Written write-endpoint vs app-URL strategy (EV-A02).

**Acceptance condition:** Written strategy; no records created. Implementation of DNS is later and unauthorized now.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D12 — Legal / residency evidence

**Purpose:** Request legal/contractual review materials for Johannesburg primary residency and the controlled Belgium DR exception. **No legal conclusion. Belgium exception is not legally approved.**

**Related:** P11; EV-L01, EV-L02; H-175 §7; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for legal/residency review of selected DR architecture (unsent draft)

**Draft body:**

Please review the **selected governance architecture** against contractual and privacy requirements. This is **not** a statement that the Belgium residency exception has been legally approved. H-168 approved a controlled cross-region DR residency exception **in principle**. H-169 refined it to DR-only `europe-west1`. Legal/contractual acceptance remains an **open prerequisite** (P11). No DPA is recorded as executed. No legal conclusion is requested from this draft’s author.

Please confirm or provide (for later Legal Counsel review — `[RECIPIENT TO BE APPOINTED]`):

1. Data categories that would enter the DR replica (EV-L01), consistent with H-157 EOS non-personal commercial boundary where applicable; no PDPC conclusion.
2. Primary data residency in Johannesburg (`africa-south1`).
3. Controlled cross-region DR residency exception for Belgium (`europe-west1`) — review, not acceptance.
4. Provider contractual terms; DPA requirements where applicable; subprocessors; applicable transfer mechanisms.
5. Encryption, retention and deletion, backup/DR access, incident responsibilities, contractual support obligations (EV-L02).

Do not accept legal terms in reply to this draft. Do not invent legal advisers or DPO contacts.

**Evidence requested:** Data-category inventory (EV-L01); written legal/contract review (EV-L02) — review ≠ acceptance.

**Acceptance condition:** Written Legal Counsel review, then Owner accept **or** refuse (H-173 P11). Collection/review ≠ acceptance.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D13 — Cost / procurement evidence

**Purpose:** Identify information required to evaluate attributable Production costs. **No prices invented. Draft is not a quotation.**

**Related:** P12; EV-M01, EV-M02; H-175 §6 commercial; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for pricing-calculator inputs and quotation requirements (unsent draft)

**Draft body:**

Please identify the **inputs** required to evaluate cost for the selected architecture. This draft is **not** a quotation, not a purchase, and not authorization to obtain live quotes. No estimated prices are on file in authoritative governance and none are inserted here.

Categories to cost (H-172 E07 / EV-M01–EV-M02), without totals:

1. Cloud SQL Enterprise Plus — primary instance.
2. HA.
3. Designated DR replica (billed as standalone — category; no amount).
4. Cross-region replication and transfer.
5. Backup/PITR.
6. Cloud Run (including active-passive DR **direction**, not deployed).
7. Logging/monitoring.
8. Storage.
9. Network, KMS/secrets (if later selected), support.
10. Expected operational overhead (qualitative unless later evidenced).

Do not create or request a purchase. Do not treat this draft as a quotation. Obtaining quotations remains **NOT AUTHORIZED** (H-176).

**Evidence requested:** Calculator **inputs** (EV-M01); later dated quotes covering listed categories (EV-M02) — quotes only after a future send grant.

**Acceptance condition:** Inputs listed without invented totals; quotes, when later authorized and received, dated and covering E07 categories. Quote ≠ approval ≠ purchase.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D14 — Operations / HUM-08 / runbook evidence

**Purpose:** Request confirmation of Production operational **roles**. **Do not invent names.**

**Related:** P13; EV-O01, EV-O02; H-175 §8; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — request for HUM-08 operational ownership and runbook-role evidence (unsent draft)

**Draft body:**

Please confirm operational ownership **roles** for EOS Production and DR. Specialist posts are currently **UNASSIGNED**. PDM is recorded in prior governance as an escalation path only. No 24/7 NOC is inferred. Names and contact details must **not** be invented; use appointment only when Owner/POA names a person.

Please confirm or appoint (names remain `[RECIPIENT TO BE APPOINTED]` until Owner Session):

1. Production operations / service owner.
2. Technical owner; database owner; application owner.
3. On-call ownership; escalation path; incident-response authority.
4. Backup ownership; restore ownership.
5. DR failover ownership; failback ownership.
6. Monitoring/alerting ownership.
7. Runbook ownership.
8. Post-failover validation; evidence custody; DR-test authorization **authority** (the test itself is not authorized — see H177-D15).

A runbook (EV-O02) is **not** a DR test and is not requested as a substitute for P19/P20.

**Evidence requested:** Named RACI when Owner appoints people (EV-O01); later approved runbook (EV-O02).

**Acceptance condition:** Named people recorded by Owner Session; runbook after ownership is named. Placeholders are not names.

**Governance status:** `UNSENT — DRAFT ONLY`

---

### H177-D15 — DR test authorization / validation evidence

**Purpose:** Identify what would eventually be required to authorize and execute a controlled EOS DR test. **No DR test is authorized by H-177.**

**Related:** P19, P20 (validation; not a P01–P13 close); EV-V01, EV-V02, EV-A03; H-175 §11 related; H-176 send **NOT AUTHORIZED**.

**Draft subject:** SEDMC EOS — identification of future DR-test authorization and measurement evidence (unsent draft)

**Draft body:**

This draft **identifies** future evidence for a controlled EOS DR test. **No DR test is authorized by H-177.** No failover, switchover, application recovery exercise, or measurement may be performed in response.

When, and only when, a later explicit Owner/POA test grant exists (EV-V01), the following would be required:

1. Written controlled DR-test authorization (separate from architecture selection and from this draft).
2. Failover procedure; application recovery; data validation; service validation.
3. Measured RTO and measured RPO against business requirements ≤ 4 hours and ≤ 1 hour (EV-V02). Provider documentation **cannot** substitute.
4. Failback/switchback; evidence capture.
5. Application validation criteria already to be defined in EV-A03 **before** any test.

Do not treat this identification as authorization. Do not perform a test.

**Evidence requested:** Later written test grant (EV-V01); later dated measurements (EV-V02). **Neither exists. Neither is requested to be produced by testing now.**

**Acceptance condition:** Explicit test grant then dated EOS measurements. H-177 cannot accept either.

**Governance status:** `UNSENT — DRAFT ONLY`

**Explicit:** **No DR test is authorized by H-177.** No test may be performed.

---

## 4. Request control matrix

| Draft ID | P prerequisite | EV-ID(s) | Intended recipient | Sender | Channel | Send authorized? | Response received? | Evidence accepted? | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| H177-D01 | P01 | EV-G01 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D02 | P02 | EV-C01, EV-M03 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D03 | P03 | EV-T01, EV-T02, EV-T03 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D04 | P04 | EV-T04, EV-T05 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D05 | P05 | EV-T06, EV-T07 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D06 | P06 | EV-T08 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D07 | P07 | EV-T09 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D08 | P08 | EV-T10, EV-T11 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D09 | P09 | EV-A01, EV-A03 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D10 | P14 (provider; supports P10/P11 context) | EV-P01–EV-P05 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D11 | P10 | EV-A02 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D12 | P11 | EV-L01, EV-L02 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D13 | P12 | EV-M01, EV-M02 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D14 | P13 | EV-O01, EV-O02 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |
| H177-D15 | P19 / P20 | EV-V01, EV-V02, EV-A03 | `[RECIPIENT TO BE APPOINTED]` | `[SENDER TO BE APPOINTED]` | `[CHANNEL TO BE APPROVED]` | NO | NO | NO | UNSENT DRAFT |

No contacts were fabricated.

---

## 5. Evidence lifecycle control

| Stage | H-177 |
| --- | --- |
| Draft preparation | **Performed** (this increment only) |
| Send authorization | **Not granted** |
| Sending | **Not performed** |
| Response receipt | **Not performed** |
| Evidence verification | **Not performed** |
| Evidence acceptance | **Not performed** |
| Implementation authorization | **Not granted** |
| Implementation | **Not performed** |
| Validation | **Not performed** |
| Production readiness | **NOT READY** |

---

## 6. P01–P13 status

H-177 populates **only** “request draft prepared”.

| ID | Requirement identified | Request draft prepared | Approved for send | Sent | Evidence received | Evidence verified | Evidence accepted | Prerequisite closed |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | Yes (H-172/H-175) | H177-D01 | NO | NO | NO | NO | NO | **OPEN** |
| P02 | Yes | H177-D02 | NO | NO | NO | NO | NO | **OPEN** |
| P03 | Yes | H177-D03 | NO | NO | NO | NO | NO | **OPEN** |
| P04 | Yes | H177-D04 | NO | NO | NO | NO | NO | **OPEN** |
| P05 | Yes | H177-D05 | NO | NO | NO | NO | NO | **OPEN** |
| P06 | Yes | H177-D06 | NO | NO | NO | NO | NO | **OPEN** |
| P07 | Yes | H177-D07 | NO | NO | NO | NO | NO | **OPEN** |
| P08 | Yes | H177-D08 | NO | NO | NO | NO | NO | **OPEN** |
| P09 | Yes | H177-D09 | NO | NO | NO | NO | NO | **OPEN** |
| P10 | Yes | H177-D11 | NO | NO | NO | NO | NO | **OPEN** |
| P11 | Yes | H177-D12 | NO | NO | NO | NO | NO | **OPEN** |
| P12 | Yes | H177-D13 | NO | NO | NO | NO | NO | **OPEN** |
| P13 | Yes | H177-D14 | NO | NO | NO | NO | NO | **OPEN** |

H177-D10 and H177-D15 support related P14/P19/P20 evidence; they do **not** close P01–P13.

---

## 7. Prohibited state transitions

H-177 **cannot** transition:

- P01–P13 `OPEN` → `CLOSED`
- Production `NOT READY` → `READY`
- Item 24 `OPEN` → `CLOSED`
- implementation `NOT AUTHORIZED` → `AUTHORIZED`
- evidence `NOT RECEIVED` → `RECEIVED`
- evidence `NOT ACCEPTED` → `ACCEPTED`
- send `NOT AUTHORIZED` → `AUTHORIZED`
- DR test `NOT PERFORMED` / `NOT AUTHORIZED` → performed or authorized

---

## 8. Production and collection boundary

H-177 does **not** authorize GCP provisioning, Production deployment, Cloud SQL or DR replica creation, data or schema migration, application deployment, failover, switchover, DR testing, legal or commercial commitment, or sending of any draft.

```text
No requests were sent.
No recipient or sender was invented.
No external connector was invoked.
No GCP resources were created.
No application / schema / infrastructure files were changed.
No evidence is marked received or accepted.
Production remains NOT AUTHORIZED / NOT READY.
Item 24 remains OPEN.
```

Historical ADR-0006, DP-0006, H-170 through H-176 were **not rewritten**.

---

## 9. Final status

| Topic | State |
| --- | --- |
| H-176 | **COMPLETE** |
| Unsent draft package | **COMPLETE** (H177-D01–H177-D15) |
| Send authorization | **NOT GRANTED** |
| Requests sent | **NONE** |
| Evidence received | **NONE** |
| Evidence accepted | **NONE** |
| P01–P13 | **OPEN** |
| Production authorization | **NOT AUTHORIZED** |
| GCP resources | **NONE** |
| Production data | **NONE** |
| DR replica | **NOT CREATED** |
| DR test | **NOT PERFORMED** / **NOT AUTHORIZED** |
| Measured RTO | **NOT AVAILABLE** |
| Measured RPO | **NOT AVAILABLE** |
| Production readiness | **NOT READY** |
| Item 24 | **OPEN** |

---

## 10. STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 671 → 672 |
| Files changed this increment | `docs/governance/h-177-controlled-unsent-evidence-request-draft-package.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-177
H-178 NOT CREATED
NEXT GATE (not executed): Owner/POA review of unsent drafts; a later
  increment may approve send only after named sender, named recipient,
  approved channel, and approved question set exist. P01–P13 remain OPEN.
```
