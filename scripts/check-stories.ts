// Checks every design-system component has a Storybook story.
//
//   npm run stories:check
//
// Fails when a component exported from src/design-system/index.ts has no
// <file>.stories.tsx next to its module that mentions it, or when a
// proposal folder in src/design-system/proposals/<Name>/ has no story.
// Runs with Node's built-in TypeScript support, so it uses only erasable
// syntax and Node built-ins.

import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DESIGN_SYSTEM = "src/design-system";
const PROPOSALS = join(DESIGN_SYSTEM, "proposals");
const EXPORT = /export\s*\{([^}]+)\}\s*from\s*["']\.\/([^"']+)["']/g;

const index = readFileSync(join(DESIGN_SYSTEM, "index.ts"), "utf8");
const problems: string[] = [];
let checked = 0;

for (const [, names, module] of index.matchAll(EXPORT)) {
  const storyFile = join(DESIGN_SYSTEM, `${module}.stories.tsx`);
  const story = existsSync(storyFile) ? readFileSync(storyFile, "utf8") : undefined;
  for (const name of names.split(",").map((part) => part.trim().split(/\s+as\s+/).pop()!)) {
    if (!name || name.startsWith("type ")) continue;
    checked++;
    if (story === undefined) problems.push(`${name}: add ${storyFile}.`);
    else if (!new RegExp(`\\b${name}\\b`).test(story)) {
      problems.push(`${name}: ${storyFile} doesn't use it.`);
    }
  }
}

if (existsSync(PROPOSALS)) {
  for (const entry of readdirSync(PROPOSALS, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    checked++;
    const folder = join(PROPOSALS, entry.name);
    if (!readdirSync(folder).some((file) => file.endsWith(".stories.tsx"))) {
      problems.push(`Proposal ${entry.name}: add a .stories.tsx file in ${folder}.`);
    }
  }
}

if (problems.length > 0) {
  console.error(`✗ ${problems.length} component(s) without a story:`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}

console.log(`✓ All ${checked} design-system components have stories.`);
