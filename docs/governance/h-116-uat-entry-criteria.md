# H-116 — UAT entry criteria, defect taxonomy, evidence, and exit criteria

> **UAT PREPARATION ONLY** · **NOT UAT EXECUTION** · **NOT UAT SIGN-OFF**

**Date:** 2026-09-21.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Baseline:** H-115 `ENGINEERING SCOPE COMPLETE WITH DOCUMENTED LIMITATIONS`.

This file defines what must be true **before** a human may authorize UAT execution, how defects and evidence are classified **during** UAT, and what is required **after** execution for a human UAT result. It does **not** start UAT and does **not** declare UAT passed.

---

## 1. Required before UAT

All of the following must be true (or explicitly waived by an authorized human in writing):

| # | Criterion | Current position (H-116) |
| ---: | --- | --- |
| 1 | H-115 engineering completion recorded | **Met** — `H-115 ENGINEERING SCOPE COMPLETE WITH DOCUMENTED LIMITATIONS` |
| 2 | Full-schema Dev/Test environment available | **Met as Dev/Test** — `127.0.0.1:5435/eos_h112_full` (H-112). Formal **UAT environment designation** is a human decision (§3) |
| 3 | Migration state known | **Met** — 120 files on `eos_h112_full`; hole `112`–`116`; `eos` 124-only / `schema_migrations` absent |
| 4 | Test data strategy | **Met** — [`h-116-uat-data-plan.md`](h-116-uat-data-plan.md) (synthetic; not auto-inserted) |
| 5 | Test accounts/roles available | **Met as Dev/Test bootstrap** — Carol operator; Alice unauthorized; passwords from `.env.example` only |
| 6 | UAT scenario catalogue | **Met** — [`h-116-uat-scenario-catalogue.md`](h-116-uat-scenario-catalogue.md) |
| 7 | Expected results defined | **Met** — each scenario has expected result + pass/fail |
| 8 | Defect classification defined | **Met** — §4 |
| 9 | Evidence capture defined | **Met** — §5 |
| 10 | Environment/runbook available | **Met** — [`h-112-devtest-operator-runbook.md`](h-112-devtest-operator-runbook.md) |
| 11 | Requirements matrix | **Met** — [`h-116-uat-readiness-matrix.md`](h-116-uat-readiness-matrix.md) |
| 12 | No known engineering blocker preventing execution | **Met** — H-115 found none. Documented limitations must be accepted by the human authorizer (§6) |
| 13 | Human UAT authorization | **Not met by this action** — required before execution |
| 14 | Named UAT testers/owners | **Not met by this action** — human appointment |

Items 13–14 are **human decisions**, not software gaps.

---

## 2. Not required for UAT entry

Do **not** delay UAT entry for:

- H-80 exit
- H-81 adoption / EOS adoption
- Production deployment, Production data, or Production migration
- SoR cutover
- Booking operator authority
- KPI history; revenue; profit; FX
- Unresolved Rate Identity policies (winner, freeze, expired live-use, public-for-sale, overlay/mixed precedence)
- Gate B / `eos_gateb`
- F2-I12 / I1–I11 thaw
- G-08-B general commercial-facts admin console
- Deletion of H-91 residue
- Playwright / full CI as a substitute for UAT
- Formal designation of `eos_h112_full` as “the UAT database” unless a human so decides

---

## 3. Environment rule

Preparation baseline: validated full-schema Dev/Test `127.0.0.1:5435/eos_h112_full`, API `127.0.0.1:18116`.

**This package does not declare that database a formal UAT environment.** It is the engineering-validated full-schema Dev/Test catalog. A formal UAT environment remains a **governance/operational decision**.

If isolation from residual H-112 demo-seed leftover rows is required, an authorized human may:

- reset the disposable container per H-112 runbook §4.2 and re-apply migrations; or
- provision a **new** isolated catalog cloned from the same chain.

Do **not** provision either automatically in H-116. Do **not** use `127.0.0.1:5432/eos` as the UAT write target. Do **not** use Production.

Web UAT, if included, must set `EOS_API_URL=http://127.0.0.1:18116` (D6-T6 mechanism). Default Next `:3001`→`:8080` is **not** the validated path.

---

## 4. Defect classification

