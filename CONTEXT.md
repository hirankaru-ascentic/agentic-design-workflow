# CONTEXT.md

Domain vocabulary for the Clients manager. Use these exact terms in code, UI
copy and conversation, and use the type names from `src/lib/clients.ts`.

## Entities

**Client**
A person we have a contract with, together with their company. One client
is one record. Type: `Client`.
_Avoid:_ customer, account, contact, lead.

**Company**
The organisation a client works for. A plain text field on the client, not a
separate entity: two clients at the same company are two records.

**Email**
The client's contact email. Required and must be a valid address. Not
required to be unique.

## Client fields

**Status** (`ClientStatus`)
Where the relationship stands. Exactly one of:

| Value     | Label   | Meaning                                                  |
| --------- | ------- | -------------------------------------------------------- |
| `active`  | Active  | Contract is running. The default for new clients.        |
| `paused`  | Paused  | Contract is on hold for now; expected to resume.         |
| `churned` | Churned | The client has left. Kept for history, not deleted.      |

Each status has its own colour tokens (`--status-active`, `--status-paused`,
`--status-churned` and their `-foreground` pairs), shown by `StatusBadge`.

**Contract value** (`contractValue`)
The client's annual contract value in whole US dollars, with no cents. Shown
as currency, e.g. `$48,000`.
_Avoid:_ revenue, MRR, price, deal size.

**Start date** (`startDate`)
The day the client's contract began, stored as `YYYY-MM-DD`. It drives "new
this month", the monthly chart and "recent". New clients default to today.
_Avoid:_ created date, signup date.

## Dashboard metrics

**Total clients**: every client, whatever their status.

**Active clients**: clients with status `active`.

**New this month**: clients whose start date falls in the current calendar
month.

**Total contract value**: the sum of contract value across all clients,
including paused and churned.

**New clients per month**: clients counted by start-date month over the last
six months.

**Recent clients**: the five clients with the latest start dates.

## Data

**Seed data**
The 25 sample clients in `src/data/clients.seed.ts`, loaded on a browser's
first visit. Start dates are relative to today, so the dashboard always has
data.

**Clients store**
`src/lib/clients-store.ts`, the only module that reads or writes clients.
Today it persists to localStorage, so each browser has its own copy.
