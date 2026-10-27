---
name: sandbox-list
description: List the open sandbox explorations with owner, last change and preview link. Use when the user says "show my explorations", "what am I working on", "where was I", or otherwise asks which explorations exist.
---

# Sandbox list

Shows every open `sandbox/` exploration so the user can pick one up. The
user is usually a designer: describe explorations by idea, not branch name.
This skill only reads; it changes no branch or file.

## Steps

1. **Gather the branches.**

   ```bash
   git fetch origin --prune
   git for-each-ref refs/remotes/origin/sandbox --sort=-committerdate \
     --format='%(refname:lstrip=3)|%(committerdate:relative)|%(committerdate:short)'
   ```

2. **Read each Decision Record.** For each slug:

   ```bash
   git show origin/sandbox/<slug>:.sandbox/DECISION-RECORD.md
   ```

   Take the Title, Owner, Contributors and Status. Fall back to
   `.sandbox/HANDOFF.md`, then to the branch's first commit author
   (`git log origin/pre-dev..origin/sandbox/<slug> --reverse --format=%an | head -1`)
   for the owner and the slug for the title. Leave out branches whose
   Status is `closed`.

3. **Find the preview links.** List the draft PRs once:

   ```bash
   gh pr list --state open --limit 100 --json number,headRefName,url \
     --jq '.[] | select(.headRefName | startswith("sandbox/"))'
   ```

   For each branch, take the Vercel preview URL from its PR's comments
   (`gh pr view <number> --json comments`). Without one, use the PR link;
   without a PR, say "no preview yet".

4. **Show the list,** newest change first, one line each: title, owner,
   last change (relative date), preview link. Mark the user's own
   (`git config user.name` matches the Owner) with "(yours)", and ones
   they contributed to with "(you helped)". If there are none, say so and
   offer to start one (`sandbox-start` skill).

5. **Offer the next step:** continuing one of them (`sandbox-continue`
   skill).

Done when every open exploration on `origin` is listed with its owner,
last change and preview link or a stated reason it has none.
