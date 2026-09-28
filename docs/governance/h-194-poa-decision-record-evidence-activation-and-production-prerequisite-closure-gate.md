# H-194 — POA Decision Record, Evidence Activation and Production Prerequisite Closure Gate

> **GOVERNANCE-ONLY.**  
> Records Owner/POA decisions exercised against the H-193 session package, and marks the evidence workstream **AUTHORIZED FOR EXECUTION**.  
> **Does not** send requests. **Does not** grant P01. **Does not** implement Production.  
> H-169 through H-193 were **inspected and not rewritten**.

**Date / time:** 2026-09-23 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of this increment:** 707 (H-193 start 705; H-193 added two files)  
**Application / schema / migration / infrastructure implementation:** **NONE**  
**GCP / Cloud Run / Cloud SQL / replica / object store / NATS / IdP / secrets / DNS / TLS created:** **NONE**  
**H-181 requests sent:** **NONE**  
**Evidence received / accepted:** **NONE**  
**Commit / push / reset / clean / stash / revert:** **NONE**

```text
H-194 STATUS = COMPLETE
P01 = NOT GRANTED
Evidence workstream = AUTHORIZED FOR EXECUTION
Requests sent = NONE
Production NOT READY
Production implementation NOT AUTHORIZED
H-81 = NOT STARTED
```

H-193 remains the **session package**. This file is the **POA decision record**. Preparing cards (H-193) ≠ recording decisions (H-194). H-194 still **does not** send H-181 requests.

---

## 1. Repository baseline

| Item | Observed |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain | **707** |
| Dirty worktree | **preserved** |
| H-193 start porcelain | 705 |

---

## 2. Governing-chain reconciliation (not rewritten)

H-169 architecture **SELECTED**; H-170 Gates B–I **OPEN**; H-171 §5 **unsatisfied**; H-173 session package **prepared**; H-174 D01 deferral / D02 architecture / D03 evidence-package preparation; H-175 requirements **prepared**; H-177 drafts **unsent**; H-181 outbound **authorized**, sent **NONE**; H-183 Google-managed encryption **direction**, HUM-08 roles, specialists **unappointed**; H-187–H-191 fail-closed application contracts; H-192 register; H-193 cards **PREPARED / NOT HELD** until this record.

This increment **records** the POA exercise of H-193. It does not rewrite those artefacts.

---

## 3. POA decision register (authoritative)

| ID | Decision | Disposition | Notes |
| --- | --- | --- | --- |
| D194-01 | P01 Production implementation grant | **NOT GRANTED** / **NOT AUTHORIZED** | H-171 §5 unsatisfied. H-194 is not a grant. |
| D194-02 | Production architecture (H-169) | **ACCEPTED** as architecture | Implementation **NOT AUTHORIZED**. See §4. |
| D194-03 | Identity | **CONDITIONAL DIRECTION** | Federated + mandatory MFA; local-password **REJECTED**; Google Identity Platform = **CANDIDATE**, not final. |
| D194-04 | Secrets | **CONDITIONAL DIRECTION** | Managed secret platform **required**; raw env values Dev/Test only. Product **OPEN**. |
| D194-05 | Encryption | **CONDITIONAL DIRECTION** | Google-managed **default** (H-183 P06). CMEK reopen only if required. |
| D194-06 | DocumentStorage | **CONDITIONAL DIRECTION** | Durable managed object storage **required**; local-fs **REJECTED**. Product/bucket **OPEN**. |
| D194-07 | Events | **CONDITIONAL DIRECTION** | Managed/professionally operated NATS JetStream **or equivalent NATS service**. Vendor **OPEN**. |
| D194-08 | Email | **ACCEPTED** adapter direction | **SMTP**. Provider **NOT YET SELECTED**. |
| D194-09 | PostgreSQL product | **ACCEPTED** as architecture | Cloud SQL for PostgreSQL (H-169). Version rule in §9; **no version hard-coded**. |
| D194-10 | PSA vs PSC | **DEFERRED — TECHNICAL EVIDENCE REQUIRED** | Not implemented. |
| D194-11 | Production sizing | **DEFERRED — EVIDENCE REQUIRED** | No CPU/memory/instances invented. |
| D194-12 | Public hostname | **CONDITIONAL DIRECTION** | Dedicated SEDMC-controlled HTTPS hostname **required**. Actual FQDN **OPEN**. |
| D194-13 | Database Owner | **REQUIRED BEFORE PRODUCTION — NOT YET APPOINTED** | Names not invented. |
| D194-14 | Security/Access Owner | **REQUIRED BEFORE PRODUCTION — NOT YET APPOINTED** | ≠ DPO. |
| D194-15 | DR Coordinator | **REQUIRED BEFORE DR VALIDATION — NOT YET APPOINTED** | |
| D194-16 | Deputies | **REQUIRED — NOT YET APPOINTED** | |
| D194-17 | Dedicated NOC | **NO DEDICATED NOC AT INITIAL LAUNCH** | 24/7 incident escalation/on-call **required before Production acceptance if EOS is business-critical**. |
| D194-18 | Belgium DR legal | **DEFERRED — LEGAL REVIEW** | Architecture accepted **in principle**. No Production data to Belgium under H-194. |
| D194-19 | Procurement | **NOT AUTHORIZED** | No purchase; no invented prices. Quotes only via authorized evidence/procurement process. |

