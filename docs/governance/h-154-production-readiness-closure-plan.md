# H-154 — Production Readiness Closure Plan and Gate Ownership Assessment

> **GOVERNANCE / PLANNING ONLY**  
> Converts the remaining Production blockers identified in H-153 into a controlled closure plan with ownership, dependencies, evidence requirements, sequencing, and authorization boundaries.  
> **Does not** close any blocker merely because this plan exists.  
> **Does not** authorize Production, provision infrastructure, select or contract a provider, create credentials/secrets/KMS, configure DNS/TLS/IdP/MFA, create a Production database, run a Production migration, modify application behaviour or schema, create migration 126, repair hydration, start H-81 / C11+ / F2-I12 / Path D, change the commercial SoR, or claim PDPC exemption or Production readiness.  
> Prior records H-120 through H-153, ADR-0006, and DP-0006 were **inspected and not modified**.

**Date / time:** 2026-09-22 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Worktree:** dirty (preserved — no reset, clean, stash, revert, discard, or overwrite)  
**Porcelain at start of this increment:** 648  
**Porcelain after this increment:** 649 (this file only)  
**Application / schema / migration / infrastructure / Production changes:** **NONE**  
**Commit / push:** **NONE**  
**H-155:** **NOT CREATED**

```text
H-154 STATUS = COMPLETE — CLOSURE PLAN RECORDED
FINAL DISPOSITION = PLANNING COMPLETE WITH OPEN BLOCKERS
CURRENT-CODE UAT = ACCEPTED WITH DOCUMENTED LIMITATIONS
PRODUCTION = NOT AUTHORIZED / NOT READY
productionReady = false
PDPC OPEN
EI-01 OPEN / REQUIRES OWNER EVIDENCE REVIEW
ADR-0006 OPEN
DP-0006 OPEN
Commercial SoR = Office / Excel / Outlook-Gmail / WhatsApp / phone
H-81 = NOT STARTED
C11+ = NOT AUTHORIZED
F2-I12 = NOT AUTHORIZED
Path D = NOT AUTHORIZED
Migration 126 = NOT CREATED
Production migration = NOT AUTHORIZED
Current migration worktree = 125
```

A plan is **not** closure. Named inventory remains **28** rows. Item 27 remains **SATISFIED AS UAT EVIDENCE ONLY**. Items 1–26 and 28 remain **OPEN**.

---

## A. Authority and sources

The Owner/POA authorized this assessment. Scope is inspection, reconciliation, classification, dependency mapping, and sequencing. No Production act is performed.

### A.1 Records read (authoritative filenames)

Grant aliases mapped to actual repository files. No record was invented.

| Grant / topic | Actual file |
| --- | --- |
| H-120 Production remediation plan | `docs/governance/h-120-production-readiness-remediation-and-infrastructure-plan.md` |
| H-121 Owner session / external evidence pack | `docs/governance/h-121-hum-08-owner-session-and-external-evidence-pack.md` |
| H-122 Owner evidence intake pack | `docs/governance/h-122-owner-evidence-intake.md` |
| H-123 External evidence pending gate | `docs/governance/h-123-external-evidence-pending-gate.md` |
| H-125 Owner-attested internal decisions | `docs/governance/h-125-owner-decision-and-evidence-pack.md` |
| H-126 Owner-confirmed legal identity / PDPC | `docs/governance/h-126-owner-confirmed-status-and-pdpc-identity-readiness.md` |
| H-128 Owner-supplied BRELA / TIN | `docs/governance/h-128-brela-tin-evidence-reconciliation.md` |
| H-129 PDPC registration readiness pack | `docs/governance/h-129-pdpc-registration-readiness-pack.md` |
| H-130 External evidence intake register | `docs/governance/h-130-external-evidence-intake-register.md` |
| H-131 TIN certificate intake | `docs/governance/h-131-tin-certificate-evidence-reconciliation.md` |
| H-132 TIN identity reconciliation | `docs/governance/h-132-tin-identity-reconciliation-and-evidence-gate.md` |
| H-147 EOS readiness gap reconciliation | `docs/governance/h-147-eos-readiness-gap-reconciliation.md` |
| H-153 Current-code UAT acceptance and Production-readiness gate | `docs/governance/h-153-current-code-uat-acceptance-and-production-readiness-gate.md` |
| ADR-0006 | `docs/adr/ADR-0006-hosting-and-residency.md` |
| DP-0006 | `docs/decisions/DP-0006-hosting-data-residency.md` |
| ADR-0012 (secrets; OPEN) | `docs/adr/ADR-0012-secrets-platform.md` |
| ADR-0013 (IdP; OPEN) | `docs/adr/ADR-0013-corporate-idp.md` |
| E1-C SEDMC-owned infrastructure direction | `docs/governance/adr-0006-e1-c-sedmc-owned-infrastructure-direction.md` |

H-131 / H-132 **personal-data** companions exist under different filenames and were **not** treated as the TIN evidence records.

### A.2 Baseline carried forward (not reopened)

