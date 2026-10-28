"use client";

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
  ClientTable,
  NewClientsChart,
  PageHeader,
  StatCard,
} from "@/design-system";
import {
  getClientStats,
  getNewClientsPerMonth,
  getRecentClients,
} from "@/lib/clients";
import { useClients } from "@/lib/clients-store";
import { formatCurrency } from "@/lib/format";

export default function DashboardPage() {
  const clients = useClients();
  const stats = clients ? getClientStats(clients) : null;

  return (
    <>
      <PageHeader
        title="Client Overview"
        description="An overview of your clients and contracts."
        actions={
          <Button nativeButton={false} render={<Link href="/clients/new" />}>
            Add client
          </Button>
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
          hint="Across all clients, per year"
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
