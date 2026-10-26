import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { STATUS_LABELS, type ClientStatus } from "@/lib/clients"

const statusClassNames: Record<ClientStatus, string> = {
  active: "bg-status-active text-status-active-foreground",
  paused: "bg-status-paused text-status-paused-foreground",
  churned: "bg-status-churned text-status-churned-foreground",
}

export function StatusBadge({
  status,
  className,
}: {
  status: ClientStatus
  className?: string
}) {
  return (
    <Badge className={cn(statusClassNames[status], className)}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
