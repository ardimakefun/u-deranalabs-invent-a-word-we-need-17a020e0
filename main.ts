// Invent a Word We Need — writes one original coined word + definition to entry.txt.
//
// Deterministic: the same exact text is written on every run. No network,
// no randomness, no environment access except MAKEFUN_OUTPUT_DIR.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "Sendgret (n.): the instant regret of spotting a typo the second after you hit send.";

function gate(text: string): void {
  // Gate (RULES.txt): entry.txt must be UTF-8 text of 1 to 140 characters,
  // not only white space. Fail fast, exit non-zero on failure.
  const length = [...text].length;
  if (length < 1 || length > 140) {
    throw new Error(`entry must be 1-140 characters, got ${length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  gate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const outPath = join(outDir, "entry.txt");
  mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, ENTRY, "utf8");
  // Re-read the bytes from disk and re-validate the gate against them.
  const written = readFileSync(outPath, "utf8");
  gate(written);
  if (written !== ENTRY) {
    throw new Error("entry.txt bytes differ from the intended text");
  }
}

main();
