# H-111 Day 7 — Final Engineering Report

> **`H-111 DAY 7 D7`**  
> **`FINAL ENGINEERING COMPLETION REPORT`**  
> **`NOT UAT`** · **`NOT PRODUCTION AUTHORIZATION`** · **`NOT H-81`**  
> **`NOT EOS ADOPTION`** · **`NOT GATE B`** · **`NO COMMIT`** · **`NO PUSH`**

**Date:** 2026-09-21.  
**Auditable timestamp:** **2026-09-21T17:45:00+03:00**.  
**HEAD:** `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`.  
**Branch:** `master`. Index **EMPTY**. Dirty tree **preserved**.  
**Controlling authorization:** [`gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md`](gpta-h-111-poa-7-day-accelerated-eos-completion-authorization.md).  
**Detailed audit:** [`accelerated-build-day-7-final-readiness-audit.md`](accelerated-build-day-7-final-readiness-audit.md).

```text
DAY 7 STATUS = FINAL ENGINEERING AUDIT COMPLETE
ENGINEERING CLASSIFICATION = ENGINEERING SCOPE COMPLETE WITH DOCUMENTED LIMITATIONS
INCREMENT = EOS-7D-ACCEL
H-80 = ACTIVE
H-81 = NOT STARTED
RATE IDENTITY = STOPPED
PRODUCTION READY = NOT CLAIMED
```

This report is executive-readable. Evidence detail lives in the companion audit. No completion percentage is used. The entire EOS system is **not** declared complete because one Dev/Test vertical slice works.

---

## 1. H-111 objective

H-111-A authorized a **seven-calendar-day engineering acceleration** so EOS software could be completed where requirements already exist, **without** waiting for H-80 commercial evidence and **without** treating software work as adoption, H-81, UAT, or Production.

H-80 remains **ACTIVE**. H-81 remains **NOT STARTED**. This programme is not H-81 evidence and does not exit H-80.

The seven-day model: Day 1 audit → Days 2–5 bounded commercial slice → Day 6 test/remediate/live integrate → Day 7 readiness audit.

H-111 §7 expected a single Day-6 report file. That file was **not** created; Day 6 ran as D6-T1 / D6-T4 / D6-T5 / D6-T6. Day 7 uses the Owner/POA prompt filenames rather than the H-111 §7 aliases.

---

## 2. What was built

A **bounded Dev/Test vertical slice** for verified commercial-facts workflows:

- Opportunity F2 facts (OR-01 qualification independent of workflow stage) with an operating detail UI.
- RFP F2 facts: SOURCE and CHANNEL kept distinct, explicit receipt and first-response timestamps, clarification status/events, with an operating detail UI.
- F2-DP-01 JSONB sidecar persist and hydrate (six maps) on opt-in bounded startup against `127.0.0.1:5432/eos`.
- Mixed PostgreSQL C-spine **fail-closed** on that 124-only database (not used as a durable fallback).
- Identifier immutability and sidecar persist fail-closed on Opportunity, Account, Programme, and RFP PUTs.
- Client Save visibility that does **not** replace server `authorize()`.
- D6-T4: two `useState<string>` annotations on already-dirty `EosSessionProvider.tsx` so web TypeScript compiles.

Not built (and not claimed): G-08-B admin console, rate identity UI, Path B write, booking, KPI history, revenue/profit/FX, mailbox ingest, Production deployment, or mixed-schema cutover.

---

## 3. What was validated (engineering tests)

Day 7 re-ran the authorized focused suites. Tests were not weakened. `migrate()` was not run.

| Suite | Result |
| --- | --- |
| Web Opportunity + RFP panel tests | **24 passed / 2 files** |
| API write-integrity + RFP PUT + persist + mixed-SQL | **25 passed / 4 files** |
| Bounded startup + shutdown observability + shutdown trigger | **30 passed / 3 files** |
| **Focused total** | **79 passed / 9 files** |
| `apps/web` TypeScript | **0 errors** |
| `apps/api` TypeScript | **0 errors** |

Baseline match: 24 / 25 / 30 / 0 / 0. No deviation.

This is focused regression of the accelerated-build deliverable. It is not full CI and not UAT.

---

## 4. What is live Dev/Test validated

Two **separate** live classes:

**Live API integration (D6-T5)** — PASS WITH FINDINGS. Actual `main.ts` on `127.0.0.1:18115`, bounded opt-in, database `127.0.0.1:5432/eos`. Opportunity and RFP GET-PUT-GET, SOURCE ≠ CHANNEL, OR-01, sidecar persist, authentication/authorization, deterministic POST shutdown (202, exit 0, listener released). Web UI was **not** validated in T5.

**Live web-to-API integration (D6-T6)** — PASS WITH FINDINGS. Isolated Next on `127.0.0.1:3016` using existing `EOS_API_URL` → bounded API. Browser Dev sign-in, Opportunity Save round-trip, RFP SOURCE/CHANNEL Save, 401 unauthenticated, 409 on conflicting ids, sidecar counts after (opp 3 / rfp 3 / pathB 1 / account 1 / rate 1 / programme 1). H91 residue preserved.

