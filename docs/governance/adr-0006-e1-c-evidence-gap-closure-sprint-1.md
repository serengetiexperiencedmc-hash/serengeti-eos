# E1-C — Evidence Gap Closure Sprint 1

> **`GOVERNANCE / CONTROLLED ASSESSMENT`**  
> **`NO PROCUREMENT`**  
> **`NO FACILITY SELECTION`**  
> **`NO PRODUCTION AUTHORIZATION`**  
> **`HUM-CAP-01 = APPROVED — ASSESSMENT ONLY`**  
> **`CAP-GATE-01 = NOT COMPLETE`**  
> **`STAGE 1 = NOT APPROVED / NOT COMPLETE`**  
> **`ALL NEW PG EVIDENCE = DEV/TEST ONLY`**  
> **`Technical RTO = NOT DEMONSTRATED`** · **`Technical RPO = NOT DEMONSTRATED`**  
> **`Assessment authorization does not constitute Production authorization.`**  
> **`SEDMC is NOT Production Ready.`**

**Sprint date:** 2026-09-17.  
**Auditable timestamp:** **2026-09-17T18:05:11+03:00** (EAT; PostgreSQL measurement start).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Authorization:** [`adr-0006-e1-c-hum-cap-01-authorization-record.md`](adr-0006-e1-c-hum-cap-01-authorization-record.md) (unchanged).  
**Parent results:** [`adr-0006-e1-c-capacity-and-facility-assessment-results.md`](adr-0006-e1-c-capacity-and-facility-assessment-results.md).  
**Assessor:** repository documentation executor (this sprint).  
**Reviewer:** **NOT ESTABLISHED**.  
**Independent validation:** **NOT PERFORMED** — **HUMAN DECISION REQUIRED — INDEPENDENT VALIDATOR**.

This sprint **does not** rewrite historical HUM-CAP-01 observations. It records gap-closure attempts and follow-up evidence only.

**Not done this sprint:** procurement; supplier contact; RFI/RFQ; facility/hardware/cloud selection; Production infrastructure; application-code changes; migration execution; dump/restore harness execution; uncontrolled load testing; commit; push.

---

## 0. Pre-sprint state (unchanged historical facts)

| Item | Status at sprint start |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Working tree | DIRTY (pre-existing diffs preserved) |
| CAP-GATE-01 | **NOT COMPLETE** |
| `127.0.0.1:5432` (prior session) | **NOT LISTENING** |
| E1-B | **PAUSED** · frozen hashes unchanged |
| E1 | **NOT APPROVED / BLOCKED** |

---

## 1. Master gap register

Common fields unless a row overrides: reviewer **NOT ESTABLISHED**; independent validation **NOT PERFORMED**.

