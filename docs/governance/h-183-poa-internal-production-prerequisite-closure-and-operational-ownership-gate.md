# H-183 — POA Internal Production-Prerequisite Closure and Operational Ownership Gate

> **GOVERNANCE / INTERNAL CLOSURE AND PREPARATION ONLY**  
> Closes, narrows, or prepares Production prerequisites that Owner/POA can resolve **without** inventing external facts or touching Production.  
> **NOT** Production implementation authorization. **NOT** GCP provisioning. **NOT** legal approval. **NOT** purchase. **NOT** measured RTO/RPO.  
> H-181 and H-182 were **inspected and not rewritten**. Historical ADR-0006 and DP-0006 were **not rewritten**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved)  
**Porcelain at start of this increment:** 679  
**Porcelain after this increment:** 680 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**GCP / secrets / DNS / IAM / certificates:** **NONE**  
**H-181 requests sent:** **NONE**  
**External evidence received / accepted:** **NONE**  
**Commit / push:** **NONE**  
**H-184:** **NOT CREATED**

```text
H-183 STATUS = COMPLETE — INTERNAL PREREQUISITES NARROWED; DESIGNS PREPARED; PRODUCTION NOT AUTHORIZED
authorization to prepare ≠ authorization to implement
Production implementation: NOT GRANTED
productionReady = false
```

---

## 1. Purpose and baseline

Remove avoidable **internal** ambiguity from the Production chain so that, when external evidence arrives, the path is: evidence review → implementation authorization → implementation → validation.

Inspected: H-171 P01–P21; H-172–H-182; H-125 OA-01–OA-03; H-159 encryption; ADR-0003 (Dev SoR).

| Item | State |
| --- | --- |
| Production | **NOT READY** / implementation **NOT AUTHORIZED** |
| H-169 architecture | **SELECTED** |
| H-181 outbound collection | **AUTHORIZED**; sent **NONE** |
| 28-row inventory | Authoritative; updated in §19 without renumbering |

---

## 2. Decision classes used

| Class | Meaning |
| --- | --- |
| 1 POA-decidable now | Owner/POA can record a governance direction without an external fact |
| 2 Internally definable now | Design/framework/RACI **roles** without names, prices, or resources |
| 3 Externally evidenced later | Provider, quote, contract, directory, or runtime fact |
| 4 Named-person appointment required | Real individual still missing |
| 5 Production authorization required | Create/configure/deploy |
| 6 Runtime validation required | Test/measure |

`DECIDED` ≠ `IMPLEMENTED` ≠ `VALIDATED`.

---

## 3. P01 — Production grant / authority

**What P01 is:** an Owner/POA **written implementation grant** (H-171 §5; H-172 P01), not a GCP IAM click. H-174 **D01** already deferred implementation (not a rejection).

**POA decisions now:**

| Sub-decision | Record |
| --- | --- |
| Implementation grant | **NOT GRANTED** — remains a later controlled authorization |
| Continued **preparation** | **AUTHORIZED** (this increment and H-182 packages) |
| GCP IAM / human identities / service accounts | **NOT CREATED** |

`authorization to prepare` ≠ `authorization to implement`.

**Status:** P01 implementation grant **OPEN** (class 1 for the grant act later; class 5 to execute). Preparation **DECIDED**. **IMPLEMENTED:** no. **VALIDATED:** no.

---

## 4. P06 — Encryption / CMEK

H-159: CMEK is **not** mandatory; Google-managed vs CMEK **REQUIRES OWNER DECISION**. No legal record requires CMEK. No keys exist.

**POA decision (class 1):** **Google-managed encryption** is the **internal default governance direction** for Cloud SQL (and associated Google-managed disk encryption).

Conditions:

- Owner/POA governance decision, **not** implementation;
- **no** KMS key created;
- **no** Production resource created;
- if later legal/security review **requires** CMEK, this decision is **reopened** (class 3 then class 5).

**Status:** Direction **DECIDED** (Google-managed default). **IMPLEMENTED:** no. **VALIDATED:** no.

---

## 5. P07 — Secrets / KMS (design, not product lock)

ADR-0012 remains `proposed — blocked for UAT and Production`. H-159: Secret Manager in `africa-south1` is a **feasible candidate**, not a lock. **No secrets, credentials, keys, or service accounts are created.**

### Secret classes (logical)