---

## 4. D194-01 — Production implementation grant

```text
NOT GRANTED
```

H-171 §5 remains unsatisfied. H-194 does **not** authorize Production provisioning, deployment, migration, or DR implementation.

`authorization to prepare` and `evidence workstream AUTHORIZED FOR EXECUTION` ≠ `authorization to implement`.

---

## 5. D194-02 — Production architecture

Reaffirmed exactly:

```text
Primary:     africa-south1 Johannesburg
Secondary:   europe-west1 Belgium
Database:    Cloud SQL Enterprise Plus
DR:          Cloud SQL Advanced DR with designated DR replica
Acceptance:  RTO ≤ 4 hours
             RPO ≤ 1 hour
```

```text
ARCHITECTURE SELECTED         = YES
IMPLEMENTATION NOT AUTHORIZED = YES
IMPLEMENTED                   = NO
DR REPLICA EXISTS             = NO
DR TEST PERFORMED             = NO
MEASURED RTO/RPO              = NOT AVAILABLE
```

N2 remains **series pairing**, not a size. Cloud SQL failover ≠ EOS failover. Architecture is **not** reopened.

---

## 6. Identity (H-193 D193-04 / D193-05 / D193-06)

```text
Production identity direction = FEDERATED IDENTITY + MANDATORY MFA
LOCAL-PASSWORD PRODUCTION IDENTITY = REJECTED
Google Identity Platform = CANDIDATE PRODUCT, NOT YET FINAL PRODUCT SELECTION
```

Not configured. No tenant/project created. Issuer/JWKS/audience **not invented**. Final product selection remains subject to technical, legal/privacy, and commercial evidence. ADR-0013 remains **proposed — blocked for Production** until that evidence is accepted.

Application contract unchanged: `local-password-dev` fatal in Production-like environments.

---

## 7. Secrets (H-193 D193-07 / D193-08)

```text
Production secrets = MANAGED SECRET PLATFORM REQUIRED
RAW ENVIRONMENT SECRET VALUES = DEV/TEST ONLY
```

No Production secrets provider selected or configured. No secrets created. ADR-0012 remains **proposed — blocked for UAT and Production** until product evidence is accepted. Runtime today remains `env-dev` (Dev/Test).

---

## 8. Encryption (H-193 D193-10)

Reaffirm H-183 P06:

```text
GOOGLE-MANAGED ENCRYPTION = DEFAULT DIRECTION
CMEK = CONDITIONAL / REOPEN ONLY IF LEGAL, SECURITY, CUSTOMER OR CONTRACTUAL REQUIREMENT DEMANDS IT
```

No keys created.

---

## 9. Object storage (H-193 D193-11 / D193-12)

