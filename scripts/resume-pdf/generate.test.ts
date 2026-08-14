import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { countPages } from "../generate-resume-pdf";

test("countPages counts page objects without counting the page tree", () => {
  const fake = Buffer.from("/Type /Pages /Type /Page /Type /Page");
  assert.equal(countPages(fake), 2);
});

test("the generator writes a single-page PDF", () => {
  execFileSync("node", ["--import", "tsx", "scripts/generate-resume-pdf.tsx"], {
    stdio: "inherit",
  });
  const pdf = readFileSync("public/Resume.pdf");
  assert.ok(pdf.subarray(0, 5).toString() === "%PDF-", "output is not a PDF");
  // 5,000 bytes is a sanity floor, not a target: it catches a broken or
  // near-empty PDF. A genuinely single-page render of this layout with
  // standard, non-embedded PDF fonts tops out around 7,500-10,000 bytes
  // depending on content density, so 10,000 was an ungrounded guess.
  assert.ok(pdf.length > 5_000, `PDF is suspiciously small: ${pdf.length} bytes`);
  assert.equal(countPages(pdf), 1, "the resume must fit on one page");
});
