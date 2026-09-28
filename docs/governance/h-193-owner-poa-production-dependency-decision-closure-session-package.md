# H-193 — Owner/POA Production Dependency Decision Closure Session Package

> **GOVERNANCE / DECISION-SESSION PACKAGE ONLY.**  
> Presents H-192 Production dependencies so Owner/POA can ACCEPT, REJECT, DEFER, accept a CONDITIONAL DIRECTION, require legal/commercial/technical follow-up, or leave OPEN.  
> **Does not** make those decisions. **Does not** grant P01. **Does not** select providers.  
> H-169 through H-192 were **inspected and not rewritten**. H-173 session remains **PREPARED / NOT YET HELD**.

**Date / time:** 2026-09-23 (Africa/Nairobi).  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`  
**Branch:** `master`  
**Index:** empty  
**Porcelain at start of this increment:** 705  
**Application / schema / migration / infrastructure implementation:** **NONE**  
**GCP / secrets / DNS / TLS / IdP created:** **NONE**  
**H-181 requests sent:** **NONE**  
**Commit / push / reset / clean / stash / revert:** **NONE**

```text
H-193 STATUS = COMPLETE
SESSION = PREPARED / NOT HELD
P01 = NOT GRANTED
Production NOT READY
Production implementation NOT AUTHORIZED
H-81 = NOT STARTED
```

A prepared card is **not** an Owner/POA decision.

---

## 1. Repository baseline

| Item | Observed |
| --- | --- |
| Branch | `master` |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Index | empty |
| Porcelain | **705** (H-192 start 703; H-192 final 705) |
| Dirty worktree | **preserved** |

Primary input: `docs/governance/h-192-production-dependency-decision-and-evidence-closure-gate.md`.

---

## 2. How Owner/POA uses this package

For each card, record **exactly one** controlled disposition:

`ACCEPTED` · `REJECTED` · `DEFERRED — EVIDENCE REQUIRED` · `DEFERRED — LEGAL REVIEW` · `DEFERRED — COMMERCIAL REVIEW` · `DEFERRED — TECHNICAL REVIEW` · `CONDITIONAL DIRECTION` · `OPEN — OWNER DECISION REQUIRED` · `NOT APPLICABLE` · `NOT AUTHORIZED`

Rules:

* Do not infer a selection because an adapter exists (`ses`, `smtp`, `nats-jetstream`).
* Do not infer implementation authorization from architecture selection.
* Do not infer evidence receipt from H-181 authorization.
* Do not infer appointments from HUM-08 role titles.
* Do not treat Dev/Test PostgreSQL 16 as Production version.
* Do not treat `.example.invalid` / `.env.example` as Production hostname or secrets.

H-173 prepared P01–P13. This package **extends** that agenda with H-192 application-runtime dependencies. It does **not** replace H-173 and does **not** record that either session was held.

---

## 3. H-169 architecture — preserve; do not reopen

```text
ARCHITECTURE SELECTED     = YES (H-169; H-174 D02)
IMPLEMENTATION AUTHORIZED = NO
IMPLEMENTED               = NO
VALIDATED                 = NO
```

```text
Primary:     africa-south1 Johannesburg
Secondary:   europe-west1 Belgium
Database:    Cloud SQL Enterprise Plus
DR:          Cloud SQL Advanced DR with designated DR replica
Acceptance:  RTO ≤ 4 hours
             RPO ≤ 1 hour
