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

| Command             | Purpose                          |
| ------------------- | -------------------------------- |
| `npm run dev`       | Dev server on localhost:3000     |
| `npm run build`     | Production build                 |
| `npm run lint`      | ESLint                           |
| `npm run typecheck` | Route types + `tsc --noEmit`     |

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

| Branch           | Role                                      | Created from | Ends up            |
| ---------------- | ----------------------------------------- | ------------ | ------------------ |
| `main`           | Live                                      | –            | –                  |
| `dev`            | QA                                        | –            | –                  |
| `pre-dev`        | Integration                               | –            | –                  |
| `feature/<idea>` | Production work                           | `pre-dev`    | PR into `pre-dev`  |
| `sandbox/<idea>` | Design ideation; throwaway                | `pre-dev`    | Never merged       |

- `main`, `dev` and `pre-dev` change only through reviewed pull requests.
  Work on a `feature/` or `sandbox/` branch and push that branch.
- Start every new branch from the latest `pre-dev` (`git fetch` first).
- A `feature/` branch is merged into `pre-dev` by pull request after review.
- A `sandbox/` branch is for exploring design ideas. Share it through its
  Vercel preview. To ship an idea, rebuild it on a fresh `feature/` branch.
- Name branches `<type>/<short-kebab-idea>`, e.g. `feature/client-notes`.

## Sandbox workflow

Skills live in `.agents/skills/` (`.claude/skills` links to it). Use them
for these requests:

- **`start-exploration`**: "Start exploration: <idea>". Creates
  `sandbox/<slug>` from the latest `pre-dev` with a filled
  `.sandbox/HANDOFF.md`.
- **`save-my-work`**: "Save my work". Commits and pushes the current
  `sandbox/` or `feature/` branch and shares the preview link.

Every push to a `sandbox/` branch opens a draft pull request into
`pre-dev` (`.github/workflows/sandbox-draft-pr.yml`), which carries the
Vercel preview. `.sandbox/HANDOFF.md` records the exploration for whoever
rebuilds it on a `feature/` branch.

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

A `feature/` branch is done when all three pass with no errors:

```bash
npm run build
npm run lint
npm run typecheck
```

Run them before opening or updating a pull request, and report the result.
