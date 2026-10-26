"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { ClientForm, PageHeader } from "@/design-system";
import { createClient } from "@/lib/clients-store";

export default function NewClientPage() {
  const router = useRouter();
  const [formKey, setFormKey] = useState(0);

  return (
    <>
      <PageHeader title="Add client" description="Create a new client record." />
      <Card>
        <CardContent>
          {/* Next keeps visited pages mounted (Activity), so remount the
              form after a submit to start the next visit with a blank form. */}
          <ClientForm
            key={formKey}
            submitLabel="Create client"
            onCancel={() => router.push("/clients")}
            onSubmit={(values) => {
              const client = createClient(values);
              toast.success(`Created ${client.name}`);
              setFormKey((key) => key + 1);
              router.push("/clients");
            }}
          />
        </CardContent>
      </Card>
    </>
  );
}
