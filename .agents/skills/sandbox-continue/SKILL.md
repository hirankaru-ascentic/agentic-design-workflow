---
name: sandbox-continue
description: Reopen an existing sandbox exploration, bring it up to date and recap it. Use when the user says "continue ...", "let's keep going on ...", "pick up where I left off", "back to the ... idea", or otherwise asks to resume an exploration.
---

# Sandbox continue

Switches to an existing `sandbox/<slug>` branch, brings it up to date with
`pre-dev`, and recaps where the exploration stands. The user is usually a
designer: talk about the idea and the preview, and run every git step
yourself.

## Steps

1. **Find the exploration.** List the open explorations:

   ```bash
   git fetch origin --prune
   git for-each-ref refs/remotes/origin/sandbox --sort=-committerdate \
     --format='%(refname:lstrip=3)|%(committerdate:relative)'
   ```

   Match the user's words against the slugs. If exactly one fits, use it.
   Otherwise show the list in plain language, one line each: the idea's
   name (slug with spaces), when it last changed, and who worked on it
   (`git log origin/pre-dev..origin/sandbox/<slug> --format=%an | sort -u`,
   leaving out `github-actions[bot]`). Ask which one, and continue once
   the user picks.

2. **Keep unsaved work safe.** Run `git status --porcelain`. If it lists
   anything:
   - On a `sandbox/` or `feature/` branch: save it with the `sandbox-save`
     skill, then continue.
   - Anywhere else: ask the user, offering to move the changes into a new
     exploration (`sandbox-start` skill) or to set them aside with
     `git stash push -u -m "<branch>: before continuing <slug>"`. If you
     stash, tell them in one line that the changes are parked and you can
     bring them back on request.

   Continue once the working tree is clean.

3. **Switch and pull.**

   ```bash
   git switch sandbox/<slug>
   git pull --ff-only
   ```

   If the fast-forward fails because this computer has commits GitHub
   doesn't, run `git pull --no-rebase` to combine both. Note the last
   change for the recap: `git log -1 --format='%s, %cr, by %an'`.

4. **Merge the latest `pre-dev`.** `git merge --no-edit origin/pre-dev`.
   On a conflict, look at each conflicted file:
   - **Simple** (both sides can be kept without choosing between them):
     separate additions that touch the same lines, both sides' lines in
     the Decision Record's Commit log (keep all, oldest first), import
     lists, or `package-lock.json` (take `pre-dev`'s copy, then
     `npm install`). Resolve it, `git add` the file, and finish with
     `git commit --no-edit`.
   - **Anything else** (the same screen, text or behaviour changed two
     ways): `git merge --abort`, then explain in plain language what
     changed on each side and offer two or three options with a
     recommendation, such as keeping the exploration's version, taking
     the new shared version, or continuing without the update for now.

5. **Read the Decision Record.** If `.sandbox/HANDOFF.md` exists, rename it
   with `git mv .sandbox/HANDOFF.md .sandbox/DECISION-RECORD.md`. If
   neither exists, create `.sandbox/DECISION-RECORD.md` from the template
   as the `sandbox-start` skill does, filling Owner from the branch's first
   commit author. Read it in full.

6. **Add the user as a contributor.** If `git config user.name` is neither
   the Owner nor listed under Contributors, add them: replace `none yet`,
   or append `, <name>`.

7. **Push the update.** If steps 4–6 changed anything:

   ```bash
   git add .sandbox/DECISION-RECORD.md
   git commit -m "sandbox(<slug>): continue exploration"   # only if staged changes
   git push
   ```

   The commit hook adds the Commit log line.

8. **Recap and hand over.** In 2–3 plain lines: what was built (from the
   record), the last change (noted in step 3), and any open questions. Share
   the preview link, found as in the `sandbox-save` skill's "Share the
   preview link" step, and ask what they'd like to do next.

Done when the user is on an up-to-date `sandbox/<slug>`, listed in its
Decision Record, and has the recap, the preview link and the question.
