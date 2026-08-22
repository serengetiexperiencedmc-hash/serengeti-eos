import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSpec } from "./crm-c1-spec-builder.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "crm-c1.yaml");

function needsQuotes(s) {
  return (
    s === "" ||
    s === "true" ||
    s === "false" ||
    s === "null" ||
    /^[\d.-]+$/.test(s) ||
    /[:#\n]|^\s|^\||^>|^@|^%/.test(s)
  );
}

function dumpScalar(v) {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return v ? "true" : "false";
  if (typeof v === "number") return String(v);
  const s = String(v);
  if (s.includes("\n")) {
    const inner = s
      .split("\n")
      .map((line) => `${"  ".repeat(2)}${line}`)
      .join("\n");
    return `|\n${inner}`;
  }
  return needsQuotes(s) ? JSON.stringify(s) : s;
}

function dump(value, indent = 0) {
  const pad = "  ".repeat(indent);
  if (value === null || value === undefined || typeof value !== "object") {
    return dumpScalar(value);
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    return value
      .map((item) => {
        if (item && typeof item === "object" && !Array.isArray(item)) {
          const entries = Object.entries(item);
          const [firstKey, firstVal] = entries[0];
          let head;
          if (Array.isArray(firstVal) && firstVal.length === 0) {
            head = `${pad}- ${firstKey}: []`;
          } else if (firstVal !== null && typeof firstVal === "object" && !Array.isArray(firstVal)) {
            head = `${pad}- ${firstKey}:\n${dump(firstVal, indent + 2)}`;
          } else {
            head = `${pad}- ${firstKey}: ${dumpScalar(firstVal)}`;
          }
          const tail = entries
            .slice(1)
            .map(([k, v]) =>
              v !== null && typeof v === "object"
                ? `${pad}  ${k}:\n${dump(v, indent + 2)}`
                : `${pad}  ${k}: ${dumpScalar(v)}`,
            )
            .join("\n");
          return tail ? `${head}\n${tail}` : head;
        }
        return `${pad}- ${dump(item, indent + 1)}`;
      })
      .join("\n");
  }
  return Object.entries(value)
    .map(([k, v]) => {
      if (Array.isArray(v) && v.length === 0) {
        return `${pad}${k}: []`;
      }
      if (v !== null && typeof v === "object") {
        return `${pad}${k}:\n${dump(v, indent + 1)}`;
      }
      return `${pad}${k}: ${dumpScalar(v)}`;
    })
    .join("\n");
}

const spec = buildSpec();
const yaml = dump(spec).replace(/^openapi: "3.1.0"/m, "openapi: 3.1.0") + "\n";
fs.writeFileSync(OUT, yaml, "utf8");

const pathCount = Object.keys(spec.paths).length;
const opCount = Object.values(spec.paths).reduce((n, m) => n + Object.keys(m).length, 0);
console.log(`Wrote ${OUT}`);
console.log(`Paths: ${pathCount}, Operations: ${opCount}`);