| ID | Current status (sprint start) | Evidence required | Permitted closure method | Prohibited action | Owner | Resulting assessment IDs | Dependency | Closure state (end of sprint) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| GAP-CAP-01 | **BUSINESS INPUT REQUIRED** | Authoritative expected/concurrent users, orgs/accounts, commercial/MICE users, document volumes | Cite existing owner-signed / approved business inputs only | Invent counts; treat planning targets as measured demand | Patrick Makundi (authorization). Census owner **NOT ESTABLISHED** | CAP-01, CAP-02 (count), CAP-06 (business volume) | HUM-CAP-01 | **OPEN — BUSINESS INPUT REQUIRED** |
| GAP-CAP-02 | **BUSINESS INPUT REQUIRED** | Approved growth assumption for capacity modelling | Cite explicit approved growth policy | Convert commercial targets into technical numbers without documented relationship | Same | CAP-07, PG-02, DOC-02 | GAP-CAP-01 | **OPEN — BUSINESS INPUT REQUIRED** |
| GAP-CAP-03 | **BUSINESS INPUT REQUIRED** | Peak-period calendar vs normal workload | Cite existing business calendar if recorded | Invent MICE seasonality numbers | Same | CAP-08, CAP-14 | GAP-CAP-01 | **OPEN — BUSINESS INPUT REQUIRED** |
| GAP-CAP-04 | **HUMAN DECISION REQUIRED** | Explicit approved headroom policy | Owner records HUM-CAP-16 | Infer a % from industry practice | Patrick Makundi | CAP-09, PG-04 | HUM-CAP-16 | **OPEN — HUMAN DECISION REQUIRED — HEADROOM** |
| GAP-PG-01 | **BLOCKED** (port not listening) | Reachable labelled disposable PostgreSQL using existing compose | Start existing `infra/compose/dev.yaml` **postgres** service only; no file changes; no migrate | Production PG; config edits; start redis/nats unless needed (not needed) | Not a named Production DBA — **NOT ESTABLISHED** | PG-01–PG-13 prerequisites | HUM-CAP-01; Docker present | **CLOSED FOR REACHABILITY — DEV/TEST ONLY** (`127.0.0.1:5432` listening after compose start) |
| GAP-PG-02 | **BLOCKED** / **EVIDENCE REQUIRED** | Idle labelled observations (version, size, connections, WAL settings) | Query running disposable instance; no load generation | Uncontrolled load; hardware BOM; treat as Production capacity | Same | PG-01, PG-03, PG-06 (defaults), PG-08 (idle), PG-10 (WAL settings) | GAP-PG-01 | **PARTIALLY CLOSED — DEV/TEST IDLE OBSERVATIONS ONLY** |
| GAP-RV-01 | **NOT ASSESSED** | Safe non-destructive dump/restore without code change and without forbidden migrate | Execute existing harness **only if** it does not require schema migrate or code change | Claim Production RTO/RPO; migrate application SoR; modify harness | Same | RV-01–RV-14, BKP-01, BKP-05–BKP-07, PG-09, PG-12 | GAP-PG-01 | **OPEN — RESTORE DRILL BLOCKED — IMPLEMENTATION CHANGE REQUIRED** |
| GAP-OPS-01 | **HUMAN DECISION REQUIRED** | Named operational ownership for infra/app/DB/backup/security/IR/on-call/escalation/change | Cite already-recorded names/roles only | Invent names; auto-assign | HUM-08 company — **OWNER NOT ESTABLISHED** except privacy/DPO designation | OPS-06, OPS-07, HUM-CAP-06 | HUM-08 | **OPEN — HUMAN DECISION REQUIRED — OPERATIONAL ROSTER** |
| GAP-FAC-01 | **EVIDENCE REQUIRED** | Site evidence for a legitimately accessible candidate | Use already-authorized site facts only | Select/rank/recommend a facility; supplier contact | HUM-CAP-02 later | FAC-01–FAC-24, NET-01 | Candidate site **NOT SELECTED** | **OPEN — EVIDENCE REQUIRED** |
| GAP-LEGAL-01 | Identification partial | Entity, PDPC, DPO appointment, PDPA, residency, occupancy, retention, IR | Reconcile existing Legal Counsel / owner records only | New legal conclusions; close unresolved items | Legal Counsel THOMAS NGULUMA (counsel only); DPO designation Wensley Shirima | FAC-17–FAC-19; E-01/E-02/E-03/E-13 | Combined Legal/DPO **INCOMPLETE** | **OPEN — LEGAL REVIEW REQUIRED** / **HUMAN DECISION REQUIRED** (item-dependent) |
| GAP-VAL-01 | Independent reviewer **NOT ESTABLISHED** | Named independent validator | Human names a reviewer | Invent a reviewer | **NOT ESTABLISHED** | CAP-GATE-01 condition (validation) | Human decision | **OPEN — HUMAN DECISION REQUIRED — INDEPENDENT VALIDATOR** |

---

## 2. Business workload inputs (GAP-CAP-01–03)

**Authoritative approved Production workload census:** **does not exist** in this repository.

Searched: capacity specification/results, deployment-readiness plan §5, owner BCM decision pack Priority 10, architecture decision package, E1-B questionnaire planning text, hosting capability evidence, stakeholder fact pack.

### 2.1 Documented planning assumptions — not approved business inputs

These are **business planning assumptions**, not technical measurements, not approved Production demand, and not a closed CAP-01/07/08.

