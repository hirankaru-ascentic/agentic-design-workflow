"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { NotebookPenIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientForm, DeleteClientDialog, PageHeader } from "@/design-system";
import { deleteClient, updateClient, useClient } from "@/lib/clients-store";

export default function EditClientPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const client = useClient(id);

  if (client === undefined) {
    return (
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Client not found</CardTitle>
          <CardDescription>
            It may have been deleted, or the link is wrong.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button nativeButton={false} render={<Link href="/clients" />}>
            Back to clients
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      <PageHeader
        title={client ? `Edit ${client.name}` : "Edit client"}
        description={client?.company}
        actions={
          client ? (
            <>
              <Button
                variant="outline"
                nativeButton={false}
                render={<Link href={`/clients/${client.id}/notes`} />}
              >
                <NotebookPenIcon data-icon="inline-start" />
                Notes
              </Button>
              <DeleteClientDialog
                clientName={client.name}
                onConfirm={() => {
                  deleteClient(client.id);
                  toast.success(`Deleted ${client.name}`);
                  router.push("/clients");
                }}
                trigger={
                  <Button variant="destructive">
                    <Trash2Icon data-icon="inline-start" />
                    Delete
                  </Button>
                }
              />
            </>
          ) : null
        }
      />
      <Card>
        <CardContent>
          {client === null ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <ClientForm
              key={client.id}
              defaultValues={client}
              submitLabel="Save changes"
              onCancel={() => router.push("/clients")}
              onSubmit={(values) => {
                updateClient(client.id, values);
                toast.success(`Saved ${values.name}`);
                router.push("/clients");
              }}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