| Item | Authoritative state |
| --- | --- |
| Branch / HEAD | `master` / `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Current-code UAT | **ACCEPTED WITH DOCUMENTED LIMITATIONS** (H-153). H-149 and H-152 are **not** reopened. No new UAT campaign is run here. |
| Production | **NOT AUTHORIZED / NOT READY** |
| `productionReady` | `false` |
| Commercial SoR | Office / Excel / Outlook-Gmail / WhatsApp / phone |
| H-80 / H-81 | H-80 **ACTIVE**; H-81 **NOT STARTED** |
| C11+ / F2-I12 / Path D | **NOT AUTHORIZED** |
| Migration 126 | **NOT created** |
| Production migration | **NOT authorized** |
| Current migration worktree | **125** |
| PDPC | **OPEN** |
| EI-01 | **OPEN / REQUIRES OWNER EVIDENCE REVIEW** |
| ADR-0006 | **OPEN** (`proposed — blocked for Production`) |
| DP-0006 | **OPEN** (recommended option *Not selected*) |

Catalogs that **are not Production:** `127.0.0.1:5432/eos`, `:5435/eos_h112_full`, `:5436/eos_h117_uat`, `:5434/eos_gateb`, `:5439/eos_h149_uat`, `:5440/eos_h152_uat`.

Recorded humans only (do not expand): PDM (Patrick Daniel Makundi); Wensley Shirima (internal DPO designation / Owner-attested internal appointment; combined E1 **NOT ESTABLISHED**); THOMAS NGULUMA / A.T.N (Legal Counsel only, not DPO).

---

## B. What H-154 is and is not

H-154 is a **closure plan and dependency map**.

It is **not**:

- Production deployment or Production infrastructure setup
- procurement or vendor contracting
- legal registration or PDPC registration
- migration, schema change, or application remediation
- SoR cutover, H-81, C11+, F2-I12, or Path D
- repair of H152-F-01 / H152-F-02
- creation of H-155

No blocker is closed by the existence of this file.

---

## C. Current-code UAT status

```text
CURRENT-CODE UAT = ACCEPTED WITH DOCUMENTED LIMITATIONS
```

H-153 is the accepted UAT evidence gate. H-149 and H-152 are **not** reopened. This increment does **not** run another UAT campaign and does **not** repeat the commercial regression.

Item 27 of the named 28-blocker inventory is **SATISFIED AS UAT EVIDENCE ONLY**. That satisfaction is **not** Production validation, **not** a Production catalog, **not** a Production host, and **not** a Production grant.

UAT acceptance is **not** authorization to move live commercial work into EOS.

---

## D. 28-blocker reconciliation

Start: H-147 named **28** Production blockers (26 H-120 P0s + current-tree UAT + EI-01). H-153 reconciled **only** item 27.

H-154 does **not** silently change that inventory.

| Named # | Current status (H-153, carried) |
| ---: | --- |
| 1–26 | **OPEN** |
| 27 | **SATISFIED AS UAT EVIDENCE ONLY** |
| 28 | **OPEN / REQUIRES OWNER EVIDENCE REVIEW** |

**OPEN Production blockers after this plan: 27 of the 28 named items** (1–26 and 28). Named inventory remains **28 rows**.

Type vocabulary used below (grant categories A–F mapped to the required Type field):

| Category | Type token |
| --- | --- |
| A. Internal Owner/POA decisions | Owner decision |
| B. External evidence | external evidence |
| C. Vendor/provider selection | vendor/provider |
| D. Engineering implementation | engineering |
| E. Production validation | infrastructure (validation) / operations |
| F. Legal/privacy | legal/privacy |

Where a blocker spans categories, the **primary** type is listed first. Mixed types are stated in the Type cell.

Authorization columns:

- **Can be decided under current POA?** means an Owner/POA decision *of that kind* is within existing POA authority. It does **not** mean the decision is already made, and it does **not** mean Production acts may proceed.
- **Implementation authorization required?** means a future explicit implementation/engineering grant is required before code, schema, or product wiring.
- **Production authorization required?** means a named Production grant is required before Production provisioning, credentials, DNS, TLS, catalog, migrate, or go-live. Evidence intake and internal decisions do **not** themselves require a Production grant.

H-125 OA-09 (managed-cloud **direction**) and E1-C (SEDMC-owned Tanzanian facility as **preferred future primary target**; cloud as **optional future contingency**) are both **direction records**. Neither is a selected architecture. Tanzania preference ≠ selected architecture. Neither closes ADR-0006 / DP-0006.

---

### D.1 Full inventory (required fields)

#### Blocker 1 — Production authorization grant

| Field | Record |
| --- | --- |
| Blocker ID | 1 / H120-P0-01 |
| H-147 description | Production authorization grant (H120-P0-01) |
| Current status | **OPEN** |
| Type | Owner decision / governance |
| Dependency | Stages 1–5 evidence and named architecture option (EI-01, PDPC/legal-privacy as applicable, ADR-0006 / DP-0006 named option). Current-code UAT (item 27) is already accepted as UAT evidence only and is **not** a remaining UAT campaign on this path. |
| Required evidence | Named Owner/POA Production grant document (H-120: “Named Owner/POA Production grant document”). Must not be inferred from UAT acceptance or from this plan. |
| Decision owner | Internal Owner/POA |
| Can be decided under current POA? | **YES** (the grant itself is an Owner/POA act) — **not** granted now |
| Implementation authorization required? | **YES** after the grant, for any Production act |
| Production authorization required? | This blocker **is** the Production authorization |
| Proposed closure sequence | Stage 6 |
| Current action | Do not grant. Keep `productionReady=false`. Wait for prerequisite evidence and named option. |
| Closure test | Written Owner/POA Production grant exists, scoped, and does not rest on UAT-only evidence. |

#### Blocker 2 — Hosting/provider/region

| Field | Record |
| --- | --- |
| Blocker ID | 2 / H120-P0-02 |
| H-147 description | Hosting/provider/region (H120-P0-02 / ADR-0006) |
| Current status | **OPEN** |
| Type | Owner decision + vendor/provider + external evidence |
| Dependency | Stage 1–2 legal/privacy evidence pack; Stage 4 named option (blockers 3–4). Direction records (H-125 OA-09; E1-C SEDMC-owned) are **not** a selection. |
| Required evidence | Approved ADR-0006 + named region/class (H-120). Provider/facility identity only after a named option is approved. No vendor is selected in this plan. |
| Decision owner | Owner + Legal + evidence pack. Vendor after shortlist. |
| Can be decided under current POA? | **NO** for a provider/region selection that lacks residency evidence. **YES** for later internal named-option approval once the evidence pack exists (that is blocker 3/4, not this row’s procurement). |
| Implementation authorization required? | **YES** before provision |
| Production authorization required? | **YES** before Production hosting is provisioned |
| Proposed closure sequence | Stages 4–5 (decision then procurement), then Stage 7 (configuration) |
| Current action | Do not select a provider, region, facility, or cloud. Do not send RFIs. |
| Closure test | Named hosting model + named region/class recorded in approved ADR-0006 / DP-0006, plus provider/facility evidence after selection — not a preference statement. |

#### Blocker 3 — ADR-0006 formal approval

| Field | Record |
| --- | --- |
| Blocker ID | 3 |
| H-147 description | ADR-0006 formal approval |
| Current status | **OPEN** — proposed, blocked for Production |
| Type | Owner decision / governance |
| Dependency | Legal/residency evidence pack (entity identity including EI-01; PDPC/privacy status as applicable). Owner must resolve the **unselected** tension between H-125 OA-09 managed-cloud direction and E1-C SEDMC-owned preferred target. Tanzania preference ≠ approval. |
| Required evidence | Formal human approval of ADR-0006 after evidence; status updated from `proposed — blocked for Production`. |
| Decision owner | Internal Owner/POA (approval). Legal input as already required by DP-0006. |
| Can be decided under current POA? | **YES** for formal approval **after** evidence — **NO** to close it now |
| Implementation authorization required? | **YES** to implement hosting under the ADR |
| Production authorization required? | **YES** to operate Production under it |
| Proposed closure sequence | Stage 4 |
| Current action | Leave OPEN. Do not auto-close. Do not create a fake approval. |
| Closure test | ADR-0006 status is approved/accepted with a named hosting/residency choice, not merely “direction established”. |

#### Blocker 4 — DP-0006 named option approval

| Field | Record |
| --- | --- |
| Blocker ID | 4 |
| H-147 description | DP-0006 named option approval |
| Current status | **OPEN** — not approved |
| Type | Owner decision / governance |
| Dependency | Same evidence pack as blocker 3. Recommended option remains *Not selected*. Must not lock Terraform/K8s. |
| Required evidence | Human approval of a **named** DP-0006 option (A/B/C/D or a later Owner-named option recorded in that paper). |
| Decision owner | Internal Owner/POA |
| Can be decided under current POA? | **YES** after evidence — **NO** now |
| Implementation authorization required? | **YES** to lock IaC/host against the option |
| Production authorization required? | **YES** to run Production on it |
| Proposed closure sequence | Stage 4 (with blocker 3) |
| Current action | Leave OPEN. Do not select an option in this plan. |
| Closure test | DP-0006 records an approved named option; recommended option is no longer *Not selected*. |

#### Blocker 5 — Production database/catalog

| Field | Record |
| --- | --- |
| Blocker ID | 5 / H120-P0-05 |
| H-147 description | Production database/catalog (not eos / h112 / h117 / gateb) |
| Current status | **OPEN** — does not exist |
| Type | infrastructure / vendor/provider |
| Dependency | Blockers 1–4; new host. Must not use `eos`, `eos_h112_full`, `eos_h117_uat`, `eos_h149_uat`, `eos_h152_uat`, or `eos_gateb`. |
| Required evidence | New catalog + credentials **outside** the repository; never the listed Dev/Test/UAT/Gate B names. |
| Decision owner | DBA after architecture + grant. DBA currently **UNASSIGNED** (H-147 §H). |
| Can be decided under current POA? | **NO** (cannot manufacture a Production catalog by decision alone) |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 7 |
| Current action | Do not create a Production database. Do not treat any existing catalog as Production. |
| Closure test | Independently named Production PostgreSQL catalog on the approved host, with credentials not in git, and explicit non-use of Dev/UAT catalogs. |

#### Blocker 6 — Authorized Production schema migrate

| Field | Record |
| --- | --- |
| Blocker ID | 6 / H120-P0-06 |
| H-147 description | Authorized Production schema migrate |
| Current status | **OPEN** — Gate C blocked |
| Type | Owner decision + engineering + infrastructure |
| Dependency | Blocker 5 exists; Gate C Item 5 currently **BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE**; startup migrate refused in production-like env. Current worktree last migration is **125**. Migration **126** must **not** be created by this plan. |
| Required evidence | Separate migrate authorization + executed apply evidence on the Production catalog only. |
| Decision owner | Owner grant **then** DBA |
| Can be decided under current POA? | **YES** for a future migrate grant — **NO** to authorize migrate now |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 10 |
| Current action | Do not migrate. Do not create migration 126. Do not run a live/Production migration. |
| Closure test | Written migrate grant + apply evidence against the Production catalog only; Gate C no longer blocked by unselected architecture. |

#### Blocker 7 — Secrets/KMS

| Field | Record |
| --- | --- |
| Blocker ID | 7 / H120-P0-07 |
| H-147 description | Secrets/KMS (ADR-0012) |
| Current status | **OPEN** |
| Type | Owner decision + vendor/provider + engineering |
| Dependency | ADR-0006 (ADR-0012: evaluate after ADR-0006). ADR-0012 remains **proposed — blocked for UAT and Production**. |
| Required evidence | Named secrets platform; rotation owners; non-placeholder `EOS_TOKEN_SECRET` held outside git. |
| Decision owner | Owner (ADR-0012) then infra |
| Can be decided under current POA? | **YES** to approve ADR-0012 later — **NO** to select a KMS product in this plan |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 5 (product selection) then Stage 8 (configuration) |
| Current action | Do not create Production secrets or KMS. Do not put secrets in git. |
| Closure test | Approved ADR-0012 named platform + rotation owners + Production secrets not in repository. |

#### Blocker 8 — Identity provider

| Field | Record |
| --- | --- |
| Blocker ID | 8 / H120-P0-08 |
| H-147 description | Identity provider (ADR-0013) |
| Current status | **OPEN** |
| Type | Owner decision + vendor/provider + external evidence |
| Dependency | HUM-05 corporate identity **NOT ESTABLISHED** (H-125 OA-07; H-126). ADR-0013 **proposed — blocked for Production**. Entra / Google Workspace / Keycloak remain **unelected options**, not inventory. |
| Required evidence | Named OIDC IdP + EOS principal mapping evidence. Actual corporate directory facts — not invented. |
| Decision owner | Owner (ADR-0013) then identity owner (currently UNASSIGNED in HUM-08) |
| Can be decided under current POA? | **NO** until corporate identity facts exist; Owner cannot invent tenant/MFA/SSO facts |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 5 then Stage 8 |
| Current action | Do not create an IdP. Do not treat `local-password-dev` as Production. |
| Closure test | Approved ADR-0013 named IdP + production-like login refused for local-password + mapped Production principals. |

#### Blocker 9 — MFA at IdP

| Field | Record |
| --- | --- |
| Blocker ID | 9 / H120-P0-09 |
| H-147 description | MFA at IdP |
| Current status | **OPEN** |
| Type | operations / vendor/provider |
| Dependency | Blocker 8 (IdP selected and existing) |
| Required evidence | IdP MFA enabled for Production admin/support (H-120). No application-side MFA is claimed as a substitute. |
| Decision owner | Identity owner after IdP selection |
| Can be decided under current POA? | **NO** (requires an actual IdP) |
| Implementation authorization required? | **YES** (IdP configuration) |
| Production authorization required? | **YES** for Production privileged access |
| Proposed closure sequence | Stage 8 (after IdP) |
| Current action | Do not create MFA. |
| Closure test | Evidence that Production admin/support MFA is enabled at the named IdP. |

#### Blocker 10 — HTTPS

| Field | Record |
| --- | --- |
| Blocker ID | 10 / H120-P0-10 |
| H-147 description | HTTPS |
| Current status | **OPEN** |
| Type | infrastructure / engineering |
| Dependency | Blockers 2 and 11 (host + DNS). Dev CORS is `http` loopback only. |
| Required evidence | Valid TLS for the public origin. |
| Decision owner | DNS/cert owner after host (currently UNASSIGNED) |
| Can be decided under current POA? | **NO** |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 9 |
| Current action | Do not configure Production TLS. |
| Closure test | Live Production origin serves valid HTTPS; not loopback HTTP. |

#### Blocker 11 — DNS

| Field | Record |
| --- | --- |
| Blocker ID | 11 / H120-P0-11 |
| H-147 description | DNS |
| Current status | **OPEN** |
| Type | infrastructure / operations |
| Dependency | Blocker 2 host exists; name policy. No Production origin is invented here. |
| Required evidence | Delegated Production hostname. |
| Decision owner | DNS owner — **no change now** |
| Can be decided under current POA? | **YES** for later name policy — **NO** to invent a hostname now |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 9 |
| Current action | Do not configure DNS. Do not invent a Production origin. |
| Closure test | Delegated Production hostname resolving to the approved host. |

#### Blocker 12 — Database TLS

| Field | Record |
| --- | --- |
| Blocker ID | 12 / H120-P0-12 |
| H-147 description | Database TLS attached to a real Production DB |
| Current status | **OPEN** |
| Type | infrastructure / engineering |
| Dependency | Blocker 5. Fail-closed contract already exists (`EOS_DATABASE_TLS_MODE=require` fatal if missing in production-like). No Production DB to attach. |
| Required evidence | Live Production PostgreSQL with `require` + certs. |
| Decision owner | DBA after catalog exists |
| Can be decided under current POA? | **NO** |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 9 (with catalog in Stage 7) |
| Current action | Do not attach TLS to a non-Production catalog and call it Production. |
| Closure test | Production catalog accepts only TLS `require` (or documented equivalent) with certificates; not Dev `disable`. |

#### Blocker 13 — Production CORS origins

| Field | Record |
| --- | --- |
| Blocker ID | 13 / H120-P0-13 |
| H-147 description | Production CORS origins |
| Current status | **OPEN** |
| Type | engineering |
| Dependency | Blockers 10–11. Current fail-closed loopback CORS is **appropriate**. Public origin **unselected**. |
| Required evidence | Named HTTPS origins allow-list after DNS. |
| Decision owner | App ops after hostname exists |
| Can be decided under current POA? | **NO** (origin does not exist) |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 9 |
| Current action | Do not add invented Production origins. Do not weaken Dev/Test CORS. |
| Closure test | Production CORS allow-list matches the named HTTPS origin(s); wildcard still rejected. |

#### Blocker 14 — Backup product

| Field | Record |
| --- | --- |
| Blocker ID | 14 / H120-P0-14 |
| H-147 description | Backup product |
| Current status | **OPEN** |
| Type | vendor/provider + operations |
| Dependency | Approved host (blockers 2–4). ADR-0011 intent 19:00 EAT + remote copy remains an **intent**, not a selected product. Lab dumps excluded. |
| Required evidence | Named encrypted backup + remote copy evidence. |
| Decision owner | Backup owner after host (currently UNASSIGNED) |
| Can be decided under current POA? | **NO** (would select a product) |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 5 (selection) then Stage 11 (configuration/evidence) |
| Current action | Do not select or configure a backup product. |
| Closure test | Named encrypted Production backup product with remote copy, not a lab dump. |

#### Blocker 15 — Restore evidence of Production state

| Field | Record |
| --- | --- |
| Blocker ID | 15 / H120-P0-15 |
| H-147 description | Restore evidence of Production state |
| Current status | **OPEN** |
| Type | infrastructure (validation) / operations |
| Dependency | Blocker 14 on Production topology. Lab synthetic restore is **not** this evidence. |
| Required evidence | Restore of **Production** state, not lab. |
| Decision owner | Ops after backup product |
| Can be decided under current POA? | **NO** |
| Implementation authorization required? | **YES** (execute restore test) |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 11 |
| Current action | Do not treat Dev/UAT restore drills as Production restore evidence. |
| Closure test | Documented restore of Production (or authorized Production-like) state meeting accepted RTO/RPO once those are measured on the approved topology. |

#### Blocker 16 — Operations ownership / HUM-08

| Field | Record |
| --- | --- |
| Blocker ID | 16 / H120-P0-16 |
| H-147 description | Operations ownership (HUM-08) |
| Current status | **OPEN** / partial Owner-attested titles only |
| Type | Owner decision / operations |
| Dependency | None for **internal** named assignments. Architecture still unselected for some specialist posts (H-121: infrastructure owner after architecture still unselected). Do **not** invent names. |
| Required evidence | Named/titled RACI for application ops, infrastructure, DBA, security, identity, backup/restore, IR, DNS/certs (H-121 Session 1). Privacy/DPO designation exists (Wensley Shirima); appointment evidence still required as a **legal/privacy** item (blocker 18), not a substitute for the other HUM-08 rows. |
| Decision owner | Internal Owner/POA |
| Can be decided under current POA? | **YES** for internal named assignments |
| Implementation authorization required? | **NO** for recording names; **YES** later for operational tooling |
| Production authorization required? | **YES** to **operate** Production — not required to record internal names |
| Proposed closure sequence | Stage 3 (can proceed in parallel with Stages 1–2) |
| Current action | Owner Session 1 assignments remain empty in H-122 except prior DPO designation. Fill in a company record; do not invent names here. |
| Closure test | HUM-08 rows that H-120 requires for Production operation are named with date/source; blanks are not treated as Cursor assignments. |

#### Blocker 17 — On-call roster

| Field | Record |
| --- | --- |
| Blocker ID | 17 / H120-P0-17 |
| H-147 description | On-call roster |
| Current status | **OPEN** |
| Type | Owner decision / operations |
| Dependency | Blocker 16. H-125 OA-02 records PDM escalation and **no 24/7 NOC**. That is not a roster overlapping the commercial RTO window. |
| Required evidence | On-call roster overlapping EAT window (H-120). |
| Decision owner | Owner / ops |
| Can be decided under current POA? | **YES** for internal roster assignment |
| Implementation authorization required? | **NO** to name a roster; **YES** to wire alerting (blocker 22) |
| Production authorization required? | **YES** to operate Production under that roster |
| Proposed closure sequence | Stage 3 |
| Current action | Do not invent an on-call roster. PDM-only escalation remains recorded and insufficient for this P0. |
| Closure test | Named on-call roster overlapping the EAT commercial RTO window, not PDM-only with an explicit “no 24/7 NOC” note. |

#### Blocker 18 — E1-C legal/privacy Production-blocking

| Field | Record |
| --- | --- |
| Blocker ID | 18 / H120-P0-18 |
| H-147 description | E1-C legal/privacy Production-blocking (PDPC, DPO combined close, DPAs) |
| Current status | **OPEN** |
| Type | legal/privacy + external evidence |
| Dependency | **PDPC:** live process confirmation on pdpc.go.tz; TIN certificate (EI-01 / blocker 28) listed by H-129 as Owner-must-obtain evidence; other live attachments; **no exemption inferred**. **DPO:** internal appointment recorded (Wensley Shirima); combined Legal/DPO **NOT ESTABLISHED**; regulator notification **OPEN**. **DPAs:** provider selection first (after ADR-0006). Distinguish EOS privacy-by-design, SEDMC operational processing, and Production legal/privacy readiness (§G). |
| Required evidence | See §G and H-129 / H-125 OA-05 / OA-06 / H-147 §G. One of: actual SEDMC-specific PDPC registration/status evidence **or** an authoritative written determination of applicable status — **not** manufactured here. DPO appointment letter / formal evidence. Executed vendor DPAs after a provider exists. L-01 remains a **rule**, not a certificate. |
| Decision owner | Legal / company / DPO — not Cursor. Counsel: THOMAS NGULUMA (counsel only). |
| Can be decided under current POA? | **NO** for PDPC/regulator artefacts and DPAs. Internal DPO appointment already Owner-attested and is **not** the combined close. |
| Implementation authorization required? | **NO** for evidence intake; **YES** if a future privacy-engineering grant is issued (not this plan) |
| Production authorization required? | **YES** before Production personal-data processing if PDPA applies (L-01 rule) |
| Proposed closure sequence | Stage 2 (PDPC/DPO); DPAs in Stage 5 after provider |
| Current action | Keep **PDPC OPEN**. Do not claim exemption, registration, non-registration beyond Owner-confirmed “registration has not yet been completed”, or compliance. Confirm live PDPC channel; do not file from this repository. |
| Closure test | PDPC status evidenced from the regulator or an authoritative determination; DPO combined E1 close complete; DPAs executed for selected subprocessors — none of which is satisfied by repository privacy-by-design work (H-131–H-146). |

#### Blocker 19 — Production event transport

| Field | Record |
| --- | --- |
| Blocker ID | 19 / H120-P0-19 |
| H-147 description | Production event transport (NATS product) |
| Current status | **OPEN** |
| Type | vendor/provider + engineering |
| Dependency | ADR-0006 (ADR-0004 pending ADR-0006 per H-120). NATS client implemented; **product unselected**; production-like throws without `EOS_NATS_URL`. |
| Required evidence | Named JetStream offering + URL in secrets, not git. |
| Decision owner | Owner then infra |
| Can be decided under current POA? | **NO** (selecting NATS hosting would pick a vendor) |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 5 then Stage 12 |
| Current action | Do not select or provision NATS. In-memory Dev transport remains labelled not Production. |
| Closure test | Named Production NATS/JetStream product; production-like start uses secrets-held URL, not in-memory-dev. |

#### Blocker 20 — Production email product + DPA

| Field | Record |
| --- | --- |
| Blocker ID | 20 / H120-P0-20 |
| H-147 description | Production email product + DPA |
| Current status | **OPEN** |
| Type | vendor/provider + legal/privacy + engineering |
| Dependency | Hosting/residency option; subprocessor/DPA. Adapters exist (`dev-outbox`, `smtp`/`smtp-stub`, `ses`/`ses-stub`); production-like fatal on stub/outbox. Host/region **unselected**. |
| Required evidence | Named adapter + host/region; executed DPA. |
| Decision owner | Owner then infra; Legal for DPA |
| Can be decided under current POA? | **NO** (would select vendor and claim a DPA) |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 5 then Stage 12 |
| Current action | Do not select email product. Do not implement mailbox/Gmail ingestion. |
| Closure test | Named Production email adapter/host + DPA; stubs/outbox refused in production-like env. |

#### Blocker 21 — Process supervision

| Field | Record |
| --- | --- |
| Blocker ID | 21 / H120-P0-21 |
| H-147 description | Process supervision (not `tsx`) |
| Current status | **OPEN** |
| Type | engineering / infrastructure |
| Dependency | Blocker 2 host. Intended contract: `npm run build` → `node dist/main.js` and `next start`. Dev uses `tsx` / `next dev`. H117-D-01 Windows `npx tsx` class remains a documented limitation, not Production supervision. |
| Required evidence | Supervised compiled process, not `tsx`. |
| Decision owner | Infra after host |
| Can be decided under current POA? | **NO** |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 12 |
| Current action | Do not deploy a supervisor. Do not treat `tsx` as Production. |
| Closure test | Production API/web run as supervised compiled processes on the approved host. |

#### Blocker 22 — Observability sink + alerting

| Field | Record |
| --- | --- |
| Blocker ID | 22 / H120-P0-22 |
| H-147 description | Observability sink + alerting |
| Current status | **OPEN** |
| Type | vendor/provider + operations |
| Dependency | Host + on-call (blocker 17). JSON logs + redaction exist; no Production sink. |
| Required evidence | Named sink + on-call alerts. |
| Decision owner | Ops after host |
| Can be decided under current POA? | **NO** (would select a product) |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 5 then Stage 12 |
| Current action | Do not select or configure a Production observability product. |
| Closure test | Named Production sink with alerts reaching the named on-call path. |

#### Blocker 23 — Passing production-like start on real config

| Field | Record |
| --- | --- |
| Blocker ID | 23 / H120-P0-23 |
| H-147 description | Passing production-like start on **real** config |
| Current status | **OPEN** (fail-closed code exists) |
| Type | infrastructure (validation) / engineering |
| Dependency | All product selections and live values (IdP, NATS, email, CORS, TLS, secrets, catalog). Fail-closed behaviour is **COMPLETE WITH CONDITIONS** in code and must not be weakened. |
| Required evidence | Passing production-like start on **real** config, not invented placeholders. |
| Decision owner | Infra after all products selected |
| Can be decided under current POA? | **NO** |
| Implementation authorization required? | **YES** (to supply real values under grant) |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 13 |
| Current action | Keep fail-closed. Do not invent Production env values to force a green start. |
| Closure test | `EOS_ENV=production` (or authorized production-like) starts successfully against the approved host/catalog/secrets — and `productionReady` is only then eligible for a separate Owner grant, not flipped by this plan. |

#### Blocker 24 — Rollback/DR procedure on Production topology

| Field | Record |
| --- | --- |
| Blocker ID | 24 / H120-P0-24 |
| H-147 description | Rollback/DR procedure on Production topology |
| Current status | **OPEN** |
| Type | Owner decision + infrastructure (validation) |
| Dependency | Production topology (blockers 2, 5, 14). Rollback SQL **not designed**; DR unselected. H-120 approach: restore-from-backup, not invented DROP scripts. |
| Required evidence | Authorized rollback method after topology. |
| Decision owner | Owner + DBA |
| Can be decided under current POA? | **YES** for later method selection — **NO** to claim DR now |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 14 |
| Current action | Do not invent rollback SQL. Do not claim DR. |
| Closure test | Authorized rollback/DR procedure executed or drill-evidenced on the Production topology. |

#### Blocker 25 — SoR / adoption

| Field | Record |
| --- | --- |
| Blocker ID | 25 / H120-P0-25 |
| H-147 description | SoR / adoption (deploy ≠ live operations) |
| Current status | **OPEN** — cutover not authorized; H-81 **NOT STARTED** |
| Type | Owner decision / operations / governance |
| Dependency | Production runtime existing does **not** imply cutover. Separate SoR cutover grant if ever desired. See §I. |
| Required evidence | Separate Owner SoR cutover grant; operational adoption evidence. Not UAT acceptance. |
| Decision owner | Internal Owner/POA |
| Can be decided under current POA? | **YES** (including the decision **not** to cut over) |
| Implementation authorization required? | **YES** for H-81 / adoption work if ever authorized |
| Production authorization required? | Production deploy ≠ SoR cutover. Cutover requires its **own** grant. |
| Proposed closure sequence | Stage 17 (after Production; separate) |
| Current action | Preserve Office / Excel / Outlook-Gmail / WhatsApp / phone as commercial SoR. Do not start H-81. |
| Closure test | Written SoR cutover grant plus evidence that EOS is the commercial system of record — **or** an explicit Owner decision that EOS remains non-SoR. Neither exists as a cutover close. |

#### Blocker 26 — Production security/access model

| Field | Record |
| --- | --- |
| Blocker ID | 26 / H120-P0-26 |
| H-147 description | Production security/access model (IdP-linked principals) |
| Current status | **OPEN** |
| Type | Owner decision + engineering + operations |
| Dependency | Blockers 8–11 (IdP, MFA, HTTPS). UAT `authorize()` RBAC is **not** Production access. |
| Required evidence | IdP-linked principals + MFA + HTTPS origin. |
| Decision owner | Identity + Owner |
| Can be decided under current POA? | **YES** for access-model **direction** — **NO** to provision Production users now |
| Implementation authorization required? | **YES** |
| Production authorization required? | **YES** |
| Proposed closure sequence | Stage 15 |
| Current action | Do not create Production users or credentials. |
| Closure test | Production principals exist only via the named IdP, with MFA and HTTPS origin; UAT users are not reused as Production identity. |

#### Blocker 27 — Current-code UAT

| Field | Record |
| --- | --- |
| Blocker ID | 27 / H147-R-36 |
| H-147 description | UAT of **current worktree** (H147-R-36) |
| Current status | **SATISFIED AS UAT EVIDENCE ONLY** (H-153) |
| Type | governance (UAT evidence) — **not** Production validation |
| Dependency | Satisfied by H-152 revalidation + H-153 acceptance. Still **not** Production validation. |
| Required evidence | Already recorded: H-152 PASS WITH FINDINGS; H-153 ACCEPTED WITH DOCUMENTED LIMITATIONS. |
| Decision owner | Internal Owner/POA (acceptance already recorded in H-153) |
| Can be decided under current POA? | **YES** — already exercised for UAT acceptance |
| Implementation authorization required? | **NO** for this evidence gate |
| Production authorization required? | **NO** for UAT evidence; **YES** if a future **production-like** campaign is authorized (that would be a new gate, not a reopen of item 27) |
| Proposed closure sequence | Stage 0 (complete as UAT evidence only) |
| Current action | Do not reopen H-149 or H-152. Do not run another current-code UAT campaign. |
| Closure test | For **UAT evidence**: already met. For **Production**: this row does **not** close Production. Item 23 remains the production-like start evidence. |

#### Blocker 28 — EI-01 TIN identity reconciliation

| Field | Record |
| --- | --- |
| Blocker ID | 28 / EI-01 |
| H-147 description | EI-01 TIN identity reconciliation |
| Current status | **OPEN / REQUIRES OWNER EVIDENCE REVIEW** |
| Type | external evidence / legal/privacy |
| Dependency | None earlier on the remaining critical path. BRELA 2025 extract is already recorded (H-128; qualified, not live 2026 verification). The 2007 TRA certificate is **not** sufficient current DMC identity evidence (H-132). |
| Required evidence | See §F (H-132 §9 preferred close). Do not invent a TIN. Do not claim TRA verification. Do not claim the DMC is legally mismatched. |
| Decision owner | Owner evidence review; TRA as document source. Cursor cannot obtain TRA documents. |
| Can be decided under current POA? | **NO** — POA cannot manufacture current TRA evidence. Owner **review** of presented evidence is an Owner act; **closure** still requires the evidence specified in H-132. |
| Implementation authorization required? | **NO** |
| Production authorization required? | **NO** for the evidence review itself |
| Proposed closure sequence | Stage 1 |
| Current action | **This is the single next executable action** (§M). Owner obtains/reviews current TRA evidence linking Patrick Daniel Makundi + the Owner-supplied TIN + Makundi Serengeti Experience DMC. |
| Closure test | H-132 preferred evidence accepted under that record’s gate — **not** “a TIN PDF exists”. Status must not move to `RECORDED — EXTERNAL DOCUMENT VERIFIED` merely because the named individual and TIN ending correspond. |

---

## E. Classification of the 27 OPEN blockers (A–F)

Item 27 is **not** in this open set.

### A. Internal Owner/POA decisions

| Blockers | Notes |
| --- | --- |
| 1 Production authorization grant | Within POA; **not** granted; blocked by earlier evidence/architecture |
| 3 ADR-0006 formal approval | Within POA **after** evidence; not closable from direction records |
| 4 DP-0006 named option | Same |
| 16 HUM-08 named specialists | Within POA; do not invent names |
| 17 On-call roster | Within POA; PDM-only is not closure |
| 25 SoR / cutover policy | Within POA; default remains **no cutover** |
| 26 access-model **direction** | Direction only; provisioning is later |

H-125 OA-08 (PDM as Production Infrastructure Owner until delegated) and OA-09/OA-10 (infrastructure **direction**) are **not** Production architecture approval.

### B. External evidence

| Blockers | Notes |
| --- | --- |
| 28 EI-01 | Current TRA evidence; certificate found ≠ closed |
| 18 PDPC status; DPO regulator component | Live PDPC channel; no exemption |
| 8 (facts) | Corporate directory / HUM-05 facts |
| 18 DPAs | After a provider exists |

### C. Vendor/provider selection

| Blockers | Notes |
| --- | --- |
| 2 hosting/provider/region | Unselected |
| 7 secrets/KMS | ADR-0012 OPEN |
| 8 IdP product | ADR-0013 OPEN |
| 14 backup product | Unselected |
| 19 NATS product | Unselected |
| 20 email product | Unselected |
| 22 observability sink | Unselected |

No vendor is chosen in H-154.

### D. Engineering implementation (future grants — not this increment)

| Blockers | Notes |
| --- | --- |
| 6 migrate procedure | After catalog + grant |
| 10–13 TLS / DNS / CORS / DB TLS config | After host/origin |
| 21 process supervision | After host |
| 23 wiring of real production-like values | After products exist |
| 7, 8, 19, 20, 26 implementation | After product decisions |

### E. Production validation (future gates)

| Blockers | Notes |
| --- | --- |
| 15 restore of Production state | Not lab |
| 23 production-like start on real config | Fail-closed code is not this evidence |
| 24 rollback/DR on Production topology | Not invented SQL |

Item 27 is **UAT** validation already accepted; it is **not** Production validation.

### F. Legal/privacy

| Blockers | Notes |
| --- | --- |
| 18 PDPC, DPO combined close, DPAs | OPEN |
| 28 EI-01 | OPEN / REQUIRES OWNER EVIDENCE REVIEW |

H-142/H-146 privacy remediation ≠ PDPC readiness ≠ Production readiness.

---

## F. EI-01 / TIN (special treatment)

```text
EI-01 = OPEN / REQUIRES OWNER EVIDENCE REVIEW
```

### F.1 What exists

| Artefact | Recorded status |
| --- | --- |
| Owner-supplied 2025 BRELA extract | Makundi Serengeti Experience DMC; registration **550040**; proprietor Patrick Daniel Makundi; registration 06/08/2023; extract generated 09/04/2025 17:21:34; principal place Arusha. **Not** live 2026 BRELA verification (H-128; H-147-R-12). |
| Owner-supplied TIN | Recorded as Owner-supplied fact (H-128 §B / H-129 §A). Full number is **not** reproduced here. Minimally: TIN ending **673**. Status: `RECORDED — OWNER-SUPPLIED TIN` — **not** a verified certificate. |
| TRA TIN certificate (external) | H-131 inspected `TIN - MAKUNDI Serengeti Experience DMC.pdf` **outside** the repository. Classification: `DOCUMENT PRESENT — REQUIRES REVIEW`. Face: Patrick Daniel Makundi; T/A **Veroted Group**; effective **21 August 2007**; Kinondoni / Mwenge. DMC name **not printed** on the TRA form. Filename/CamScanner overlay is **not** TRA-printed business-name evidence. Certificate **not** copied into Git. |

### F.2 What H-132 established — and did not

H-132 did **not** accept the 2007 certificate as sufficient current DMC identity evidence.

Established correspondence: named individual appears to correspond to the proprietor; TIN ending 673 corresponds to the Owner-supplied TIN fact.

**Not** established (do not infer):

- that T/A Veroted Group **is** Makundi Serengeti Experience DMC
- that the 2007 certificate **is** the current DMC tax certificate
- that the certificate is **invalid**
- that the TIN itself is **invalid**
- that Veroted Group and the DMC are **unrelated**
- TRA verification
- legal mismatch of the DMC

Classification remains **evidence reconciliation** until authoritative evidence resolves it.

```text
No equivalence between the 2007 TRA certificate and Makundi Serengeti Experience DMC
is asserted without additional evidence.
```

### F.3 Exact evidence that would close EI-01

From H-132 §9 (not expanded):

**Preferred evidence:** a **current** TRA document, or other **authoritative TRA evidence**, that clearly connects **all** of:

- Patrick Daniel Makundi;
- the relevant TIN (already Owner-supplied; full number not repeated here);
- Makundi Serengeti Experience DMC.

If TRA documentation uses a different legal / trading-name structure, that relationship must be **evidenced**, not inferred.

No specific additional TRA form title is prescribed beyond the inspected Certificate of Registration for Taxpayer Identification Number, which **does not** itself close EI-01 for the DMC.

The Owner may need to obtain **clarification or update evidence from TRA** if the tax identity was established under an earlier trading / business name.

Until such evidence is presented and accepted under H-132 §14, EI-01 remains **OPEN / REQUIRES OWNER EVIDENCE REVIEW**.

H-154 does **not** close EI-01 because a certificate exists.

---

## G. PDPC (special treatment)

```text
PDPC OPEN
```

H-126 Owner-confirmed: PDPC registration **has not yet been completed**. H-129 pack is preparation only — **not** a filing. No SEDMC PDPC certificate is in the repository. **No exemption is inferred. No registration, non-registration-as-a-legal-conclusion, or compliance is claimed.**

L-01 remains an adopted **rule**: confirm actual PDPC status before Production personal-data processing **if** PDPA applies. It is **not** a certificate.

### G.1 Three distinctions (must not be conflated)

| Layer | Meaning | Current state |
| --- | --- | --- |
| 1. EOS privacy-by-design boundary | EOS is **not** intended to be a system of record for personal data (H-131 privacy companion; H-132 §12). H-142/H-146 dispositions are Dev/Test privacy-engineering evidence. | Engineering/privacy-by-design work exists with documented residuals. **Not** regulator status. |
| 2. SEDMC operational processing of personal data | The business already processes personal data in Office / Excel / Outlook-Gmail / WhatsApp / phone (current commercial SoR). That operational reality is **not** EOS Production. | Outside this repository’s Production runtime. Not assessed as “compliant” here. |
| 3. Production legal/privacy readiness | Whether EOS **Production** may process personal data under an evidenced PDPC/PDPA position, DPO combined close, and vendor DPAs. | **NOT READY**. Blocker 18 OPEN. |

```text
H-142/H-146 privacy remediation status
≠ PDPC / regulatory readiness
≠ Production readiness
```

### G.2 Evidence/action required to close the PDPC Production blocker

From H-129 / H-147-R-10 / H-125 OA-05, without inventing a mandatory attachment list:

1. Confirm **live** PDPC application fields, current attachment list, controller vs processor category, and DPO introduction mechanics on the current PDPC channel (`https://pdpc.go.tz/services/registration/` catalogued; live form **not** captured in-repo). Repository URLs are **not** a captured copy of the current form.
2. Owner-must-obtain evidence already listed: **TIN certificate** (blocked on EI-01); audited financials **if** the current PDPC process requires them; any other supporting documents the live process requires.
3. Outcome evidence: actual SEDMC-specific PDPC registration/status evidence **or** an authoritative written determination establishing the applicable status.
4. DPO: keep internal appointment vs regulator component separate (H-125 OA-06 MIXED). Combined E1 DPO close remains incomplete.
5. Do **not** treat H-126’s paraphrase of public guidance as SEDMC’s registration status.

