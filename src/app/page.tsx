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
  CLIENT_STATUSES,
  STATUS_LABELS,
  getClientStats,
  getNewClientsPerMonth,
  getRecentClients,
  type ClientStatus,
} from "@/lib/clients";
import { useClients } from "@/lib/clients-store";
import { formatCurrency } from "@/lib/format";

type StatusFilter = ClientStatus | "all";

const statusFilterItems: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  ...CLIENT_STATUSES.map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  })),
];

export default function DashboardPage() {
  const allClients = useClients();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const clients =
    allClients && statusFilter !== "all"
      ? allClients.filter((client) => client.status === statusFilter)
      : allClients;
  const stats = clients ? getClientStats(clients) : null;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of your clients and contracts."
        actions={
          <>
            <Select
              items={statusFilterItems}
              value={statusFilter}
              onValueChange={(value) => {
                if (value) setStatusFilter(value as StatusFilter);
              }}
            >
              <SelectTrigger aria-label="Filter by status">
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
          hint={
            statusFilter === "all"
              ? "Across all clients, per year"
              : `Across ${STATUS_LABELS[statusFilter].toLowerCase()} clients, per year`
          }
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
