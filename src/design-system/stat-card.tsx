import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  /** `null` renders a loading placeholder. */
  value: ReactNode | null
  hint?: ReactNode
  icon?: LucideIcon
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value === null ? <Skeleton className="h-8 w-24" /> : value}
        </CardTitle>
        {Icon ? (
          <CardAction>
            <Icon className="size-4 text-muted-foreground" aria-hidden />
          </CardAction>
        ) : null}
        {hint ? (
          <p className="text-xs text-muted-foreground">{hint}</p>
        ) : null}
      </CardHeader>
    </Card>
  )
}