```text
Production DocumentStorage = DURABLE MANAGED OBJECT STORAGE REQUIRED
LOCAL FILESYSTEM = REJECTED FOR PRODUCTION
```

Product, bucket/container, location, and credentials remain **OPEN** pending evidence. **Do not** infer GCS solely because hosting direction is GCP. Application contract unchanged: local-fs fatal Production-like.

---

## 10. Event transport (H-193 D193-13 / D193-14)

```text
Production events = MANAGED/PROFESSIONALLY OPERATED NATS JETSTREAM OR EQUIVALENT NATS SERVICE
```

Required properties: TLS; authentication; durable JetStream; operational ownership; monitoring.

Vendor **not selected**. Endpoints **not created**. Application contract unchanged: Production/UAT require live NATS TLS+userinfo; in-memory/stub refused.

---

## 11. Email (H-193 D193-15 / D193-16)

```text
EMAIL INTEGRATION DIRECTION = SMTP
EMAIL PROVIDER = NOT YET SELECTED
```

**Rationale recorded by POA:** provider portability; avoids unnecessary vendor API coupling; compatible with the H-189/H-190 provider-neutral contract (`ses` remains a **supported** adapter, not selected).

Still required: provider evidence; TLS; sender identity; credentials; deliverability; DPA/terms where applicable.

SMTP **not configured**. No From address invented.

---

## 12. PostgreSQL (H-193 D193-17 / D194-09)

```text
DATABASE ARCHITECTURE = CLOUD SQL FOR POSTGRESQL
```

Version rule:

```text
USE THE NEWEST APPLICATION-COMPATIBLE PROVIDER-SUPPORTED VERSION AVAILABLE AT PRODUCTION IMPLEMENTATION TIME, SUBJECT TO MIGRATION COMPATIBILITY VALIDATION
```

No version hard-coded in application code. Migrations **not changed**. Dev/Test PostgreSQL 16 is **not** the Production selection.

---

## 13. Connectivity (H-193 D193-19)

```text
PSA VS PSC = DEFERRED — TECHNICAL EVIDENCE REQUIRED
```

Required evidence: actual network architecture; security requirements; provider-supported connectivity; operational implications (including DR path). Neither path implemented.

---

## 14. Production sizing (H-193 D193-18)

```text
PRODUCTION SIZING = EVIDENCE-BASED DECISION REQUIRED
```

**Not invented:** CPU, memory, machine class, min/max instances, concurrency, storage size, IOPS.

Sizing must be determined from defensible workload assumptions and provider evidence **before implementation**. N2 series pairing (H-169) is unchanged and is **not** a size.

---

## 15. Public endpoint (H-193 D193-21 / D193-22)

```text
DEDICATED SEDMC-CONTROLLED HTTPS PRODUCTION HOSTNAME = REQUIRED
ACTUAL HOSTNAME = OPEN
DNS = NOT CONFIGURED
TLS = NOT CONFIGURED
```

No hostname invented. `EOS_PUBLIC_ORIGIN` contract remains: https, non-loopback, non-wildcard **once a value is supplied**.

---

## 16. Operations

```text
Database Owner:        REQUIRED BEFORE PRODUCTION — NOT YET APPOINTED
Security/Access Owner: REQUIRED BEFORE PRODUCTION — NOT YET APPOINTED
DR Coordinator:        REQUIRED BEFORE DR VALIDATION — NOT YET APPOINTED
Deputies:              REQUIRED — NOT YET APPOINTED
Dedicated NOC:         NO DEDICATED NOC AT INITIAL LAUNCH
```

```text
24/7 INCIDENT ESCALATION / ON-CALL COVERAGE REQUIRED BEFORE PRODUCTION ACCEPTANCE IF EOS IS BUSINESS-CRITICAL
```

Names **not invented**. Existing evidenced individuals unchanged: **PDM** (H-125 OA-01/OA-02); **Wensley Shirima** (DPO; appointment evidence still required; not GCP admin); **Thomas Nguluma** (E1-C01 counsel; not auto H-181 D12 recipient). Escalation remains to PDM until deputies exist (H-183).

---

## 17. Belgium DR legal (H-193 D193-27)

