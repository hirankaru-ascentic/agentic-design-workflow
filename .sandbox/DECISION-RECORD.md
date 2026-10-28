# Decision Record: Client dashboard filters

- **Owner:** hirankaru-ascentic
- **Contributors:** none yet
- **Started:** 2026-10-27
- **Status:** open <!-- open | closed -->

## Problem or goal

Let people narrow the dashboard to one client status (Active, Paused or Churned) so they can see, for example, how much contract value sits with paused clients.

## Who it's for

{{The people this idea serves.}}

## What was built

A "Filter by status" dropdown next to "Add client" on the dashboard, with All statuses, Active, Paused and Churned. Picking a status updates everything on the page together: the four summary numbers, the new-clients-per-month chart and the recent clients list. The contract value hint reads "Across paused clients, per year" (etc.) when a filter is on. The filter resets to All statuses on reload.

## Preview link

{{Vercel preview URL for this branch.}}

## Options explored and chosen option

Filter by status only (time period, company and contract value were considered and left out for now). The filter changes the whole dashboard rather than only the numbers or only the chart and list, so the page tells one consistent story.

## Components used

- `@/design-system`: PageHeader, StatCard, NewClientsChart, ClientTable
- `@/components/ui`: Select (SelectTrigger, SelectValue, SelectContent, SelectItem), Button, Card

## New component requests

none

## Earlier Decision Records for this feature

none

## Figma links

{{Links to related Figma files or frames.}}

## Open questions

{{Decisions still to make before this can ship.}}

## Lift policy

rewrite <!-- rewrite (default): the idea ships by being rebuilt on a fresh feature/ branch; no sandbox code is copied across. -->

## Commit log

<!-- Added automatically on every commit by .husky/post-commit: YYYY-MM-DD · message -->
- 2026-10-27 · sandbox(client-dashboard-filters): start exploration
- 2026-10-28 · sandbox(client-dashboard-filters): add a status filter to the dashboard
