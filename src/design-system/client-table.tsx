"use client"

import Link from "next/link"
import {
  NotebookPenIcon,
  PencilIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  CLIENT_STATUSES,
  STATUS_LABELS,
  type Client,
  type ClientStatus,
} from "@/lib/clients"
import { formatCurrency, formatDate } from "@/lib/format"
import { DeleteClientDialog } from "@/design-system/delete-client-dialog"
import { StatusBadge } from "@/design-system/status-badge"

type StatusFilter = ClientStatus | "all"

const statusFilterItems = [
  { value: "all", label: "All statuses" },
  ...CLIENT_STATUSES.map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  })),
]

export function ClientTable({
  clients,
  variant = "full",
  onDelete,
}: {
  /** `null` renders loading rows. */
  clients: Client[] | null
  /** `compact` hides the toolbar, email, start date and row actions. */
  variant?: "full" | "compact"
  onDelete?: (client: Client) => void
}) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")
  const isFull = variant === "full"

  const rows = useMemo(() => {
    if (!clients || !isFull) return clients
    const q = query.trim().toLowerCase()
    return clients
      .filter(
        (client) =>
          (status === "all" || client.status === status) &&
          (!q ||
            client.name.toLowerCase().includes(q) ||
            client.company.toLowerCase().includes(q) ||
            client.email.toLowerCase().includes(q))
      )
      .sort((a, b) => b.startDate.localeCompare(a.startDate))
  }, [clients, isFull, query, status])

  const columnCount = isFull ? 6 : 3

  return (
    <div className="flex flex-col gap-4">
      {isFull ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:max-w-xs sm:flex-1">
            <SearchIcon
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Search name, company or email"
              aria-label="Search clients"
              className="pl-8"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Select
            items={statusFilterItems}
            value={status}
            onValueChange={(value) => setStatus((value as StatusFilter) ?? "all")}
          >
            <SelectTrigger aria-label="Filter by status" className="sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusFilterItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              {isFull ? <TableHead>Company</TableHead> : null}
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Contract value</TableHead>
              {isFull ? <TableHead>Start date</TableHead> : null}
              {isFull ? (
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows === null
              ? Array.from({ length: 5 }, (_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={columnCount}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : null}

            {rows?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="h-24 text-center text-muted-foreground"
                >
                  No clients found.
                </TableCell>
              </TableRow>
            ) : null}

            {rows?.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      href={`/clients/${client.id}/edit`}
                      className="font-medium hover:underline"
                    >
                      {client.name}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {isFull ? client.email : client.company}
                    </span>
                  </div>
                </TableCell>
                {isFull ? <TableCell>{client.company}</TableCell> : null}
                <TableCell>
                  <StatusBadge status={client.status} />
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(client.contractValue)}
                </TableCell>
                {isFull ? (
                  <TableCell className="text-muted-foreground">
                    {formatDate(client.startDate)}
                  </TableCell>
                ) : null}
                {isFull ? (
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Notes for ${client.name}`}
                        nativeButton={false}
                        render={<Link href={`/clients/${client.id}/notes`} />}
                      >
                        <NotebookPenIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Edit ${client.name}`}
                        nativeButton={false}
                        render={<Link href={`/clients/${client.id}/edit`} />}
                      >
                        <PencilIcon />
                      </Button>
                      {onDelete ? (
                        <DeleteClientDialog
                          clientName={client.name}
                          onConfirm={() => onDelete(client)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Delete ${client.name}`}
                            >
                              <Trash2Icon />
                            </Button>
                          }
                        />
                      ) : null}
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
