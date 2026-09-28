# H-125 — Owner Decision and Evidence Pack

> **GOVERNANCE / DOCUMENTATION ONLY**  
> Signatory for internal Owner decisions: **PDM**  
> **NOT Production authorization · NOT provisioning · NOT vendor selection · NOT fabricated external evidence**

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Application / schema / migration / infrastructure / Production changes:** **NONE**.

```text
Production authorization: NOT AUTHORIZED
Production readiness: NOT READY
```

This pack records **Owner-attested internal decisions** that PDM may legitimately make. It does **not** manufacture BRELA extracts, PDPC certificates, identity-provider facts, DPAs, cloud accounts, regions, or regulator filings.

---

## 0. Evidence classes used here

| Class | Meaning |
| --- | --- |
| Owner-attested / internal decision | PDM records company accountability or architectural **direction** |
| Authoritative external evidence | Registry, regulator, vendor, or independently verifiable artefact |
| Unresolved external evidence | Required and **not** present; PDM cannot manufacture it |

An Owner attestation is **not** a government certificate, PDPC record, vendor contract, cloud account, or identity-provider fact.

---

## 1. OA-01 — Operational ownership

**Status:** `RECORDED — OWNER-ATTESTED / INTERNAL DECISION`

PDM records the following accountability model. This is **not** an external appointment and does **not** imply Production infrastructure exists.

| Responsibility | Accountable owner |
| --- | --- |
| Executive / System Owner | PDM |
| Commercial / Product Owner | PDM |
| Application Owner | PDM, with technical execution delegated to engineering |
| Production Infrastructure Owner | PDM until formally delegated |
| Data Protection Owner | Wensley Shirima, **subject to formal appointment evidence** (see OA-03 / OA-06) |
| User Support / Business Operations | PDM |
| Production Incident Escalation | PDM |
| Vendor / Hosting Relationship Owner | PDM |

**Signatory:** PDM  
**Does not close:** named specialist DBA/security/DNS administrators; staffed operations team; Production runtime.

---

## 2. OA-02 — On-call / escalation

**Status:** `RECORDED — OWNER-ATTESTED / INTERNAL DECISION`

- Primary Production escalation: **PDM**
- Production incident accountability: **PDM**
- **No claim** of a staffed 24/7 NOC
- Future delegation may be documented separately

**Signatory:** PDM  
This does **not** establish on-call **readiness** as a Production control (no roster of additional staff; no NOC).

---

## 3. OA-03 — Internal DPO appointment

**Status:** `RECORDED — OWNER-ATTESTED / INTERNAL DECISION`

PDM appoints **Wensley Shirima** as Data Protection Officer for Serengeti Experience DMC, effective immediately, subject to applicable law and regulatory requirements.

**Signatory:** PDM  
**Date:** 2026-09-21

This advances HUM-03 from **designation only** to an **internal company appointment** recorded by the Owner.

| Component | Status |
| --- | --- |
| Internal company appointment | Owner-attested (this section) |
| Regulator-facing PDPC evidence | **NOT YET ESTABLISHED** |
| PDPC acceptance or registration | **Not claimed** |

THOMAS NGULUMA remains **Legal Counsel only**. P1 software role key `dpo` remains configuration, not this appointment.

---

## 4. OA-04 — Legal entity

**Status:** `OPEN — AUTHORITATIVE BRELA EVIDENCE REQUIRED`

PDM **does not** invent the legal entity name or registration number.

The repository still contains only the unverified company-provided string:

`Makundi Serengeti Experience DMC`

Seed `Serengeti Experience DMC Ltd` remains application-derived and is **not** verified.

An official **BRELA certificate/extract** (or equivalent authoritative registry extract) is required to establish legal-entity identity. **OA-04 is not closed.**

---

## 5. OA-05 — PDPC status

**Status:** `OPEN — AUTHORITATIVE PDPC STATUS EVIDENCE REQUIRED`

PDM **does not** assert that SEDMC is registered or exempt.

Required evidence is one of:

- actual SEDMC-specific PDPC registration/status evidence; or
- an authoritative written determination establishing the applicable status.

No exemption is manufactured.