Cursor cannot complete PDPC registration from this repository.

---

## H. ADR-0006 and DP-0006 (special treatment)

```text
ADR-0006 OPEN
DP-0006 OPEN
```

| Record | Status | What is still required before closure |
| --- | --- | --- |
| ADR-0006 | **proposed — blocked for Production**. “No Production hosting choice is made here.” Candidates to evaluate remain unelected. | Formal human approval **after** legal/residency evidence pack. Named hosting model and residency/region class. Must resolve OA-09 **managed cloud direction** vs E1-C **SEDMC-owned Tanzanian facility preferred / cloud optional contingency**. Tanzania preference ≠ selected architecture. Direction ≠ approval. |
| DP-0006 | **OPEN — for formal human approval**. Recommended option ***Not selected***. Options A–D remain “under consideration (not selected)”. | Human approval of a **named** option. Must not lock Terraform/K8s. Where Production/UAT run, where data and backups live, still undecided. |

H-125 OA-09 / OA-10 record architectural **direction** and explicitly leave both records OPEN. E1-C records `PREFERRED ARCHITECTURAL DIRECTION — NOT PRODUCTION APPROVAL` and `NO PROVIDER SELECTED`.

H-154 does **not** select a provider or region. H-154 does **not** create an approval. Neither record is closed because the Owner previously expressed a general infrastructure direction.