```text
CROSS-REGION DR ARCHITECTURE = ACCEPTED IN PRINCIPLE
BELGIUM RESIDENCY / DPA / LEGAL TREATMENT = DEFERRED — LEGAL REVIEW
```

No Production data may be moved to Belgium under H-194. H-168 in-principle exception is **not** legal acceptance.

---

## 18. Procurement (H-193 D193-28)

```text
NO PROCUREMENT COMMITMENT AUTHORIZED BY H-194
```

Quotes may be obtained **only** through the authorized evidence/procurement process (H-181 D13 informational scope). **No prices invented.** No purchase.

---

## 19. Evidence collection activation

```text
H-181 OUTBOUND AUTHORIZATION = EXISTS
REQUESTS SENT                = NONE
EVIDENCE RECEIVED            = NONE
EVIDENCE ACCEPTED            = NONE
Evidence workstream          = AUTHORIZED FOR EXECUTION
H-194 itself sent            = NOTHING
```

H-177 drafts and H-181 role-based recipients/channels are **not rewritten**.

```text
SENDER MAILBOX = REQUIRES EXECUTION-TIME CONFIRMATION
```

H-181 O181-03 / §5: actual corporate outbound mailbox is **TO BE CONFIRMED AT EXECUTION**. RFP/E1-B mailboxes are **not** substituted. If mailbox or official GCP destination cannot be confirmed without fabrication, **queue** — do not send (H-181 O181-06). Recipients remain role-based: R181-GCP, R181-LEGAL, R181-COMMERCIAL. No external individual contacts invented.

---

## 20. Evidence workstream execution matrix

Every row: **NOT REQUESTED / NOT COLLECTED / NOT ACCEPTED** as of this increment. Mapping is to H-177 dispositions where they exist; wording of H-177 is not rewritten.

### 20.1 GCP / provider

| EV | Subject | Serves decisions | H-177 / H-181 path | Status |
| --- | --- | --- | --- | --- |
| EV-G01 | Project / billing / account ownership | D194-01, D194-02 | H177-D02 outbound when mailbox confirmed | NOT SENT |
| EV-G02 | Cloud Run capability in `africa-south1` | D194-02 | H177-D09 optional / D10 | NOT SENT |
| EV-G03 | Cloud SQL / Enterprise Plus / Advanced DR confirmation | D194-02, D194-09 | H177-D10 | NOT SENT |
| EV-G04 | PostgreSQL versions supported vs EOS migrate 001–125 | D194-09 version rule | H177-D03 | NOT SENT |
| EV-G05 | Region support `africa-south1` / `europe-west1` | D194-02, D194-18 | H177-D10 | NOT SENT |
| EV-G06 | Backup / PITR / HA characteristics | D194-02; H-160–H-163 directions | H177-D10 | NOT SENT |
| EV-G07 | Networking; PSA vs PSC implications | D194-10 | H177-D05 | NOT SENT |
| EV-G08 | Object storage capability (API, residency, IAM) | D194-06 | (information; product still OPEN) | NOT SENT |
| EV-G09 | Secrets platform capability (candidate evaluation) | D194-04 | H177-D07 | NOT SENT |
| EV-G10 | Identity/MFA; Google Identity Platform **candidate** facts | D194-03 | H177-D08 internal + provider info as applicable | NOT SENT |
| EV-G11 | NATS/JetStream or equivalent managed NATS | D194-07 | (no silent vendor) | NOT SENT |
| EV-G12 | SMTP provider capability (TLS, From, deliverability) | D194-08 | after vendor shortlist | NOT SENT |
| EV-G13 | Observability / Cloud Logging `africa-south1` | H-161; H-192 I1 | H177-D10 class | NOT SENT |

### 20.2 Legal

| EV | Subject | Serves | Status |
| --- | --- | --- | --- |
| EV-L01 | Belgium DR residency treatment | D194-18 | NOT SENT (H177-D12 informational) |
| EV-L02 | DPA / provider terms | D194-18, vendors | NOT SENT |
| EV-L03 | Processor / subprocessor implications | IdP, email, object store, NATS, GCP | NOT SENT |

