# H-176 — Controlled External Evidence-Collection Authorization

> **GOVERNANCE / COLLECTION-BOUNDARY ONLY**  
> Determines and records the boundary for any **future** actual evidence-collection activity after H-175 prepared requirements.  
> **NOT** sending of requests. **NOT** provider, legal, or commercial contact. **NOT** evidence receipt or acceptance.  
> **NOT** Production implementation authorization. **NOT** GCP provisioning, replica creation, deployment, legal conclusion, commercial commitment, or DR test.  
> Historical ADR-0006, DP-0006, H-170, H-171, H-172, H-173, H-174, and H-175 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 670  
**Porcelain after this increment:** 671 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP / credentials / DNS / IAM / KMS:** **NONE**  
**Vendor contact / legal engagement / purchase / quotation:** **NONE**  
**Evidence requests sent:** **NONE**  
**Evidence collected / received / accepted:** **NONE**  
**Commit / push:** **NONE**  
**H-177:** **NOT CREATED**

```text
H-176 STATUS = COMPLETE — ACTUAL EXTERNAL COLLECTION NOT AUTHORIZED
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

H-174 **D03** authorized **preparation** of an evidence-collection list/package. H-175 completed that preparation. D03 does **not** automatically authorize external communication. This increment records that limitation.

---

## 1. Repository baseline (inspected)

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain at start | 670 (matches H-175 after-count) |
| H-175 path | `docs/governance/h-175-production-evidence-collection-requirements-package.md` |
| H-175 status | **COMPLETE** — requirements prepared; collection not executed |
| Evidence requests sent | **NONE** (no repository evidence of any send) |
| Evidence received or accepted | **NONE** |
| Production implementation authorized | **NO** |
| GCP resources | **NONE** |

No repository evidence was found of approved request drafts with named sender, named recipient, send date, or Provider/Legal/commercial replies.

---

## 2. Authoritative baseline (H-169 through H-175)

No new architecture is introduced. Carried forward:

| Topic | State |
| --- | --- |
| Primary region | `africa-south1` |
| Secondary DR region | `europe-west1` |
| Cloud SQL edition | Enterprise Plus |
| DR mechanism | Advanced DR with designated DR replica |
| Machine-series pairing | N2 |
| RTO requirement | ≤ 4 hours |
| RPO requirement | ≤ 1 hour |
| Application DR | Active-passive **direction** |
| Architecture | **SELECTED** (H-169); **not** Production-approved (H-174 D02) |
| Production implementation | **NOT AUTHORIZED** (H-174 D01) |
| GCP resources | **NONE** |
| Production data | **NONE** |
| DR replica | **NOT CREATED** |
| DR test | **NOT PERFORMED** |
| Measured RTO/RPO | **NOT AVAILABLE** |
| P01–P13 | **OPEN** |
| Evidence package | **PREPARED** (H-175 EV-G01–EV-V02) |
| Evidence collection | **NOT EXECUTED** |

---

## 3. Collection authorization decision

**Actual evidence-collection activity (sending requests / contacting external parties): NOT AUTHORIZED.**

| Activity | Decision | Basis |
| --- | --- | --- |
| Preparing internal request **drafts** (no send, no named fictitious recipients) | **AUTHORIZED WITH CONDITIONS** | Continuation of H-174 D03 and H-175; drafts remain governance artefacts |
| Approving request drafts for send | **NOT AUTHORIZED** | No named sender/authority; names must not be invented |
| Sending requests / contacting providers, vendors, legal advisers, or commercial partners | **NOT AUTHORIZED** | D03 did not grant send; H-175 §10 reserved send to a later explicit grant; this increment lacks named recipient, sender, and approved question set |
| Receiving / logging external responses | **NOT AUTHORIZED** as a live process | Nothing has been sent; no inbound channel is stood up |
| Obtaining quotations | **NOT AUTHORIZED** | Requires contact and later commercial grant |
| Negotiating or accepting legal/commercial terms | **NOT AUTHORIZED** | P11/P12 remain OPEN |
| Purchases / account creation / provisioning | **NOT AUTHORIZED** | H-174 D01 |

**Why sending is not authorized here**

1. H-174 D03: “Sending requests, obtaining quotes, creating accounts, and configuring infrastructure remain **forbidden** until a later explicit authorization.”
2. H-175 §10: H-175 “does **not** authorize sending requests” and required a later increment to authorize **actual** collection.
3. Existence of D03 and of an H-175 requirements list is **not** a send grant.
4. Section 5 controls cannot be populated without inventing recipients, sender names, dates, or approvals — which this increment **must not** do.
5. No repository evidence of Owner/POA naming a sender, a recipient, or an approved outbound question set.

Sending is therefore **NOT AUTHORIZED**. It is also **DEFERRED** in the sense that a later increment **may** grant it once the missing controls exist. It is **not BLOCKED** by a prohibition on ever collecting evidence.

**Conditions on draft preparation (only)**

- Drafts must map to H-175 evidence IDs and P01–P13.
- Drafts must use the §5 control template with fields left **OPEN** where names/dates/recipients are unknown.
- Drafts must not contain credentials, secrets, unnecessary personal information, or confidential material.
- Drafts must not be addressed or transmitted.
- Drafts are **not** approved for send by being written.

No request is recorded as approved, sent, or answered.

---

## 4. Permitted collection scope (future grant — not a present send grant)

The following is the **topic scope** that a **later** send-authorization increment **may** adopt. It is **not** permission to send now. Internal drafts **may** cover these topics. Numerical values, prices, legal conclusions, and names **must not** be invented.

### A. Technical / provider evidence

Permissible **future** questions (H-175 EV-P01–EV-P05, EV-T01–EV-T03, EV-T06–EV-T07):

- Cloud SQL Enterprise Plus availability in `africa-south1` and `europe-west1`;
- Advanced DR prerequisites;
- designated DR replica support;
- supported PostgreSQL versions (no Production version selected);
- connectivity options (PSA vs PSC **not** selected);
- backup/PITR behaviour (H-160/H-162 direction already recorded; applied config is later);
- failover/switchover behaviour;
- regional availability;
- provider limitations.

Class (1) provider documentation already cited in H-169/H-170 remains documentation. Future collection would seek class (2) confirmation. Generic docs ≠ EOS evidence.

### B. Workload and sizing evidence

Permissible **future** internal inputs (H-175 EV-T04–EV-T05): required workload inputs; sizing assumptions labelled as assumptions; storage and growth; concurrency; peak usage; backup and recovery **expectations** (RTO ≤4h / RPO ≤1h as requirements, not measurements).

Do **not** request or invent unsupported numerical values. Do **not** select instance sizes. N2 remains series pairing only.

### C. Commercial evidence

Permissible **future** quotation/calculator topics (H-175 EV-M01–EV-M03; H-172 E07): pricing calculator inputs; quotation requirements; support arrangements; transfer and replication charges; Cloud Run and related service costs.

**No purchase or commitment may be made** by collecting, quoting, or drafting.

### D. Legal / contractual evidence

Permissible **future** review topics (H-175 EV-L01–EV-L02): provider terms; DPA; subprocessors; Belgium residency; transfer mechanisms; retention and deletion; backup/DR access; incident responsibilities.

**No legal acceptance** may be recorded through evidence collection alone. P11 remains **LEGAL/CONTRACT REVIEW REQUIRED**.

### E. Operational evidence

Permissible **future** ownership/support topics (H-175 EV-O01–EV-O02): support model; operational responsibilities; HUM-08; escalation; runbook expectations; incident and DR authority.

Do **not** invent names or assign ownership without authoritative confirmation. Posts remain **UNASSIGNED**.

---

## 5. Approved request controls (template — unpopulated)

Any **future** outbound request, if a later increment authorizes send, **must** record:

| Control field | Required content | State in H-176 |
| --- | --- | --- |
| Request ID | Stable ID mapped to H-175 EV-* | **OPEN** — no request IDs issued for send |
| Recipient / provider | Named organisation / channel | **OPEN** — **not invented** |
| Purpose | One-sentence purpose tied to a decision | **OPEN** |
| Related P01–P13 item | Explicit P-ID and EV-ID | **OPEN** |
| Approved question set | Exact questions, versioned | **OPEN** — not approved for send |
| Sender / authority | Named person + Owner/POA authority | **OPEN** — **not invented** |
| Date sent | Actual send timestamp | **NONE** — not sent |
| Response deadline | If applicable | **OPEN** |
| Information classification | Governance / non-secret | Drafts: no secrets |
| Prohibited information | Credentials, secrets, unnecessary personal data, confidential material not required for the question | **IN FORCE** |
| Response storage location | Repository path or evidence-custody location | **OPEN** — Owner assignment required |
| Evidence review owner | Named reviewer | **OPEN** — **not invented** |
| Acceptance criteria | Per H-175 §9 classes (1)–(7) | Defined in H-175; **not applied** to any artefact |

No recipient, sender, reviewer, send date, or approval is recorded. Writing this template does **not** approve any request.

---

## 6. Evidence receipt and acceptance

When (and only when) evidence is later received under a send grant, the process is:

1. Record receipt (date, channel, request ID).
2. Preserve original source and date.
3. Identify the source and authority.
4. Map the evidence to the relevant P-item and EV-ID.
5. Review completeness and relevance.
6. Identify limitations and contradictions.
7. Record acceptance or rejection **separately** from receipt.
8. Update the related governance decision **only** through a later controlled increment.

**States that must remain distinct:**

| State | Meaning | Current |
| --- | --- | --- |
| Received | Artefact on file | **NONE CONFIRMED** |
| Reviewed | Completeness/relevance assessed | **NONE** |
| Accepted | Reviewer accepted the artefact as genuine and in-scope | **NONE** |
| Sufficient for decision | Accepted artefact is enough to decide that P-item | **NONE** |
| Sufficient for implementation | Enough to implement (still needs P01 grant) | **NONE** |
| Sufficient for Production readiness | Closes Item 1 / Item 24 class blockers | **NONE** |

No provider response automatically closes a Production blocker. Provider documentation is not measured EOS RTO/RPO.

---

## 7. External communication boundary

Each permission is classified separately. Evidence collection is **not** procurement, legal approval, or implementation authorization.

| Permission | H-176 classification |
| --- | --- |
| Preparing request drafts (internal, unsent) | **AUTHORIZED WITH CONDITIONS** (§3) |
| Approving request drafts for send | **NOT AUTHORIZED** |
| Sending requests | **NOT AUTHORIZED** |
| Receiving responses (live inbound process) | **NOT AUTHORIZED** |
| Negotiating terms | **NOT AUTHORIZED** |
| Obtaining quotations | **NOT AUTHORIZED** |
| Accepting legal terms | **NOT AUTHORIZED** |
| Making purchases | **NOT AUTHORIZED** |

```text
No requests were drafted for send, approved, or sent in this increment.
No provider, legal adviser, or commercial partner was contacted.
No quotations were obtained.
No terms were negotiated or accepted.
No purchases were made.
```

---

## 8. Production authorization boundary

H-176 does **not** authorize:

- GCP provisioning;
- Production deployment;
- Cloud SQL creation;
- DR replica creation;
- data migration;
- application deployment;
- schema migration;
- failover;
- switchover;
- DR testing;
- Production readiness.

H-174 D01 (implementation deferred) and D02 (architecture selected, not Production-approved) remain in force.

```text
No GCP resources were created.
Application / schema / migrations unchanged.
Production remains NOT AUTHORIZED / NOT READY.
```

Historical ADR-0006, DP-0006, H-170, H-171, H-172, H-173, H-174, and H-175 were **not rewritten**.

---

## 9. Final status

| Topic | State |
| --- | --- |
| H-175 | **COMPLETE** |
| Evidence package preparation | **COMPLETE** |
| Evidence collection | **NOT EXECUTED** |
| Actual collection authorization | **NOT AUTHORIZED** |
| Request-draft preparation | **AUTHORIZED WITH CONDITIONS** (unsent internal drafts only) |
| Requests sent | **NOT CONFIRMED / NOT AUTHORIZED** |
| Evidence received | **NONE CONFIRMED** |
| Evidence accepted | **NONE** |
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

No Production blocker is closed by defining a collection boundary.

---

## 10. STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 670 → 671 |
| Files changed this increment | `docs/governance/h-176-controlled-external-evidence-collection-authorization.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-176
H-177 NOT CREATED
NEXT GATE (not executed): prepare unsent request-draft artefacts
  using H-175 EV-IDs and this §5 control template, still without
  inventing recipients/senders or sending anything. A subsequent
  increment may authorize send only after named sender, named
  recipient, and an approved question set exist. P01–P13 remain OPEN.
```
