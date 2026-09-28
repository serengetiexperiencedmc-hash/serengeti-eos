# H-178 — Controlled Outbound Evidence-Request Approval Gate

> **GOVERNANCE / OUTBOUND-READINESS GATE ONLY**  
> Reviews H177-D01 through H177-D15 for outbound-control completeness.  
> **NOT** evidence collection. **NOT** communication. **NOT** procurement. **NOT** Production implementation.  
> **NOT** send authorization. H-177 draft preparation does **not** constitute send authorization.  
> Historical ADR-0006, DP-0006, H-170 through H-177 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 672  
**Porcelain after this increment:** 673 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP / credentials / DNS / IAM / KMS:** **NONE**  
**Vendor contact / legal engagement / purchase / quotation:** **NONE**  
**External connectors invoked:** **NONE**  
**Evidence requests sent:** **NONE**  
**Evidence received / accepted:** **NONE**  
**Commit / push:** **NONE**  
**H-179:** **NOT CREATED**

```text
H-178 STATUS = COMPLETE — OUTBOUND SEND NOT YET AUTHORIZED
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
```

Lifecycle preserved (no later stage inferred):

`requirement` → `draft prepared` → `sender identified` → `recipient identified` → `question set reviewed` → `send authorization` → `request sent` → `response received` → `evidence verified` → `evidence accepted` → `prerequisite closed` → `implementation authorization` → `implementation` → `validation` → `Production readiness`

H-178 may transition only: `request requirements identified` → `outbound draft governance reviewed`.

---

## 1. Repository baseline (inspected)

| Item | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain at start | 672 (matches H-177 after-count) |
| H-177 path | `docs/governance/h-177-controlled-unsent-evidence-request-draft-package.md` |
| H-177 status | **COMPLETE** — H177-D01–H177-D15 unsent drafts |
| H-176 send / collection | **NOT AUTHORIZED** |
| Named sender in repository | **NONE** — `[SENDER TO BE APPOINTED]` on every draft |
| Named recipient in repository | **NONE** — `[RECIPIENT TO BE APPOINTED]` on every draft |
| Approved channel in repository | **NONE** — `[CHANNEL TO BE APPROVED]` |
| Requests sent | **NONE** |
| Evidence received / accepted | **NONE** |
| Production implementation | **NOT AUTHORIZED** |

No Git identity, author metadata, filename, or commit history was used to infer a sender or recipient.

---

## 2. Review method and classification keys

H-177 was **read, not rewritten**. Drafts were **not** silently modified.

**Sender status (all drafts):** `SENDER NOT YET APPOINTED` — governance dependency.

**Recipient status (all drafts):** `RECIPIENT NOT YET APPOINTED` — governance dependency.

**Channel (all drafts):** H-177 records `[CHANNEL TO BE APPROVED]`. Email is **not** assumed. Classification: **REQUIRES OWNER DECISION**.

**Future send readiness (H-178 §11):**

| Code | Meaning |
| --- | --- |
| A | READY FOR FUTURE SEND-AUTHORIZATION REVIEW |
| B | CONDITIONAL — MISSING NAMED CONTACTS |
| C | CONDITIONAL — MISSING QUESTION-SET APPROVAL |
| D | BLOCKED |
| E | NOT READY |

**Question-set:** `CLEAR` / `CLEAR WITH MINOR EDIT` / `REQUIRES GOVERNANCE CLARIFICATION` / `BLOCKED BY MISSING FACT` / `NOT YET SUITABLE`.

A draft may be substantively `CLEAR` and still **B**, because named contacts are absent. Absence of a real recipient is **not** cured by Owner/POA internal authority.

---

## 3. Per-draft review (H177-D01 through H177-D15)

Invented facts or contacts found: **NONE**. Unauthorized commercial/legal **commitment** language found: **NONE** (informational requests only). Objectively identifiable evidence: **YES** for each (mapped to H-175 EV-IDs). Suitable for **eventual** outbound review after contacts and send grant: **YES**, except as noted for D15 (internal Owner grant identification, not a provider test instruction).

