# E2 laboratory environment — safety record

**ENVIRONMENT:** `LAB` / `DEVTEST` only  
**NOT Production.** Not UAT. Not a selected hosting topology.

| Check | Result |
| --- | --- |
| Bind address | `127.0.0.1` only |
| Image | `postgres:16-alpine` (local Docker Desktop) |
| Compose used | **Not** `infra/compose/dev.yaml` (isolated project/containers/volumes) |
| Production data | None — synthetic markers only |
| Production credentials | None in process env at lab start |
| Production DB endpoint | None — ports `127.0.0.1:55432` / `55433` |
| Production backups | None |
| Production failover | None — no Production endpoints exist in this lab |
| PII | No live customer/employee/passport/payment data |

**RUN COMPLETED:** `20260915-183034`. Lab containers, volumes, and network were removed after the run.