| Class | Examples | Production rule |
| --- | --- | --- |
| S1 | `EOS_TOKEN_SECRET` and session signing | Outside git; rotated; injection via platform secret store |
| S2 | Database URLs / passwords | TLS `require`; not in images |
| S3 | SMTP / event-bus credentials if used | Least privilege |
| S4 | IdP client secrets (when IdP exists) | After P08 |
| S5 | CMEK key material | **N/A** under P06 default |

### Design (class 2)

| Topic | Direction |
| --- | --- |
| Store | Named platform **after** ADR-0012; candidate regional Secret Manager — **not selected** |
| Ownership | Security/Access Owner (role); rotation: same + Database Owner for DB secrets |
| Access | Least privilege; no secrets in git/images (standing) |
| Injection | Environment / platform mount at runtime; not baked into artefacts |
| Emergency rotation | Security/Access Owner + Platform Owner; invalidate sessions |
| Audit | Access and rotation events retained per later retention policy |
| Break-glass | Documented dual-control **roles**; no standing shared passwords |
| Location | Prefer `africa-south1` if cloud secret product selected |

**External later:** product confirmation, IAM bindings, actual secret create (class 3+5).

**Status:** Architecture **DECIDED** as design. Product **OPEN**. **IMPLEMENTED:** no.

---

## 6. P09 — Application DR design (design closed)

Selected architecture (H-169; H-182 package): primary `africa-south1`; secondary `europe-west1`; Plus; Advanced DR; designated replica; active-passive app; RTO ≤4h / RPO ≤1h as **requirements**.

**POA: application-side DR design is CLOSED at design level.**

| Event | Application responsibility |
| --- | --- |
| Primary-region failure | Treat as EOS incident; DB failover ≠ app restored |
| Database failover | Reconnect via write endpoint **when conditions met**; do not assume in-memory sessions survive |
| Endpoint transition | Cut application URL / Cloud Run traffic to passive region per runbook; DNS name still `[PRODUCTION DNS NAME TO BE DETERMINED]` |
| Secrets/config | Must be available in DR path **without** copying secrets into git |
| Service validation | Auth + smoke of authorized commercial slice (H-182 procedure §6) |
| Business validation | Owner/Business Owner acceptance in test grant |
| Switchback | Prefer documented switchover when both healthy; separate from disaster failover |

Left **OPEN:** implementation; provider confirmation; actual failover; measured RTO/RPO (classes 3, 5, 6).

**Status:** Design **DECIDED**. **IMPLEMENTED:** no. **VALIDATED:** no.

---

## 7. P10 — Write endpoint / DNS

No Production hostname is selected in governance (`[PRODUCTION DNS NAME TO BE DETERMINED]`). **Not invented.**

**Framework (class 2) — `DESIGN READY — IMPLEMENTATION OPEN`:**

| Topic | Direction |
| --- | --- |
| Canonical app endpoint | Single Production HTTPS origin **when named** |
| Hostname | Owner-selected later; not invented here |
| TLS | Valid public cert on that origin (blocker 10) |
| DNS ownership | DNS owner role (HUM-08); records only after grant |
| Failover | Active-passive: change app routing / DNS per runbook; TTL policy later |
| API vs DB | App URL ≠ Cloud SQL write endpoint |
| DB connectivity | Private IP; write endpoint if Plus + private IP; PSA vs PSC **unselected** |
| CORS | Allow-list of named HTTPS origins only; no wildcard; Dev loopback stays |
| DR transition | Secondary Cloud Run + DB writer in `europe-west1` during event |
| Rollback | Revert routing; abort per H-182 package |

No DNS, certificates, CORS Production config, or load balancers created.

**Status:** Framework **DECIDED**. Hostname **OPEN**. **IMPLEMENTED:** no.

---

## 8. P12 — Cost / procurement

**`COMMERCIAL MODEL PREPARED / ACTUAL PRICING EVIDENCE PENDING`**

Cost **structure** (categories only — **no amounts, discounts, CUD, or FX**):

1. Cloud Run (primary + passive DR **direction**)
2. Cloud SQL Enterprise Plus primary
3. HA (regional)
4. Designated DR replica (standalone billing category)
5. Cross-region replication / data transfer
6. Backup / PITR / storage
7. Logging / monitoring
8. Network / private connectivity
9. KMS/secrets **if** later selected (P06 default avoids CMEK cost unless reopened)
10. Support arrangement (policy later; not 24/7 NOC)

H-181 D13 remains informational. **No purchase, quote acceptance, or commitment.**

