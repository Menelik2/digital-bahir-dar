#!/usr/bin/env node
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const partNames = ["lock-q1.b64", "lock-q2.b64", "lock-q3.b64", "lock-q4.b64"];
const out = "package-lock.json";

function needsRestore() {
  if (process.env.FORCE_LOCK === "1") return true;
  if (!existsSync(out)) return true;
  try {
    const t = readFileSync(out, "utf8");
    return t.includes('"packages":{}') || !t.includes("node_modules/react");
  } catch {
    return true;
  }
}

if (!needsRestore()) {
  console.log("package-lock.json ok, skip restore");
  process.exit(0);
}

const missing = partNames.filter((f) => !existsSync(join(__dir, f)));
if (missing.length) {
  console.log("lock fragments missing (" + missing.join(", ") + ") — run npm install to generate package-lock.json");
  process.exit(0);
}

const b64 = partNames.map((f) => readFileSync(join(__dir, f), "utf8").trim()).join("");
const json = inflateSync(Buffer.from(b64, "base64")).toString("utf8");
writeFileSync(out, json);
console.log("wrote", out, json.length, "bytes");