---

## I. Commercial SoR / cutover

```text
Office / Excel / Outlook-Gmail / WhatsApp / phone remains the current commercial System of Record.
```

H-154 does **not** authorize EOS as the commercial SoR. H-80 remains **ACTIVE**. H-81 remains **NOT STARTED**.

UAT acceptance does **not** mean the business should move live work into EOS.

Future evidence/decision required before an EOS commercial cutover could occur (blocker 25):

1. Production authorization and a running Production topology (blockers 1–24, 26 as applicable) — deploy still ≠ adoption.
2. A **separate** Owner/POA SoR cutover grant (H-120 P0-25; H-147 operational adoption “separate H-81 / SoR grant — not implied”).
3. Operational ownership actually staffed (HUM-08 / on-call).
4. Explicit decision that EOS replaces Office / Excel / Outlook-Gmail / WhatsApp / phone for the in-scope commercial records — not inferred.

Do not start H-81. Do not implement mailbox / Gmail / WhatsApp / Excel ingestion. Do not reconstruct KPI/revenue/profit. Do not introduce FX providers. Do not change the 250k/20% rule.

---

## J. Hydration findings (H-152 / H-153)

| Finding | Status | UAT | Production-blocker classification |
| --- | --- | --- | --- |
| H152-F-01 `/field` hydration mismatch | Unresolved genuine application defect | Non-blocking to accepted current-code UAT | **Requires explicit future engineering/readiness assessment** — not closed; not declared Production-safe |
| H152-F-02 `Shell.tsx` hydration overlay | Unresolved genuine application defect (distinct surface) | Non-blocking to accepted current-code UAT | **Requires explicit future engineering/readiness assessment** — not closed; not declared Production-safe |

