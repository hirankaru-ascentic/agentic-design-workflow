---
name: build-start
description: Start a production build on a feature/ branch from a build issue and its Decision Record. Use when the user says "start build from issue #...", "pick up the build issue for ...", "build the ... feature", or otherwise asks to build a closed sandbox exploration for real.
---

# Build start

Turns a `Build: <title>` issue (opened by `sandbox-close`) into a
`feature/<slug>` branch with a production build of the idea. The user is
usually a developer: be concise and technical, but still run every git
step yourself.

## Steps

1. **Find the issue.** Use the number the user gave; otherwise match their
   words against `gh issue list --label build --state open --json number,title`
   and ask if more than one fits.

   ```bash
   gh issue view <n> --json number,title,body,state,url,labels
   ```

   If the issue is closed, say so and ask whether to continue. `<slug>` is
   the branch name in the issue's "Sandbox branch" link, after `sandbox/`.

2. **Check component approvals.** In the issue's "New components to build"
   section, each `Approve new component: <Name> (UX/UI designer)` item is
   approved when ticked (`- [x]`) and not approved when unticked
   (`- [ ]`). If any are unticked, list them and ask how to proceed before
   continuing, with a recommendation:
   - Wait: stop here until the UX/UI designer ticks them on the issue.
   - Build without them: compose existing components instead and note
     the gap in the PR.
   - Treat them as approved: tick them on the issue
     (`gh issue edit <n> --body-file -`) and build them.

3. **Create the branch.** If `git status --porcelain` lists anything, save
   or stash it first as `sandbox-continue` step 2 does.

   ```bash
   git fetch origin --prune
   git switch -c feature/<slug> origin/pre-dev
   ```

   If `feature/<slug>` already exists, ask whether to continue on it
   (`git switch feature/<slug>`, then `git merge --no-edit origin/pre-dev`)
   or start fresh under another name.

4. **Load the Decision Record.** Read `docs/decision-records/<slug>.md`. If
   it isn't on `pre-dev` yet (its docs PR hasn't merged), read it with
   `git show origin/sandbox/<slug>:.sandbox/DECISION-RECORD.md`. Also read
   any Earlier Decision Records it links. Note the Lift policy, the
   chosen option and the open questions.

5. **Study the sandbox, as reference only.**

   ```bash
   git diff --stat origin/pre-dev...origin/sandbox/<slug> -- src
   git diff origin/pre-dev...origin/sandbox/<slug> -- src
   ```

   Never merge, rebase onto or cherry-pick from the sandbox branch: it
   carries the Decision Record and throwaway code.

6. **Share a short plan and wait for approval.** In under 15 lines:
   - What changes on screen, in the record's words.
   - Lift policy and what it means here.
   - Each piece of UI and its rung on the decision ladder (`AGENTS.md`),
     checked against `src/design-system/index.ts` and the stories:
     existing component used, configured or composed, or an approved new
     component (name, props, file in `src/design-system/`, its stories).
   - Data: which `clients-store` functions are used or added.
   - Loading, empty and error states, and accessibility notes.
   - Each open question from the record with a proposed answer.

   Adjust the plan to the user's answers, then continue.

7. **Lift (only when the policy is `lift`).** Apply the sandbox's own
   changes on top of the current `pre-dev`, leaving the Decision Record
   behind, and commit them unchanged so the PR can say what was lifted:

   ```bash
   git diff origin/pre-dev...origin/sandbox/<slug> -- src ':!src/design-system/proposals' | git apply --3way
   git add -A
   git commit -m "feat(<slug>): lift sandbox changes from sandbox/<slug>"
   ```

   Resolve any conflicts in favour of the current `pre-dev` code. Skip
   files the plan doesn't use. Proposals stay behind: step 8 rebuilds the
   approved ones, so point lifted imports of
   `@/design-system/proposals/<Name>` at `@/design-system`.

8. **Build approved components first.** For each ticked component, read
   its proposal on the sandbox
   (`git show origin/sandbox/<slug>:src/design-system/proposals/<Name>/<name>.tsx`
   and its story) as reference, then build it properly:
   - `src/design-system/<name>.tsx`, production quality, without the
     `PROPOSAL` comment, exported from `src/design-system/index.ts`.
   - `src/design-system/<name>.stories.tsx` (title
     `Design system/<Name>`) covering every variant and state, with a
     `Dark` story, written before the feature uses the component.

   Nothing goes in `src/design-system/proposals/` on a feature branch:
   `ds:audit` fails on it. Run `npm run stories:check`, and commit each
   component on its own: `feat(<slug>): add <Name> to the design system`.

9. **Build the feature.** Delegate to the `build-developer` sub-agent with
   the record path, the approved plan, the lift policy and
   `origin/sandbox/<slug>`. Without sub-agents, follow
   `.claude/agents/build-developer.md` yourself.

10. **Check and commit.** Run `npm run lint`, `npm run typecheck`,
   `npm run build`, `npm run ds:audit` and `npm run stories:check`; fix
   what fails and rerun. Then:

   ```bash
   git add -A
   git commit -m "feat(<slug>): <what changed>"
   ```

   Don't push yet: the `build-pr` skill pushes once the work is reviewed.

11. **Tell the user** in 3–4 lines: what was built, the check results,
    anything that differs from the plan, and that saying "open a PR" runs
    the reviews and opens the pull request. To try it, run `npm run dev`
    and open http://localhost:3000.

Done when `feature/<slug>` exists from the latest `pre-dev`, holds a build
of the approved plan that passes all five checks, and the user has the
summary.