### H177-D01 — Governance / Production authorization

| Item | Finding |
| --- | --- |
| P / EV | P01; EV-G01 |
| Recipient / sender / channel | RECIPIENT NOT YET APPOINTED / SENDER NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — asks whether a written grant exists; does not assert one |
| Identifiable evidence | Written grant or continued deferral after H-171 §5 |
| Commercial/legal commitment risk | None as drafted |
| Dependencies before send | Named sender and recipient; Owner/POA remains the natural eventual audience |
| Future send readiness | **B** |

### H177-D02 — GCP ownership / billing

| Item | Finding |
| --- | --- |
| P / EV | P02; EV-C01, EV-M03 |
| Recipient / sender / channel | RECIPIENT / SENDER NOT YET APPOINTED; channel REQUIRES OWNER DECISION |
| Question set | **CLEAR** — ownership **model** and policy; placeholders for project/billing IDs |
| Identifiable evidence | Named model/policy, not a live project |
| Commercial/legal commitment risk | Informational; **not** account creation or purchase |
| Dependencies before send | Named contacts; must not be used to create a GCP project |
| Future send readiness | **B** |

### H177-D03 — PostgreSQL compatibility

| Item | Finding |
| --- | --- |
| P / EV | P03; EV-T01, EV-T02, EV-T03 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — asks for versions/compatibility; does **not** select a version |
| Identifiable evidence | Compatibility pack; feature matrix; Advanced DR version prerequisites |
| Commercial/legal commitment risk | None as drafted |
| Dependencies before send | Named contacts; class (3)/(4) EOS tests remain later and unauthorized |
| Future send readiness | **B** |

### H177-D04 — Workload and sizing

| Item | Finding |
| --- | --- |
| P / EV | P04; EV-T04, EV-T05 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — requests inputs; does not invent measurements or sizes |
| Identifiable evidence | Workload pack; later sizing proposal citing that pack |
| Commercial/legal commitment risk | None as drafted |
| Dependencies before send | Named contacts; internal ops/engineering likely eventual audience |
| Future send readiness | **B** |

### H177-D05 — Connectivity / networking

| Item | Finding |
| --- | --- |
| P / EV | P05; EV-T06, EV-T07 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — PSA vs PSC options; path **not** selected |
| Identifiable evidence | Comparison pack; DR-path design note |
| Commercial/legal commitment risk | None; must not be treated as network build authorization |
| Dependencies before send | Named contacts; P10 write-endpoint conditions remain design-only |
| Future send readiness | **B** |

### H177-D06 — Encryption / CMEK

| Item | Finding |
| --- | --- |
| P / EV | P06; EV-T08 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — options paper; CMEK not mandatory (H-159); no product selected |
| Identifiable evidence | Binary options; CMEK design only if later chosen |
| Commercial/legal commitment risk | None; not a security or DPA approval |
| Dependencies before send | Named contacts; no key creation |
| Future send readiness | **B** |

### H177-D07 — Secrets / KMS

| Item | Finding |
| --- | --- |
| P / EV | P07; EV-T09 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — ADR-0012 remains proposed-blocked |
| Identifiable evidence | Secrets/KMS options without credentials |
| Commercial/legal commitment risk | None; not product lock or credential issuance |
| Dependencies before send | Named contacts; no secrets created |
| Future send readiness | **B** |

### H177-D08 — Identity / MFA

| Item | Finding |
| --- | --- |
| P / EV | P08; EV-T10, EV-T11 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — HUM-05 not established; tenant not invented |
| Identifiable evidence | Directory facts; role design (not people) |
| Commercial/legal commitment risk | None; not account creation |
| Dependencies before send | Named contacts; corporate directory facts remain EXTERNAL |
| Future send readiness | **B** |

### H177-D09 — Application DR design

