import React from "react";
import { renderToFile } from "@react-pdf/renderer";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { DATA } from "../data/resume";
import { select } from "./resume-pdf/select";
import { ResumeDocument } from "./resume-pdf/document";

const OUTPUT = resolve(process.cwd(), "public/Resume.pdf");

/**
 * Counts page objects in a rendered PDF. The negative lookahead matters:
 * the page tree is `/Type /Pages` and must not be counted as a page.
 */
export function countPages(pdf: Buffer): number {
  return (pdf.toString("latin1").match(/\/Type\s*\/Page(?![s])/g) ?? []).length;
}

async function main() {
  const data = select(DATA);
  await renderToFile(<ResumeDocument data={data} />, OUTPUT);

  const pages = countPages(readFileSync(OUTPUT));
  if (pages !== 1) {
    console.warn(
      `[resume-pdf] warning: rendered ${pages} pages, expected 1. ` +
        `Trim bullet copy in data/resume.json or lower MAX_PROJECT_HIGHLIGHTS.`,
    );
  }
  console.log(`[resume-pdf] wrote public/Resume.pdf (${pages} page${pages === 1 ? "" : "s"})`);
}

if (process.argv[1]?.endsWith("generate-resume-pdf.tsx")) {
  main().catch((error) => {
    console.error("[resume-pdf] generation failed:", error);
    process.exit(1);
  });
}