| Topic | Documented value | Source | Date/source nature | Authority |
| --- | --- | --- | --- | --- |
| Expected users (Year 1 modelling) | **up to 500 users** | [`adr-0006-owner-business-bcm-decision-pack.md`](adr-0006-owner-business-bcm-decision-pack.md) Priority 10 | Owner BCM pack; planning targets requiring IT validation | **NOT APPROVED as capacity input** — labelled planning target |
| Concurrent users | **up to 200 concurrent users** | Same; also [`adr-0006-e1-b-provider-neutral-rfi-rfq.md`](adr-0006-e1-b-provider-neutral-rfi-rfq.md) | Planning assumptions only — not measured Production requirements | **NOT APPROVED as capacity input** |
| Growth | **approximately 30% annual** for modelling | Same BCM pack; architecture decision package 500/200/30% | IT validation required; not approved measured growth | **NOT APPROVED as capacity input** |
| Peak periods | **Not specified** in BCM authorization | BCM pack Priority 10 “Major seasonal peaks” | Explicitly not specified | **BUSINESS INPUT REQUIRED** |
| Organizations/accounts | **EVIDENCE NOT AVAILABLE** | No census located | — | **BUSINESS INPUT REQUIRED** |
| Commercial/MICE operational users | **EVIDENCE NOT AVAILABLE** as a distinct count | No census located | — | **BUSINESS INPUT REQUIRED** |
| Document volumes (business) | **EVIDENCE NOT AVAILABLE** | Dev/Test LocalFs 21/420 B is **not** a business volume | Prior assessment | **BUSINESS INPUT REQUIRED** |
| Current EOS users | **Not a measured figure** | BCM pack Priority 10 | Explicit | **BUSINESS INPUT REQUIRED** |

[`adr-0006-e1-c-sedmc-owned-infrastructure-deployment-readiness-plan.md`](adr-0006-e1-c-sedmc-owned-infrastructure-deployment-readiness-plan.md) §5 still records expected user population, concurrent users, growth, and peak workload as **BUSINESS INPUT REQUIRED**. That status is **not overridden**.

**Do not** treat 500/200/30% as closed CAP-01/CAP-07 numbers. No documented conversion from those planning targets to RPS, CPU, or disk exists.

**GAP-CAP-01, GAP-CAP-02, GAP-CAP-03 closure state:** **OPEN — BUSINESS INPUT REQUIRED**.

---

## 3. Headroom (GAP-CAP-04 / HUM-CAP-16)

Repository search found **no explicit approved headroom policy** (no owner-approved % above peak). The **30%** figure is a **growth modelling assumption**, not a capacity-headroom margin.

**HUMAN DECISION REQUIRED — HEADROOM.**  
No percentage chosen. No industry-practice inference.

---

## 4. Disposable PostgreSQL (GAP-PG-01)

### 4.1 Existing definition (inspected, not modified)

| Artefact | Fact |
| --- | --- |
| Compose | [`infra/compose/dev.yaml`](../../infra/compose/dev.yaml) — labelled isolated Development/Test; `postgres:16-alpine`; `POSTGRES_USER=eos`; `POSTGRES_PASSWORD=eos-dev-only`; `POSTGRES_DB=eos`; host port **5432** |
| Comment in compose | Schema applied by `npm run migrate -w @sedmc/db` (**not** docker-entrypoint) |
| `.env.example` | `EOS_DATABASE_URL=postgres://eos:eos-dev-only@127.0.0.1:5432/eos` |
| Redis / NATS in same file | **Not started** this sprint |
| Dockerfiles | **None** in repository (GAP-DEP-02 historically) |

Starting **only** the `postgres` service uses existing configuration, does not execute application migrations, and does not create Production infrastructure.

### 4.2 Start record (DEV/TEST ONLY)

| Field | Value |
| --- | --- |
| Command | `docker compose -f infra/compose/dev.yaml up -d postgres` |
| Image | `postgres:16-alpine` (already local; `cf78e76683b9`) |
| Container | `compose-postgres-1` |
| Created / started (UTC) | 2026-09-17T15:04:39Z |
| Volume | `compose_eos_pg` **created this sprint** (fresh empty data directory) |
| Redis/NATS | **Not started** |
| Application migrate | **Not executed** |
| Host port after start | `127.0.0.1:5432` **TcpTestSucceeded=True** |
| Publish observation | Compose publishes `0.0.0.0:5432` (existing file; **not changed**). Limitation: default bind is not loopback-only |

**GAP-PG-01 closure state:** **CLOSED FOR REACHABILITY — DEV/TEST ONLY.**  
A local/dev PostgreSQL instance **does not** establish Production PostgreSQL capacity.

