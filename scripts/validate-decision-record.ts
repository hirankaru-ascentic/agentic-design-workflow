// Checks a Decision Record is complete enough to close and file.
//
//   npm run record:validate                       # .sandbox/DECISION-RECORD.md
//   npm run record:validate -- docs/decision-records/<slug>.md
//
// Fails when a required field or section is empty, a template placeholder
// ({{...}}) is left in, or Status or Lift policy has an unknown value.
// Runs with Node's built-in TypeScript support, so it uses only erasable
// syntax and Node built-ins.

import { existsSync, readFileSync } from "node:fs";

const path = process.argv[2] ?? ".sandbox/DECISION-RECORD.md";

const REQUIRED_FIELDS = ["Owner", "Contributors", "Started", "Status"];

// Sections that may say "none" but must not be empty. "Options explored and
// chosen option", "Figma links" and "Commit log" are optional.
const REQUIRED_SECTIONS = [
  "Problem or goal",
  "Who it's for",
  "What was built",
  "Preview link",
  "Components used",
  "New component requests",
  "Earlier Decision Records for this feature",
  "Open questions",
  "Lift policy",
];

const STATUSES = ["open", "closed"];
const LIFT_POLICIES = ["lift", "rewrite"];

function stripComments(text: string): string {
  return text.replace(/<!--[\s\S]*?-->/g, "").trim();
}

function sectionBody(markdown: string, heading: string): string | undefined {
  const lines = markdown.split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) return undefined;
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith("## "));
  return stripComments((end === -1 ? rest : rest.slice(0, end)).join("\n"));
}

function fieldValue(markdown: string, field: string): string | undefined {
  const match = markdown.match(new RegExp(`^- \\*\\*${field}:\\*\\*(.*)$`, "m"));
  return match ? stripComments(match[1]) : undefined;
}

if (!existsSync(path)) {
  console.error(`✗ ${path} not found.`);
  process.exit(1);
}

const markdown = readFileSync(path, "utf8");
const problems: string[] = [];

const title = markdown.match(/^# Decision Record:(.*)$/m)?.[1].trim();
if (!title) problems.push('Title: the first line must be "# Decision Record: <title>".');

for (const field of REQUIRED_FIELDS) {
  const value = fieldValue(markdown, field);
  if (value === undefined) problems.push(`${field}: field is missing.`);
  else if (!value) problems.push(`${field}: field is empty.`);
}

const status = fieldValue(markdown, "Status");
if (status && !STATUSES.includes(status)) {
  problems.push(`Status: "${status}" must be one of ${STATUSES.join(", ")}.`);
}

for (const heading of REQUIRED_SECTIONS) {
  const body = sectionBody(markdown, heading);
  if (body === undefined) problems.push(`${heading}: section is missing.`);
  else if (!body) problems.push(`${heading}: section is empty.`);
}

const liftPolicy = sectionBody(markdown, "Lift policy")?.split(/\s/)[0];
if (liftPolicy && !LIFT_POLICIES.includes(liftPolicy)) {
  problems.push(`Lift policy: "${liftPolicy}" must be one of ${LIFT_POLICIES.join(", ")}.`);
}

markdown.split("\n").forEach((line, index) => {
  for (const placeholder of line.match(/\{\{[^}]*\}\}/g) ?? []) {
    problems.push(`Line ${index + 1}: template placeholder ${placeholder} left in.`);
  }
});

if (problems.length > 0) {
  console.error(`✗ ${path} is not complete:`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`✓ ${path} is complete.`);
