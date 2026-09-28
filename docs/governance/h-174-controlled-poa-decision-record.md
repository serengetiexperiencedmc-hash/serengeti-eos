# H-174 — Controlled POA Decision Record and Evidence-Collection Authorization

> **GOVERNANCE / LIMITED POA DIRECTION ONLY**  
> Records limited Owner/POA directions that are already supported by the existing H-169–H-173 governance record.  
> **NOT** minutes of a physical Owner/POA decision session. **NOT** a claim that such a session was held.  
> **NOT** Production implementation authorization. **NOT** GCP provisioning, replica creation, deployment, legal conclusion, commercial commitment, or DR test.  
> Historical ADR-0006, DP-0006, H-170, H-171, H-172, and H-173 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 668  
**Porcelain after this increment:** 669 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP / credentials / DNS / IAM / KMS:** **NONE**  
**Vendor contact / legal commitment / purchase:** **NONE**  
**Evidence-collection execution:** **NONE**  
**Commit / push:** **NONE**  
**H-175:** **NOT CREATED**

```text
H-174 STATUS = COMPLETE — LIMITED POA GOVERNANCE DIRECTIONS RECORDED; SESSION NOT HELD
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

H-173 remains authoritative that the Owner/POA prerequisite decision session covering P01–P13 was **PREPARED / NOT YET HELD**. No repository evidence was found that the session has since occurred. This increment does **not** convert H-173 into meeting minutes.

---

## 1. Repository baseline (inspected)

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain at start | 668 (matches H-173 after-count) |
| H-173 path | `docs/governance/h-173-owner-poa-prerequisite-decision-session.md` |
| H-173 status | **COMPLETE** — session **prepared**; **not** held |
| Physical Owner/POA session | **NOT HELD** |
| Production implementation authorized | **NO** |
| GCP resources | **NONE** |

---

## 2. Authoritative baseline (H-169 through H-173)

No new architecture is introduced. The following remain the selected **direction**, subject to unresolved evidence, legal/contract review, implementation, and validation:

| Topic | Existing record | State carried forward |
| --- | --- | --- |
| Primary region | H-158 / H-169 | `africa-south1` |
| Secondary DR region | H-169 | `europe-west1` |
| Cloud SQL edition (selected direction) | H-169 | Enterprise Plus |
| DR mechanism | H-169 | Advanced DR with designated DR replica |
| Machine-series pairing | H-169 | N2 |
| RTO requirement | H-166 / H-169 | ≤ 4 hours |
| RPO requirement | H-166 / H-169 | ≤ 1 hour |
| Application DR | H-169 | Active-passive **direction** |
| Database failover vs EOS failover | H-167 / H-169 / H-173 | Cloud SQL failover is **not** complete EOS application failover |
| Production implementation | H-169–H-173 | **NOT AUTHORIZED** |
| GCP resources | H-169–H-173 | **NONE** |
| DR testing | H-169–H-173 | **NOT PERFORMED** |
| Measured RTO / RPO | H-169–H-173 | **NOT AVAILABLE** |
| Production readiness | H-154–H-173 | **NOT READY** |

H-173 classified P01–P13 and authorized **preparation** of a decision session. It did **not** close P01–P13. Architecture selection remains **COMPLETE**. Prerequisite closure remains **IN PROGRESS**.

---

## 3. Limited POA decisions

Only directions that can be supported **without** new external technical, legal, commercial, or operational evidence are recorded. These are **limited governance directions**. They are **not** final Production decisions.

Options considered for each item below include: (a) record the limited direction now; (b) defer until a physical session is held; (c) invent a technical/legal/commercial/operational value (rejected).

### D01 — Continue Production implementation deferral

**Decision statement:** Production implementation remains **deferred and unauthorized**. This is **not** a Production rejection and **not** a permanent cancellation.

**Authority:** Owner/POA, using H-173 P01 permissible next action (“explicit grant **or** explicit deferral — **not** inferred”) and H-171 §5 (twenty conditions unsatisfied).

**Evidence relied upon:** H-169–H-173 (implementation not authorized; GCP none; Item 1 OPEN). No physical session.

**Status:** **DECIDED — LIMITED GOVERNANCE DIRECTION**

**Limitations:** Does not close Item 1 as rejected. Does not prevent a later explicit grant. Does not satisfy H-171 §5.

**Dependencies:** H-171 §5; P02–P21 remain open as in H-172/H-173.

**Required follow-up:** A later **written** Production grant, or a later recorded continuation of deferral, after prerequisite evidence.

**Closure evidence for a future grant:** Written Production grant document (H-173 P01). **Not produced here.**

### D02 — Preserve architecture selection

**Decision statement:** The H-169 architecture remains the selected **direction**: primary `africa-south1`; secondary `europe-west1`; Cloud SQL Enterprise Plus; Advanced DR with designated DR replica; N2 pairing; RTO ≤4 hours; RPO ≤1 hour; active-passive application DR; Cloud SQL failover ≠ EOS application failover. It is **not** Production-approved.

**Authority:** Owner/POA, using H-169 selection and H-173 §2 (“established architecture (not reopened)”).

**Evidence relied upon:** H-169 (selection COMPLETE); H-170–H-173 (implementation gates OPEN).

**Status:** **DECIDED — LIMITED GOVERNANCE DIRECTION**

**Limitations:** Subject to unresolved evidence, legal/contract review, commercial approval, implementation, and validation. Does not authorize creation of any GCP resource. Does not close Item 24.

**Dependencies:** P03–P21; H-170 Gates B–I; H-171 §5.

**Required follow-up:** Keep architecture as the design baseline while collecting evidence. Do not reopen selection without a new governance increment.

**Closure evidence for Production approval of this architecture:** Implementation evidence, legal acceptance, commercial approval, DR test, and measured RTO/RPO. **None of these exist.**

### D03 — Evidence-collection direction

**Decision statement:** Governance **may authorize preparation** of an evidence-collection list and evidence-request **package** without contacting external parties and without provisioning resources. This increment **authorizes that preparation** as a future governance activity. It does **not** execute collection.

Explicit controls:

- Evidence collection is **not** implementation.
- **No** external contact is being made in H-174.
- **No** provider-specific evidence is being fabricated.
- Evidence must be **dated** and **attributable**.
- Unresolved matters remain **open** until evidence is received and reviewed.

**Authority:** Owner/POA, using H-173 purpose item 6 and Category A (“whether to authorize a future evidence-collection activity”).

**Evidence relied upon:** H-172 E02–E08 / P03–P12 evidence requirements; H-173 §§4–6. No new provider pages, quotes, or confirmations.

**Status:** **DECIDED — LIMITED GOVERNANCE DIRECTION**

**Limitations:** Preparation only. Sending requests, obtaining quotes, creating accounts, and configuring infrastructure remain **forbidden** until a later explicit authorization. Receipt of evidence is **not** automatic closure.

**Dependencies:** Future evidence-pack increment; still-open P03–P12.

**Required follow-up:** Prepare (not send) the evidence-collection requirements package in a subsequent governance increment.

**Closure evidence:** A dated, attributable evidence pack accepted by Owner/POA after review. **Not produced here. Collection NOT EXECUTED.**

### D04 — Decision-framework direction

**Decision statement:** Decision **frameworks may be prepared** for the following subjects **without selecting unsupported technical values:**

- PostgreSQL version selection (P03);
- sizing (P04);
- PSA versus PSC (P05);
- CMEK versus Google-managed encryption (P06);
- secrets/KMS (P07);
- IdP/MFA (P08);
- application DR (P09);
- write endpoint/DNS (P10).

H-159 records that CMEK is **not mandatory** and that Google-managed versus CMEK **REQUIRES OWNER DECISION**. That is a constraint, **not** a selected encryption direction. **No encryption product is selected here.**

**Authority:** Owner/POA, using H-173 §4 (frameworks may be approved without numbers/values) and H-173 §7 (no technical value without adequate evidence).

**Evidence relied upon:** H-173 register and classification. No new compatibility, workload, network, KMS, IdP, or DNS evidence.

**Status:** **DECIDED — LIMITED GOVERNANCE DIRECTION**

**Limitations:** Framework preparation ≠ value selection. P03–P10 remain open for the actual choices. No credentials, keys, tenants, or DNS records are created.

**Dependencies:** D03 evidence packs for values; P11–P13 for legal/commercial/ops where applicable.

**Required follow-up:** Framework documents in later governance increments, still without invented values.

**Closure evidence:** Per-item written selection after adequate evidence (H-173 §6). **Not produced here.**

---

## 4. Matters that must remain open

The following are **not** closed by assertion, by architecture preservation, or by authorizing evidence-pack **preparation**:

| Matter | H-172/H-173 ID | Status after H-174 |
| --- | --- | --- |
| Production authorization | P01 | **OPEN** — deferred by D01; **not** granted |
| GCP project, billing, and ownership | P02 | **OPEN** / **NOT STARTED** |
| PostgreSQL Production version | P03 | **OWNER/POA DECISION REQUIRED** + **EXTERNAL EVIDENCE REQUIRED** |
| Sizing values | P04 | **EXTERNAL EVIDENCE REQUIRED** |
| PSA versus PSC | P05 | **OWNER/POA DECISION REQUIRED** |
| CMEK versus Google-managed encryption | P06 | **OWNER/POA DECISION REQUIRED** — no existing authorized product direction |
| Secrets/KMS implementation | P07 | **OWNER/POA DECISION REQUIRED** |
| IdP/MFA | P08 | **OWNER/POA DECISION REQUIRED** + **EXTERNAL EVIDENCE REQUIRED** |
| Application DR implementation design | P09 | **OWNER/POA DECISION REQUIRED** (active-passive **direction** only) |
| Write endpoint/DNS strategy | P10 | **OWNER/POA DECISION REQUIRED** |
| Belgium legal and contractual acceptance | P11 | **LEGAL/CONTRACT REVIEW REQUIRED** |
| Cost and procurement | P12 | **COMMERCIAL EVIDENCE REQUIRED** |
| HUM-08 operational ownership | P13 | **OWNER/POA DECISION REQUIRED** — names **not** invented |
| Implementation evidence | P14–P18 | **IMPLEMENTATION REQUIRED** / **NOT STARTED** |
| DR testing | P19 | **VALIDATION REQUIRED** / **NOT PERFORMED** |
| Measured RTO/RPO | P20 | **VALIDATION REQUIRED** / **NOT AVAILABLE** |
| Production readiness | Item 1 / H-154 | **NOT READY** |

---

## 5. Decision register

Governance direction is distinguished from a final Production decision. D01–D04 are the former.

| Decision ID | Decision statement | Authority | Evidence relied upon | Status | Limitations | Dependencies | Required follow-up | Closure evidence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| D01 | Production implementation remains deferred and unauthorized. Not a rejection or cancellation. | Owner/POA | H-169–H-173; H-171 §5 unsatisfied | **DECIDED — LIMITED GOVERNANCE DIRECTION** | Not a grant; Item 1 remains OPEN | P02–P21 | Later explicit grant or continued deferral | Written Production grant (future) |
| D02 | H-169 architecture remains selected direction; not Production-approved | Owner/POA | H-169 selection; H-170–H-173 OPEN gates | **DECIDED — LIMITED GOVERNANCE DIRECTION** | Subject to evidence, legal, commercial, implementation, validation | P03–P21 | Do not reopen without a new increment | Implementation + legal + commercial + DR test + measured RTO/RPO |
| D03 | Preparation of an evidence-collection list/package is authorized. Collection is not executed. | Owner/POA | H-172 E02–E08; H-173 §§4–6 | **DECIDED — LIMITED GOVERNANCE DIRECTION** | No contact, quotes, accounts, or provisioning in this increment | Open P03–P12 | Prepare (not send) evidence pack | Dated, attributable pack accepted after review |
| D04 | Decision frameworks may be prepared for P03–P10 without selecting unsupported values | Owner/POA | H-173 §4 and §7 | **DECIDED — LIMITED GOVERNANCE DIRECTION** | Framework ≠ selection; P06 still OPEN | D03; P11–P13 where applicable | Later framework documents | Per-item selection after adequate evidence |
| P01 | Production grant | Owner/POA | None adequate for a grant | **OPEN** | D01 is deferral only | H-171 §5 | Explicit grant document | Written grant |
| P02 | GCP project/billing/ownership | Owner/POA + commercial | H-158 direction only | **OPEN** / **NOT STARTED** | No project exists | D01 | Named ownership model without provisioning | Named owners + policy |
| P03 | PostgreSQL Production version | Owner/POA after evidence | ADR-0003 Dev only; lab 16.15 not Production | **EXTERNAL EVIDENCE REQUIRED** | D04 framework only | E02 compatibility pack | Collect then select | Version + compatibility evidence |
| P04 | Sizing values | Owner/POA after evidence | N2 series only | **EXTERNAL EVIDENCE REQUIRED** | D04 framework only | Workload pack | Collect then size | Sizing record tied to evidence |
| P05 | PSA versus PSC | Owner/POA after design | Distinct paths; not chosen | **OWNER/POA DECISION REQUIRED** | D04 framework only | E04 design note | Design then name a path | Named PSA or PSC |
| P06 | CMEK versus Google-managed | Owner/POA | H-159: CMEK not mandatory; decision required | **OWNER/POA DECISION REQUIRED** | Constraint ≠ product selection | E06 if CMEK | Record direction when Owner is ready; no keys | Written encryption decision |
| P07 | Secrets/KMS | Owner/POA | ADR-0012 proposed — blocked | **OWNER/POA DECISION REQUIRED** | No credentials | ADR-0012 | Evaluation then direction | ADR-0012 Production-ready or controlled deferral |
| P08 | IdP/MFA | Owner/POA | ADR-0013 blocked; HUM-05 not established | **EXTERNAL EVIDENCE REQUIRED** | Do not invent tenant | Directory facts | Establish identity facts | ADR-0013 + MFA evidence |
| P09 | Application DR implementation design | Owner/POA | Active-passive direction only | **OWNER/POA DECISION REQUIRED** | Direction ≠ artefact/config/routing | P05, P07, P08, P10 | Define package; do not deploy | Written app-DR design |
| P10 | Write endpoint/DNS strategy | Owner/POA | Write endpoint where documented conditions met; app DNS OPEN | **OWNER/POA DECISION REQUIRED** | No DNS records | P05 | Select strategy; no records | Written strategy |
| P11 | Belgium legal/contract acceptance | Owner/POA + Legal Counsel | H-168 in principle; H-169 DR-only; no DPA | **LEGAL/CONTRACT REVIEW REQUIRED** | No legal conclusion here | E08 legal pack | Legal review then accept or refuse | Written Legal/Owner acceptance or refusal |
| P12 | Cost and procurement | Owner/POA + commercial | Category list only; no totals | **COMMERCIAL EVIDENCE REQUIRED** | No amounts invented | E07 | Commercial pack then approve | Approved commercial pack |
| P13 | HUM-08 operational ownership | Owner/POA | Posts unassigned; no 24/7 NOC | **OWNER/POA DECISION REQUIRED** | Names not invented | H-154 items 16–17 | Owner Session assignments | Named RACI record |
| P14–P18 | Implementation evidence | Owner/POA after implementation | None | **IMPLEMENTATION REQUIRED** | D01 forbids implementation now | D01 grant | Later implementation increment | Instance/replica/config evidence |
| P19–P20 | DR test; measured RTO/RPO | Owner/POA after test | None | **VALIDATION REQUIRED** | Provider docs ≠ EOS test | P14–P18; separate test authorization | Controlled EOS DR test | Dated test record + measured values |

Date of this register: **2026-09-22**. Implementation status of D01–D04: **governance record only**. Validation requirements: **none satisfied**.

---

## 6. Evidence-collection boundary

A **future** evidence-collection activity, if executed under a later increment, **may** in principle:

- prepare evidence requirements;
- identify authoritative sources;
- define evidence ownership (**without inventing names** — assignment remains OPEN);
- define evidence dates;
- prepare questions for later approval;
- define comparison criteria;
- define evidence acceptance criteria.

**Not permitted in H-174** (and not done):

- sending requests;
- contacting providers;
- obtaining quotes;
- provisioning resources;
- creating accounts;
- configuring infrastructure;
- implementing or testing DR.

Provider documentation already cited in H-159–H-169 remains **provider documentation**. It is **not** provider-specific confirmation and **not** actual EOS evidence.

---

## 7. Production authorization boundary

H-174 does **not** authorize:

- GCP provisioning;
- Production implementation;
- database creation;
- DR replica creation;
- application deployment;
- schema migration;
- data migration;
- failover;
- switchover;
- DR testing;
- legal or commercial commitment.

A later **explicit** authorization is required for any applicable implementation activity.

```text
No GCP resources were created.
No vendor or legal adviser was contacted.
No evidence requests were sent.
Application / schema / migrations unchanged.
Production remains NOT AUTHORIZED / NOT READY.
```

Historical ADR-0006, DP-0006, H-170, H-171, H-172, and H-173 were **not rewritten**.

---

## 8. Final status

| Topic | State |
| --- | --- |
| H-173 | **COMPLETE** |
| Physical Owner/POA session | **NOT HELD** |
| Limited POA governance decisions | **D01–D04 RECORDED** (supported by existing record) |
| Evidence collection | **NOT EXECUTED** |
| Production authorization | **NOT AUTHORIZED** |
| GCP resources | **NONE** |
| Production data | **NONE** |
| DR replica | **NOT CREATED** |
| DR test | **NOT PERFORMED** |
| Measured RTO | **NOT AVAILABLE** |
| Measured RPO | **NOT AVAILABLE** |
| Production readiness | **NOT READY** |
| Item 24 | **OPEN** |

Item 1 remains **OPEN** (deferred, not granted). No Production blocker is closed by recording limited governance directions.

---

## 9. STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 668 → 669 |
| Files changed this increment | `docs/governance/h-174-controlled-poa-decision-record.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-174
H-175 NOT CREATED
NEXT GATE (not executed): prepare (do not send) the evidence-collection
  requirements package authorized by D03, still without contacting
  providers, provisioning resources, or granting Production.
  Remaining P01–P13 values stay open. Do not treat this file as
  minutes of a held physical session.
```