Existing Production-readiness requirements (H-120 P0 list / H-147 28 blockers) **do not** name these hydration defects as Production blockers. H-153 recorded them as UAT limitations and **did not** classify Production-blocking status.

Therefore H-154 **does not** add them as silent inventory items 29–30, **does not** mark them closed, and **does not** decide they are Production-safe merely because they were non-blocking for UAT.

They are **not** repaired here. They remain recorded for a later separately authorized engineering/readiness action.

H152-F-03 (stale harness URL / historical H-149 row) remains a UAT process limitation; the historical row must **not** be deleted. It is not added to the 28-blocker Production inventory.

---

## K. Dependency graph

H-147 §I logical path (not a schedule, not authorization):

```text
external evidence / decisions
  (PDPC, EI-01, DPO legal completeness, DPAs as applicable)
→ infrastructure decision
  (ADR-0006 + DP-0006 named option)
→ Production environment preparation
  (new host/catalog — not eos / h112 / h117 / gateb)
→ security / secrets / networking
  (KMS, IdP/MFA, HTTPS, DNS, CORS, DB TLS)
→ database readiness
  (authorized migrate grant; apply on Production catalog only)
→ backup / restore
→ deployment rehearsal
  (supervised compiled process)
→ UAT decision
  (new campaign for current worktree)
→ formal UAT
→ UAT acceptance
→ Production authorization
→ Production deployment
→ post-deployment verification
→ operational adoption
  (separate H-81 / SoR grant — not implied)
```

