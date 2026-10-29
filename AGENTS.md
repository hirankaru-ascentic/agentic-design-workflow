# AGENTS.md

The single source of rules for every coding agent in this repo. `CLAUDE.md`
imports this file, so Claude Code and Cursor follow the same rules.

## Project

A **Clients manager**: a dashboard plus create/edit/delete for clients. It is
the target app for the agentic design workflow POC, so the design system
boundary matters more than features. Domain terms (client, status, contract
value…) are defined in `CONTEXT.md`; read it before naming anything.

**Stack:** Next.js 16 (App Router, TypeScript, Cache Components on),
Tailwind CSS v4, shadcn/ui `base-nova` style on Base UI, Recharts,
next-themes, npm.

**Next.js 16 differs from your training data.** Before writing Next.js code,
read the relevant guide in `node_modules/next/dist/docs/`. Two gotchas this
app has already hit:

- Runtime values (`useParams`, `usePathname`, `new Date()`) must sit inside a
  `<Suspense>` boundary or an event handler, or the build fails.
- Visited pages stay mounted in the background (React Activity). Reset form
  and dialog state explicitly when a fresh state is expected.

**Base UI, not Radix:** compose with the `render` prop
(`<Button render={<Link href="/" />} nativeButton={false}>`), not `asChild`.

**Data:** clients live in the browser's localStorage. All reads and writes go
through `src/lib/clients-store.ts`, so a real database can replace it later
without touching pages.

```
src/
├── app/               # Routes. globals.css holds every design token
├── components/ui/     # shadcn/ui primitives
├── design-system/     # Shared app components, exported from index.ts
├── data/              # Seed data (25 clients)
├── hooks/             # Shared React hooks
└── lib/               # clients-store (data access), domain helpers, format
```

## Commands

| Command             | Purpose                      |
| ------------------- | ---------------------------- |
| `npm run dev`       | Dev server on localhost:3000 |
| `npm run build`     | Production build             |
| `npm run lint`      | ESLint                       |
| `npm run typecheck` | Route types + `tsc --noEmit` |
| `npm run ds:audit`  | Design system rules check    |

## Design system rules

### Tokens

Every colour, spacing, radius and font size comes from a token defined in
`src/app/globals.css` (oklch values in `:root` for light and `.dark` for
dark, mapped to Tailwind in `@theme inline`). Use token utilities
(`bg-primary`, `text-muted-foreground`, `text-status-active-foreground`) and
the Tailwind scale (`p-4`, `gap-6`, `rounded-lg`, `text-sm`).

Hex, rgb, oklch or arbitrary values (`p-[13px]`, `text-[15px]`) never appear
outside `globals.css`. When a token is missing, add it to `globals.css` in
both `:root` and `.dark`, then use it.

### Decision ladder

Before creating any UI, climb this ladder and stop at the first rung that
fits:

1. **Use it.** The component exists in `@/design-system` or
   `@/components/ui`.
2. **Configure it.** An existing component covers it through a variant or
   props.
3. **Compose it.** Build it by combining existing components.
4. **Propose it.** Stop and propose a new component: name, props, which
   existing pieces it builds on, and why rungs 1–3 fall short. Wait for
   approval before writing it.

An approved app component goes in `src/design-system/` and is exported from
`src/design-system/index.ts`. Add a new shadcn primitive with
`npx shadcn@latest add <name>`.

### Pages assemble

Pages in `src/app/**` only assemble components. They import UI from
`@/design-system` and `@/components/ui`, and data from `@/lib/*`. Layout,
spacing and visual styling live inside design-system components, so pages
carry no styling of their own.

## Branches and workflow

