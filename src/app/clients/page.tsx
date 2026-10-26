"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { ClientTable, PageHeader } from "@/design-system";
import { deleteClient, useClients } from "@/lib/clients-store";

export default function ClientsPage() {
  const clients = useClients();

  return (
    <>
      <PageHeader
        title="Clients"
        description={
          clients ? `${clients.length} clients` : "Loading clients…"
        }
        actions={
          <Button nativeButton={false} render={<Link href="/clients/new" />}>
            <PlusIcon data-icon="inline-start" />
            Add client
          </Button>
        }
      />
      <ClientTable
        clients={clients}
        onDelete={(client) => {
          deleteClient(client.id);
          toast.success(`Deleted ${client.name}`);
        }}
      />
    </>
  );
}
