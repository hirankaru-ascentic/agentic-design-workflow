---
name: sandbox-save
description: Commit and push the user's current work, then share the preview link. Use when the user says "save", "save my work", "push this", "keep my progress", or otherwise asks to save, commit or push their changes.
---

# Sandbox save

Saves the user's changes to their branch on GitHub. The user is usually a
designer: describe what was saved on screen, and run every git step
yourself.

## Steps

1. **Check the branch.** Run `git branch --show-current`.
   - `main`, `dev` or `pre-dev`: explain that these are shared branches
     that only change through reviewed pull requests, so work can't be
     saved there directly. Offer to start an exploration
     (`sandbox-start` skill) to hold the changes. Stop.
   - `sandbox/*`: follow **Sandbox branch**.
   - `feature/*`: follow **Feature branch**.
   - Anything else: explain that saving works on `sandbox/` and
     `feature/` branches, offer `sandbox-start`, and stop.

2. **Check for changes.** If `git status --porcelain` is empty and nothing
   is waiting to be pushed, tell the user everything is already saved,
   share the preview link (Sandbox step 5), and stop.

## Sandbox branch

1. **Check the Decision Record.** If `.sandbox/HANDOFF.md` exists, rename
   it with `git mv .sandbox/HANDOFF.md .sandbox/DECISION-RECORD.md`. If
   neither exists, create `.sandbox/DECISION-RECORD.md` from
   `.sandbox/DECISION-RECORD.template.md` as the `sandbox-start` skill
   does. Update any section the changes touched (what was built,
   components used, new component requests, open questions): delegate
   this to the `sandbox-recorder` sub-agent ("update") when available.

2. **Tidy design tokens quietly.** In the changed files (`git status
   --porcelain`, plus `git diff --name-only origin/pre-dev...HEAD`),
   outside `src/app/globals.css`, replace every hardcoded colour (hex,
   `rgb()`, `hsl()`, `oklch()`) and arbitrary value (`p-[13px]`,
   `text-[15px]`, `bg-[#fff]`) with the closest token utility or
   Tailwind scale step, per the Tokens rules in `AGENTS.md`. When no
   token fits, add one to `globals.css` in both `:root` and `.dark`.
   This step always finishes: save the work even if something can't be
   tidied, and mention any fix in one plain sentence.

3. **Commit.** Write a short plain-language message describing what
   changed on screen, prefixed with the slug (the branch name after
   `sandbox/`):

   ```bash
   git add -A
   git commit -m "sandbox(<slug>): <what changed>"
   ```

   The commit hook adds the line to the Decision Record's Commit log; don't
   add it yourself.

4. **Push.** `git push -u origin HEAD`.

5. **Share the preview link.** Find the newest Vercel preview URL for the
   branch, trying in order:

   ```bash
   # the draft PR and its comments (Vercel posts the preview there)
   gh pr view --json url,comments
   # deployment statuses for the latest commit
   gh api "repos/{owner}/{repo}/deployments?ref=$(git branch --show-current)" --jq '.[0].statuses_url'
   gh api <statuses_url> --jq '.[0].environment_url'
   ```

   Share the preview URL. If it isn't there yet, share the draft PR link
   and say the preview appears on it within a minute or two. If no PR
   exists yet, say it will appear on GitHub shortly.

## Feature branch

1. **Check the build.** Run `npm run build`, `npm run lint`,
   `npm run typecheck` and `npm run ds:audit`. Fix every error the changes
   caused and rerun until all four pass. Errors you can't fix: list them in plain language and
   continue.

2. **Commit and push** with a short plain-language message describing the
   change:

   ```bash
   git add -A
   git commit -m "<what changed>"
   git push -u origin HEAD
   ```

3. **Report** what was saved and the result of each check. If any check
   still fails, say the branch isn't ready for review until it passes.