| Branch                        | Role                           | Created from | Ends up                        |
| ----------------------------- | ------------------------------ | ------------ | ------------------------------ |
| `main`                        | Live                           | –            | –                              |
| `dev`                         | QA                             | –            | –                              |
| `pre-dev`                     | Integration                    | –            | –                              |
| `feature/<idea>`              | Production work                | `pre-dev`    | PR into `pre-dev`              |
| `sandbox/<idea>`              | Design ideation; throwaway     | `pre-dev`    | Never merged                   |
| `docs/decision-record-<slug>` | Files a closed Decision Record | `pre-dev`    | PR into `pre-dev` (auto-merge) |

- `main`, `dev` and `pre-dev` change only through reviewed pull requests.
  Work on a `feature/` or `sandbox/` branch and push that branch.
- Start every new branch from the latest `pre-dev` (`git fetch` first).
- A `feature/` branch is merged into `pre-dev` by pull request after review.
- A `sandbox/` branch is for exploring design ideas. Share it through its
  Vercel preview. To ship an idea, rebuild it on a fresh `feature/` branch.
- Name branches `<type>/<short-kebab-idea>`, e.g. `feature/client-notes`.

## Sandbox workflow (works with or without skills)

Skills live in `.agents/skills/` (`.claude/skills` links to it). Cheat
sheet:

| The user says                                                                                   | Skill              | What it does                                                                                   |
| ----------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| "start exploration: …", "I want to try an idea for …", "new sandbox for …"                      | `sandbox-start`    | Creates `sandbox/<slug>` from the latest `pre-dev` with a filled `.sandbox/DECISION-RECORD.md` |
| "continue …", "let's keep going on …", "pick up where I left off", "back to the … idea"         | `sandbox-continue` | Switches to an exploration, updates it from `pre-dev`, recaps it and shares the preview        |
| "show my explorations", "what am I working on", "where was I"                                   | `sandbox-list`     | Lists open explorations with owner, last change and preview link                               |
| "save", "save my work", "push this", "keep my progress"                                         | `sandbox-save`     | Commits and pushes the current `sandbox/` or `feature/` branch and shares the preview link     |
| "I'm done", "wrap this up", "close this exploration", "hand this over", "ready for development" | `sandbox-close`    | Completes the Decision Record, opens a build issue, files the record and closes the draft PR   |

Users never type skill names. Pick the skill from what they say. If skills
aren't available in your tool, read the matching `SKILL.md` and follow the
same steps.

The **Decision Record** (`.sandbox/DECISION-RECORD.md`, from
`.sandbox/DECISION-RECORD.template.md`) records the exploration for whoever
rebuilds it on a `feature/` branch. A legacy `.sandbox/HANDOFF.md` is the
same file under its old name: rename it with `git mv` when you find it.
Closed records are filed in `docs/decision-records/`, the Living Product
Knowledge Base.

Automation does the bookkeeping, so don't repeat it by hand:

- A commit hook (`.husky/post-commit`) adds a dated line to the Decision
  Record's Commit log on every commit on a `sandbox/` branch.
- Every push to a `sandbox/` branch opens a draft pull request
  "Sandbox: <slug> (do not merge)" into `pre-dev`, which carries the Vercel
  preview, and creates the Decision Record if it is missing
  (`.github/workflows/sandbox-draft-pr.yml`).
- `npm run record:validate` checks a Decision Record has every required
  field filled and no template placeholders left
  (`scripts/validate-decision-record.ts`).
- A PR from a `docs/decision-record-*` branch fails if it changes anything
  outside `docs/decision-records/`
  (`.github/workflows/decision-record-guard.yml`).
- Every other non-sandbox PR into `pre-dev` runs lint, typecheck, build
  and `ds:audit` (`.github/workflows/feature-checks.yml`).
- A Claude Code hook blocks file edits while `main`, `dev` or `pre-dev` is
  checked out (`.claude/hooks/protect-shared-branches.sh`).

### Sub-agents

Claude Code delegates focused work to sub-agents in `.claude/agents/`; the
skills say when. Tools without sub-agents follow the agent's file as
instructions instead.

