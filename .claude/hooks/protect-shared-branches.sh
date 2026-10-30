#!/usr/bin/env bash
# PreToolUse hook: blocks file edits in this repo while main, dev or pre-dev
# is checked out. Those branches change only through reviewed pull requests.
# Files outside the repo (memory, scratch files) are not affected.

input=$(cat)
file=$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_input.notebook_path // empty')
repo="${CLAUDE_PROJECT_DIR:-$(pwd)}"

case "$file" in
  "$repo"/* | [!/]*) ;;
  *) exit 0 ;;
esac

branch=$(git -C "$repo" branch --show-current 2>/dev/null)

case "$branch" in
  main | dev | pre-dev)
    cat >&2 <<EOF
Blocked: "$branch" is a shared branch that only changes through reviewed pull requests, so files can't be edited on it.
Offer the user two options instead: start a sandbox to explore a design idea (sandbox-start skill), or create a feature/ branch from the latest pre-dev for production work (build-start skill when there is a build issue). Make the edit once on that branch.
EOF
    exit 2
    ;;
esac

exit 0
