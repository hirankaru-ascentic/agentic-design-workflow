---
name: start-exploration
description: Start a sandbox branch for a new design idea. Use when the user says "Start exploration: <idea>" or asks to explore or try out a design idea.
---

# Start exploration

Opens a throwaway `sandbox/<slug>` branch from the latest `pre-dev`, with a
filled-in `.sandbox/HANDOFF.md`. The user is usually a designer: talk about
the idea and the preview, and run every git step yourself.

## Steps

1. **Check for unsaved work.** Run `git status --porcelain`. If it lists
   anything, tell the user they have unsaved changes on the current branch
   and offer to save them first with the `save-my-work` skill. Continue
   once the working tree is clean.

2. **Pick the slug.** Turn the idea into 2–4 lowercase words joined by
   hyphens (`client-notes-panel`). Confirm it in one line, e.g.
   "I'll call this exploration `client-notes-panel`, OK?", and use the
   user's alternative if they give one.

3. **Create the branch.**

   ```bash
   git fetch origin
   git switch pre-dev
   git pull --ff-only origin pre-dev
   git switch -c sandbox/<slug>
   ```

   If `sandbox/<slug>` already exists locally or on `origin`, propose a
   different slug (add a short qualifier) and confirm again.

4. **Write the handoff.** Copy `.sandbox/HANDOFF.template.md` to
   `.sandbox/HANDOFF.md` and fill:
   - **Title:** a short human title for the idea.
   - **Owner:** `git config user.name`.
   - **Started:** today, `YYYY-MM-DD`.
   - **Status:** `open`.
   - **Problem or goal:** the idea in the user's own words, unedited.

   Leave every other section as its placeholder.

5. **Commit and push.**

   ```bash
   git add .sandbox/HANDOFF.md
   git commit -m "sandbox(<slug>): start exploration"
   ```

   Append the first Commit log line to `.sandbox/HANDOFF.md`, using the
   start commit's short hash (`git rev-parse --short HEAD`):

   ```
   - YYYY-MM-DD · <short hash> · sandbox(<slug>): start exploration
   ```

   Commit that as `sandbox(<slug>): log save`, then push both commits:

   ```bash
   git push -u origin sandbox/<slug>
   ```

6. **Tell the user**, in plain language, that their exploration space is
   ready, and that within a minute or two a draft pull request (a page on
   GitHub that tracks this idea) and a preview link (a live website
   showing their changes) will appear on GitHub. Saying "Save my work"
   at any point saves and shares the latest version.

Done when `sandbox/<slug>` is on `origin` with a filled `HANDOFF.md`, and
the user has had that message.
