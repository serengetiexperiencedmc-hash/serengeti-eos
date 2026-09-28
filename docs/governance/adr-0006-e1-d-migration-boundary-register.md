# E1-D — Migration Boundary Register

> **`MIGRATION EXECUTION IS NOT AUTHORIZED`** (this stage and current Gate C remainder)  
> **`NO NEW MIGRATION FILES CREATED THIS STAGE`**  
> **`NO migrate() INVOKED BY THIS STAGE`**  
> **`MIGRATION 123 EXECUTE AUTHORIZATION IS CONSUMED` (disposable Gate-B Dev/Test only)**

**Date:** 2026-09-17.  
**Authoritative Gate C:** [`adr-0006-gate-c-migration-backlog.md`](adr-0006-gate-c-migration-backlog.md).

`apps/api/src/main.ts` calls `migrate(pool)` **when `EOS_DATABASE_URL` is set**. That applies **already-committed / already-present** SQL files to **local Dev**. It is **not** authorization to **create** new files or to migrate **UAT/Production**.

---

| Item | Migration required? | Migration **creation** required? | Migration **execution** required? | Authorization required? | Current authorization status | Production impact |
| --- | --- | --- | --- | --- | --- | --- |
| Gate B dual-path using 015/016/017/018/019/119/122 | Schema **exists** as Dev inputs | **No** (already present) | Dev startup `migrate()` of **existing** files only | Historical Gate B / Dev URL | Gate B **CLOSED**. Not UAT/Production | Must not be treated as Production schema authorization |
| Migration 123 (RFP/Programme FKs + unique active programme-per-RFP) | **Already executed** on disposable Gate-B | **No** (file exists) | **Consumed** on that disposable instance | Bounded Gate C slice 1–3 | **EXECUTED / consumed**. Remainder **NOT AUTHORIZED** | **Not** UAT/Production |
| TECH-PER-05 / Gate C remainder Production schema path | **Yes** for Production | **Yes** if new Production scripts | **Yes** if authorized later | **Yes** | **NOT AUTHORIZED** | Production data risk |
| TECH-MIG-01 Gate C item 4 indexes | **If** a Production index is later named | **Yes** if DDL | **Yes** if applied | **Yes** | OPEN; OA.15; **not authorized**; assessment said not a migration yet | Production DDL |
| TECH-MIG-02 Gate C item 5 backfill/cutover | **Yes** | **Yes** | **Yes** | **Yes** | **BLOCKED BY UNRESOLVED PRODUCTION ARCHITECTURE** | Cutover |
| TECH-MIG-03 Gate C item 6 event_catalogue rows | **Yes** if executed as SQL | **Yes** | **Yes** | **Yes** | OPEN; separate auth | Catalogue only |
| Gate C item 7 kernel `DocumentStorage.delete` | **No** (not DDL) | **No** | **No** | **Yes** (implementation, not migration) | OPEN | Port contract |
| TECH-IDN-02 MFA TOTP store | **If** seeds stored in PG | **Yes** | **Yes** | **Yes** | **NOT AUTHORIZED** | Secret table |
| TECH-SEC-05 Redis/shared rate-limit table | **If** not in-memory | **Yes** | **Yes** | **Yes** | Prefer in-memory Dev (**A**) to avoid this | Shared store |
| TECH-PER-02 remaining-module dual-path | **If** module lacks tables | **Yes** | **Yes** | **Yes** (persist + possibly Gate C-class) | Gate B does **not** cover new modules | SoR expansion |
| Persistence cutover memory → PG Production | **Yes** | **Yes** | **Yes** | **Yes** | **NOT AUTHORIZED** | Cutover |
| Rollback migration | **If** a forward migration is later authorized | Separate down-script would need auth | **Yes** to roll back | **Yes** | **None** for new work | Data loss risk if invented |
| This E1-D A-pack (headers/CORS/in-memory rate-limit/secret tests) | **No** | **No** | **No** | Implementation auth **≠** migration auth | Pack **not** a grant | None if in-memory |

---

## Standing rule

**Do not execute migrations. Do not create new migration SQL in this stage.**  
Any later human grant must name **creation** vs **execution** vs **environment** (disposable Dev vs UAT vs Production) separately.