| Item | Finding |
| --- | --- |
| P / EV | P09; EV-A01, EV-A03 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — architecture as **direction**; RTO/RPO as business requirements, not measurements; no claim of current regional failover |
| Identifiable evidence | Written app-DR package; post-failover **criteria** |
| Commercial/legal commitment risk | None; not deploy or test |
| Dependencies before send | Named contacts; P05/P07/P08/P10 remain open |
| Future send readiness | **B** |

### H177-D10 — Provider / Google Cloud capability

| Item | Finding |
| --- | --- |
| P / EV | P14 (supports P10/P11 context); EV-P01–EV-P05 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — four evidence classes distinguished; architecture not represented as implemented |
| Identifiable evidence | Class-1 docs vs later class-2 confirmation |
| Commercial/legal commitment risk | Capability confirmation ≠ purchase, contract, or implementation |
| Dependencies before send | Named contacts. Class-2 instance confirmation additionally depends on a later P01 grant and real project — **not** a reason to treat the draft as sent or as class-2 evidence now |
| Future send readiness | **B** |

### H177-D11 — Write endpoint / DNS / failover

| Item | Finding |
| --- | --- |
| P / EV | P10; EV-A02 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — `[PRODUCTION DNS NAME TO BE DETERMINED]`; no invented DNS |
| Identifiable evidence | Written endpoint/DNS strategy |
| Commercial/legal commitment risk | None; not DNS record creation |
| Dependencies before send | Named contacts; P05 path unselected |
| Future send readiness | **B** |

### H177-D12 — Legal / residency

| Item | Finding |
| --- | --- |
| P / EV | P11; EV-L01, EV-L02 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — Belgium exception **not** stated as legally approved; review ≠ acceptance |
| Identifiable evidence | Category inventory; written legal/contract review |
| Commercial/legal commitment risk | **Informational only.** Request for contractual/DPA/residency **information** is **not** DPA acceptance, contract acceptance, or legal approval. Additional **internal legal-review** control is required before any future send-authorization review of this draft |
| Dependencies before send | Named contacts; internal legal-scope confirmation; accepting legal terms remains NOT AUTHORIZED (H-176) |
| Future send readiness | **B** (plus legal-boundary control) |

### H177-D13 — Cost / procurement

| Item | Finding |
| --- | --- |
| P / EV | P12; EV-M01, EV-M02 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — calculator **inputs** and quotation **requirements**; no prices invented; draft is not a quotation |
| Identifiable evidence | Input list; later dated quotes only after a **separate** send grant |
| Commercial/legal commitment risk | **Informational only.** Pricing information ≠ purchase. Obtaining quotations remains **NOT AUTHORIZED** (H-176). Additional **internal commercial-review** control is required before any future send that would seek live quotes |
| Dependencies before send | Named contacts; separate authorization still required to **obtain** quotes; no purchase |
| Future send readiness | **B** (plus commercial-boundary control) |

### H177-D14 — Operations / HUM-08 / runbook

| Item | Finding |
| --- | --- |
| P / EV | P13; EV-O01, EV-O02 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — roles, not invented names |
| Identifiable evidence | Named RACI when Owner appoints people; later runbook |
| Commercial/legal commitment risk | None; placeholders are not appointments |
| Dependencies before send | Named contacts; Owner Session remains the appointment authority |
| Future send readiness | **B** |

### H177-D15 — DR test authorization / validation

| Item | Finding |
| --- | --- |
| P / EV | P19, P20 (not a P01–P13 close); EV-V01, EV-V02, EV-A03 |
| Recipient / sender / channel | NOT YET APPOINTED / REQUIRES OWNER DECISION |
| Question set | **CLEAR** — identifies future grant/measurement artefacts; **explicitly forbids** performing a test |
| Identifiable evidence | Later written test grant; later dated measurements — **neither exists** |
| Commercial/legal commitment risk | None if treated as identification only |
| Dependencies before send | Named contacts. This draft is **not** a provider test instruction and **does not** authorize failover, switchover, or measurement. A later P19 grant is a separate increment |
| Future send readiness | **B** — and **not** interpretable as DR-test or send authorization |