### K.1 What H-154 changes — and why

The grant’s illustrative order (legal/entity → privacy → hosting → architecture → environment → secrets/access → database → migrate → deploy → backup → observability → production-like validation → rollback → SoR → Production authorization) is **approximately** right but is **not** adopted unchanged.

Derived graph, with explicit deltas from H-147 and from the illustrative order:

1. **Item 27 current-code UAT is no longer a remaining campaign on this path.** H-153 accepted it as UAT evidence only. H-147’s “UAT decision → formal UAT → UAT acceptance” block for the **current worktree** is therefore **removed** from the remaining critical path. A **production-like** start on real config (item 23) remains later and is **not** a reopen of H-149/H-152.
2. **EI-01 is the earliest remaining external-evidence prerequisite**, not merely parallel with PDPC. H-129 lists TIN certificate as Owner-must-obtain PDPC evidence; H-132 §10 records that tax-identity evidence required for any future PDPC application remains unresolved. BRELA identity is already **qualified documentary evidence** (H-128), so “legal/entity identity” is **not** a blank first stage — the open identity gate is **TIN/EI-01**, not a missing BRELA extract.
3. **DPAs cannot precede provider selection.** They stay after ADR-0006 / named option / vendor selection (H-147-R-14).
4. **HUM-08 / on-call can proceed in parallel** with Stages 1–2 as internal POA assignments. They are **not** a substitute for EI-01/PDPC and do **not** unlock hosting selection.
5. **Infrastructure direction is internally inconsistent until a named option is chosen.** H-125 OA-09 (managed cloud) and E1-C (SEDMC-owned preferred) are both direction-only. Hosting decision (items 2–4) therefore **requires an Owner named-option resolution**, not “Tanzania preference = architecture”.
6. **Production authorization (item 1) is required before Production acts** (H-120 P0-01). H-147 placed the grant after UAT acceptance. With current-code UAT already accepted as evidence only, the remaining order is: evidence + named option → **Production grant** → provision environment/secrets/DB/migrate → backup/restore → supervision/observability → production-like start (item 23) → rollback/DR → access model. Post-deploy verification remains a future operational gate, not a current inventory close.
7. **SoR cutover (item 25) stays last and separate.** It is **not** implied by Production authorization or deployment. Illustrative order that placed SoR immediately before Production authorization would incorrectly treat cutover as a go-live prerequisite; existing records treat cutover as **optional later adoption** (H-81).

