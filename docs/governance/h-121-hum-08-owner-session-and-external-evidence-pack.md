# H-121 — HUM-08 Owner Session and External Evidence Pack

> **GOVERNANCE PREPARATION ONLY**  
> **NOT Production authorization · NOT vendor selection · NOT infrastructure provisioning · NOT an engineering cycle**  
> This pack **collects** Owner/human inputs. It **does not** make the decisions.

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` (`master`).  
**Index:** empty. Dirty worktree preserved.  
**Application code this increment:** **NONE**.

```text
HUM-08 OWNER SESSION PACK COMPLETE WITH FINDINGS
NO H-120 P0 IS CLOSED BY H-121 PREPARATION ALONE.
ADR-0006 OPEN
DP-0006 OPEN
Production authorization: NOT AUTHORIZED
Production readiness: NOT READY
```

**Finding:** HUM-08 is **partially** recorded. Privacy/DPO **designation** exists (Wensley Shirima). Appointment **evidence** does not. All other operational HUM-08 rows remain `OWNER NOT YET ASSIGNED`. HUM-05 corporate IdP is **NOT ESTABLISHED**. E-01/E-02 authoritative artefacts are **absent**. This pack does not invent those inputs.

---

## 0. How to use this pack

| This pack does | This pack does not |
| --- | --- |
| Give the Owner blank recording fields | Assign fictional owners |
| List artefacts H-120/E1-C01 already require | Write legal conclusions |
| Inventory the **existing** corporate directory | Select an IdP |
| Separate available evidence from open decisions | Close ADR-0006 / DP-0006 |
| Show what can close after human input | Authorize Production |

**Already recorded humans (do not expand or re-interpret):**

| Name | Recorded role | Source | Not |
| --- | --- | --- | --- |
| THOMAS NGULUMA | LEGAL COUNSEL only (15 Sep 2026, A.T.N) | E1-C01 attestation | Not DPO |
| Wensley Shirima | IT Manager; Owner-confirmed **DPO designation** (HUM-03 CLOSED / OWNER-CONFIRMED) | `adr-0006-e1-owner-formal-decision-record.md` §7 | Appointment letter still **REQUIRED**; combined Legal/DPO **NOT COMPLETE** |
| Patrick Makundi | HUM-11 named RFI sender; HUM-07 BCM formally confirmed | Same owner decision record | **E1-B sender ≠ Production ops**; not on-call |

Fill session recording tables **in a company record** (this file may be copied). Do not treat blank cells as Cursor assignments.

---

## 1. HUM-08 — operational owners

H-120 P0-16/P0-17: named operational RACI required before Production **operation**. HUM-08 named RACI: Privacy/DPO = Wensley Shirima; **other personnel = NOT ESTABLISHED**.

| Responsibility | Required owner | Current state | Evidence required | Decision/Action |
| --- | --- | --- | --- | --- |
| Application operations | Titled person or role for API/web runtime | OWNER NOT YET ASSIGNED | Name/title; date; source (HR/Owner minute) | Session 1 assignment |
| Infrastructure | Titled person or role for host/network | OWNER NOT YET ASSIGNED | Same | Session 1; after architecture still unselected |
| Database/DBA | Titled DBA or equivalent | OWNER NOT YET ASSIGNED | Same | Session 1; no Production catalog exists |
| Security | Titled security owner | OWNER NOT YET ASSIGNED | Same | Session 1 |
| Identity/Access | Titled identity owner | OWNER NOT YET ASSIGNED | Same; HUM-05 still NOT ESTABLISHED | Session 1 + Session 3 inventory |
| Backup/Restore | Titled backup owner | OWNER NOT YET ASSIGNED | Same | Session 1; product unselected |
| Incident response | Titled IR owner | OWNER NOT YET ASSIGNED (HUM-12: IR ownership **NOT YET NAMED**; E-15 draft ≠ Production IR) | Same | Session 1 |
| DNS/Certificates | Titled DNS/cert owner | OWNER NOT YET ASSIGNED | Same | Session 1; no Production DNS |
| Privacy/DPO | Privacy/DPO function | **Designated:** Wensley Shirima (HUM-03). **Appointment evidence:** REQUIRED / TO BE RECORDED. E1-C01 combined Legal/DPO **NOT COMPLETE**. Thomas Nguluma remains counsel only | Appointment letter / board designation **or** written “not required” determination with legal basis (E-03). Do not invent | Session 1 + Session 2: record evidence; do not re-appoint via this pack |
| On-call | Coverage overlapping commercial RTO window (EAT) | OWNER NOT YET ASSIGNED — **no roster invented** | Named primary/backup; hours; escalation | Session 1; do not invent names |

### Session 1 recording card (Owner fills)

Copy one row per responsibility. Leave unused.

| Field | Record here |
| --- | --- |
| Responsibility | |
| Person / role | |
| Primary / backup | |
| Escalation route | |
| Evidence / source | |
| Date of assignment | |
| Assigner | Owner / POA |

On-call roster: **do not invent**. If no person is assigned, record `OWNER NOT YET ASSIGNED` and date of that statement.

---

## 2. E-01 / E-02 / E-03 artefact collection

H-120 P0-18. Do not interpret legal sufficiency. Do not mark complete without the artefact.

| Artefact | Required? | Current evidence | Missing evidence | Owner/source | Production-blocking? |
| --- | --- | --- | --- | --- | --- |
| **E-01** registry / incorporation extract (or equivalent authoritative corporate document) | Yes — to verify legal entity | Company-provided name **Makundi Serengeti Experience DMC** (COMPANY-PROVIDED FACT, 2026-09-16). Seed `Serengeti Experience DMC Ltd` is application-derived **not** verified. Receipt: **NO AUTHORITATIVE DOCUMENT** | Certificate/extract; registration number; incorporation date; registered office — **as printed**, not invented | Company secretary / Legal (E01-A1..A5 OPEN) | **Yes** (GAP-LEG-01) |
| **E-01** human Legal confirmation that documents support LA-01 Tanzania establishment | Yes after extract exists | Counsel attestation is **not** E-01 evidence | Legal review of the extract | Qualified Legal | **Yes** once processing Production personal data is contemplated |
| **E-02** SEDMC-specific PDPC status artefact | Yes **if** PDPA duty applies (L-01: confirm actual status before Production personal-data processing) | Public process page EA-02 is **not** SEDMC registration. **NO SEDMC-SPECIFIC PDPC DOCUMENT**. Status is **NOT VERIFIED** — neither registered nor unregistered is claimed | Certificate/number/correspondence **of this company**, or documented absence/not-required determination **in those exact words** | PDPC and/or SEDMC Legal files | **Yes if required/unknown** (GAP-LEG-02) |
| **E-03** DPO appointment artefact **or** written not-required determination | Yes to complete combined Legal/DPO | HUM-03 **designation** Wensley Shirima. **No** appointment letter in repo. P1 role key `dpo` is **not** appointment. Counsel is not DPO | Appointment letter / board resolution / regulator notification **if applicable**; keep trigger analysis separate from appointment | Company + Legal; do not appoint in git | **Yes if required**; E1 incomplete without it (GAP-LEG-03/04) |

### Collection checklist (Owner/company)

**E-01**

- [ ] Locate current extract from competent registry or corporate files
- [ ] Record **exact** legal name as printed (reconcile later to **Makundi Serengeti Experience DMC**; do not equate to seed `Ltd`)
- [ ] Record number, date, office **only if printed**
- [ ] File copy location (not in this git pack as a fake PDF)
- [ ] Legal reviewer confirms sufficiency for LA-01 / L-04

**E-02**

- [ ] Search Legal files and PDPC for **this company**
- [ ] If found: transcribe issuer, date, entity name, number **as printed**
- [ ] If a written “not required” / “not registered” determination exists: file **exact wording**
- [ ] Do **not** treat silence as either registered or unregistered
- [ ] Do **not** treat https://pdpc.go.tz/services/registration/ as company registration

**E-03**

- [ ] Keep five questions separate: appointed? legally triggered? company decided to appoint? named individual? regulator notified?
- [ ] If appointment exists: file letter/resolution (name, date, reporting line)
- [ ] If not required: file the determination and legal basis
- [ ] Do **not** convert HUM-03 designation into appointment evidence by this session
- [ ] Do **not** name Thomas Nguluma as DPO

---

## 3. Corporate directory / ADR-0013 inventory

**Session 3 inventories the existing corporate environment only.**

```text
Do NOT select an IdP.
Do NOT recommend an IdP.
Do NOT create IdP configuration.
Do NOT create credentials.
ADR-0013 remains proposed — blocked for Production.
DP-0013 remains OPEN — recommended option: Not selected — confirm corporate directory first.
HUM-05 current corporate IdP: NOT ESTABLISHED.
```

Protocol direction (already decided): OIDC (ADR-0005). **Product** is not decided.

### Inventory template (Owner/IT fills)

| Field | Record (existing facts only) | If unknown |
| --- | --- | --- |
| Corporate directory currently used | | `NOT ESTABLISHED` |
| Directory type (e.g. Google Workspace, Microsoft 365/Entra, on-prem AD, none, other — **as used today**) | | `NOT ESTABLISHED` |
| Administrative ownership | | `OWNER NOT YET ASSIGNED` |
| Existing authentication method | | `NOT ESTABLISHED` |
| MFA capability (exists in current directory? in use for admin?) | | `NOT ESTABLISHED` |
| User lifecycle (joiner/mover/leaver as actually practised) | | `NOT ESTABLISHED` |
| Group/role management | | `NOT ESTABLISHED` |
| SSO capability | | `NOT ESTABLISHED` |
| Relevant security policies (name/location of existing policy, not a new policy) | | `NOT ESTABLISHED` |
| Contact / owner | | `OWNER NOT YET ASSIGNED` |
| Evidence source (admin console screenshot policy, IT attestation — **company files**, not git secrets) | | `NOT ESTABLISHED` |

**Outcome of Session 3 (Owner ticks one):**

- [ ] `CORPORATE DIRECTORY INVENTORY COMPLETE`
- [ ] `CORPORATE DIRECTORY INVENTORY INCOMPLETE` — missing fields: ________

Completing the inventory **does not** close ADR-0013 and **does not** select Microsoft Entra, Google Workspace, Keycloak, or any other product.

---

## 4. ADR-0006 hosting / region worksheet

**Required current state:**

```text
ADR-0006 OPEN
```

Status in `docs/adr/ADR-0006-hosting-and-residency.md`: **proposed — blocked for Production**. Owner formal decision: **not approved**. Tanzania = **PREFERRED BASELINE / DESIGN PREFERENCE ONLY**, not approval (GAP-RES-01, LA-06).

### Evidence already available

- Portable application assumption (Fastify + Next compiled start + PostgreSQL)
- Fail-closed production-like configuration (H-120)
- Legal Counsel LA-01–LA-17 adopted (positions, not hosting selection)
- E1-A class types evaluated historically; **no class selected**
- Company BCM sequence S2 **Owner-confirmed** (HUM-07) — **not** a hosting product
- H-117 isolated UAT is **not** Production hosting evidence

### Evidence still required

- Named host/region after legal/residency assessment
- Production data-flow map (L-05 deferred)
- Transfer register (E-09 empty)
- Provider/facility evidence if a third party is later in scope
- Encryption-at-rest/in-transit **Production** verification (GAP-SEU-02)
- DR site if used (GAP-DR-01 unselected)

### Decision that remains open

Where Production (and any future Production-like hosting) will **run**, where **data resides**, where **backups/DR** live. Candidates in ADR-0006 (African cloud / EU + transfers / colo-hybrid) are **unevaluated selections**, not a ranking.

**Owner must not be asked in Session 4 to pick a provider.** Session 4 records what evidence is still missing and that the decision stays open.

| Session 4 field | Owner record |
| --- | --- |
| Confirm ADR-0006 remains OPEN | Yes / No (must remain Yes unless a **separate** authorized approval exists — **none found**) |
| Additional evidence commissioned | |
| Date | |

Do **not** rank options. Do **not** recommend a provider. Do **not** close ADR-0006.

---

## 5. DP-0006 worksheet

**Required current state:**

```text
DP-0006 OPEN
```

File: `docs/decisions/DP-0006-hosting-data-residency.md`

| Item | Record |
| --- | --- |
| Current status | **OPEN — for formal human approval before UAT/Production infrastructure** |
| Unresolved decision | Where Production/UAT run; data residence; backup/DR copies |
| Options A–D | Sketched only (African public cloud / EU + safeguards / hybrid / colo TZ/KE) |
| Recommended option in the paper | **Not selected — awaiting business, legal, and IT input** |
| Decision owner | Owner (human approval). **Not Cursor** |
| Dependencies | ADR-0006 evidence; Legal residency; E1 not approved |
| Gate | UAT/Production hosting must not be finalized until this paper is approved and ADR-0006 updated |
| Consequences of leaving it open | **Correct and required** until evidence exists. Forbids locking Production Terraform/K8s. Production grant cannot proceed (H120-P0-04) |

Do **not** select the “recommended option” (there is none selected). Do **not** close DP-0006.

| Session 4 field | Owner record |
| --- | --- |
| Confirm DP-0006 remains OPEN | Yes / No (must remain Yes unless separate approval exists — **none found**) |
| Date | |

---

## 6. Production infrastructure dependency list

Do not choose products. Do not create accounts. Do not provision.

| Dependency | Decision required? | Infrastructure required? | Credential required? | Evidence required before Production grant? |
| --- | --- | --- | --- | --- |
| Hosting | Yes (ADR-0006/DP-0006) | Yes | Yes (later) | Yes |
| Region/residency | Yes (not Tanzania preference alone) | Yes | No | Yes |
| PostgreSQL | Yes (new catalog, never `eos*`) | Yes | Yes | Yes |
| Secrets/KMS | Yes (ADR-0012 OPEN) | Yes | Yes | Yes |
| IdP | Yes (ADR-0013) **after** inventory | Yes | Yes | Yes |
| MFA | Yes (IdP/policy; no app MFA) | Via IdP | Via IdP | Yes |
| HTTPS/certificates | After hostname | Yes | Cert material in secrets | Yes |
| DNS | Yes | Yes | Registrar | Yes |
| DB TLS | Contract exists (`require`) | Yes | Certs | Yes |
| CORS origin | After public HTTPS origin | Config | No | Yes |
| Event transport | Yes (NATS product unselected) | Yes | `EOS_NATS_URL` in KMS not git | Yes |
| Email | Yes (subprocessor/DPA) | Yes | SMTP/SES secrets | Yes |
| Backup | Yes (product unselected) | Yes | Backup keys | Yes |
| Restore | After backup product | Yes | Same | Yes (restore test) |
| Observability | Yes (sink unselected) | Yes | Sink credentials | Yes |
| Process supervision | After host (not `npx tsx`) | Yes | Host access | Yes |

---

## 7. Owner decision register

Decisions Cursor **cannot** resolve.

| Decision ID | Decision required | Why required | Evidence needed | Decision owner | Current status | Downstream |
| --- | --- | --- | --- | --- | --- | --- |
| H121-D-01 | Hosting / region | No Production place to run | ADR-0006 pack | Owner + Legal | OPEN | All infra P0s |
| H121-D-02 | Hosting / data residency (DP-0006) | Residency + backup copy location | DP-0006 pack | Owner + Legal | OPEN | DB, backup, L-05/L-17 |
| H121-D-03 | Production authorization **timing** | Grant is separate from UAT acceptance | This pack + closed P0 evidence | Owner/POA | NOT AUTHORIZED | Deploy/migrate |
| H121-D-04 | Operational ownership (HUM-08 except DPO designation) | No accountable operators | Session 1 cards | Owner | NOT ESTABLISHED | Ops P0-16 |
| H121-D-05 | On-call ownership | Commercial RTO window coverage | Roster — do not invent | Owner | NOT ESTABLISHED | P0-17 |
| H121-D-06 | Privacy/DPO **appointment evidence** vs designation | Combined Legal/DPO incomplete | E-03 artefact | Owner + Legal | Designation yes; appointment evidence no | P0-18, E1 |
| H121-D-07 | Corporate identity **environment facts** (inventory) | ADR-0013 cannot be decided without HUM-05 | Session 3 template | Owner + IT | HUM-05 NOT ESTABLISHED | IdP/MFA |
| H121-D-08 | Production infrastructure ownership | Host/DBA/DNS untitled | Session 1 | Owner | NOT ESTABLISHED | Provisioning later |
| H121-D-09 | ADR-0012 secrets platform | Production-like fatal without real `EOS_TOKEN_SECRET`/KMS | After ADR-0006 | Owner | proposed — blocked UAT/Production | Secrets P0-07 |
| H121-D-10 | Whether overlay-only Rate Identity is the Production commercial contract | H-113 PARTIALLY DEFINED | Separate commercial grant | Owner | Unresolved live-proposal policy | Not a hosting P0; still governance-blocked |
| H121-D-11 | SoR cutover / H-80 / H-81 | Deploy ≠ adoption | Separate grants | Owner | H-80 ACTIVE; H-81 NOT STARTED; SoR unchanged | Must stay out of this session’s “select host” discussion |

Do not decide these on behalf of the Owner.

---

## 8. External evidence register

Only items already identified by H-119/H-120 and inspected E1-C / HUM records.

| Evidence ID | Evidence required | Source/owner | Current status | Blocks |
| --- | --- | --- | --- | --- |
| EV-E01 | Authoritative legal-entity extract | Company / registry / Legal | ABSENT (name string only) | GAP-LEG-01; Production personal-data processing |
| EV-E02 | SEDMC-specific PDPC status | PDPC / Legal files | NOT VERIFIED; no company artefact | GAP-LEG-02 |
| EV-E03 | DPO appointment or not-required determination | Company / Legal | Designation recorded; appointment artefact ABSENT | GAP-LEG-03/04; E1 |
| EV-HUM05 | Current corporate directory facts | Company IT | NOT ESTABLISHED | ADR-0013 inventory |
| EV-HUM08 | Named RACI except Privacy/DPO designation | Owner | Other personnel NOT ESTABLISHED | P0-16/17 |
| EV-HUM03-APPT | Appointment evidence for Wensley Shirima DPO designation | Company | REQUIRED / TO BE RECORDED | Combined Legal/DPO |
| EV-L05 | Production data-flow map | After topology | DEFERRED | GAP-RES-02 |
| EV-LEG05 | Vendor DPAs | After named provider | ABSENT | GAP-LEG-05 |
| EV-E12 | Privacy notice complete for publish | After entity/DPO/recipients | DRAFT unpublished | GAP-LEG-07 |
| EV-HOST | Hosting/residency approval artefacts | Owner + Legal | ADR-0006/DP-0006 OPEN | P0-02/03/04 |
| EV-BKP | Named backup product + restore test | After host | Lab only | P0-14/15 |

Do not invent further evidence IDs.

---

## 9. Production-readiness reconciliation

### Can H-121 close any H-120 P0?

No previously missed artefact was found that would close a P0.

```text
NO H-120 P0 IS CLOSED BY H-121 PREPARATION ALONE.
```

HUM-03 designation was **already** recorded before H-121; it does not close E-03 appointment evidence or Production authorization.

### What remains

```text
Production authorization: NOT AUTHORIZED
Production readiness: NOT READY
ADR-0006: OPEN
DP-0006: OPEN
H-80: ACTIVE
H-81: NOT STARTED
SoR unchanged
no ingestion
no booking
no KPI history
no revenue/profit
no FX
Rate Identity live-proposal policy unresolved
```

---

## 10. Owner session agenda

Practical order. Each session may be separate calendar events. **Do not merge Session 4 into a provider selection.**

### Session 1 — Ownership

- HUM-08 rows: application ops, infrastructure, DBA, security, identity, backup/restore, IR, DNS/certs, on-call
- Record Privacy/DPO designation (already: Wensley Shirima) and **separately** queue appointment evidence
- Confirm Patrick Makundi remains RFI sender / BCM confirmation **not** Production ops
- Confirm Thomas Nguluma remains Legal Counsel only
- Output: filled recording cards or explicit `OWNER NOT YET ASSIGNED` dated statements

### Session 2 — Company evidence

- E-01 extract collection
- E-02 PDPC company-specific status
- E-03 appointment vs not-required determination
- Do not publish E-12 privacy notice
- Do not invent Kenya/GDPR/UK GDPR conclusions (GAP-LEG-08 still fact-specific)

### Session 3 — Corporate identity inventory

- Fill §3 template from **existing** environment
- Tick COMPLETE or INCOMPLETE
- **Do not select ADR-0013 product**

### Session 4 — Hosting/residency evidence

- Confirm ADR-0006 OPEN
- Confirm DP-0006 OPEN
- List evidence still required (§4–§5)
- Decision still pending — **no ranking, no provider**

### Session 5 — Gate implications

**What can subsequently be closed** (only after artefacts actually exist):

- HUM-08 rows that were assigned with evidence
- E-01/E-02/E-03 **if** artefacts are filed and legally reviewed
- HUM-05 inventory completeness (still ≠ IdP selection)

**What remains infrastructure-blocked:**

- Host, PG catalog, DNS, TLS, backup product, NATS, email, observability, process supervisor, Production CORS origin

**What remains governance-blocked:**

- Production authorization grant
- ADR-0006 / DP-0006 / ADR-0012 / ADR-0013
- H-80 / H-81 / SoR cutover
- Rate Identity live-proposal policy; booking; KPI/revenue/profit/FX; ingestion

**What evidence is needed before Production authorization can even be considered:**

H-120 P0 list in full: grant + architecture + new catalog + secrets + IdP/MFA + HTTPS/DNS + backup/restore + ops roster + E1-C PRODUCTION-BLOCKING legal items + event/email products. UAT acceptance (H-119) is **necessary but not sufficient**.

---

## 11. Explicit non-actions

This increment does not: deploy; provision; create Production DB; migrate; select host/region/IdP/email/NATS/KMS; create DNS/certs/credentials; close ADR-0006, DP-0006, or E1-C blockers; assign fictional owners; invent on-call; invent legal artefacts; invent directory facts; alter commercial semantics; exit H-80; start H-81; cut over SoR; implement ingestion/booking/KPI/revenue/FX/Rate Identity live-proposal policy; change application code; commit; push.

---

## 12. Next human input after H-121

```text
Owner executes Sessions 1–3 first (ownership + E-01/E-02/E-03 collection routing + directory inventory).
Session 4 only confirms ADR-0006/DP-0006 remain OPEN and commissions missing evidence.
Do not start H-122 automatically.
Do not deploy.
Do not provision.
Do not select vendors.
```