---

## 5. PostgreSQL measurements (GAP-PG-02) — DEV/TEST ONLY

**Environment:** disposable compose PostgreSQL, database `eos`, **no application relations**.  
**Method:** `docker exec compose-postgres-1 psql` / `pg_isready`.  
**Measurement start:** 2026-09-17T18:05:11+03:00.  
**Load:** **none generated**. Uncontrolled load testing **not authorized**.  
**Reviewer:** **NOT ESTABLISHED**.  
**Validation:** **COLLECTED — NOT INDEPENDENTLY VALIDATED**.

| Observation | Raw result | Limitations |
| --- | --- | --- |
| Version | PostgreSQL **16.15** on x86_64-pc-linux-musl (Alpine 15.2.0 gcc) | Image default; not a Production pin approval |
| `eos` size | **7,699,479 bytes** (7519 kB) | Empty cluster + default catalogs; **no app schema** |
| Other DBs | `postgres` 7519 kB; `template0`/`template1` 7361 kB | Same |
| User relations | **none** (`\dt` empty; no non-catalog relations) | migrate() **not run** |
| Backends | **6** (`pg_stat_activity` count) | Includes this measurement session |
| Active | **1** active; **5** idle/other | Idle instance |
| `max_connections` | **100** (image default) | **Not** a Production pool design |
| App pool default | **10** (config inspection, prior) | Unchanged; not live pool telemetry |
| `shared_buffers` | **128MB** | Alpine default observation — **not** approved GUC |
| `work_mem` | **4MB** | Same |
| `wal_level` | **replica** | Default; PITR **not adopted** |
| `archive_mode` | **off**; `archive_command` disabled | No WAL archive |
| Recovery | `pg_is_in_recovery = f` | Primary only; HA **NOT SELECTED** |
| WAL file | `000000010000000000000001`; LSN `0/1925E08` | Idle |
| `pg_wal` on disk | **16.0M** | Idle cluster; not a Production WAL rate |
| Data directory | `/var/lib/postgresql/data` **45.9M** | Fresh volume |
| `xact_commit` / rollback | **32** / **0** on `eos` at measurement | Catalog/setup activity; **not** meaningful TPS |
| `EXPLAIN ANALYZE SELECT 1` | Planning **0.092 ms**; execution **0.050 ms** | Idle empty DB; **not** a Production SLA |
| Host `docker exec` SELECT 1 | n=10 avg **~191 ms** (min 124, max 512) | **Includes docker-exec overhead**; not engine latency |

**Not collected (would require load or migrate):** DB CPU under load, IOPS under backup+peak, application TPS, backup dump bytes, restore duration.

**GAP-PG-02 closure state:** **PARTIALLY CLOSED — DEV/TEST IDLE OBSERVATIONS ONLY.**  
Does **not** close Production sizing.

---

## 6. Restore drill (GAP-RV-01)

### 6.1 Harness inspection (no execution)

| Field | Fact |
| --- | --- |
| Module | `apps/api/src/persistence/disposable-pg-recovery.ts` |
| Entry | `runDisposablePgDumpRestoreDrill` |
| Safety vs Gate B | Refuses database name `eos_gateb` |
| Label | `DEV/TEST ONLY`; `productionRtoClaimed: false` |
| Methods | `pg_dump`/`pg_restore` if on PATH; else SQL-logical fallback |
| Host `pg_dump` this sprint | **NOT ON PATH** |
| Schema step | **`migrate()` is called** on a newly created disposable database (`seedMarker` / SQL-logical restore) |

This sprint’s standing prohibition: **do not execute application/database schema migrations** and **do not alter schema**.

The existing harness **cannot complete without `migrate()`**. No code/configuration change is authorized to provide a migrate-free path.

**RESTORE DRILL BLOCKED — IMPLEMENTATION CHANGE REQUIRED.**

Harness existence **≠** a restore test. **No PASS.**

| Field | Record |
| --- | --- |
| Start time | **N/A — not executed** |
| End time | **N/A** |
| Duration | **EVIDENCE NOT AVAILABLE** |
| Source / destination | **N/A** |
| Integrity validation | **NOT PERFORMED** |
| Environment | Disposable PG was reachable; drill **not run** |
| Reviewer | **NOT ESTABLISHED** |
| Production RTO/RPO | **NOT CLAIMED** · **NOT DEMONSTRATED** |