Do not treat T5 as T6. The default Next on `:3001` (proxy to `:8080`) was **not** the validated web.

---

## 5. What remains incomplete (engineering)

- Mixed C-spine schema (migrations 001–123) is **unapplied** on the validated database; the slice is **not** full EOS database readiness.
- Opportunity/RFP **HTTP identity** is process-local on 124-only `eos`; sidecar facts survive restart, mixed entities do not.
- Account and Programme F2 **write UIs** were not built; PUTs are API-tested only.
- Path B is **display GET** only.
- Rate identity remains **STOPPED** (also governance-gated).
- Operator web targeting required an isolated Next copy because of a Next 16 directory lock and occupied default API port.
- React hydration overlay on existing `Shell.tsx` was observed live and not remediated.
- Deployment/operational documentation remains partial (`.env.example` + daily reports, not a Production runbook).
- Unified Day-6 report file is absent (T-series used instead).
- Full CI, Playwright, backup/restore-as-H-111-Production-evidence, and Production observability were not produced.

---

## 6. What remains governance-gated

Not authorized by H-111 or by this audit — **not** scored as engineering failures:

Production deployment and Production migration · UAT sign-off · Gate B / `eos_gateb` · F2-I12 · I1–I11 thaw · SoR cutover · mailbox/Excel/WhatsApp/phone ingestion · booking · KPI history · revenue/profit/FX · Path D · G-08-B general commercial-facts admin console · Windows SIGINT experiment · deletion of H91 synthetic residue · H-81 · H-80 exit · commit · push.

---

## 7. Known findings

1. Default API `:8080` occupied; bounded API used `:18115`.
2. H91 sidecar rows are not HTTP pipeline entities without mixed identity tables.
3. T5 stopped web validation; T6 completed it via isolated Next, not by restarting `:3001`.
4. PID 36512 later observed dead after API shutdown without this programme sending Stop-Process; cause unknown.
5. Isolated Next is operational copy, not committed architecture.
6. Hydration overlay (`Shell.tsx` / line 232) did not block Save.
7. `dev-preview.mjs` is unsafe for bounded sidecar (`EOS_SEED_DEMO`).
8. `/v1/me` has no permission keys (unchanged by design).
9. Mixed SQL is fail-closed on this DB — **not** a deployable C-spine.

---

## 8. Security / authentication position

Unauthenticated commercial-facts and `/v1/me` requests return **401**. Mutations require server `authorize()`. Conflicting body identifiers return **409**. Bounded shutdown is **loopback-only**. Production-like and Gate B targets are **refused**. Authentication was **not** redesigned. UI hiding Save is **not** authorization.

Dev/Test local-password login was used live. That is not a Production identity provider.

---

## 9. Persistence / database position

Six F2-DP-01 sidecar maps remain defined. JSONB persist and hydrate remain intact. Live field round-trips succeeded for Opportunity and RFP. Sidecar-only mode is explicit (`mixedSqlDurable=false`). Identifiers remain immutable. H91 synthetic residue remains. No unauthorized migrations were introduced. D7 did not run `migrate()`.

**The broader mixed PostgreSQL C-spine is not deployable against this 124-only database.** `schema_migrations` is absent; mixed `opp_%` / `rfp_%` tables are absent.

---

## 10. Production / UAT limitations

D6-T5/T6 and D7 tests are **engineering Dev/Test evidence**. They are not UAT and not Production authorization.

Before UAT (if separately granted): a scoped environment, identity durability rules, operator web→API procedure, UAT journeys, and explicit exclusion of gated capabilities.

Before Production (if separately granted): Owner/POA Production decision, authorized schema/migration plan **other than** applying 001–123 to this 124-only Dev/Test DB, secrets, backup/restore, rollback, observability, and UAT sign-off. H-80/H-81 remain independent of this software slice.

---

## 11. Final engineering classification

```text
ENGINEERING SCOPE COMPLETE WITH DOCUMENTED LIMITATIONS
```

This is about the **H-111 engineering scope only**.

It is **not** UAT approval, Production authorization, H-81 completion, EOS adoption, SoR cutover, or overall company software completion.

---

## 12. Exact repository state

Recorded at Day-7 start (before these two artefacts): HEAD `75ee4c3aabdcf5974f6a589f8c36a0b98727edba`, branch `master`, index empty, porcelain **458**.

Day 7 added only:

- `docs/governance/accelerated-build-day-7-final-readiness-audit.md`
- `docs/governance/accelerated-build-day-7-final-report.md`

No application source change. No commit. No push. Dirty tree otherwise preserved.

---

**STOP.** Day 7 is complete. Do not begin another implementation cycle. Do not create H-113. Do not modify H-80 or H-81.

---

**End of H-111 Day 7 final report.**