| Class | Meaning | UAT effect |
| --- | --- | --- |
| **BLOCKER** | Prevents meaningful UAT execution or invalidates a core authorized workflow (e.g. cannot login; full-schema API will not start against the intended catalog) | Stop the affected stream until resolved or human-accepted |
| **CRITICAL** | Core authorized workflow produces materially incorrect behaviour (e.g. SOURCE collapsed into CHANNEL; overlay amount treated as identity; 409 not returned on duplicate versionIdentity) | Must be resolved or separately accepted before UAT exit |
| **MAJOR** | Material authorized capability misses its defined contract but other scenarios can continue | Disposition required before exit |
| **MINOR** | Non-blocking; defined workaround exists (e.g. wrapper exit 1 after SIGTERM if port released and hydrate succeeds) | Document; does not by itself block exit |
| **GOVERNANCE** | Cannot be judged because the business rule is not authorized/defined (winner, FX, freeze, revenue, booking) | **Not a software fail.** Record as out of scope |
| **DATA/ENVIRONMENT** | Caused by test data, credentials, infrastructure, wrong catalog, demo seed, or wrapper process control | Fix setup; do not blame application unless reproduced on a correct environment |

Rules:

- Unresolved commercial policy is **GOVERNANCE**, never BLOCKER/CRITICAL.
- Wrong environment (bounded `eos`, Gate B, Production) is **DATA/ENVIRONMENT**.
- H-115 documented limitations are not automatically defects; they become defects only if they violate an **IN SCOPE** expected result.

---

## 5. Evidence requirements

Each executed scenario captures:

| Field | Required? | Notes |
| --- | --- | --- |
| Scenario ID | Yes | Catalogue ID |
| Date/time (UTC or +03:00) | Yes | — |
| Actor | Yes | e.g. Carol / Alice / none |
| Environment | Yes | host, port, database name, `namedBranch` if known |
| Action | Yes | method + path or UI step |
| Expected result | Yes | from catalogue |
| Actual result | Yes | status + material JSON fields |
| Screenshot | If UI path used | Not required when HTTP JSON is sufficient |
| API evidence | If API path | Status + body excerpt (redact tokens) |
| Persisted-state evidence | If persistence/restart scenario | Sidecar SELECT **or** GET-after-restart |
| Pass / fail | Yes | — |
| Defect ID | If fail | Class from §4 |
| Exclusion invoked | If GOVERNANCE | Cite H-113/H-114/H-115 |

Do **not** require screenshots for API-only scenarios. Do **not** paste bootstrap passwords into evidence packs.

---

## 6. Known limitations that a human authorizer must accept

These do **not** fail entry by themselves:

1. `eos_h112_full` is Dev/Test, not a formally designated UAT environment.
2. Disposable catalog may contain leftover rows from an H-112 failed `EOS_SEED_DEMO` attempt.
3. Windows `npx tsx` SIGTERM may exit 1 without `shutdown_completed`; in-process bounded POST shutdown remains the proven graceful class (bounded plane only).
4. Live browser against full-schema was not repeated in H-112/H-114; UAT may still execute UI using `EOS_API_URL`.
5. Organization-type ids must come from GET after hydrate (not process-local seeds).
6. `EOS_SEED_DEMO` must remain **false**.
7. Numbering hole `112`–`116` (files absent).

---

## 7. UAT exit criteria

UAT execution (a later, separately authorized action) may be submitted for **human acceptance** only when:

1. All **MANDATORY** scenarios in the catalogue have been executed (or explicitly waived in writing by the UAT owner).
2. All **BLOCKER** and **CRITICAL** defects are resolved **or** separately accepted by an authorized human.
3. Material failed scenarios (MAJOR) are dispositioned (fix, accept, or reclassify with rationale).
4. GOVERNANCE-blocked scenarios are explicitly identified as not judged.
5. Evidence pack is complete per §5 for executed scenarios.
6. Known limitations (§6) are restated on the UAT result.
7. A final UAT result is submitted for **human** acceptance.

Do **not** invent a percentage pass threshold.  
Do **not** declare UAT passed in H-116.  
Do **not** treat H-116 itself as UAT exit.

---

## 8. Human intervention boundary

Humans must authorize:

- formal UAT execution;
- appointment of testers/owners;
- acceptance of UAT entry despite §6 limitations;
- acceptance or rejection of defects;
- UAT sign-off;
- any later Production authorization (separate from UAT).

This package does not make those decisions.