### 20.3 Commercial

| EV | Subject | Serves | Status |
| --- | --- | --- | --- |
| EV-C01 | Quotations / pricing inputs | D194-11, D194-19 | NOT SENT (H177-D13 informational) |
| EV-C02 | Procurement terms | D194-19 | NOT SENT |
| EV-C03 | Recurring operating costs (categories only until quotes) | D194-19 | NOT SENT |

### 20.4 Operational

| EV | Subject | Serves | Status |
| --- | --- | --- | --- |
| EV-O01 | Service ownership appointments | D194-13–D194-16 | INTERNAL; **UNAPPOINTED** |
| EV-O02 | Escalation / on-call (no dedicated NOC) | D194-17 | INTERNAL |
| EV-O03 | Support arrangement | D194-19 / HUM-08 | NOT SENT |
| EV-O04 | Backup/restore responsibilities | D194-13 | INTERNAL until appointed |
| EV-O05 | DR responsibilities | D194-15 | INTERNAL until appointed |

---

## 21. Evidence acceptance rules

Evidence may be marked **ACCEPTED** only if **all** of the following hold:

1. **Identifiable** (dated artefact with a clear identifier).
2. **Attributable** to the relevant provider, legal, or commercial authority.
3. **Relevant** to the decision it is offered to support.
4. **Sufficiently specific** (not a generic slogan).
5. **Retained** in an auditable repository location.
6. **Reviewed** against the applicable H-175 / H-192 acceptance criteria.
7. **Explicitly accepted** under the applicable later governance gate.

A provider marketing statement is **not** automatically implementation evidence. Provider documentation is **not** measured EOS RTO/RPO. H-181 authorization is **not** evidence received.

---

## 22. H-171 revisit conditions

H-171 may be revisited **only after**:

* required provider evidence obtained and accepted;
* required technical evidence (PG compatibility, connectivity, sizing inputs);
* legal review of Belgium/DPA/terms;
* commercial/procurement review (quotes — not invented);
* required operational appointments (Database Owner, Security/Access Owner; DR Coordinator before P19);
* implementation package completeness (H-184/H-191 contracts plus selected values);
* **explicit** Production implementation grant (D194-01 still **NOT GRANTED**).

H-171 is **not** marked satisfied.

---

## 23. Production readiness consequence

Even after H-194:

```text
Production NOT READY
Production implementation NOT AUTHORIZED
H-81 = NOT STARTED
```

Purpose: close **internal POA directions** and **activate** controlled evidence execution. Not Production readiness.

---

## 24. Future gates (none completed by H-194)

| Gate | Status after H-194 |
| --- | --- |
| A External evidence collection | **Authorized for execution**; sent **NONE** |
| B Owner/POA decision closure | **Partial:** directions in §3 recorded; products/values still OPEN/deferred |
| C H-171 revisit | **NOT GRANTED** |
| D–H Implementation → readiness | **BLOCKED** |

---

## 25. Contradiction scan

| Check | Result |
| --- | --- |
| SMTP direction vs remaining `ses` adapter in code | **Consistent:** SMTP is **selected integration direction**; `ses` remains a supported unused adapter. Provider still unselected. |
| Google Identity Platform candidate vs ADR-0013 OPEN | **Consistent:** candidate ≠ final selection; no tenant created. |
| Managed secrets required vs `env-dev` runtime | **Consistent:** runtime remains Dev/Test until product selected after evidence. |
| Cloud Run/SQL architecture vs no instances | **Consistent** (D194-02). |
| H-181 authorized vs sent NONE | **Consistent**; workstream now **AUTHORIZED FOR EXECUTION** without send. |
| Application fail-closed contracts H-187–H-191 | **Unchanged** (no code in this increment). |

No implementation performed.

---

## 26. Final status

```text
H-194 STATUS = COMPLETE
P01 = NOT GRANTED
Production NOT READY
Production implementation NOT AUTHORIZED
H-81 = NOT STARTED
Evidence workstream = AUTHORIZED FOR EXECUTION
Requests sent = NONE
```