### K.2 Sequenced stages (remaining work)

```text
Stage 0  Item 27 current-code UAT evidence — SATISFIED AS UAT EVIDENCE ONLY
Stage 1  Item 28 EI-01 Owner evidence review          ← next executable action
Stage 2  Item 18 PDPC / DPO combined close (DPAs wait)
Stage 3  Items 16–17 HUM-08 / on-call (parallel-capable)
Stage 4  Items 2–4 named hosting/residency option (ADR-0006 + DP-0006)
Stage 5  Vendor/provider selection + DPAs + product shortlist
           (7, 8, 14, 18-DPA, 19, 20, 22)
Stage 6  Item 1 Production authorization grant
Stage 7  Item 5 Production host/catalog (new names only)
Stage 8  Items 7–9 secrets/KMS, IdP, MFA
Stage 9  Items 10–13 HTTPS, DNS, DB TLS, CORS
Stage 10 Item 6 authorized Production migrate (125 on Production catalog;
           126 not created by this plan)
Stage 11 Items 14–15 backup product + restore evidence
Stage 12 Items 19–22 NATS, email, supervision, observability
Stage 13 Item 23 production-like start on real config
Stage 14 Item 24 rollback/DR on Production topology
Stage 15 Item 26 IdP-linked Production access model
Stage 16 Post-deployment verification (future; not a named H-147 row)
Stage 17 Item 25 SoR cutover / H-81 — separate grant; not implied
```

