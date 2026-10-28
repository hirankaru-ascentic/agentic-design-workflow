"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClientNotes, PageHeader } from "@/design-system";
import { useClient } from "@/lib/clients-store";
import { addNote, deleteNote, useClientNotes } from "@/lib/notes-store";

export default function ClientNotesPage() {
  const { id } = useParams<{ id: string }>();
  const client = useClient(id);
  const notes = useClientNotes(id);

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
        title={client ? `Notes for ${client.name}` : "Notes"}
        description={client?.company}
        actions={
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href={`/clients/${id}/edit`} />}
          >
            <PencilIcon data-icon="inline-start" />
            Edit client
          </Button>
        }
      />
      <ClientNotes
        key={id}
        notes={client === null ? null : notes}
        onAdd={(body) => {
          addNote(id, body);
          toast.success("Note added");
        }}
        onDelete={(note) => {
          deleteNote(note.id);
          toast.success("Note deleted");
        }}
      />
    </>
  );
}