---

## 7. RV-01–RV-14 reconciliation

Business targets remain ≤3h / ≤4h / zero tolerated loss of **critical business data**. Technical RTO/RPO **NOT DEMONSTRATED**.

| ID | Status this sprint | Justification |
| --- | --- | --- |
| RV-01 | **EVIDENCE REQUIRED** | No dated portable dump artefact produced |
| RV-02 | **NOT APPLICABLE — JUSTIFICATION REQUIRED** | PITR **not adopted** (HUM-CAP-08 open). Observed Dev/Test `archive_mode=off` |
| RV-03 | **BLOCKED** | Restore not executed; harness requires migrate() |
| RV-04 | **BLOCKED** | Depends on RV-03; documents not restored |
| RV-05 | **BLOCKED** | No restored SoR |
| RV-06 | **BLOCKED** | No restored SoR served |
| RV-07 | **PARTIALLY EVIDENCED** | Dependency **list of unknowns** unchanged (IdP/DNS/store/email/secrets **UNSELECTED**) |
| RV-08 | **BLOCKED** | No clocked restore+bring-up. **Not** Production RTO |
| RV-09 | **BLOCKED** | No backup lag measurement. **Not** technical RPO=0 |
| RV-10 | **NOT APPLICABLE — JUSTIFICATION REQUIRED** | DR topology **UNSELECTED** |
| RV-11 | **NOT APPLICABLE — JUSTIFICATION REQUIRED** | Depends on RV-10 |
| RV-12 | **BLOCKED** | No backup integrity probe |
| RV-13 | **BLOCKED** | No application-level restore checks |
| RV-14 | **BLOCKED** | No RV run to packetize |

---

## 8. Operations roster (GAP-OPS-01)

Existing named humans (not auto-assigned as Production ops):

| Role | Recorded name | Source | Production ops? |
| --- | --- | --- | --- |
| Company owner / assessment authorizer | **Patrick Makundi** | HUM-CAP-01; owner formal decision | Owner ≠ named DBA/on-call |
| DPO (designation) | **Wensley Shirima** (IT Manager) | [`adr-0006-e1-c-dpo-owner-designation-record.md`](adr-0006-e1-c-dpo-owner-designation-record.md) | Privacy function; **not** a full ops roster |
| Legal Counsel | **THOMAS NGULUMA** | Legal Counsel attestation 15TH SEPTEMBER 2026, A.T.N | Counsel only — **not** DPO, **not** infra ops |
| E1-B named sender | **Patrick Makundi** | Owner formal decision HUM-11 | Sender **≠** Production ops |

HUM-08 named RACI: Privacy/DPO = Wensley Shirima. **Other personnel = NOT ESTABLISHED** ([`adr-0006-e1-owner-formal-decision-record.md`](adr-0006-e1-owner-formal-decision-record.md) §7).

| Function | Status |
| --- | --- |
| Infrastructure owner | **HUMAN DECISION REQUIRED — OPERATIONAL ROSTER** |
| Application operations | **HUMAN DECISION REQUIRED — OPERATIONAL ROSTER** |
| Database operations | **HUMAN DECISION REQUIRED — OPERATIONAL ROSTER** |
| Backup monitoring | **HUMAN DECISION REQUIRED — OPERATIONAL ROSTER** |
| Security operations | **HUMAN DECISION REQUIRED — OPERATIONAL ROSTER** |
| Incident response | **NOT YET NAMED** (HUM-12) |
| On-call | **HUMAN DECISION REQUIRED — OPERATIONAL ROSTER** |
| Escalation | **HUMAN DECISION REQUIRED — OPERATIONAL ROSTER** |
| Change management | **HUMAN DECISION REQUIRED — OPERATIONAL ROSTER** |

No names invented. No automatic assignment.

---

## 9. Facility evidence (GAP-FAC-01)

Inspected direction, requirements framework, deployment-readiness plan, and prior FAC-01–FAC-24 results.

Genuine site facts already in repository:

- Tanzanian facility = **preferred future location — NOT SELECTED**
- No occupancy document, survey, circuit, or insurance artefact for a named candidate

