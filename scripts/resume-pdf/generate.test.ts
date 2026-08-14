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
  assert.ok(pdf.length > 10_000, `PDF is suspiciously small: ${pdf.length} bytes`);
  assert.equal(countPages(pdf), 1, "the resume must fit on one page");
});