Public PDPC registration **guidance** (process page, previously cited as EA-02) describes registration for persons collecting/processing personal data and documentation requirements for private organizations. That guidance is **not** SEDMC’s registration status. This pack does not overstate a legal conclusion beyond that source.

**OA-05 is not closed.**

---

## 6. OA-06 — E-03 (do not redefine)

Existing E-03 (`adr-0006-e1-c01-e03-dpo-evidence-acquisition.md`) keeps **five** questions separate. H-125 does **not** collapse them.

| E-03 question | After this pack |
| --- | --- |
| 1. Has a DPO actually been appointed? | **Owner-attested yes** — OA-03 internal appointment of Wensley Shirima |
| 2. Is appointment legally triggered? | **Unchanged** — not a completed trigger finding |
| 3. Company decision to appoint? | **Owner-attested yes** — this pack |
| 4. Named individual? | **Wensley Shirima** (internal appointment) |
| 5. Regulator notification where applicable? | **OPEN** — no PDPC/regulator artefact |

**Status:** `MIXED`

- Internal appointment / company-decision component: **recorded** (Owner-attested).
- Regulator-issued or external E-03 component: **OPEN**.

This does **not** silently redefine E-03 as “internal only.” Combined Legal/DPO remains incomplete until external/legal components required by E1-C are satisfied.

---

## 7. OA-07 — Corporate identity

**Status:** `OPEN — CORPORATE IDENTITY FACTS REQUIRED`

Repository search (H-123 and this increment): HUM-05 remains **NOT ESTABLISHED**. ADR-0013/DP-0013 list Entra / Google Workspace / Keycloak as **unelected options**, not company inventory. Dev `local-password-dev` is not a corporate directory.

PDM **does not** invent directory, MFA, tenant, administrator, or SSO facts and **does not** select an IdP.

ADR-0013 remains **OPEN**.

---

## 8. OA-08 — Production infrastructure ownership

**Status:** `RECORDED — OWNER-ATTESTED / INTERNAL DECISION`

PDM is the accountable Production Infrastructure Owner until a specific infrastructure administrator is formally delegated.

**Signatory:** PDM  

This does **not** imply that Production infrastructure exists, is provisioned, or may be accessed.

---

## 9. OA-09 — ADR-0006 hosting / residency

**Status:** `OWNER DIRECTION ESTABLISHED / PROVIDER- AND REGION-SPECIFIC EVIDENCE PENDING`

PDM records architectural **direction** (not a provider selection, not a region selection, not a contract):

- Production EOS should use **managed cloud infrastructure**;
- PostgreSQL is the intended durable Production system of record;
- durable application data must **not** rely on local filesystem persistence;
- Production storage and transport must use appropriate encryption/TLS;
- Production requires controlled network access;
- Production requires managed secrets;
- Production requires backup/recovery controls;
- Production requires documented data-residency / hosting-region evidence.

**Not invented:** provider, region, contract, account, deployment.

```text
ADR-0006 = OPEN
```

ADR-0006 is **not** approved/closed. No claim that Production hosting has been provisioned.

---

## 10. OA-10 — DP-0006

**Status:** `OWNER DIRECTION ESTABLISHED / PROVIDER-SPECIFIC EVIDENCE PENDING`

PDM records that Production data-processing architecture must require:

- approved managed hosting;
- documented hosting / data residency;
- appropriate security controls;
- access control;
- encryption/TLS;
- backup/recovery;
- secrets management;
- appropriate contractual/privacy controls with the **eventual** infrastructure provider.

**No DPA or provider contract is claimed.**

```text
DP-0006 = OPEN
```

DP-0006 is **not** approved/closed. Recommended option in the decision paper remains **not selected**.

ADR-0012 remains **OPEN** (secrets platform unselected).

---

## 11. External evidence matrix