**FACILITY EVIDENCE CANNOT BE CLOSED WITHOUT A LEGITIMATELY ACCESSIBLE CANDIDATE SITE.**

FAC-01–FAC-24 remain **EVIDENCE REQUIRED**. No ranking. No recommendation. No supplier contact.

---

## 10. Legal / privacy reconciliation (GAP-LEGAL-01)

No new legal conclusions.

| Topic | Status |
| --- | --- |
| Legal entity verification | **LEGAL REVIEW REQUIRED** — E-01 **NOT VERIFIED** (company-provided name is not a registry extract) |
| PDPC | **LEGAL REVIEW REQUIRED** — **NOT ESTABLISHED** |
| Formal DPO appointment | **HUMAN DECISION REQUIRED** / **LEGAL REVIEW REQUIRED** — owner-designated Wensley Shirima; appointment evidence **REQUIRED** |
| PDPA applicability | **LEGAL REVIEW REQUIRED** |
| Data residency | **LEGAL REVIEW REQUIRED** — no selected site/architecture |
| Occupancy rights | **LEGAL REVIEW REQUIRED** — no candidate site |
| Retention | **HUMAN DECISION REQUIRED** — E-13 not closed |
| Incident response | **HUMAN DECISION REQUIRED** — IR owner **NOT YET NAMED** |

Combined Legal/DPO remains **INCOMPLETE**. Unresolved items are **not** closed.

---

## 11. Independent validation (GAP-VAL-01)

Independent reviewer: **NOT ESTABLISHED**.  
**HUMAN DECISION REQUIRED — INDEPENDENT VALIDATOR.**

Absence of independent validation remains visible in CAP-GATE-01.

---

## 12. CAP-GATE-01 recalculation

| Condition | After Sprint 1 |
| --- | --- |
| (1) applicable CAP items assessed | **PARTIALLY COMPLETE** — business/headroom/load still open |
| (2) PG evidence | **PARTIALLY COMPLETE** — idle Dev/Test only; restore/load still open |
| (3) document-storage evidence | Unchanged **PARTIALLY COMPLETE** |
| (4) network evidence | Unchanged **EVIDENCE REQUIRED** / facility-dependent |
| (5) backup/restore evidence | **BLOCKED** — drill not executed |
| (6) facility evidence | **EVIDENCE REQUIRED** |
| (7) legal/privacy dependencies identified | **YES** (identification); evidence **not** closed |
| (8) operational ownership identified | **NOT ESTABLISHED** (except DPO designation) |
| (9) TCO inputs identified | Unchanged (categories; **PRICE INPUT REQUIRED — FUTURE STAGE**) |
| (10) exceptions documented | **YES** (this file) |
| (11) technical vs business RTO/RPO distinguished | **YES** — technical **NOT DEMONSTRATED** |
| (12) human decisions recorded | **YES** — remaining list below |
| Independent validation | **NOT PERFORMED** |

**CAP-GATE-01 = NOT COMPLETE.**

Not **COMPLETE** (facility, validation, restore, business inputs, roster still open).  
Not forced **PARTIALLY COMPLETE** as the gate status: the gate remains incomplete even though GAP-PG-01 reachability closed.

**Stage 1 = NOT APPROVED / NOT COMPLETE.** No BOM, topology, facility ranking, vendor recommendation, or procurement plan produced.

---

## 13. Safety check

| Check | Result |
| --- | --- |
| Procurement / purchase / financial commitment | **Not performed** |
| Supplier procurement contact / RFI | **Not performed** |
| Facility / hardware / cloud selection | **Not performed** |
| Production deploy / migrate / Production data | **Not performed** |
| Application-code / migration file changes | **Not performed** |
| `migrate()` / schema change | **Not performed** |
| Restore harness | **Not executed** |
| Invented measurements / legal conclusions | **Not performed** |
| Unsupported RTO/RPO claims | **Not performed** |
| E1-B frozen hashes | **Unchanged** (verified this sprint) |
| E1-B | **PAUSED** |
| E1 | **NOT APPROVED / BLOCKED** |
| ADR-0006 / DP-0006 / Gate C | **OPEN** |
| Commit / push | **Not performed** |

**Assessment authorization does not constitute Production authorization.**  
**SEDMC is NOT Production Ready.**
