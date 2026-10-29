export const CLIENT_STATUSES = ["active", "paused", "churned"] as const

export type ClientStatus = (typeof CLIENT_STATUSES)[number]

export type Client = {
  id: string
  name: string
  company: string
  email: string
  status: ClientStatus
  /** Annual contract value in whole currency units. */
  contractValue: number
  /** ISO date, YYYY-MM-DD. */
  startDate: string
}

export type ClientInput = Omit<Client, "id">

export const STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Active",
  paused: "Paused",
  churned: "Churned",
}

/** A status to narrow a list of clients to, or `all` for no filter. */
export type StatusFilter = ClientStatus | "all"

export const STATUS_FILTER_ITEMS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  ...CLIENT_STATUSES.map((status) => ({ value: status, label: STATUS_LABELS[status] })),
]

export function filterClientsByStatus(clients: Client[], status: StatusFilter): Client[] {
  return status === "all" ? clients : clients.filter((c) => c.status === status)
}

export type ClientStats = {
  total: number
  active: number
  newThisMonth: number
  totalContractValue: number
}

export type MonthlyCount = {
  /** YYYY-MM */
  month: string
  label: string
  count: number
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export function getClientStats(clients: Client[], now = new Date()): ClientStats {
  const thisMonth = monthKey(now)
  return {
    total: clients.length,
    active: clients.filter((c) => c.status === "active").length,
    newThisMonth: clients.filter((c) => c.startDate.startsWith(thisMonth)).length,
    totalContractValue: clients.reduce((sum, c) => sum + c.contractValue, 0),
  }
}

/** Counts clients by start month for the last `months` months, oldest first. */
export function getNewClientsPerMonth(
  clients: Client[],
  months = 6,
  now = new Date()
): MonthlyCount[] {
  const buckets: MonthlyCount[] = []
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    buckets.push({
      month: monthKey(date),
      label: date.toLocaleDateString("en-US", { month: "short" }),
      count: 0,
    })
  }
  for (const client of clients) {
    const bucket = buckets.find((b) => client.startDate.startsWith(b.month))
    if (bucket) bucket.count++
  }
  return buckets
}

export function getRecentClients(clients: Client[], limit = 5): Client[] {
  return [...clients]
    .sort((a, b) => b.startDate.localeCompare(a.startDate))
    .slice(0, limit)
}
