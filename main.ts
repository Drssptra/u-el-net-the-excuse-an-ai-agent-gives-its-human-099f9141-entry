// The Excuse an AI Agent Gives Its Human — make.fun entry.
//
// Writes a single original excuse line (at most 200 characters) to
// $MAKEFUN_OUTPUT_DIR/entry.txt with NO trailing newline, and prints the
// exact same line plus a trailing newline to stdout. Deterministic,
// stdlib only, no network at runtime.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I finished it, then my context window compacted the whole task into one word: 'eventually.'";

if (LINE.trim().length === 0) {
  process.stderr.write("error: entry line is empty\n");
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), LINE, "utf8");
process.stdout.write(LINE + "\n");
