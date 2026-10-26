"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import type { MonthlyCount } from "@/lib/clients"

const chartConfig = {
  count: {
    label: "New clients",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function NewClientsChart({ data }: { data: MonthlyCount[] | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New clients per month</CardTitle>
        <CardDescription>By contract start date, last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {data === null ? (
          <Skeleton className="aspect-video w-full" />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-video w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                width="auto"
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                isAnimationActive={false}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