| Sub-agent          | Model  | Does                                                   |
| ------------------ | ------ | ------------------------------------------------------ |
| `sandbox-explorer` | sonnet | Builds pages and design options on a `sandbox/` branch |
| `sandbox-recorder` | haiku  | Keeps and completes Decision Records                   |
| `build-developer`  | sonnet | Production builds from a Decision Record and plan      |
| `ds-guardian`      | haiku  | Read-only design system review                         |
| `ds-a11y-checker`  | haiku  | Read-only accessibility review                         |

### Rules by branch

Check the branch (`git branch --show-current`) at the start of every
session.

**On `sandbox/*`:**

- At session start, run the `sandbox-continue` steps from "Switch and
  pull" on (without the skill, read its `SKILL.md`): pull the branch,
  merge `origin/pre-dev` (resolve simple conflicts yourself, abort and
  explain anything else in plain language), read the Decision Record
  (rename a legacy `HANDOFF.md`, create it if missing), add the current
  git user to Contributors, then recap in 2–3 lines with the preview link
  and ask what's next.
- While working: delegate building pages and options to the
  `sandbox-explorer` sub-agent. Fix design-system issues (hardcoded
  values, missing tokens) silently, and never block the user's idea on a
  rule. Keep the Decision Record current as the work changes
  (`sandbox-recorder`).
- When the user seems done ("I'm done", "wrap this up", "hand this
  over"): offer to close the exploration. Closing follows the
  `sandbox-close` steps (without the skill, read its `SKILL.md`):
  complete and validate the Decision Record, asking at most 3 short
  questions and confirming the lift policy; open a "Build: <title>" issue;
  file the record on a `docs/decision-record-<slug>` branch by PR into
  `pre-dev`; close the draft PR without merging or deleting the branch.
- Never merge, never push to `main`, `dev` or `pre-dev`, and never open a
  regular (non-draft) pull request from a `sandbox/` branch.

**On `feature/*`:**

- Build from a closed Decision Record in `docs/decision-records/` and its
  build issue (`build-start`). Use the `sandbox/` branch as reference only:
  never merge, rebase onto or cherry-pick from it. Copy its code only when
  the record's Lift policy is `lift`, then clean it up.
- Build only new components ticked as approved on the build issue.
- Production quality: data through `clients-store`, loading, empty and
  error states, accessibility, and every design system rule.
- Run `npm run build`, `npm run lint`, `npm run typecheck` and
  `npm run ds:audit` before every push, and report the result.
- Open the pull request into `pre-dev` with `build-pr`.

**On `main`, `dev` or `pre-dev`:** don't edit files (a hook enforces this
in Claude Code). Offer to start a sandbox (to explore an idea) or a
feature branch (for production work).

## Developer workflow

Developers turn a closed exploration into production code. Cheat sheet:

| The user says                                                                   | Skill         | What it does                                                                                               |
| ------------------------------------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------- |
| "start build from issue #…", "pick up the build issue for …", "build the … feature" | `build-start` | Checks component approvals, creates `feature/<slug>` from `pre-dev`, plans from the Decision Record, builds |
| "open a PR", "ready for review", "submit this"                                  | `build-pr`    | Runs all checks and reviews, pushes, opens a PR into `pre-dev` that closes the build issue                 |

## Working with non-technical users

Many people using this repo are designers or product people, not developers.

- Explain in plain language: describe what changed on screen and why, not
  file names or git terms. Briefly define any technical word you must use.
- Do every git step yourself: branching, committing, pushing, opening pull
  requests. Ask the user to choose or approve, never to type a command.
- Show work through links: the local dev URL or the branch's Vercel preview.
- When a decision is needed, give two or three plain options with a
  recommendation.

## Definition of done (feature branches)

A `feature/` branch is done when all four pass with no errors:

```bash
npm run build
npm run lint
npm run typecheck
npm run ds:audit
```

Run them before opening or updating a pull request, and report the result.
