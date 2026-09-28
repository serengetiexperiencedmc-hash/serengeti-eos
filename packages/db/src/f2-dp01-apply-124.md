# F2-DP-01 124-only Dev/Test apply mechanism (GPTA-H-88)

This mechanism exists so a later, **separately authorized** execution can apply **only**:

`packages/db/migrations/124_f2_dp01_commercial_facts.sql`

It does **not** itself authorize that execution.

## What it does

- Selects a hard allowlist of one basename: `124_f2_dp01_commercial_facts.sql`.
- Refuses `schema.sql`, migration `123`, any other catalogue file, wildcards, and “latest”.
- Refuses Production-like env (`EOS_ENV=production|uat` or `NODE_ENV=production`).
- Refuses database `eos_gateb`.
- Refuses the in-process stand-in database `eos_devtest_f2_dp01`.
- Accepts only the recorded isolated Dev/Test identity class: host `127.0.0.1`, port `5432`, database `eos`.
- Fails closed when the target cannot be identified.
- Does **not** call global `migrate()`.
- Does **not** change `packages/db/src/index.ts` `migrate(pool)` (“apply all unapplied files”).
- Does **not** fabricate `schema_migrations` rows for `001`–`123`.
- Transaction shape for a later authorized write: `BEGIN` → SQL of 124 only → `COMMIT`, or `ROLLBACK` on failure.

## Why global `migrate()` is unchanged

H-87 stopped because `migrate()` would apply 120 files on an empty Dev/Test `eos` database. This module is an **explicit** 124-only path. It is not an implicit bypass and is not wired into `npm run migrate -w @sedmc/db`.

## Invocation

Inspect only (no PostgreSQL write):

```text
npx tsx src/f2-dp01-apply-124-cli.ts
```

from `packages/db`, with `EOS_DATABASE_URL` set if a target check is required. Default CLI **never** writes.

`--execute` is **refused** until a later governance execution authorization exists. GPTA-H-88 implemented the mechanism and safety tests only.

## Safety tests

`src/f2-dp01-apply-124.test.ts` covers allowlist selection, rejection of 123 / `schema.sql` / other files, production-like and `eos_gateb` refusal, unidentified-target refusal, no call to `migrate()`, and credential redaction. Those tests use mocks/fixtures. They are **not** live PostgreSQL validation evidence.

## Live application

Migration 124 must **not** be applied until a separate execution authorization is granted after this mechanism is audited.