**Status:** Model **DECIDED**. Prices **OPEN** (class 3). **IMPLEMENTED:** no purchase.

---

## 9. HUM-08 — Operational ownership (role-based)

**ROLE DEFINED** vs **INDIVIDUAL APPOINTED**. Names are **not** invented. Existing H-125 evidence is **preserved**.

| Role | Responsibility | Authority | Availability expectation | Escalation | Evidence | Deputy | Named before Production impl? | During preparation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Business Owner | Commercial/business acceptance | Accept/reject go-live business criteria | Business hours unless incident | To Executive | Acceptance records | Required before go-live | **Yes** | Role-based OK |
| Product/System Owner | EOS scope and system decisions | Product direction | Business hours | To Business Owner | Decision records | Required before go-live | **Yes** | Role-based OK |
| Technical/Platform Owner | Infra/platform ops | Platform changes after grant | Incident-responsive; **no 24/7 NOC claimed** | To Product Owner / PDM escalation | Config evidence | Required before go-live | **Yes** | Role-based OK |
| Database Owner | DB, backup, restore, DB DR | DB procedures after grant | Incident-responsive | To Platform Owner | Backup/restore/DR DB evidence | **Yes** | **Yes** | Role-based OK |
| Security/Access Owner | IAM, MFA, secrets, reviews | Access control | Incident-responsive | To Platform Owner | Access-review evidence | **Yes** | **Yes** | Role-based OK |
| Operations/On-call Owner | Incident response | Incident command | Escalation path exists; **not** a staffed NOC | To PDM (OA-02) until delegated | Incident logs | **Yes** before go-live | **Yes** | Role-based OK |
| DR Coordinator | DR invoke, test, evidence, switchback | DR test only with P19 | On P19 window | To Platform + Business | DR evidence pack | **Yes** | **Yes** for test/go-live | Role-based OK |
| Vendor/GCP Relationship Owner | Provider comms / commercial coord | H-181 send execution (mailbox confirm) | Business hours | To Product Owner | Send/receipt logs | Recommended | **Yes** for send execution | Role-based OK |
| Legal/Privacy Review Owner | Review DPA/residency material | **Review ≠ accept** | As needed | To Owner | Review notes | Recommended | **Yes** before P11 close | Role-based OK |

### Individuals already evidenced (not invented)

| Role | Individual | Source | Appointment quality |
| --- | --- | --- | --- |
| Executive / System Owner; Commercial/Product; Application (with engineering execution); Infrastructure until delegated; User support; Incident escalation; Vendor/hosting relationship | **PDM** | H-125 OA-01 / OA-02 | **INDIVIDUAL APPOINTED** for those H-125 roles — **not** a 24/7 NOC |
| Data Protection / DPO | **Wensley Shirima** | H-125 OA-03 | Internal appointment; **appointment evidence REQUIRED**; **not** GCP admin (H-159) |
| Legal Counsel (E1-C01 process) | **Thomas Nguluma** | E1-C01 | Preserved for that process; **not** auto-used as H-181 D12 outbound recipient |

### Still **INDIVIDUAL APPOINTED = OPEN**

Database Owner; Security/Access Owner (GCP/IAM — not DPO); DR Coordinator; dedicated 24/7 operator; deputies.

**Status:** Roles **DECIDED**. Specialist individuals **OPEN** (class 4). 24/7 NOC **not** claimed.

---

## 10. P03 — PostgreSQL version

**Do not select Production version.**

**Internal compatibility constraint:** ADR-0003 PostgreSQL **16** is the OLTP SoR for **Development**. Lab 16.15 is **not** a Production patch lock. Cloud SQL Plus docs listing PG 12–18 are class-1, not EOS tests.

**Prepare (class 2):**

- Checklist: migrate 001–125 apply; extensions/collations used by EOS; Plus support matrix; Advanced DR prerequisites vs version.
- Acceptance: dated EOS test against **named candidate** versions (EV-T01).
- Rollback: do not create Production instance until candidate chosen; Dev/Test remains 16-class.

**Status:** Constraint **DECIDED** (Dev 16-class). Production version **OPEN** (class 3+5).

---

## 11. P04 — Sizing

**`SIZING FRAMEWORK PREPARED / FINAL PRODUCTION SIZING PENDING EVIDENCE`**

N2 is **series** pairing only (H-169). **No invented vCPU/RAM/disk/IOPS/connections/RPS.**

