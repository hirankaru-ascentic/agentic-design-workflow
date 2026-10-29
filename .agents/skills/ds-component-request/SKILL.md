---
name: ds-component-request
description: Build a new component as a proposal on a sandbox/ branch when nothing in the design system fits, and record it in the Decision Record. Used automatically by agents at rung 4 of the decision ladder in AGENTS.md (check the catalogue, then use, configure, compose, propose), never on a user's request.
---

# Design system component request

On a `sandbox/<slug>` branch, when the idea needs UI that no existing
component can use, configure or compose, build it as a **proposal**: a
working component the sandbox can show, kept out of the design system
until a UX/UI designer approves it on the build issue. The user's idea is
never blocked waiting for approval.

## Steps

1. **Check the branch and the catalogue.** Run `git branch --show-current`.
   Off a `sandbox/*` branch, don't use this skill: stop and propose the
   component as rung 4 of the decision ladder in `AGENTS.md` says. On a
   sandbox, confirm nothing fits: read `src/design-system/index.ts`, list
   `src/components/ui/`, and read the stories of likely candidates
   (`*.stories.tsx`) for variants and props. If one fits, use it instead.

2. **Name it.** A PascalCase name describing what it is, not where it's
   used (`ContractTimeline`, not `DashboardThing`). If
   `src/design-system/proposals/<Name>/` exists, extend it instead of
   making a second one.

3. **Build the proposal** in `src/design-system/proposals/<Name>/`:
   - `<name>.tsx` (kebab-case file name), starting with:

     ```tsx
     /**
      * PROPOSAL: not approved. Used only on sandbox/<slug>.
      * Why: <why existing components can't use, configure or compose it>
      * Builds on: <existing components it uses>
      */
     ```

     Build it from `@/components/ui` primitives and existing
     design-system components, with tokens and the Tailwind scale only.
   - `index.ts` exporting it, so pages import
     `@/design-system/proposals/<Name>`.
   - `<name>.stories.tsx` with the title `Proposals/<Name>`, a story per
     variant and state the sandbox uses (loading, empty), and a `Dark`
     story (`globals: { theme: "dark" }`), like the stories next to
     `src/design-system/`.

   Don't export it from `src/design-system/index.ts`, and use it only on
   this sandbox's screens. `ds:audit` allows proposals on `sandbox/*` and
   fails on every other branch.

4. **Tell the user in one line**, in plain language, e.g. "Nothing in the
   design system shows a contract timeline, so I built a new Contract
   timeline component for this idea; a UX/UI designer approves it before
   it ships." Then carry on with the idea.

5. **Record it** under **New component requests** in
   `.sandbox/DECISION-RECORD.md`, replacing `none` or the placeholder, one
   bullet per proposal:

   ```markdown
   - **<Name>** (`src/design-system/proposals/<Name>/`): <why existing
     components fall short>. Used on: <screens or sections>. Builds on:
     <components>. Props: <main props>.
   ```

   Update the bullet when the proposal changes. If the idea stops using
   it, delete the folder and the bullet.

The work is saved with the rest of the sandbox by `sandbox-save`; don't
commit separately. Done when the proposal renders on the sandbox screen,
has a story, and is listed in the Decision Record.
