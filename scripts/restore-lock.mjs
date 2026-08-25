#!/usr/bin/env node
import { writeFileSync, existsSync, readFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dir = dirname(fileURLToPath(import.meta.url));
const part1 = readFileSync(join(__dir, "lock-part1.b64"), "utf8").trim();
const part2 = readFileSync(join(__dir, "lock-part2.b64"), "utf8").trim();
const b64 = part1 + part2;
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

if (needsRestore()) {
  const json = inflateSync(Buffer.from(b64, "base64")).toString("utf8");
  writeFileSync(out, json);
  console.log("wrote", out, json.length, "bytes");
} else {
  console.log("package-lock.json ok, skip restore");
}