| Input | Label |
| --- | --- |
| Concurrent users / connections | **Unknown** until measured or Owner-labelled estimate |
| DB size / growth | **Unknown** |
| Peak periods | **Unknown** |
| Cloud Run concurrency / autoscale | **Unknown** |
| Headroom | Planning assumption: size after evidence; do not treat as measured |
| RTO/RPO | **Requirements**, not capacity proof |

Finalize later: Cloud SQL tier, CPU, memory, storage, growth, IOPS if applicable, connections, Cloud Run size, concurrency, autoscaling, headroom.

**Status:** Framework **DECIDED**. Values **OPEN** (class 3).

---

## 12. P05 — Connectivity

**PSA vs PSC: NOT SELECTED** (H-169: distinct paths; write endpoint needs Plus + private IP).

| Topic | Direction |
| --- | --- |
| Cloud Run → Cloud SQL | Private; public IP not the Production target |
| Private connectivity | PSA **or** PSC after EV-T06 |
| TLS | App HTTPS later; DB `require` in production-like |
| Firewall / egress / admin access | Least privilege; break-glass roles |
| DNS | P10 framework |
| DR connectivity | Path to `europe-west1` replica/app — described, not built |

**Status:** Matrix **DECIDED**. Path **OPEN** (class 3+5). **No network created.**

---

## 13. P08 — Identity / MFA

**`ACCESS MODEL PREPARED / ACTUAL IDENTITY IMPLEMENTATION OPEN`**

HUM-05 directory **NOT ESTABLISHED**. ADR-0013 blocked. `local-password-dev` is **not** Production. **No accounts or IdP invented.**

| Access | Design |
| --- | --- |
| Administrator | Named IdP group later; MFA **required** at IdP (blocker 9) |
| Developer | No standing Production write; break-glass separately |
| Operations | Least privilege; incident roles |
| Database | DB Owner + break-glass; no shared superuser in git |
| Break-glass | Dual-control roles; logged |
| MFA | At IdP, not app-only |
| Reviews | Periodic access review by Security/Access Owner |
| On/off-boarding | Tied to directory when it exists |
| Audit | IdP + app auth logs |

**Status:** Model **DECIDED**. IdP/MFA **OPEN** (class 3+4+5).

---

## 14. P11 — Legal / residency

**`LEGAL REVIEW REQUIRED`**  
**`NO LEGAL APPROVAL CLAIMED`**

Architecture (Johannesburg primary, Belgium DR-only, H-168 in principle) is **not** legal approval of Belgium residency.

Review package (inputs, not a conclusion): data categories (H-157 boundary); H-168/H-169 exception text; provider terms/DPA **when received**; transfer; retention/deletion; backup/DR access. H-181 D12 = informational request only.

**Status:** Package **PREPARED**. Acceptance **OPEN**. **IMPLEMENTED:** no DPA. **VALIDATED:** no.

---

## 15. P13 — Operational / commercial requirements

Internally decidable:

| Topic | Direction |
| --- | --- |
| Support | Role-based HUM-08; PDM escalation (OA-02) |
| Vendor contact | H-181 official GCP channel; mailbox confirm at execution |
| Hours | Business hours + incident escalation; **no invented 24/7 SLA**; **no 24/7 NOC** |
| Severity | Sev1 = Production down / data-loss risk; Sev2 = degraded; Sev3 = backlog — **qualitative**, not timed SLAs |
| Response | Escalate to PDM until deputies named; RTO ≤4h is **DR requirement**, not a staffing SLA |
| Commercial ownership | PDM as Commercial/Product Owner (H-125) |
| Procurement chain | Owner/commercial approval **after** quotes (H-181 D13 informational) |

No contract; no provider terms accepted; no invented SLA minutes.

**Status:** Requirements **DECIDED** (qualitative). Named deputies **OPEN**. **IMPLEMENTED:** no.

---

## 16. Owner decision register