```

N2 is **series pairing**, not a size. Active-passive application DR. Cloud SQL failover ≠ EOS failover. Replica **does not exist**. P19 **not performed**. Measured RTO/RPO **unavailable**.

---

## 4. Owner/POA decision register

H-192 IDs are cross-referenced. **Current disposition** uses only the taxonomy in §2. Where a prior increment already recorded a direction, that is stated. Blank session outcome is **not** filled in.

| ID | Decision | Current direction | Evidence required | Options/status | Consequence | Decision authority | Current disposition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D193-01 | P01 Production implementation grant | H-174 D01: implementation **deferred** | H-171 §5 (twenty conditions) | Grant later **or** continue deferral | Grant unlocks provisioning; absence blocks all Production acts | Owner/POA | **NOT AUTHORIZED** / **NOT GRANTED** |
| D193-02 | Preserve H-169 DR architecture | H-169 + H-174 D02 | Legal/commercial/implementation later — not for reopening now | Reaffirm **or** superseding increment | Reaffirm keeps design baseline | Owner/POA | **ACCEPTED** as architecture (H-174 D02); **not** Production-approved |
| D193-03 | GCP project / billing / ownership | H-158 hosting direction only | Named owners, billing policy, support; **no project invent** | Ownership model now; create project only after P01 | Without owners, no Production host | Owner/POA + commercial | **OPEN — OWNER DECISION REQUIRED** |
| D193-04 | Production IdP product | ADR-0013 proposed/blocked; local-password refused | Corporate directory, OIDC, admin model | Select later after evidence **or** defer | Blocks Production login | Owner/POA | **DEFERRED — EVIDENCE REQUIRED** |
| D193-05 | MFA product/capability | GAP-IDN-02; `mfaEnabled: false` | IdP MFA for Human actors | After D193-04 | Blocks Human Production sessions | Owner/POA | **DEFERRED — EVIDENCE REQUIRED** |
| D193-06 | Issuer / JWKS / audience | No env consumed (H-190) | Issuer URL, JWKS/discovery, audience — **not invented** | After D193-04 | Cannot verify federated tokens | Owner/POA after provider facts | **DEFERRED — EVIDENCE REQUIRED** |
| D193-07 | Secrets platform | ADR-0012 blocked; `env-dev` only; SM is **candidate not lock** | Vault vs cloud SM evaluation | Select **or** controlled deferral; **no credentials** | Blocks UAT+/Production secrets | Owner/POA | **OPEN — OWNER DECISION REQUIRED** |
| D193-08 | Secret-reference mechanism | Raw env names | URI scheme only after D193-07 | Keep env names until platform exists | Injection design | Owner/POA + engineering | **DEFERRED — TECHNICAL REVIEW** |
| D193-09 | Secret operational ownership | HUM-08 Security/Access + DB Owner roles | Named individuals | Appoint **or** leave UNAPPOINTED | No Production secret create | Owner/POA | **OPEN — OWNER DECISION REQUIRED**; specialists **UNAPPOINTED** |
| D193-10 | Google-managed vs CMEK | H-183 P06 Google-managed **default** | Legal/security if CMEK required | Keep default **or** reopen CMEK | No keys created under default | Owner/POA | **CONDITIONAL DIRECTION** (H-183); reopen only if required |
| D193-11 | Object-storage product | `DocumentStorage` port; local-fs fatal | API semantics, residency, IAM, durability | Select after evidence | Blocks Production documents | Owner/POA | **DEFERRED — EVIDENCE REQUIRED** |
| D193-12 | Object residency / bucket / IAM | None | Location vs H-158/H-168; identifier **not invented** | After D193-11 | Adapter cannot ship | Owner/POA + Legal | **DEFERRED — EVIDENCE REQUIRED** |
| D193-13 | NATS hoster/product | TLS+userinfo **contract**; Dev compose ≠ Production | TLS, auth, JetStream, HA, ownership | Select after evidence | Blocks Production/UAT events + drain | Owner/POA | **DEFERRED — EVIDENCE REQUIRED** |
| D193-14 | NATS endpoint / auth method / certs | Scheme+userinfo required; values OPEN | Endpoint, nkey vs password vs token, CA | After D193-13 | Cannot connect | Owner/POA after provider | **DEFERRED — EVIDENCE REQUIRED** |
| D193-15 | Email adapter SES vs SMTP | Both **supported**, neither selected | Capability, TLS, From, DPA | Choose adapter **or** defer | Blocks Production notify | Owner/POA | **OPEN — OWNER DECISION REQUIRED** |
| D193-16 | Email provider / sender identity | `.local` From refused | Vendor, From address, credentials — **not invented** | After D193-15 | Cannot send | Owner/POA + commercial | **DEFERRED — EVIDENCE REQUIRED** |
| D193-17 | Production PostgreSQL version | ADR-0003 PG 16 = **Development** SoR; lab 16.15 ≠ Production lock | EOS migrate 001–125 vs Plus-supported version | Defer until compatibility pack | Wrong version blocks migrate | Owner/POA after evidence | **DEFERRED — TECHNICAL REVIEW** |
| D193-18 | Sizing methodology / values | N2 **series** only; values unknown | Workload, connections, growth — **not invented** | Approve **framework** now; values later | Undersize/overspend | Owner/POA | Framework: **CONDITIONAL DIRECTION** (H-183 P04). Values: **DEFERRED — EVIDENCE REQUIRED** |
| D193-19 | PSA versus PSC | Private IP required; path **not chosen** | Topology, provider guidance, DR path | Select after design note | Write endpoint may be unavailable | Owner/POA | **DEFERRED — TECHNICAL REVIEW** |
| D193-20 | Production catalog name | Forbidden: `eos`, `eos_gateb`, UAT names | Empty authorized catalog after grant | Name later; not invented now | Separate migrate grant | Owner/POA + Database Owner | **DEFERRED — EVIDENCE REQUIRED** |
| D193-21 | Production hostname | `[PRODUCTION DNS NAME TO BE DETERMINED]` | Owner FQDN; ownership proof | Do not invent | Blocks CORS/`EOS_PUBLIC_ORIGIN` value | Owner/POA | **DEFERRED — EVIDENCE REQUIRED** |
| D193-22 | DNS ownership / certificate mechanism | P10 framework; app does not terminate TLS | Named DNS owner; public-cert approach | Appoint + mechanism later | No Production HTTPS | Owner/POA | DNS owner **UNAPPOINTED**. Cert: **OPEN — OWNER DECISION REQUIRED** |
| D193-23 | Database Owner | HUM-08 role defined | Named person + deputy | Appoint or UNAPPOINTED | Blocks migrate/backup/DR DB | Owner/POA | **UNAPPOINTED** |
| D193-24 | Security/Access Owner | Role defined; ≠ DPO | Named person + deputy | Appoint or UNAPPOINTED | Blocks IAM/IdP/secrets | Owner/POA | **UNAPPOINTED** |
| D193-25 | DR Coordinator + deputies | Role defined | Named coordinator + deputies | Appoint before P19 | Blocks DR test | Owner/POA | **UNAPPOINTED** |
| D193-26 | NOC / 24×7 supervision | **No NOC claimed**; escalate to PDM | Owner choice to staff or not | Staff **or** retain PDM escalation | Coverage expectation | Owner/POA | **OPEN — OWNER DECISION REQUIRED** |
| D193-27 | Belgium DR legal treatment | H-168 in principle; H-169 topology | DPA, terms, transfer, subprocessors | Legal review then accept/refuse | Blocks replica with Production data | Owner/POA + Legal | **DEFERRED — LEGAL REVIEW** |
| D193-28 | Commercial / quotations / procurement | Cost **structure** H-183 P12; **no amounts** | Quotes, calculator inputs — **not invented** | Informational request (H-181 D13) then approve | Blocks purchase | Owner/POA + commercial | **DEFERRED — COMMERCIAL REVIEW** |
| D193-29 | Container base image / registry | Node ≥20 contract; no Dockerfile | Image family, registry account | After orchestrator implementation planning | Blocks Production image | Owner/POA | **DEFERRED — EVIDENCE REQUIRED** |
| D193-30 | Logging sink vs startup contract | H-161 location **direction**; app stdout sufficient to **start** | Applied Logging in `africa-south1` | Operational sink after P01 | Not a start blocker | Owner/POA | Location **CONDITIONAL DIRECTION** (H-161). Product: **DEFERRED — EVIDENCE REQUIRED** |

---

## 5. Evidence vs decision matrix

| Item | Decision possible now? | External evidence required? | Legal required? | Commercial required? | Implementation required? | Runtime validation required? |
| --- | --- | --- | --- | --- | --- | --- |
| D193-01 P01 grant | **No** (H-171 §5 unsatisfied) | Yes (many EV-* still uncollected) | Yes (Belgium/DPA among §5) | Yes | No — grant **precedes** impl | No |
| D193-02 Architecture | **Yes — reaffirm only** | Not to preserve selection | Later for Belgium replica | Later for Plus purchase | Yes to **exist**, not to **select** | Yes to **measure**, not to **select** |
| D193-03 Project/billing owners | **Partial** (names/policy) | Yes for Google account artefacts | No for ownership model | Yes | Project create is later impl | No |
| D193-04 IdP | **No** | Yes (directory/OIDC) | Maybe (IdP DPA) | Maybe | After selection | Federated login |
| D193-05 MFA | **No** | Yes | No unless processor | Maybe | After IdP | MFA session |
| D193-06 Issuer/JWKS | **No** | Yes | No | No | After IdP | Token verify |
| D193-07 Secrets platform | **Direction possible; product not** | Yes for product confirmation | Maybe | Maybe | No credentials now | Rotation later |
| D193-08 Secret references | **Defer** | After D193-07 | No | No | Adapter later | Injection test |
| D193-09 Secret ownership | **Appointment possible** | Appointment evidence | No | No | After names | Access logs |
| D193-10 Encryption | **Already directed** | Only if CMEK reopened | If CMEK required | If CMEK | No keys now | Later |
| D193-11 Object store | **No** | Yes | Residency | Yes | Adapter after product | put/get |
| D193-12 Object residency/bucket | **No** | Yes | Yes | Yes | Identifiers after product | Round-trip |
| D193-13 NATS hoster | **No** | Yes | Maybe | Yes | After grant | health().ok |
| D193-14 NATS endpoint/auth | **No** | Yes | No | No | After hoster | TLS+auth |
| D193-15 SES vs SMTP | **Possible if Owner chooses without vendor** | Capability confirmation still needed to operate | If processor | Yes for vendor | After choice | Send test |
| D193-16 Email provider/From | **No** | Yes | DPA if processor | Yes | After vendor | Deliverability |
| D193-17 PG version | **No** | Yes (Plus + EOS migrate) | No | No | After selection | Migrate rehearsal |
| D193-18 Sizing values | **No** | Yes (workload) | No | Yes (cost) | After values | Not a substitute for RTO/RPO |
| D193-19 PSA vs PSC | **No** | Yes | No | No | After path | DR connectivity |
| D193-20 Catalog name | **Defer** | Target after grant | No | No | Separate migrate grant | Ledger 125 |
| D193-21 Hostname | **No** | Ownership/control | Maybe trademark | Maybe registrar | DNS later | HTTPS origin |
| D193-22 DNS/cert | **Appointment possible; mechanism deferred** | Cert issuer capability | No | Maybe | After hostname | Valid cert |
| D193-23–25 Appointments | **Yes — if Owner names people** | Appointment evidence | No | No | Before impl/P19 | Role drills |
| D193-26 NOC | **Yes** (staff or not) | Cost if staffing | No | If staffing | N/A | N/A |
| D193-27 Belgium legal | **No** | Provider terms | **Yes** | Related | Replica after accept | P19 later |
| D193-28 Commercial | **No** | Quotes | Related | **Yes** | Purchase after approve | N/A |
| D193-29 Container image | **No** | Registry/image family | No | Yes | After P01 | Image runtime |
| D193-30 Log sink product | **No** (location already directed) | Sink product | Retention | Yes | After P01 | Alert/log location |

---

## 6. Decision cards

Session outcome on each card remains `PENDING OWNER/POA DECISION` unless a **prior governed record** already set the disposition (cited).

### D193-01 — P01 Production implementation grant

**Decision:** Whether to grant Production implementation authorization.  
**Current state:** H-171 defined §5; H-174 D01 **deferred**; grant **NOT GRANTED**.  
**Evidence available:** Architecture selected (H-169); application fail-closed contracts (H-187–H-191); HUM-08 **roles** (H-183).  
**Evidence missing:** H-171 §5 items 1–20 (project, version, sizing, connectivity, IdP/MFA, applied backup/PITR, legal, cost, HUM-08 **individuals**, runbooks, etc.).  
**Choices:** Continue **NOT AUTHORIZED**; or grant later in a dedicated increment **after** §5.  
**Consequences:** Grant would unlock Gate D. Current state blocks all Production provisioning.  
**Required follow-up:** Gates A–B, then revisit H-171.  
**Decision:** `NOT GRANTED` (existing). Session may only **reaffirm deferral** or **refuse to grant**. H-193 does **not** grant P01.

### D193-02 — Preserve H-169 architecture

**Decision:** Whether the selected future architecture remains the design baseline.  
**Current state:** H-169 SELECTED; H-174 D02 preserve.  
**Evidence available:** H-167 assessment; H-168 in-principle exception; Google docs dated in H-169 (capability, not EOS RTO/RPO).  
**Evidence missing:** Implementation, legal acceptance of Belgium replica, measured RTO/RPO.  
**Choices:** Reaffirm; or supersede in a **new** increment (do not silently reopen here).  
**Consequences:** Reaffirm avoids redesign churn. Does not create a replica.  
**Required follow-up:** None to keep selection; Gates D–G to implement/validate.  
**Decision:** `ACCEPTED` as architecture (H-174 D02). `IMPLEMENTATION AUTHORIZED` remains **NO**.

### D193-03 — GCP project / billing / ownership

**Decision:** Named ownership/billing/support **model** (not project IDs).  
**Current state:** H-158 direction; no project (H-192 C2).  
**Evidence available:** Hosting direction only.  
**Evidence missing:** Google account artefacts, billing account, support tier.  
**Choices:** Record owners/policy now; create project only after P01.  
**Consequences:** Model can be prepared; live project is implementation.  
**Required follow-up:** Commercial + H-181 D02 **if sent** (currently unsent).  
**Decision:** `PENDING OWNER/POA DECISION` / presently `OPEN — OWNER DECISION REQUIRED`.

### D193-04 — Production IdP product

**Decision:** Which OIDC IdP (if any) will map `{issuer, subject}` to EOS principals.  
**Current state:** ADR-0013 OPEN; `local-password-dev` fatal in Production-like.  
**Evidence available:** Port `authenticateFederated`; fail-closed tests. HUM-05 directory **NOT ESTABLISHED**.  
**Evidence missing:** Corporate IdP facts, MFA, admin model, DPA.  
**Choices:** Defer; commission directory evidence; later select. **Do not pick Entra/Google/Keycloak here.**  
**Consequences:** Selection without evidence would invent a tenant.  
**Required follow-up:** External identity evidence then ADR-0013.  
**Decision:** `DEFERRED — EVIDENCE REQUIRED`.

### D193-05 — MFA product/capability

**Decision:** How Human MFA is enforced (at IdP, not app-only — H-183 P08).  
**Current state:** `mfaEnabled: false`; named in identity fatal.  
**Evidence available:** Requirement only.  
**Evidence missing:** IdP MFA capability evidence.  
**Choices:** Defer until D193-04.  
**Consequences:** Production Human login remains forbidden.  
**Required follow-up:** After IdP evidence.  
**Decision:** `DEFERRED — EVIDENCE REQUIRED`.

### D193-06 — Issuer / JWKS / audience

**Decision:** Production token-verification configuration values.  
**Current state:** No OIDC env vars (none invented). App tokens are HMAC `EOS_TOKEN_SECRET` today.  
**Evidence available:** Contract that a future IdP must supply issuer/JWKS/audience.  
**Evidence missing:** Actual URLs.  
**Choices:** Do not invent URLs.  
**Consequences:** Federated verify cannot be implemented with fake issuers.  
**Required follow-up:** Provider discovery documents after D193-04.  
**Decision:** `DEFERRED — EVIDENCE REQUIRED`.

### D193-07 — Secrets platform

**Decision:** Production secret store (ADR-0012).  
**Current state:** `env-dev`; H-183 design; Secret Manager **candidate not selected**.  
**Evidence available:** Secret **classes** S1–S5 (H-183); rotation/ownership design.  
**Evidence missing:** Product evaluation, IAM, regional confirmation.  
**Choices:** Defer; later Vault **or** cloud SM **or** other — not chosen here.  
**Consequences:** No Production secrets may be created.  
**Required follow-up:** Evaluation pack; **no credentials**.  
**Decision:** `PENDING OWNER/POA DECISION` / presently `OPEN — OWNER DECISION REQUIRED`.

### D193-08 — Secret-reference mechanism

**Decision:** Whether runtime keeps env-name references or moves to platform URIs.  
**Current state:** `SecretsProvider.get(reference)` = `process.env[name]`.  
**Evidence available:** H-190/H-191 contract.  
**Evidence missing:** Selected platform URI scheme.  
**Choices:** Keep env names until D193-07; then implement adapter.  
**Consequences:** Inventing URIs now would be unimplemented config.  
**Required follow-up:** After platform selection.  
**Decision:** `DEFERRED — TECHNICAL REVIEW`.

### D193-09 — Secret operational ownership

**Decision:** Who owns rotation and access.  
**Current state:** Roles: Security/Access Owner; Database Owner for DB secrets. Individuals **UNAPPOINTED**.  
**Evidence available:** H-183 RACI. Named: PDM (not this specialist role); DPO ≠ GCP admin.  
**Evidence missing:** Named specialists + deputies.  
**Choices:** Appoint real people **or** leave UNAPPOINTED. Do not invent names.  
**Consequences:** Secret create blocked without owners.  
**Required follow-up:** Owner appointments.  
**Decision:** `OPEN — OWNER DECISION REQUIRED`; **UNAPPOINTED**.

### D193-10 — Google-managed encryption vs CMEK

**Decision:** Whether to keep H-183 P06 or reopen CMEK.  
**Current state:** Google-managed **default**; no keys.  
**Evidence available:** H-159 CMEK not mandatory; H-183 P06.  
**Evidence missing:** Legal/security requirement **for CMEK** (none on file).  
**Choices:** Reaffirm default; reopen **only if** later required.  
**Consequences:** Default avoids key create. CMEK would need `africa-south1` key location evidence.  
**Required follow-up:** None unless legal/security raises CMEK.  
**Decision:** `CONDITIONAL DIRECTION` (H-183 P06). Session may **reaffirm**.

### D193-11 — Object-storage product

**Decision:** Product implementing `put/get/exists/stat/delete`.  
**Current state:** local-fs Dev/Test; Production fatal including unimplemented future.  
**Evidence available:** Port + fail-closed tests.  
**Evidence missing:** Product, residency, IAM, durability, adapter.  
**Choices:** Defer; do not assume GCS because GCP hosting is directed.  
**Consequences:** Architecture GCP ≠ selected object API.  
**Required follow-up:** Provider evidence then adapter **after** P01.  
**Decision:** `DEFERRED — EVIDENCE REQUIRED`.

### D193-12 — Object residency / bucket / IAM

**Decision:** Where bytes live; identifier; access model.  
**Current state:** No bucket. Must respect Johannesburg primary + Belgium **DR exception** if bytes replicate.  
**Evidence available:** H-158/H-168/H-169 residency **framework**.  
**Evidence missing:** Product, bucket name, IAM.  
**Choices:** Do not invent names/regions beyond architecture **constraints**.  
**Consequences:** Adapter implementation blocked.  
**Required follow-up:** After D193-11 + legal if cross-region.  
**Decision:** `DEFERRED — EVIDENCE REQUIRED`.

### D193-13 — NATS hoster/product

**Decision:** Who hosts Production JetStream.  
**Current state:** Contract: live NATS, TLS URL, userinfo, no in-memory/stub. Dev compose NATS is not Production.  
**Evidence available:** H-188/H-190/H-191 tests.  
**Evidence missing:** Hoster, HA, commercial terms.  
**Choices:** Defer. Do not select Synadia/GCP/self-host here.  
**Consequences:** Production/UAT cannot drain outbox.  
**Required follow-up:** Commercial + capability evidence.  
**Decision:** `DEFERRED — EVIDENCE REQUIRED`.

### D193-14 — NATS endpoint / authentication / TLS certs

**Decision:** Actual URL, credential type, trust bundle.  
**Current state:** Values OPEN; loopback/plaintext refused. Logs redact userinfo.  
**Evidence available:** Contract only.  
**Evidence missing:** Endpoint, nkey vs password vs token, CA.  
**Choices:** Do not invent endpoints.  
**Consequences:** `nats.connect` cannot run in Production.  
**Required follow-up:** After D193-13.  
**Decision:** `DEFERRED — EVIDENCE REQUIRED`.

### D193-15 — Email adapter (SES versus SMTP)

**Decision:** Which **supported** adapter Production will use.  
**Current state:** Both implemented; neither selected; stubs refused.  
**Evidence available:** H-189/H-190 resolver + SMTP TLS rule.  
**Evidence missing:** Vendor, From, DPA, region (if SES).  
**Choices:** Owner may choose adapter **in principle** or defer until vendor evidence. Choosing adapter ≠ choosing AWS account or SMTP host.  
**Consequences:** Startup still fatal until remaining email fatals clear **and** other Production deps exist.  
**Required follow-up:** D193-16 if adapter chosen.  
**Decision:** `PENDING OWNER/POA DECISION` / presently `OPEN — OWNER DECISION REQUIRED`.

### D193-16 — Email provider / sender identity

**Decision:** Vendor and Production From identity.  
**Current state:** Placeholders/`.local` refused.  
**Evidence available:** None received.  
**Evidence missing:** Provider, From, credentials, DPA.  
**Choices:** Defer. Do not invent `noreply@…`.  
**Consequences:** Cannot send Production mail.  
**Required follow-up:** Commercial + legal if processor.  
**Decision:** `DEFERRED — EVIDENCE REQUIRED`.

### D193-17 — Production PostgreSQL version

**Decision:** Cloud SQL major/minor for Production.  
**Current state:** Dev ADR-0003 = PG 16; disposable lab 16.15; Plus docs 12–18 are **not** EOS lock.  
**Evidence available:** Dev/Test migrate 001–125 on 16-class catalogs (H-185/H-186 rehearsals — **not** Production).  
**Evidence missing:** Named Cloud SQL version compatibility pack (EV-T01).  
**Choices:** Do **not** select 16 because Dev used 16.  
**Consequences:** Premature lock risks migrate/SoR breakage.  
**Required follow-up:** Technical evidence then Owner select.  
**Decision:** `DEFERRED — TECHNICAL REVIEW`.

### D193-18 — Sizing methodology / values

**Decision:** (a) accept sizing **framework**; (b) set vCPU/RAM/disk.  
**Current state:** H-183 P04 framework; N2 series; **values unknown**.  
**Evidence available:** RTO/RPO **requirements** (not capacity proof).  
**Evidence missing:** Concurrent users, DB size, peak, Cloud Run concurrency.  
**Choices:** Reaffirm framework; **do not invent numbers**.  
**Consequences:** Instance create blocked without values **after** P01.  
**Required follow-up:** Workload pack + commercial.  
**Decision:** Framework `CONDITIONAL DIRECTION`. Values `DEFERRED — EVIDENCE REQUIRED`.

### D193-19 — PSA versus PSC

**Decision:** Private connectivity path.  
**Current state:** **NOT SELECTED**. Write endpoint needs Plus + private IP.  
**Evidence available:** Distinction recorded (H-169/H-183).  
**Evidence missing:** Topology design, DR-region path, Cloud Run connector.  
**Choices:** Do not silent-default PSA or PSC.  
**Consequences:** Replica/write-endpoint design incomplete.  
**Required follow-up:** Connectivity design note.  
**Decision:** `DEFERRED — TECHNICAL REVIEW`.

### D193-20 — Production catalog name

**Decision:** Name of the authorized empty Production database.  
**Current state:** `eos` / `eos_gateb` / listed UAT names **forbidden** as Production.  
**Evidence available:** Migrate-guard + H-184 forbidden list.  
**Evidence missing:** Production catalog identity after project exists.  
**Choices:** Do not invent a name now.  
**Consequences:** Separate migrate grant still required (Gate E).  
**Required follow-up:** After C2 + P01.  
**Decision:** `DEFERRED — EVIDENCE REQUIRED`.

### D193-21 — Production hostname

**Decision:** Public HTTPS origin FQDN.  
**Current state:** `EOS_PUBLIC_ORIGIN` contract CLOSED; **value OPEN**.  
**Evidence available:** CORS/https/non-loopback/non-wildcard tests.  
**Evidence missing:** Actual hostname, DNS control.  
**Choices:** Do not use `app.example.invalid`.  
**Consequences:** Production CORS cannot be valued.  
**Required follow-up:** Owner naming + H6 evidence.  
**Decision:** `DEFERRED — EVIDENCE REQUIRED`.

### D193-22 — DNS ownership / certificate mechanism

**Decision:** Who operates DNS; how public TLS is issued.  
**Current state:** P10 framework; process does not terminate TLS.  
**Evidence available:** Role title exists.  
**Evidence missing:** Named DNS owner; ACME vs other — not selected.  
**Choices:** Appoint; defer mechanism until hostname exists.  
**Consequences:** No Production HTTPS.  
**Required follow-up:** After D193-21.  
**Decision:** DNS **UNAPPOINTED**. Mechanism `OPEN — OWNER DECISION REQUIRED`.

### D193-23 — Database Owner

**Decision:** Appoint Database Owner (+ deputy).  
**Current state:** Role defined. **UNAPPOINTED**.  
**Evidence available:** H-183 HUM-08 table.  
**Evidence missing:** Named individual. PDM is **not** automatically this role.  
**Choices:** Appoint a real person **or** remain UNAPPOINTED.  
**Consequences:** Backup/migrate/DR DB acts blocked.  
**Required follow-up:** Appointment evidence.  
**Decision:** `UNAPPOINTED`.

### D193-24 — Security/Access Owner

**Decision:** Appoint Security/Access Owner for IAM/MFA/secrets (**not** DPO).  
**Current state:** **UNAPPOINTED**. Wensley Shirima = DPO designation; **not** GCP admin.  
**Evidence available:** H-125 OA-03; H-183.  
**Evidence missing:** Named Security/Access Owner.  
**Choices:** Appoint or UNAPPOINTED.  
**Consequences:** Production IAM/IdP blocked.  
**Required follow-up:** Appointment.  
**Decision:** `UNAPPOINTED`.

### D193-25 — DR Coordinator and deputies

**Decision:** Appoint DR Coordinator and deputies.  
**Current state:** Role defined; P19 blocked. **UNAPPOINTED**.  
**Evidence available:** H-182 procedure (unexecuted).  
**Evidence missing:** Names.  
**Choices:** Appoint before any DR test grant.  
**Consequences:** Gate G cannot run.  
**Required follow-up:** Appointment.  
**Decision:** `UNAPPOINTED`.

### D193-26 — NOC / 24×7 supervision

**Decision:** Whether to staff a NOC or retain PDM escalation (OA-02).  
**Current state:** **No NOC claimed**.  
**Evidence available:** H-183 on-call design.  
**Evidence missing:** Cost/staffing if YES.  
**Choices:** Staff; or explicit “no NOC, PDM escalation”.  
**Consequences:** Sets coverage expectation; does not create GCP.  
**Required follow-up:** If staffing, commercial.  
**Decision:** `PENDING OWNER/POA DECISION` / `OPEN — OWNER DECISION REQUIRED`.

### D193-27 — Belgium DR legal treatment

**Decision:** Legal accept/refuse of `europe-west1` replica under H-168/H-169.  
**Current state:** In-principle exception **≠** legal approval. **NO LEGAL APPROVAL CLAIMED**.  
**Evidence available:** H-157 boundary; H-168/H-169 text.  
**Evidence missing:** DPA, terms, subprocessors, transfer mechanism.  
**Choices:** Review then accept/refuse; do not treat architecture as acceptance.  
**Consequences:** Replica with Production data blocked.  
**Required follow-up:** Legal pack; H-181 D12 informational **unsent**.  
**Decision:** `DEFERRED — LEGAL REVIEW`.

### D193-28 — Commercial / quotations / procurement

**Decision:** Approve spend after real quotes.  
**Current state:** Category list only; **no amounts**.  
**Evidence available:** H-183 P12 structure.  
**Evidence missing:** Quotes/calculator inputs.  
**Choices:** Do not invent prices. H-181 D13 informational **unsent**.  
**Consequences:** Purchase blocked.  
**Required follow-up:** Commercial pack then Owner approval.  
**Decision:** `DEFERRED — COMMERCIAL REVIEW`.

### D193-29 — Container base image / registry

**Decision:** Production image family and registry.  
**Current state:** No Dockerfile (H-191 classified). Node ≥20.  
**Evidence available:** Compiled `node dist/main.js` contract.  
**Evidence missing:** Base image, registry account.  
**Choices:** Do not invent `node:20-…`.  
**Consequences:** No Production image.  
**Required follow-up:** After orchestrator implementation planning + P01.  
**Decision:** `DEFERRED — EVIDENCE REQUIRED`.

### D193-30 — Observability sink (operational)

**Decision:** Log/monitoring **product** (startup does not require it).  
**Current state:** H-161 storage **location** directed `africa-south1`; app JSON stdout.  
**Evidence available:** H-190/H-191 observability contract.  
**Evidence missing:** Sink/APM vendor, alert destinations.  
**Choices:** Defer product; do not install SDKs to close the row.  
**Consequences:** Process can start without vendor; ops alerting remains OPEN.  
**Required follow-up:** After P01 + HUM-08 destinations.  
**Decision:** Location `CONDITIONAL DIRECTION` (H-161). Product `DEFERRED — EVIDENCE REQUIRED`.

---

## 7. Decisions that must remain deferred

| Decision | Why deferred |
| --- | --- |
| P01 grant | H-171 §5 unsatisfied |
| IdP / MFA / issuer values | HUM-05 not established; ADR-0013 OPEN; no issuer evidence |
| Secrets **product** | ADR-0012 OPEN; evaluation not executed |
| Object-store **product** and bucket names | No evidence; GCS must not be inferred from GCP hosting |
| NATS **hoster** and endpoints | Contract only |
| Email **vendor** and From | Adapter choice ≠ vendor |
| PostgreSQL **version** | Dev 16 is not Production evidence |
| Sizing **numbers** | Workload unknown |
| PSA vs PSC | Design note missing |
| Hostname | Not selected; examples are not Production |
| Credentials / project IDs | Would be invention |
| Commercial pricing | No quotes |
| Legal acceptance | No DPA; Belgium unreviewed as acceptance |
| Container image tag | No Dockerfile/platform lock |
| Production catalog name | No Production project |
| Implementation of backup/PITR/HA/replica | Directions exist; **implementation** is Gate D after P01 |

Owner/POA **may** still: reaffirm architecture; reaffirm Google-managed encryption; reaffirm P01 deferral; appoint named people; decide NOC yes/no; optionally choose email **adapter** in principle without a vendor.

---

## 8. H-181 evidence-collection status

```text
H-181 authorization = EXISTS
requests sent       = NONE
evidence received   = NONE
evidence accepted   = NONE
```

H-177 drafts remain **unsent**. H-193 does not send, rewrite, or convert drafts into communications.

---

## 9. P01 — Production Implementation Grant

```text
NOT GRANTED
```

H-193 is a **session package**. It is not a grant. H-174 D01 remains: implementation **deferred**, not rejected forever.

**Before H-171 may be revisited**, at minimum:

1. Gate A: evidence actually obtained and recorded (today: none received).
2. Gate B: Owner/POA closes or explicitly defers remaining **product/appointment** items with dispositions in this taxonomy.
3. H-171 §5 conditions 1–20 are satisfied or formally waived **in a later grant increment** (no waiver is recorded here).

`authorization to prepare` ≠ `authorization to implement`.

---

## 10. Future gate sequence (not occurred)

| Gate | Content | Status |
| --- | --- | --- |
| A | External evidence collection | Authorized to send (H-181); **sent NONE** |
| B | Owner/POA decision closure | **This package prepares B; session NOT HELD** |
| C | H-171 implementation authorization revisit | **NOT GRANTED** |
| D | Production implementation | **BLOCKED** |
| E | Production migration | **BLOCKED** |
| F | Runtime validation | **BLOCKED** |
| G | DR implementation and validation | **BLOCKED** |
| H | Production readiness acceptance | **BLOCKED**; `productionReady = false` |

---

## 11. Contradiction scan

| Check | Result |
| --- | --- |
| Cloud Run architecture vs deployed service | **Consistent:** H-158/H-169 direction; H-191 no service/Dockerfile |
| Cloud SQL architecture vs instance | **Consistent:** Plus **direction**; no instance |
| Johannesburg primary | **Consistent:** `africa-south1` |
| Belgium secondary DR | **Consistent:** `europe-west1`; replica **absent** |
| Enterprise Plus / Advanced DR | **Consistent:** selected architecture; not purchased/created |
| Provider credentials in app config | **None found** (H-192 audit; `.env.example` placeholders) |
| Production hostname invented | **No** (`EOS_PUBLIC_ORIGIN` unset / UNSELECTED) |
| Production infrastructure | **NONE** |
| Unselected provider treated as selected | **No** (`ses`/`smtp`/`nats-jetstream` = adapters) |
| H-183 Google-managed vs H-171 “encryption OPEN” | **Narrowed, not contradicted:** H-183 P06 is later **direction**; still **unimplemented**; CMEK reopen path remains |
| H-181 authorized vs received | **Consistent:** authorized; sent/received NONE |

No implementation was performed to “fix” these. None required.

---

## 12. Session outcome block (blank)

To be completed **only** when a real Owner/POA session is held. Not completed by H-193.

```text
Session held:            NO
Date:                    [ ]
Attendees:               [ ]   (do not invent)
D193-01 P01:             remains NOT GRANTED unless a later increment grants
Cards D193-02–30:        PENDING unless pre-existing disposition cited above
Follow-up increment:     [ ]
```

---

## 13. Final status

```text
H-193 STATUS = COMPLETE
SESSION = PREPARED / NOT HELD
P01 = NOT GRANTED
Production NOT READY
Production implementation NOT AUTHORIZED
H-81 = NOT STARTED
External evidence collected = NONE
Owner/POA decisions made by this increment = NONE (existing prior dispositions preserved only)
```