No draft is classified **A** at this increment: A requires controlled readiness for a **future send-authorization review** in the sense of progressing the contact/channel gates; those gates are unmet. No draft is **C** (question sets are not the blocking defect). No draft is **D** or **E** for material unsuitability of the H-177 text. The blocking defect for **all fifteen** is missing named sender, missing named recipient, unapproved channel, and the standing H-176 send prohibition.

---

## 4. Request control matrix

| Draft | P prerequisite | EV-ID(s) | Sender | Recipient | Channel | Question set | Commercial/legal boundary | Future send readiness | Current status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| H177-D01 | P01 | EV-G01 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Informational; not a grant | B | UNSENT DRAFT |
| H177-D02 | P02 | EV-C01, EV-M03 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Not account creation or purchase | B | UNSENT DRAFT |
| H177-D03 | P03 | EV-T01–EV-T03 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Not a version lock | B | UNSENT DRAFT |
| H177-D04 | P04 | EV-T04, EV-T05 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Not a size selection | B | UNSENT DRAFT |
| H177-D05 | P05 | EV-T06, EV-T07 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Not network build | B | UNSENT DRAFT |
| H177-D06 | P06 | EV-T08 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Not encryption/DPA approval | B | UNSENT DRAFT |
| H177-D07 | P07 | EV-T09 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Not credential issuance | B | UNSENT DRAFT |
| H177-D08 | P08 | EV-T10, EV-T11 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Not IdP/MFA readiness | B | UNSENT DRAFT |
| H177-D09 | P09 | EV-A01, EV-A03 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Not deploy or measured RTO/RPO | B | UNSENT DRAFT |
| H177-D10 | P14 (P10/P11 context) | EV-P01–EV-P05 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Capability ≠ implementation or purchase | B | UNSENT DRAFT |
| H177-D11 | P10 | EV-A02 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Not DNS creation | B | UNSENT DRAFT |
| H177-D12 | P11 | EV-L01, EV-L02 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Info ≠ legal/DPA/contract acceptance | B | UNSENT DRAFT |
| H177-D13 | P12 | EV-M01, EV-M02 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Inputs ≠ quote issued ≠ purchase | B | UNSENT DRAFT |
| H177-D14 | P13 | EV-O01, EV-O02 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Placeholders ≠ named RACI | B | UNSENT DRAFT |
| H177-D15 | P19 / P20 | EV-V01, EV-V02, EV-A03 | SENDER NOT YET APPOINTED | RECIPIENT NOT YET APPOINTED | REQUIRES OWNER DECISION | CLEAR | Not DR-test authorization | B | UNSENT DRAFT |

---

## 5. P01–P13 gate matrix

| P | Requirement | Draft(s) | Draft prepared | Sender identified | Recipient identified | Question set controlled | Send authorized | Evidence received | Evidence accepted | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P01 | Production grant | H177-D01 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |
| P02 | GCP ownership/billing | H177-D02 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |
| P03 | PostgreSQL version | H177-D03 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |
| P04 | Sizing values | H177-D04 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |
| P05 | PSA vs PSC | H177-D05 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |
| P06 | CMEK vs Google-managed | H177-D06 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |
| P07 | Secrets/KMS | H177-D07 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |
| P08 | IdP/MFA | H177-D08 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |
| P09 | App DR design | H177-D09 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |
| P10 | Write endpoint/DNS | H177-D11 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |
| P11 | Belgium legal/contract | H177-D12 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |
| P12 | Cost/procurement | H177-D13 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |
| P13 | HUM-08 ownership | H177-D14 | YES | NO | NO | YES (CLEAR) | NO | NO | NO | **OPEN** |

