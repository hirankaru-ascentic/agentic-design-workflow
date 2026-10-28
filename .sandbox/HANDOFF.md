# Sandbox handoff: Client notes page

- **Owner:** Hiran Karu
- **Started:** 2026-10-26
- **Status:** open <!-- open | closed -->

## Problem or goal

client notes page

## Who it's for

{{The people this idea serves.}}

## What was built

A notes page for each client (`/clients/<id>/notes`). The top shows the client's name, their company and an "Edit client" button. Below that is a "New note" text box with an "Add note" button (Ctrl/⌘ + Enter also adds the note; adding an empty note shows a hint). Then comes every note for that client, newest first, each with the date and time it was added and a delete icon that asks "Delete this note?" first. A client with no notes shows "No notes yet. Add the first one above."

How to get there: a notebook icon on each row of the clients list, and a "Notes" button at the top of a client's edit page. Notes are stored in the browser (localStorage), like clients.

## Preview link

{{Vercel preview URL for this branch.}}

## Options explored and chosen option

{{Optional. Each option tried, and which one was chosen and why.}}

## Components used

- `@/design-system`: `PageHeader`, `ClientTable` (new notes icon per row), `ClientNotes` (new)
- `@/components/ui`: `Card`, `Button`, `Field`, `Textarea` (new), `AlertDialog`, `Skeleton`

## New component requests

- **`ClientNotes`** (approved and built here): props `notes: Note[] | null` (newest first; `null` = loading), `onAdd(body)`, `onDelete?(note)`. Built on `Card`, `Field`, `Textarea`, `Button`, `AlertDialog` and `Skeleton`. Needed because nothing existing shows a list of written notes with an add box.
- **`Textarea`**: the standard shadcn primitive, added with `npx shadcn@latest add textarea`. The app only had single-line inputs.
- **Data:** a `Note` type (`src/lib/notes.ts`) and a notes store (`src/lib/notes-store.ts`) mirroring `clients-store`. "Note" was added to `CONTEXT.md`.

## Figma links

{{Links to related Figma files or frames.}}

## Open questions

- Deleting a client leaves their notes in storage. Should notes be deleted along with the client?
- Should notes be editable after they're added, or only added and deleted?

## Lift policy

rewrite <!-- rewrite: the idea ships by being rebuilt on a fresh feature/ branch; no sandbox code is copied across. -->

## Commit log

<!-- One line per save: YYYY-MM-DD · short hash · message -->
- 2026-10-26 · 445b276 · sandbox(client-notes-page): start exploration
- 2026-10-26 · 0a9d633 · sandbox(client-notes-page): add a notes page for each client