Hydration F-01 / F-02 sit **beside** this graph as a future engineering/readiness assessment, not as a sequenced Production P0.

### K.3 Prerequisite map (what blocks what)

| These blockers wait on | Prerequisites |
| --- | --- |
| 18 PDPC application attachments involving TIN | 28 EI-01 |
| 3, 4 ADR/DP named option | 28 (entity/tax identity evidence) + 18 PDPC/privacy status as applicable + Owner resolution of OA-09 vs E1-C direction |
| 2 provider/region procurement | 3, 4 |
| 18 DPAs; 7, 8, 14, 19, 20, 22 products | 2–4 |
| 1 Production grant | Stages 1–5 as applicable; item 27 already UAT-satisfied |
| 5 Production catalog | 1, 2–4 |
| 6 migrate | 1, 5 |
| 9 MFA | 8 |
| 10–13 HTTPS/DNS/TLS/CORS | 2, 5, 11 as applicable |
| 12 DB TLS | 5 |
| 15 restore | 14 + Production state |
| 23 production-like start | live values for 7, 8, 10, 11, 13, 19, 20, 5 |
| 24 rollback/DR | 2, 5, 14 |
| 26 Production access model | 8, 9, 10, 11 |
| 25 SoR cutover | Production runtime **and** a separate H-81 grant — not automatic |

---

## L. Production environment dependency sequence

For each Production environment concern: **Decision → Procurement/selection → Configuration → Evidence → Closure**. **None of these steps is performed in H-154.**

| Concern | Decision | Procurement/selection | Configuration | Evidence | Closure |
| --- | --- | --- | --- | --- | --- |
| Hosting/provider | Named DP-0006 option + ADR-0006 approval | Contract/facility/cloud account — **unselected** | Provision host | Provider/region/residency artefacts | Blocker 2 |
| Region / data residency | Same named option; Legal review | Region/class in the selected offering | Data placed only there | Residency evidence pack | Blockers 2–4 |
| Production PostgreSQL | After host | Managed PG or equivalent **unselected** | New catalog, not Dev/UAT names | Catalog identity + credentials outside git | Blocker 5 |
| Production catalog | Explicit non-use of `eos` / h112 / h117 / h149 / h152 / gateb | Same | Create only under grant | Name/host evidence | Blocker 5 |
| Migration authorization | Separate migrate grant | n/a | Apply **125** on Production catalog only; **no 126** from this plan | Apply log | Blocker 6 |
| Secrets/KMS | ADR-0012 approval after ADR-0006 | Named platform **unselected** | Rotation owners; no git secrets | Platform + owners | Blocker 7 |
| IdP | ADR-0013 after HUM-05 facts | Named OIDC **unselected** | Principal mapping | IdP evidence | Blocker 8 |
| MFA | Policy at IdP | IdP feature | Enable for admin/support | MFA evidence | Blocker 9 |
| HTTPS | Origin policy | Certificate issuer after DNS | Valid TLS | Live HTTPS | Blocker 10 |
| DNS | Name policy | Delegation | Records | Delegated hostname | Blocker 11 |
| DB TLS | `require` contract already in code | Host TLS offering | Attach to Production DB | Live require + certs | Blocker 12 |
| CORS | Named HTTPS origins | n/a | Allow-list after DNS | Config vs origin | Blocker 13 |
| Backup | Product after host | Named encrypted backup **unselected** | 19:00 EAT intent + remote copy | Product evidence | Blocker 14 |
| Restore | Accept measured RTO/RPO | n/a | Restore drill | Production-state restore | Blocker 15 |
| Process supervision | Compiled-process contract | Supervisor after host | `node dist` / `next start` | Supervised process | Blocker 21 |
| Observability | Sink after host | Named sink **unselected** | Alerts to on-call | Sink + pages | Blocker 22 |
| Event transport | After ADR-0006 | NATS/JetStream **unselected** | URL in secrets | Product + start | Blocker 19 |
| Email | Adapter after host | Product **unselected** + DPA | Non-stub adapter | Product + DPA | Blocker 20 |
| Rollback/DR | Method after topology | DR location unselected | Restore-from-backup approach | Drill on Production topology | Blocker 24 |
| Production access model | IdP-linked principals | Users in IdP, not local-password | RBAC mapping | Principals + MFA + HTTPS | Blocker 26 |

---

## M. Single next executable action

**Exactly one** next action, earliest on the Production-readiness critical path:

```text
Owner/POA evidence review of EI-01:
obtain and present current TRA documentary evidence (or other
authoritative TRA evidence) that clearly connects Patrick Daniel
Makundi + the Owner-supplied TIN + Makundi Serengeti Experience DMC,
or evidenced clarification of any different TRA legal/trading-name
structure, as specified in H-132 §9.
```

**Why this is the earliest material action:** H-132 already left EI-01 as `OPEN / REQUIRES OWNER EVIDENCE REVIEW`. H-129 treats TIN certificate evidence as required Owner-obtain material for any future PDPC application. ADR-0006 / DP-0006 cannot close without a legal/residency evidence pack that still includes unresolved tax identity. Internal HUM-08 naming can proceed in parallel but does **not** reduce this identity/privacy critical path. Provider/region selection is forbidden until a named option exists.

**Who can execute it:** the Owner/POA (and TRA as the document source). **Cursor cannot execute this action.** The required artefact is an external TRA document (or TRA-sourced clarification) that is **not** available as verified current DMC TIN evidence in the repository. The 2007 certificate already inspected remains `DOCUMENT PRESENT — REQUIRES REVIEW` and is **not** that close.

Do not pretend this external dependency can be completed from the worktree.

---

## N. Explicitly excluded (not started)

```text
H-155: NOT CREATED
Production deployment: NOT PERFORMED
Production infrastructure: NOT PROVISIONED
provider selection / contracting: NOT PERFORMED
Production credentials / secrets / KMS: NOT CREATED
DNS / TLS / IdP / MFA: NOT CONFIGURED
Production database: NOT CREATED
Production / live migration: NOT PERFORMED
migration 126: NOT CREATED
application / schema behaviour: NOT MODIFIED
Rate Identity: UNCHANGED
GET rate-by-id: NOT IMPLEMENTED
hydration repair (F-01 / F-02): NOT PERFORMED
H-81: NOT STARTED
C11+: NOT AUTHORIZED
F2-I12: NOT AUTHORIZED
Path D: NOT AUTHORIZED
mailbox / Gmail / WhatsApp / Excel ingestion: NOT AUTHORIZED
commercial SoR: UNCHANGED
KPI / revenue / profit reconstruction: NOT AUTHORIZED
FX providers: NOT AUTHORIZED
250k / 20% rule: NOT AUTHORIZED
PDPC exemption / compliance: NOT CLAIMED
Production readiness: NOT CLAIMED
```

---

## O. Repository safety (this increment)

| Check | Result |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Application changes this increment | **NONE** |
| Schema / migration 126 / live migration | **NONE** |
| Infrastructure changes this increment | **NONE** |
| Prior governance records modified | **NONE** |
| Porcelain | 648 → 649 |
| Files created this increment | `docs/governance/h-154-production-readiness-closure-plan.md` only |
| Commit | **NONE** |
| Push | **NONE** |
| Existing dirty worktree | **Preserved** |

```text
PRODUCTION REMAINS NOT AUTHORIZED / NOT READY
H-155 WAS NOT CREATED
```
