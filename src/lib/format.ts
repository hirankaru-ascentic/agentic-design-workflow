const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
})

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

export function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

/** Formats an ISO YYYY-MM-DD date without shifting it by the local time zone. */
export function formatDate(isoDate: string) {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`))
}

/** Formats an ISO timestamp in the viewer's local time zone. */
export function formatDateTime(isoTimestamp: string) {
  return dateTimeFormatter.format(new Date(isoTimestamp))
}
