import { readFileSync, writeFileSync } from "node:fs";
const ids = JSON.parse(readFileSync(new URL("./uat-ids.json", import.meta.url), "utf8")).ids;
const login = await fetch("http://127.0.0.1:18117/v1/auth/login", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    email: "carol.admin@sedmc.local",
    password: process.env.EOS_BOOTSTRAP_CAROL_PASSWORD ?? "test-carol-not-for-prod",
    tenantSlug: "sedmc",
  }),
});
const token = (await login.json()).accessToken;
const r = await fetch(`http://127.0.0.1:18117/v1/suppliers/${ids.supplierId}`, {
  headers: { authorization: `Bearer ${token}` },
});
const j = await r.json();
const out = {
  status: r.status,
  supplierCode: j.supplier?.supplierCode,
  legalName: j.supplier?.legalName,
  rateCount: (j.rates ?? j.supplier?.rates ?? []).length,
  firstRate: (j.rates ?? j.supplier?.rates ?? [])[0],
  keys: Object.keys(j),
};
writeFileSync(new URL("./mixed-supplier-after-restart.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out));
