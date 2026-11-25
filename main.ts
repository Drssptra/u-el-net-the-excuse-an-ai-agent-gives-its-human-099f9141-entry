// u-el-net-the-excuse-an-ai-agent-gives-its-human-099f9141 — v2 resubmission.
// The excuse is assembled from three sentence fragments, validated against
// the 1-200 character single-line gate, then written byte-for-byte to
// entry.txt (no trailing newline). stdout echoes the same text with a
// newline so a human reader sees it on its own line. Stdlib only.

import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const FRAGMENTS: readonly string[] = [
  "I delegated it to a subagent.",
  "The subagent delegated it back to me.",
  "So technically, it's still in progress.",
];

const GATE_MIN = 1;
const GATE_MAX = 200;

function compose(fragments: readonly string[]): string {
  if (fragments.length === 0) throw new Error("entry fails gate: no fragments");
  for (const fragment of fragments) {
    if (fragment.length === 0 || /[\r\n]/.test(fragment)) {
      throw new Error("entry fails gate: bad fragment");
    }
  }
  return fragments.join(" ");
}

function gateCheck(text: string): string {
  const problems: string[] = [];
  if (text.length < GATE_MIN) problems.push("empty");
  if (text.length > GATE_MAX) problems.push(`too long (${text.length} > ${GATE_MAX})`);
  if (/[\r\n]/.test(text)) problems.push("multi-line");
  if (text !== text.trim()) problems.push("leading/trailing whitespace");
  if (problems.length > 0) {
    throw new Error(`entry fails gate: ${problems.join("; ")}`);
  }
  return text;
}

async function main(): Promise<void> {
  const entry = gateCheck(compose(FRAGMENTS));
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  await mkdir(outDir, { recursive: true });
  await writeFile(resolve(outDir, "entry.txt"), entry, { encoding: "utf8", flag: "w" });
  process.stdout.write(`${entry}\n`);
}

main().catch((err: unknown) => {
  process.stderr.write(`error: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
