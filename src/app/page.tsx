"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarPlusIcon,
  CircleDollarSignIcon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClientTable,
  NewClientsChart,
  PageHeader,
  StatCard,
} from "@/design-system";
import {
  STATUS_FILTER_ITEMS,
  STATUS_LABELS,
  filterClientsByStatus,
  getClientStats,
  getNewClientsPerMonth,
  getRecentClients,
  type StatusFilter,
} from "@/lib/clients";
import { useClients } from "@/lib/clients-store";
import { formatCurrency } from "@/lib/format";

export default function DashboardPage() {
  const allClients = useClients();
  const [status, setStatus] = useState<StatusFilter>("all");
  const clients = allClients ? filterClientsByStatus(allClients, status) : null;
  const stats = clients ? getClientStats(clients) : null;
  const scope =
    status === "all" ? "all" : STATUS_LABELS[status].toLowerCase();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of your clients and contracts."
        actions={
          <>
            <Select
              items={STATUS_FILTER_ITEMS}
              value={status}
              onValueChange={(value) => setStatus((value as StatusFilter) ?? "all")}
            >
              <SelectTrigger aria-label="Filter by status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button nativeButton={false} render={<Link href="/clients/new" />}>
              Add client
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total clients" value={stats?.total ?? null} icon={UsersIcon} />
        <StatCard label="Active" value={stats?.active ?? null} icon={UserCheckIcon} />
        <StatCard
          label="New this month"
          value={stats?.newThisMonth ?? null}
          icon={CalendarPlusIcon}
        />
        <StatCard
          label="Total contract value"
          value={stats ? formatCurrency(stats.totalContractValue) : null}
          hint={`Across ${scope} clients, per year`}
          icon={CircleDollarSignIcon}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <NewClientsChart data={clients ? getNewClientsPerMonth(clients) : null} />
        <Card>
          <CardHeader>
            <CardTitle>Recent clients</CardTitle>
            <CardDescription>Latest by start date</CardDescription>
            <CardAction>
              <Button
                variant="ghost"
                size="sm"
                nativeButton={false}
                render={<Link href="/clients" />}
              >
                View all
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ClientTable
              variant="compact"
              clients={clients ? getRecentClients(clients) : null}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