| Evidence | Current status | Evidence class | Can PDM manufacture it? | Required next action |
| --- | --- | --- | --- | --- |
| OA-01 RACI | Recorded in this pack | Owner-attested | YES | Recorded |
| OA-02 escalation / on-call | Recorded (PDM; no 24/7 NOC) | Owner-attested | YES | Recorded |
| OA-03 DPO appointment | Internal appointment recorded | Owner-attested | YES (internal only) | Recorded; PDPC still external |
| OA-04 BRELA extract | Missing | Authoritative external | **NO** | Obtain official extract |
| OA-05 PDPC status | Missing | Authoritative external | **NO** | Obtain authoritative PDPC evidence |
| OA-06 E-03 | Internal appointment recorded; regulator component missing | Mixed | Internal YES; regulator **NO** | Preserve distinction; obtain regulator artefact if applicable |
| OA-07 identity provider | Not established | Technical / external fact | **NO** | Establish actual identity facts |
| OA-08 infrastructure owner | Recorded (PDM until delegated) | Owner-attested | YES | Recorded; no Production infra implied |
| OA-09 hosting / provider / region | Owner direction only | Decision + external evidence | Decision YES; external **NO** | Later provider/region evidence |
| OA-10 hosting / data-processing | Owner direction only | Decision + external evidence | Decision YES; external **NO** | Later provider-specific evidence (incl. DPA if used) |

---

## 12. H-120 / H-123 reconciliation

H-123 gate remains **EXTERNAL EVIDENCE PENDING** for items PDM cannot manufacture. H-125 **advances internal OA items only**.

| H-120 area | After H-125 | Notes |
| --- | --- | --- |
| Production authorization | **NOT AUTHORIZED** | Unchanged |
| Production readiness | **NOT READY** | Unchanged |
| Ops ownership (P0-16) | PARTIALLY SATISFIED | Owner-attested RACI; not Production implementation |
| On-call (P0-17) | PARTIALLY SATISFIED | PDM escalation; no 24/7 NOC |
| E1-C DPO internal appointment | PARTIALLY SATISFIED | OA-03; regulator/PDPC still OPEN |
| E-01 / legal entity | OPEN | BRELA extract required |
| E-02 / PDPC | OPEN | SEDMC-specific status required |
| IdP / MFA | OPEN | HUM-05 facts required; ADR-0013 OPEN |
| Hosting / region | BLOCKED — GOVERNANCE + HUMAN/INFRASTRUCTURE | Direction recorded; provider/region absent |
| Secrets/KMS | BLOCKED — GOVERNANCE | ADR-0012 OPEN |
| Production DB / TLS / HTTPS / DNS / CORS | OPEN | No Production catalog or origin |
| Backup/restore / observability / supervision | OPEN | No Production product |
| Event transport / email | OPEN | Products unselected |
| SoR / H-80 / H-81 | Unchanged | Not adoption |

```text
H-120 P0 CLOSED BY H-125 AS PRODUCTION IMPLEMENTATION: NONE
```

Internal OA-01, OA-02, OA-03 (internal), OA-08 are **recorded**. They do **not** authorize Production.

---

## 13. Remaining blockers before a legitimate reconciliation cycle

Must still be **obtained/attached** (not invented):

1. Authoritative BRELA (or equivalent) legal-entity extract — OA-04  
2. Authoritative SEDMC-specific PDPC status evidence or written determination — OA-05  
3. Regulator-facing E-03 component if applicable — OA-06 external  
4. Actual corporate identity-provider / directory facts — OA-07  
5. Named hosting provider, region, and residency evidence — OA-09/OA-10 external  
6. Secrets/KMS product (ADR-0012), Production catalog, TLS/DNS/CORS, backup product, event/email products — still unselected  

Until those exist, **do not** open another empty H-124-style reconciliation.

---

## 14. Governance state preserved

```text
H-80 ACTIVE
H-81 NOT STARTED
SoR unchanged (Office / Excel / Outlook-Gmail / WhatsApp / phone)
No ingestion
No booking
No KPI history
No revenue/profit history
No FX
Rate Identity live-proposal policy unresolved
ADR-0006 OPEN  (owner direction recorded; provider/region pending)
DP-0006 OPEN   (owner direction recorded; provider-specific evidence pending)
ADR-0012 OPEN
ADR-0013 OPEN
```

Owner decisions here are **not** software operational adoption or SoR cutover.

---

## 15. Signatory block

Internal Owner decisions in §§1–3, §8–10:

**PDM**  
2026-09-21  

External evidence in §§4–5, §7, and OA-06 regulator component: **not signed as established**, because it does not exist in the repository.