H177-D10 and H177-D15 remain supporting drafts (P14 / P19–P20). They do **not** close P01–P13. No EV-ID is marked accepted. No provider documentation is treated as newly received. No legal approval or commercial quotation is treated as obtained.

---

## 6. Commercial / legal boundary (standing)

| Conversion that is **forbidden** by treating a draft as more than information |
| --- |
| Evidence collection → procurement |
| Pricing questions → quotation acceptance or purchase |
| Contractual questions → contract or DPA acceptance |
| Legal-review questions → legal approval |
| Provider capability questions → implementation approval or onboarding |

H-176 remains in force: obtaining quotations, negotiating terms, accepting legal terms, and purchasing are **NOT AUTHORIZED**.

Evidence states remain distinct: sent ≠ received ≠ verified ≠ accepted ≠ prerequisite closed. None of the right-hand states is true.

---

## 7. H-178 overall decision

**OUTBOUND SEND NOT YET AUTHORIZED.**

Reasons (repository facts, not inferences of a change):

1. H-176 prohibited sending and prohibited approving drafts for send.
2. H-177 only prepared unsent drafts.
3. No named sender has been established (`SENDER NOT YET APPOINTED` on all fifteen drafts). Git identity and similar metadata were **not** used.
4. No named recipients have been established (`RECIPIENT NOT YET APPOINTED` on all fifteen drafts). No Google Cloud, legal, DPO, procurement, or vendor contact was invented.
5. No communication channel has been approved (`REQUIRES OWNER DECISION`).
6. No separate send-authorization increment has been granted.
7. No repository evidence was found that changes (1)–(6).

Counts:

| Classification | Count |
| --- | --- |
| A — READY FOR FUTURE SEND-AUTHORIZATION REVIEW | **0** |
| B — CONDITIONAL — MISSING NAMED CONTACTS | **15** |
| C — CONDITIONAL — MISSING QUESTION-SET APPROVAL | **0** |
| D — BLOCKED | **0** |
| E — NOT READY | **0** |

All fifteen question sets are **CLEAR** for later review. That does **not** authorize send. D12 and D13 additionally require internal legal/commercial-scope control before any future send-authorization review. D15 additionally remains **not** a DR-test authorization.

---

## 8. Permitted and prohibited transitions

**Permitted (this increment):** `request requirements identified` → `outbound draft governance reviewed`.

**Not transitioned:**

- `draft` → `sent`
- `not authorized` → `authorized` (send)
- `not received` → `received`
- `not accepted` → `accepted`
- P01–P13 `OPEN` → `CLOSED`

---

## 9. Production state (unchanged)

| Topic | State |
| --- | --- |
| GCP resources | **NONE** |
| Production data | **NONE** |
| Implementation authorization | **NOT AUTHORIZED** |
| DR replica | **NOT CREATED** |
| DR testing | **NOT PERFORMED** |
| Measured RTO/RPO | **NOT AVAILABLE** |
| Production readiness | **NOT READY** |
| Item 24 | **OPEN** |

H-178 cannot and did not change these states.

```text
No requests were sent.
No sender or recipient was invented.
No external connector was invoked.
No GCP resources were created.
No application / schema / infrastructure files were changed.
No evidence is marked received or accepted.
P01–P13 remain OPEN.
Production remains NOT AUTHORIZED / NOT READY.
```

Historical ADR-0006, DP-0006, and H-170 through H-177 were **not rewritten**.

---

## 10. STOP

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 672 → 673 |
| Files changed this increment | `docs/governance/h-178-controlled-outbound-evidence-request-approval-gate.md` only |
| Commit / push | **NONE** |
| Dirty worktree | **Preserved** |

```text
PROCESS STOPPED AFTER H-178
H-179 NOT CREATED
NEXT GATE (not executed): appoint named sender and named recipient
  for any draft that Owner/POA intends to progress, approve a channel,
  then a subsequent explicit send-authorization increment. Until those
  dependencies exist, outbound send remains NOT AUTHORIZED.
  P01–P13 remain OPEN.
```
