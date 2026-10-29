---
name: build-pr
description: Check, review, push and open a pull request into pre-dev from a feature/ branch. Use when the user says "open a PR", "ready for review", "submit this", or otherwise asks to hand finished feature work over for review.
---

# Build PR

Gets a `feature/*` branch ready for review: runs every check, reviews the
design system and accessibility, pushes, and opens a pull request into
`pre-dev` that closes the build issue.

## Steps

1. **Check the branch.** Run `git branch --show-current`.
   - `feature/*`: continue. `<slug>` is the name after `feature/`.
   - `sandbox/*`: explain that sandboxes are never merged; offer to close
     it (`sandbox-close`) or build it properly (`build-start`). Stop.
   - Anything else: explain that pull requests come from `feature/`
     branches and offer `build-start`. Stop.

2. **Bring it up to date.** Commit any uncommitted work with a short
   message describing the change, then `git fetch origin` and
   `git merge --no-edit origin/pre-dev`. Resolve simple conflicts; for
   anything else, abort and explain both sides.

3. **Run the checks.**

   ```bash
   npm run lint
   npm run typecheck
   npm run build
   npm run ds:audit
   ```

   Fix every failure and rerun until all four pass. If one can't be fixed,
   report it with its output and ask whether to open the PR as a draft or
   stop.

4. **Review.** List the changed files with
   `git diff --name-only origin/pre-dev...HEAD -- src`, then run the
   `ds-guardian` and `ds-a11y-checker` sub-agents in parallel, giving both
   the file list and `ds-guardian` the `ds:audit` output. Without
   sub-agents, follow `.claude/agents/ds-guardian.md` and
   `.claude/agents/ds-a11y-checker.md` yourself. Fix each confirmed
   problem, rerun the checks, and commit. Keep the problems you chose not
   to fix for the PR body.

5. **Gather the links.** From `docs/decision-records/<slug>.md` (or the
   sandbox's `.sandbox/DECISION-RECORD.md` if it isn't filed yet), read the
   **Build issue** number, the **Preview link** and the **Lift policy**.
   If the issue isn't there, find it with
   `gh issue list --label build --search "<slug>"` or ask the user. Check
   for lifted code:

   ```bash
   git log origin/pre-dev..HEAD --format=%s --grep="lift sandbox changes"
   ```

6. **Push and open the PR.**

   ```bash
   git push -u origin HEAD
   gh pr create --base pre-dev --title "<Issue title without 'Build: '>" --body-file - <<'EOF'
   Closes #<issue>

   <2–3 sentences: what changes on screen and for whom>

   ## Links

   - Decision Record: https://github.com/<owner>/<repo>/blob/pre-dev/docs/decision-records/<slug>.md
   - Sandbox preview: <preview URL>
   - Sandbox branch: https://github.com/<owner>/<repo>/tree/sandbox/<slug>

   ## Notes

   - <Lifted: "Code was lifted from `sandbox/<slug>` (commit <sha>) and cleaned up."
     Rewritten: "Rebuilt from the Decision Record; no sandbox code was copied.">
   - <How the record's open questions were answered>
   - <Review problems left unfixed, and why, or drop this line>

   ## Checks

   lint ✓ · typecheck ✓ · build ✓ · ds:audit ✓
   EOF
   ```

   If a PR for the branch already exists (`gh pr view`), push and update
   its body with `gh pr edit --body-file -` instead.

7. **Tell the user** in 2–3 lines: the PR link, the check and review
   results, and that the Feature checks workflow reruns the same checks on
   GitHub. The PR merges into `pre-dev` only after review.

Done when all four checks pass (or the user chose a draft), the branch is
pushed, and the PR into `pre-dev` says `Closes #<issue>` and links the
Decision Record and preview.
