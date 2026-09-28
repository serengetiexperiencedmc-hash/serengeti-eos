# H-118 — H117-D-02 Hydration Overlay Remediation

> **Not human UAT sign-off.** H-117 remains `H-117 UAT COMPLETE — HUMAN ACCEPTANCE REQUIRED`.  
> **Not Production.** **Not H-80/H-81.** **Not a second formal UAT cycle.**

**Date:** 2026-09-21.

---

## A. Header

H-118 — H117-D-02 Hydration Overlay Remediation

---

## B. Baseline

| Item | Value |
| --- | --- |
| HEAD | `75ee4c3aabdcf5974f6a589f8c36a0b98727edba` |
| Branch | `master` |
| Index | empty (`git diff --cached --quiet` succeeded) |
| Initial porcelain | **497** |
| Final porcelain | **498** (this report only) |
| Pre-existing dirty worktree | Preserved. `apps/web/src/components/commercial/Shell.tsx` was **not dirty** vs HEAD (`git diff HEAD -- Shell.tsx` empty). Last commit touching it: `cc92954` “fix: resolve commercial shell hydration mismatch” (2026-09-05). |

No reset, clean, stash, revert, discard, commit, or push.

---

## C. Governing authority

H-118 is a narrowly bounded increment after:

- H-115 `ENGINEERING SCOPE COMPLETE WITH DOCUMENTED LIMITATIONS`
- H-116 UAT entry package
- H-117 `UAT COMPLETE — HUMAN ACCEPTANCE REQUIRED`

It authorizes inspection and, if safe, minimal remediation of **H117-D-02 only**. It does not reopen UAT acceptance, Production, H117-D-01 shutdown, or commercial-policy work.

---

## D. Original defect

H-117 recorded:

> **H117-D-02 — MINOR — Next.js hydration overlay on `Shell.tsx` during web UAT. Facts still loaded.**

H-117 evidence (`docs/governance/h-117-uat-execution-report.md`; browser snapshots on `http://127.0.0.1:3017`):

- Next.js issues overlay / “Was this helpful?” region
- Generic hydration copy (`typeof window`, `Date.now()`, locale dates)
- Component stack: `src\components\commercial\Shell.tsx (232:17) @ eval`
- Observed on commercial pages after full document loads in the Cursor IDE browser
- Commercial facts still rendered (PCO/UK, SOURCE≠CHANNEL, Path B, Rate Identity)

Reproduction this increment (2026-09-21 ~18:35Z):

- Web: `http://127.0.0.1:3017` (H-117 isolated Next, `EOS_API_URL=http://127.0.0.1:18117`)
- API: `http://127.0.0.1:18117` (not mutated)
- Runtime: Cursor IDE browser, unauthenticated `GET /commercial`
- Overlay: **reproduced** (Next.js portal present; “Console Error / A tree hydrated but some attributes…”)
- A second `next dev` on :3018 was refused by Next 16 (`Another next dev server is already running` for `apps/web`)

---

## E. Root cause

**Not an application server/client render split in `Shell.tsx`.**

The Next.js 16 overlay’s pseudo-HTML mismatch lines are exclusively extra **client-only attributes**:

```text
-                             data-cursor-ref="e0"
-                             data-cursor-ref="e1"
… (88 mismatch lines of this form)
```

Live DOM after a Cursor `browser_snapshot`: **74** `data-cursor-ref` nodes. The dashboard `<a href="/commercial">` class after mount is the expected client active class (`bg-gold/15 text-gold`). Overlay **did not** list `bg-gold/15` vs inactive class as the mismatch.

`data-cursor-ref` is injected by the **Cursor IDE browser snapshot instrumentation** onto interactive `<a>` / control nodes **before or during** React hydration. Next.js then reports an attribute mismatch on the first sidebar `Link` (`Shell.tsx` ~232), which is the first instrumented `<a>` in the commercial layout tree.

This matches Next’s own overlay note: a client environment that **messes with the HTML before React loaded** (browser extension / automation). It is **not**:

- `typeof window` during render in Sidebar
- `Date.now()` / `Math.random()` in Shell
- locale date formatting in Shell
- sessionStorage during first paint (session still hydrates in `useEffect`)
- the existing `useClientMounted()` active/badge gate failing to keep SSR and first client classNames aligned

`Shell.tsx` already defers pathname-based `active` and nav badges until after mount (`useState(false)` + `useEffect`). Commit `cc92954` replaced `useSyncExternalStore(() => true, () => false)` with that pattern. H-117 still saw the overlay because **Cursor refs are independent of that gate**.

A real unaided browser (no `data-cursor-ref`) would not present this overlay for that reason. H-117 UI evidence used the Cursor browser exclusively.

---

## F. Change made

**Application files changed: none.**

| File | Change |
| --- | --- |
| `apps/web/src/components/commercial/Shell.tsx` | **Unchanged** |
| Related providers / commercial-facts panels | **Unchanged** |
| Shutdown / API | **Unchanged** |

Why no in-app edit:

- The mismatched attributes are not produced by application render.
- `suppressHydrationWarning` on every `Link` would hide Cursor injection **and** real future mismatches; H-118 forbids cosmetic suppression.
- Replacing `Link` with `<a>`, disabling SSR for Sidebar, or adding a new state library would be unrelated architecture, not a hydration-semantics fix.

Minimum safe change is **no change**.

---

## G. Preserved semantics

No commercial, auth, or persistence code was edited. Therefore unchanged:

- login / logout / `/v1/me` / `authorize()`
- Opportunity identity; qualification ≠ workflow stage; OR-01
- RFP SOURCE ≠ CHANNEL; explicit timestamps; clarification
- Programme identity trace; no booking facts added
- F2-DP-01 six maps; no migration
- Path B GET/PUT
- Rate Identity catalogues, append-only `versionIdentity`, 409, amount not identity, no FX/winner/freeze
- 401 unauthenticated / 403 unauthorized

H-117 UAT evidence was not rewritten or invalidated.

---

## H. Tests

| Command | Result |
| --- | --- |
| `cd apps/web && npm test` (`vitest run`) | **36 passed** / 6 files (account, opportunity, RFP, Path B, programme, Rate Identity panels) |
| `cd apps/web && npx tsc -p tsconfig.json --noEmit` | **TSC_EXIT=0** |
| API suite | Not rerun; no API files changed |
| Formal H-116 UAT catalogue | Not rerun (H-117 stands) |

There is no dedicated Shell/session unit test file in `apps/web`.

---

## I. Hydration result

**PASSED WITH LIMITATION**

- Overlay **was reproduced** on `http://127.0.0.1:3017/commercial` under the Cursor IDE browser.
- Extracted mismatch is **only** `data-cursor-ref="e*"`.
- No application HTML/className mismatch was evidenced.
- After mount, sidebar active styling works as designed.
- Not claimed “resolved in product code” because the overlay will **reappear whenever Cursor snapshots a page during hydration**. That is an evidence-environment limitation, not an unfixed Shell bug.

H117-D-02 should be treated going forward as **DATA/ENVIRONMENT** (Cursor browser instrumentation), not as an open application defect requiring a Shell rewrite. H-117’s original MINOR classification is left intact in H-117 documents.

---

## J. H117-D-01

H117-D-01 was not modified and remains a documented DATA/ENVIRONMENT finding.

No SIGTERM/SIGINT/shutdown code was changed.

---

## K. Governance boundaries

This increment does **not** authorize:

- Production deployment or migration
- Gate B / `eos_gateb`
- H-80 exit / H-81 / SoR cutover
- booking; KPI history; revenue/profit; FX
- unresolved Rate Identity policy
- schema/migration changes (`125+` not created; `124` not altered; `eos`, `eos_h112_full`, `eos_h117_uat` not migrated)
- human UAT acceptance (still required from H-117)

UAT catalogs were not mutated for this diagnosis.

---

## L. Final classification

```text
H-118 REMEDIATION COMPLETE WITH LIMITATIONS
```

Human UAT state is unchanged:

```text
H-117 UAT COMPLETE — HUMAN ACCEPTANCE REQUIRED
```
