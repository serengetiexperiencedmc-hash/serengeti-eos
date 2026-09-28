# H-173 — Owner/POA Prerequisite Decision Session and Decision Register

> **GOVERNANCE / DECISION-SESSION PREPARATION ONLY**  
> Prepares a structured Owner/POA agenda and decision register for H-172 items **P01–P13**.  
> **NOT** a record that a decision session has been held. **NOT** Production implementation authorization. **NOT** GCP provisioning, replica creation, deployment, legal conclusion, commercial commitment, or DR test.  
> Historical ADR-0006, DP-0006, H-170, H-171, and H-172 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 667  
**Porcelain after this increment:** 668 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP / credentials / DNS / IAM / KMS:** **NONE**  
**Vendor contact / legal commitment / purchase:** **NONE**  
**Commit / push:** **NONE**  
**H-174:** **NOT CREATED**

```text
H-173 STATUS = COMPLETE — DECISION SESSION PREPARED / NOT YET HELD
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

No repository evidence was found that an Owner/POA prerequisite decision session covering P01–P13 has occurred. This increment therefore **prepares** the session. It does **not** claim the session was held.

---

## 1. Repository baseline (inspected)

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain at start | 667 (matches H-172 after-count) |
| H-172 file | `docs/governance/h-172-production-prerequisite-decision-closure-plan.md` |
| H-172 status | **COMPLETE** — closure **plan** recorded; prerequisites **not** closed |
| Production implementation authorized | **NO** |
| GCP resources | **NONE** |

---

## 2. Decision-session purpose

H-173 is a **structured decision-session preparation gate**. Its purpose is to:

1. Review P01–P13.
2. Separate decisions that **can** be made by Owner/POA from evidence-dependent matters.
3. Identify required inputs for each decision.
4. Prevent premature closure.
5. Produce a controlled **agenda** and **decision register**.
6. Identify the next evidence-collection actions.

Authority to decide is **not** evidence that a decision should already be made. Open items remain open when required evidence is absent.

Established architecture (not reopened): primary `africa-south1`; secondary `europe-west1`; Enterprise Plus Advanced DR with designated replica; N2 pairing; RTO ≤4h; RPO ≤1h; active-passive application DR; Cloud SQL failover ≠ EOS application failover. Architecture selection remains **COMPLETE**. Implementation remains **NOT AUTHORIZED**.

---

## 3. P01–P13 decision register

Authoritative source: H-172 §3. No new technical, legal, commercial, or ownership **values** are selected.

| ID | Decision title | Existing direction, if any | Decision authority | Current status | Evidence required | Risks if decided prematurely | Dependencies | Permissible next action | Closure evidence required |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | Production authorization grant | None. H-169–H-172 are **not** a grant. | Owner/POA | **OWNER/POA DECISION REQUIRED** | H-171 §5 twenty conditions; written grant scope | Unauthorized GCP/data acts; false readiness | Prerequisite closure | Explicit grant **or** explicit deferral — **not** inferred | Written Production grant document |
| P02 | GCP project, billing, ownership, support, budget | Hosting **direction** H-158 only; no project | Owner/POA + commercial | **NOT STARTED** | Named ownership model; support/budget policy. Project create is later **IMPLEMENTATION REQUIRED**. | Orphan billing; uncontrolled spend | P01 for Production use of a project | Decide ownership/billing **without** provisioning | Named owners + policy; not a live project |
| P03 | Production PostgreSQL version | ADR-0003 PG 16 **Development** SoR; lab 16.15 **not** Production | Owner/POA after evidence | **OWNER/POA DECISION REQUIRED** | EOS–Plus compatibility pack (H-172 E02). Plus docs PG 12–18 are **not** EOS evidence. | Migrate/SoR breakage | EXTERNAL EVIDENCE REQUIRED | Commission compatibility pack; then select | Written version + compatibility evidence |
| P04 | Cloud SQL sizing | N2 **series** pairing (H-169). No vCPU/memory/storage values. | Owner/POA confirms after evidence | **EXTERNAL EVIDENCE REQUIRED** | Workload pack. Framework may be Owner-approved; **values** need evidence. | Missed RTO/RPO; overspend | Workload evidence | Approve **framework** only, or wait for evidence | Sizing record tied to evidence |
| P05 | PSA versus PSC | Write endpoint: Plus + private IP; PSA and PSC are **distinct**. **Not chosen.** | Owner/POA after design | **OWNER/POA DECISION REQUIRED** | Connectivity design note (H-172 E04). Provider docs ≠ selected path. | Replica/write-endpoint incompatibility | Design evidence | Record named path after design — **not now** | Named PSA or PSC (or documented alternative) |
| P06 | CMEK versus Google-managed encryption | H-159: Owner decision; CMEK **not** mandatory | Owner/POA | **OWNER/POA DECISION REQUIRED** | If CMEK: key location/IAM/rotation (E06). Binary direction can be Owner-set; **configuration** needs evidence. | Unusable keys; residency leak | Optional KMS design | Record encryption **direction** when Owner is ready; no keys created | Written encryption decision |
| P07 | Secrets / KMS platform | ADR-0012 **proposed — blocked for UAT and Production** | Owner/POA | **OWNER/POA DECISION REQUIRED** | Vault vs cloud KMS/Secret Manager evaluation | Secrets in git/images; blocked UAT+ | ADR-0012 | Direction or recorded deferral with control; **no credentials** | ADR-0012 Production-ready **or** controlled deferral |
| P08 | IdP / MFA | ADR-0013 **proposed — blocked for Production**. HUM-05 directory **NOT ESTABLISHED**. | Owner/POA | **OWNER/POA DECISION REQUIRED** | Corporate identity facts — **EXTERNAL EVIDENCE REQUIRED**. Do not invent tenant. | Unusable Production login | Directory facts | Establish identity facts; then select | ADR-0013 + MFA evidence |
| P09 | Application DR deployment strategy | Active-passive **direction** DECIDED (H-169). Production artefact/config/routing **not** defined. | Owner/POA | **OWNER/POA DECISION REQUIRED** | App-DR package: Cloud Run DR runtime, config, auth, dependencies | DB-only failover mistaken for EOS DR | P05, P07, P08, P10 | Define package; **do not deploy** | Written app-DR design |
| P10 | Write endpoint and DNS / app routing | Direction to use write endpoint **where documented conditions met** (H-169). App DNS OPEN. | Owner/POA | **OWNER/POA DECISION REQUIRED** | Strategy for DB DNS vs app URL; Cloud DNS API is a later implementation item | Failed reconnect after failover | P05 | Select strategy; **no DNS records** | Written strategy |
| P11 | Belgium residency / legal acceptance | H-168 in principle; H-169 refined to `europe-west1` DR only. **No DPA. No legal conclusion.** | Owner/POA + Legal Counsel | **LEGAL/CONTRACT REVIEW REQUIRED** | DPA, terms, subprocessors, transfer, retention, access (H-172 §7 / E08) | Unlawful or unaccepted transfer | Legal pack | Legal review; then Owner accept **or** refuse | Written Legal/Owner acceptance or refusal |
| P12 | Cost and procurement authorization | Category list only (H-170/H-172). **No totals.** | Owner/POA + commercial | **COMMERCIAL EVIDENCE REQUIRED** | Quotes/calculator inputs for listed categories | Unfunded replica/Plus | E07 | Obtain commercial pack; then approve | Approved commercial pack |
| P13 | HUM-08 operational ownership | PDM recorded as escalation; DBA/identity/backup/DNS **UNASSIGNED**. No 24/7 NOC. | Owner/POA | **OWNER/POA DECISION REQUIRED** | Named RACI. **Do not invent names.** | Unowned failover | H-154 items 16–17 | Owner Session assignments | Named RACI record |

P14–P21 remain as in H-172 (**not** this session’s P01–P13 close set). They stay **EXTERNAL EVIDENCE REQUIRED**, **IMPLEMENTATION REQUIRED**, **VALIDATION REQUIRED**, **BLOCKED**, or **NOT STARTED** as recorded.

---

## 4. Decision classification

Each P01–P13 has **one primary category**. Secondary notes do not move the item to CLOSED.

| ID | Primary category | Notes |
| --- | --- | --- |
| P01 | **A — Potential Owner/POA decision** | Owner may **defer** or set conditions for a **future** grant. Granting Production now would skip H-171 §5. Authority ≠ due now. |
| P02 | **D — Commercial/operational** | Ownership/billing model is Owner/commercial. Creating the GCP project is **E / IMPLEMENTATION REQUIRED** later. |
| P03 | **B — Evidence-dependent** | Version value needs compatibility pack. Owner may authorize **collection** of that pack (A-type activity) without selecting the version. |
| P04 | **B — Evidence-dependent** | Sizes need workload evidence. Owner may approve a **sizing framework** (A-type) without numbers. |
| P05 | **B — Evidence-dependent** | PSA vs PSC needs a connectivity design note. Grant lists this as a B example. |
| P06 | **A — Potential Owner/POA decision** | Binary Google-managed vs CMEK is an Owner security direction (H-159). KMS **configuration** remains B if CMEK is chosen. **Not decided here.** |
| P07 | **B — Evidence-dependent** | Secrets architecture (grant example). Direction/deferral is Owner; product lock needs evaluation. |
| P08 | **B — Evidence-dependent** | IdP/MFA needs corporate directory facts. |
| P09 | **B — Evidence-dependent** | App DR **endpoint/deployment** strategy beyond active-passive direction. |
| P10 | **B — Evidence-dependent** | Write endpoint / DNS strategy (grant example). |
| P11 | **C — Legal/contract-dependent** | Belgium DR residency, DPA, terms, subprocessors, transfer. **No legal approval recorded.** |
| P12 | **D — Commercial/operational** | Quotations and cost. **No amounts invented.** |
| P13 | **D — Commercial/operational** | HUM-08, on-call, incident authority. **No names invented.** |

**Category E** (implementation/validation) applies to H-172 P14–P20 (instance evidence, replica, failover, measured RTO/RPO). **None of P01–P13 is closed as E.** They must not be closed in H-173 on implementation evidence that does not exist.

---

## 5. Session agenda (proposed — not held)

The following is a **proposed** agenda. It does **not** imply that the session has already occurred.

1. Confirmation of selected DR architecture (`africa-south1` / `europe-west1` / Plus / Advanced DR / designated replica / N2 / RTO ≤4h / RPO ≤1h / active-passive app DR).
2. Confirmation of unresolved P01–P13 items (register §3).
3. Decisions that **may** be made immediately **if** the Owner is prepared (typically Category A items such as P01 **deferral**, P02 ownership **model**, P06 encryption **direction**, P04 **framework** only) — still optional; not pre-decided.
4. Evidence that must be obtained before technical decisions (P03, P04 values, P05, P07–P10).
5. Legal and contractual review requirements (P11).
6. Commercial evidence and approval requirements (P12).
7. Operational ownership requirements (P13).
8. Implementation authorization prerequisites (H-171 §5; not satisfied).
9. Separate DR test authorization requirements (H-172 P19–P20; not this session’s close).
10. Decision-record and evidence-custody requirements (§8 below).

---

## 6. Decision-pack requirements (P01–P13)

Minimum information for an **informed** future decision. Evidence owner: **OPEN — OWNER ASSIGNMENT REQUIRED** unless a role is already recorded. Provider documentation ≠ provider-specific confirmation ≠ actual EOS evidence.

| ID | Authoritative source | Evidence date | Technical assumptions | Unresolved uncertainties | Legal review | Commercial impact | Implementation dependency | Validation dependency | Expiry / refresh |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | H-154 Item 1; H-171 §5 | H-171 2026-09-22 | Architecture ≠ authorization | Whether remaining OPEN gates block a grant | N/A for the grant act itself | Unlocks spend only after P12 | Blocks all Production acts | N/A until grant | Grant must remain scoped; refresh if architecture changes |
| P02 | H-158 direction | 2026-09-22 | No project exists | Billing entity; support tier | Contract later | Billing/support | Project create is later | N/A | Refresh at procurement |
| P03 | ADR-0003 (Dev); Plus PG 12–18 docs | Dev 2026-08-21; Plus docs per H-169 | Dev 16-class ≠ Production patch | EOS migrate vs Cloud SQL version | N/A | Edition default PG 16+ is Plus | Instance create | Compatibility tests | Re-check Plus support at create |
| P04 | H-169 N2 only | 2026-09-22 | No workload numbers | vCPU/RAM/disk | N/A | Instance + replica cost | Instance create | Load/RTO later | Re-size after Production load exists |
| P05 | H-170 write-endpoint / PSA vs PSC | 2026-09-22 | Private IP required for documented write endpoint | Which path SEDMC will operate | Network/data path | Network/DNS cost | VPC/PSA or PSC build | Connectivity test | Re-verify at create |
| P06 | H-159 CMEK vs Google-managed | H-159 | CMEK not mandatory | Key location if CMEK | If CMEK/cross-region keys | KMS cost if CMEK | Key create if CMEK | Restore with CMEK | Rotation policy later |
| P07 | ADR-0012 | 2026-08-21 | No Production secrets store | Vault vs Secret Manager/KMS | Secrets location | Platform cost | Secret create **forbidden now** | Rotation drill later | Refresh at UAT+ |
| P08 | ADR-0013; HUM-05 | 2026-08-21 | Corporate IdP unknown | Tenant, MFA, SSO | Identity processing | IdP cost | IdP wiring later | Login test | Refresh if directory changes |
| P09 | H-169 active-passive | 2026-09-22 | DB DR ≠ EOS DR | DR Cloud Run artefact, config | App data in `europe-west1` during event | Dual-region Cloud Run | Deploy later | App recovery test | Refresh after app change |
| P10 | H-169 write endpoint | 2026-09-22 | Conditions: Plus + private IP + DNS API | App URL vs DB DNS | DNS metadata | Cloud DNS | DNS records later | Failover reconnect | TTL/refresh at test |
| P11 | H-168/H-169 exception | 2026-09-22 | Exception is DR-only, not blanket | DPA, subprocessors, transfer | **Required — OPEN** | May block replica | Replica create blocked | N/A | Refresh on contract change |
| P12 | H-170/H-172 category list | 2026-09-22 | Replica billed as instance; cross-region transfer charged | All **amounts** unknown | Tied to P11 | **OPEN** | Purchase later | N/A | Refresh quotes before buy |
| P13 | H-154 HUM-08 | H-154 | No invented names; no 24/7 NOC | All specialist posts | Access/IR | Staffing | Ops before go-live | Drill later | Refresh roster |

---

## 7. Decision rules

- No technical value is selected without adequate supporting evidence.
- No legal acceptance is recorded without appropriate legal/contractual review.
- No cost approval is recorded without commercial evidence.
- No operational owner is invented.
- No Production authorization is inferred from architecture selection.
- No DR test acceptance is inferred from provider documentation.
- No measured RTO/RPO is recorded before a controlled EOS DR test.
- Open items remain open when required evidence is absent.

---

## 8. Future decision record (format only)

Any later Owner/POA decision must be recorded with:

- decision ID;
- exact decision statement;
- authority;
- options considered;
- evidence relied upon;
- assumptions;
- risks;
- selected direction, if any;
- limitations;
- implementation status;
- validation requirements;
- date;
- resulting governance dependencies.

**No future decision is populated with invented approvals in this increment.**

---

## 9. Authorization boundary

H-173 does **not** authorize:

- GCP provisioning;
- Production deployment;
- Cloud SQL creation;
- DR replica creation;
- migration;
- failover;
- switchover;
- application or schema changes;
- DR testing;
- legal or commercial commitment.

A subsequent **explicit** governance decision is required for any applicable implementation activity.

```text
No GCP resources were created.
No vendor or legal adviser was contacted.
Application / schema / migrations unchanged.
Production remains NOT AUTHORIZED / NOT READY.
```

Historical ADR-0006, DP-0006, H-170, H-171, and H-172 were **not rewritten**.

---

## 10. Final status

| Topic | State |
| --- | --- |
| Architecture | **COMPLETE** |
| P01–P13 prerequisite closure | **IN PROGRESS** |
| Owner/POA decision session | **PREPARED / NOT YET HELD** |
| Production authorization | **OPEN** |
| GCP resources | **NONE** |
| Production data | **NONE** |
| DR replica | **NOT CREATED** |
| DR test | **NOT PERFORMED** |
| Measured RTO | **NOT AVAILABLE** |
| Measured RPO | **NOT AVAILABLE** |
| Production readiness | **NOT READY** |
| Item 24 | **OPEN** |

Item 1 remains **OPEN**. No Production blocker is closed by preparing an agenda.

---

## 11. STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 667 → 668 |
| Files changed this increment | `docs/governance/h-173-owner-poa-prerequisite-decision-session.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-173
H-174 NOT CREATED
NEXT GATE (not executed): convene the Owner/POA prerequisite decision session
  using this agenda and register; record outcomes in a subsequent
  governance increment. Do not treat this file as minutes of a held session.
```