| Decision | POA decision | Status | DECIDED / IMPLEMENTED / VALIDATED | What remains |
| --- | --- | --- | --- | --- |
| P01 | Prepare **yes**; implement grant **no** | Grant OPEN | Prepare DECIDED / grant not DECIDED as yes / not IMPL / not VAL | Written grant after H-171 §5 |
| P03 | Dev 16-class constraint; no Production version | OPEN (Prod version) | Constraint DECIDED / not IMPL | EV-T01 pack |
| P04 | Framework only | OPEN (values) | Framework DECIDED / not IMPL | Workload evidence |
| P05 | Private IP direction; PSA/PSC unselected | OPEN (path) | Matrix DECIDED / not IMPL | EV-T06 |
| P06 | **Google-managed default** | Direction DECIDED | DECIDED / not IMPL / not VAL | Reopen if CMEK required |
| P07 | Secret classes + design; product unselected | Design DECIDED | DECIDED design / not IMPL | ADR-0012 product |
| P08 | Access model; no IdP | Model DECIDED | DECIDED model / not IMPL | Directory + ADR-0013 |
| P09 | App DR **design closed** | Design DECIDED | DECIDED design / not IMPL / not VAL | Deploy + test |
| P10 | Endpoint framework; hostname TBD | Design READY | DECIDED framework / not IMPL | Hostname + DNS |
| P11 | Review pack; no approval | OPEN | Pack PREPARED / not DECIDED accept | Legal review |
| P12 | Cost **structure** only | OPEN (prices) | Model DECIDED / not IMPL | Quotes |
| P13 | Qualitative ops; no fake SLA | Partial | Reqs DECIDED / not IMPL | Deputies |
| HUM-08 | Roles defined; PDM/Shirima/Nguluma preserved | Partial | Roles DECIDED / specialists OPEN | Named DBA, security, DR coordinator |

---

## 17. Must remain later gates (not closed)

Production authorization; Production database; migrate; deploy; GCP project; Cloud SQL; DR replica; credentials; DNS changes; TLS issuance; IAM provisioning; legal approval; DPA; provider evidence; pricing evidence; measured RTO/RPO; DR test; operational adoption (H-81).

---

## 18. Implementation packages

H-182 DR implementation package and validation procedure remain authoritative for DR **procedures**. H-183 adds encryption default, secrets design, app-DR design close, DNS framework, cost structure, HUM-08 roles, access model. **H-182 files were not rewritten.** No extra H-number file required.

---

## 19. 28-row blocker reconciliation (H-182 §15 → H-183)

Identity of rows **unchanged**. No artificial count reduction. Designs do **not** close implementation blockers.

| # | H-182 | After H-183 | Why |
| --- | --- | --- | --- |
| 1 | OPEN grant | **OPEN** (prepare authorized; grant **not** given) | §3 |
| 2–3 | Direction selected | **Unchanged** | Not implemented |
| 4 | Legal OPEN | **Unchanged** + review pack prepared | §14 |
| 5–6 | OPEN | **Unchanged** | Class 5 |
| 7 | OPEN | **OPEN** — design prepared; ADR-0012 still blocked | §5; P06 default reduces CMEK urgency |
| 8–9 | OPEN | **OPEN** — access model prepared | §13 |
| 10–13 | OPEN | **OPEN** — P10 framework; hostname TBD | §7 |
| 14 | Direction H-160 | **Unchanged** | Not applied |
| 15 | OPEN | **Unchanged** | Class 6 |
| 16 | OPEN no NOC | **OPEN** — still no NOC; escalation = PDM | §9 |
| 17 | OPEN HUM-08 | **NARROWED** — roles defined; specialists unappointed | §9 |
| 18–21 | OPEN | **Unchanged** (design elsewhere) | Class 5 |
| 22–23 | OPEN | **Unchanged** | No Production host |
| 24 | Arch selected; impl/test OPEN | **NARROWED** — **app DR design closed**; replica/test still OPEN | §6 |
| 25–26 | OPEN / H-81 H | **Unchanged** | Out of scope |
| 27 | UAT evidence only | **Unchanged** | |
| 28 | EI-01 closed | **Unchanged** | H-155 |

---

## 20. Audit and stop

```text
No personal names invented (PDM / Wensley Shirima / Thomas Nguluma preserved from prior records only).
No emails invented.
No prices invented.
No legal approval claimed.
No GCP / DNS / TLS / IAM / secrets created.
No application/schema/migration/infrastructure files changed.
H-181 not sent from this increment.
```

| Check | Result |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty |
| Porcelain | 679 → 680 |
| Files | this file only |
| Commit / push | **NONE** |

```text
PROCESS STOPPED AFTER H-183
NEXT GOVERNED ACTION: Human H-181 execution (mailbox + official GCP
  destination, send or queue) in parallel with Owner Session naming
  Database Owner, Security/Access Owner, and DR Coordinator.
  Independent of evidence wait: none of those names may be invented
  in Cursor. Do not provision GCP.
```
