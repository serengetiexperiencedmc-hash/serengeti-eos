# External Systems Discovery Register

**Status:** Active discovery — **UNKNOWN / NOT INVENTED** until verified  
**Rule:** Do not fabricate integrations, credentials, APIs, or contracts.  
**Update:** Every confirmed system must get an owner, purpose, DPA/contract reference, and ADR if integration is irreversible.

| System | Status | Owner | Purpose | Integration required | API available | Credentials available | Decision |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ERP / accounting | Unknown | TBD | TBD | TBD | TBD | No | Discovery |
| CRS (hotel/lodge) | Unknown | TBD | TBD | TBD | TBD | No | Discovery |
| GDS (air) | Unknown | TBD | TBD | TBD | TBD | No | Discovery |
| Banking / payments | Unknown | TBD | TBD | TBD | TBD | No | Discovery |
| SMS provider | Unknown | TBD | TBD | TBD | TBD | No | Discovery |
| Email provider | Unknown | TBD | TBD | TBD | TBD | No | Discovery |
| Existing CRM | Unknown | TBD | TBD | TBD | TBD | No | Discovery |
| HR platform | Unknown | TBD | TBD | TBD | TBD | No | Discovery |
| Corporate IdP | Unknown | TBD | Workforce SSO | Required before Prod | TBD | No | Discovery — see ADR-0013 |
| Cloud infrastructure | Unknown | TBD | Hosting | Required before Prod | TBD | No | Discovery — see ADR-0006 |
| Document management | Unknown | TBD | TBD | TBD | TBD | No | Discovery |
| Existing APIs | Unknown | TBD | TBD | TBD | TBD | No | Discovery |
| Supplier systems | Unknown | TBD | TBD | TBD | TBD | No | Discovery |
| Teams / business chat | Unknown | TBD | TBD | TBD | TBD | No | Discovery |
| Object storage (Prod) | Unknown | TBD | Evidence/docs | Required before Prod | TBD | No | Discovery |
| SIEM | Unknown | TBD | Defensive SOC | Phase 3 | TBD | No | Discovery |

## Discovery process

1. Interview system owners / finance / IT  
2. Record vendor, region, data classes, lawful basis considerations  
3. Capture whether API, file, or manual integration is realistic  
4. Only then design an anti-corruption adapter  
5. Update this register and open/close ADRs  

## Forbidden

- Inventing vendor names as if contracted  
- Committing production credentials  
- Designing irreversible couplings to unverified systems  
