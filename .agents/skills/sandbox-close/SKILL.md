---
name: sandbox-close
description: Close a sandbox exploration, complete its Decision Record, open a build issue and file the record in the knowledge base. Use when the user says "I'm done", "wrap this up", "close this exploration", "hand this over", "ready for development", or otherwise signals an exploration is finished.
---

# Sandbox close

Closes a `sandbox/<slug>` exploration: completes its Decision Record, opens
a GitHub issue to build it, files the record in `docs/decision-records/`
and closes the draft pull request. The branch itself is kept. The user is
usually a designer: tell them what is happening at each step in one plain
line, ask only what you can't work out, and run every git step yourself.

## Steps

1. **Pick the exploration.** Run `git branch --show-current`.
   - On a `sandbox/*` branch the user didn't name differently: use it.
   - Otherwise, list explorations as the `sandbox-continue` skill does
     (step 1) and ask which one to close. Switch to it with the
     `sandbox-continue` steps "Keep unsaved work safe" and "Switch and
     pull".

   On the branch, save any unsaved changes with the `sandbox-save` skill,
   then merge the latest `pre-dev` as `sandbox-continue` step 4 does
   (resolve simple conflicts, abort and explain anything else).

2. **Gather the facts.** `<slug>` is the branch name after `sandbox/`.

   ```bash
   git log origin/pre-dev..HEAD --no-merges --format='%h %ad %an: %s' --date=short
   git diff --stat origin/pre-dev...HEAD
   git diff --name-only --diff-filter=A origin/pre-dev...HEAD -- src
   gh pr view --json number,url,comments      # draft PR; preview as in sandbox-save step 5
   ls docs/decision-records/
   ```

   Read the changed files under `src/` and collect their imports from
   `@/design-system` and `@/components/ui/*`. New component proposals
   are the folders in `src/design-system/proposals/` (from the
   `ds-component-request` skill), plus any component written inside a page
   or added to `src/design-system/` or `src/components/ui/` on this
   branch.

3. **Complete the Decision Record.** If `.sandbox/HANDOFF.md` exists,
   rename it with `git mv .sandbox/HANDOFF.md .sandbox/DECISION-RECORD.md`;
   if neither exists, create it as `sandbox-start` does. Fill every
   remaining `{{...}}` yourself from step 2:
   - **Contributors:** commit authors other than the Owner and
     `github-actions[bot]`, or `none yet`.
   - **What was built:** what is on screen now, in plain language.
   - **Preview link:** the Vercel preview URL.
   - **Components used:** one bullet per component, grouped under
     `@/design-system` and `@/components/ui`.
   - **New component requests:** for each proposal, its name, why
     existing components fall short (the ladder's rung 4 in `AGENTS.md`),
     where it's used, the pieces it builds on and its props, as the
     `ds-component-request` skill writes them, or `none`.
   - **Earlier Decision Records for this feature:** related files in
     `docs/decision-records/`, or `none`.
   - **Figma links:** links found in the record, commits or PR, or `none`.

   Delegate this step to the `sandbox-recorder` sub-agent ("complete"),
   passing the preview URL and draft PR link from step 2; its report lists
   the gaps for step 4. Without sub-agents, do it yourself.

4. **Ask what you can't work out.** In one message, ask at most 3 short
   questions, only about gaps: the goal (if the record still has the bare
   idea), who it's for, open questions before it can ship. If the record
   or commits show several options, one question is which was chosen and
   why. In the same message, suggest a lift policy and ask the user to
   confirm it:
   - `lift`: small visual or copy changes; the sandbox code may be copied
     to the `feature/` branch.
   - `rewrite`: anything else; the idea is rebuilt from scratch.

   Write the answers into the record, set **Status:** `closed`, and set
   the Lift policy section's first word to the confirmed policy.

5. **Validate, commit and push.**

   ```bash
   npm run record:validate
   ```

   Fix every problem it lists and rerun until it passes, then:

   ```bash
   git add .sandbox/DECISION-RECORD.md
   git commit -m "sandbox(<slug>): close exploration"
   git push
   ```

   The commit hook adds the Commit log line. Note the commit for links:
   `sha=$(git rev-parse HEAD)`.

6. **Open the build issue.** Create the labels if missing:

   ```bash
   labels=$(gh label list --limit 200 --json name --jq '.[].name')
   echo "$labels" | grep -qx build ||
     gh label create build --color 0E8A16 --description "Ready to build on a feature/ branch"
   echo "$labels" | grep -qx from-sandbox ||
     gh label create from-sandbox --color 5319E7 --description "Comes from a closed sandbox exploration"
   ```

   Then create the issue, with `<title>` from the record's first line:

   ```bash
   gh issue create --title "Build: <title>" --label build --label from-sandbox --body-file - <<'EOF'
   <2–3 sentence summary: the goal, who it's for, what was built>

   **Chosen option:** <option and why, or "single option explored">
   **Lift policy:** <lift | rewrite>: <one line on what that means>

   ## New components to build

   - [ ] Approve new component: <Name> (UX/UI designer)
     <one line: why it's needed and where it's used; the proposal is in
     `src/design-system/proposals/<Name>/` on the sandbox branch>

   (one checklist item per New component request, or "None.")

   ## Links

   - Decision Record: https://github.com/<owner>/<repo>/blob/<sha>/.sandbox/DECISION-RECORD.md
   - Sandbox branch: https://github.com/<owner>/<repo>/tree/sandbox/<slug>
   - Draft PR: <draft PR URL>
   - Preview: <preview URL>
   EOF
   ```

7. **File the record in the knowledge base.**

   ```bash
   git fetch origin
   git switch -c docs/decision-record-<slug> origin/pre-dev
   git show sandbox/<slug>:.sandbox/DECISION-RECORD.md > docs/decision-records/<slug>.md
   ```

   If `docs/decision-records/<slug>.md` already exists on `pre-dev` (the
   idea was closed before), name the file `<slug>-<YYYY-MM-DD>.md` and
   list the older record under Earlier Decision Records. Add
   `- **Build issue:** <issue URL>` under the Status line, then:

   ```bash
   npm run record:validate -- docs/decision-records/<slug>.md
   git add docs/decision-records/
   git commit -m "docs(decision-record): <slug>"
   git push -u origin docs/decision-record-<slug>
   gh pr create --base pre-dev --title "docs(decision-record): <slug>" \
     --body "Files the closed Decision Record for \`sandbox/<slug>\` in the knowledge base. Build issue: <issue URL>"
   gh pr merge --auto --merge
   ```

   If auto-merge can't be enabled (the repo setting is off), leave the PR
   open for review and say so in the summary. Never merge it directly.
   Then add the PR to the issue:
   `gh issue comment <issue> --body "Decision Record filed in <docs PR URL>"`.

8. **Close the draft PR** without merging and without deleting the branch:

   ```bash
   gh pr close <draft PR number> --comment "Exploration closed. Decision Record: <docs PR URL>. Build issue: <issue URL>."
   ```

   Switch back with `git switch pre-dev` so no further edits land on the
   closed branch or the docs branch.

9. **Tell the user** in 3–4 plain lines: the exploration is closed and its
   notes are saved in the product knowledge base (docs PR link, and
   whether it merges automatically or waits for review), the build issue
   developers will pick up (link), and that the preview stays available
   (link).

Done when the record on `sandbox/<slug>` is closed and passes validation,
the build issue exists with both labels, the docs PR is open into
`pre-dev`, the draft PR is closed, and the user has the summary.
