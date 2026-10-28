"use client"

import { Trash2Icon } from "lucide-react"
import { useState, type FormEvent } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { formatDateTime } from "@/lib/format"
import type { Note } from "@/lib/notes"

function DeleteNoteButton({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Delete note">
            <Trash2Icon />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this note?</AlertDialogTitle>
          <AlertDialogDescription>
            The note is removed for good. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              setOpen(false)
              onConfirm()
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function ClientNotes({
  notes,
  onAdd,
  onDelete,
}: {
  /** Newest first. `null` renders loading placeholders. */
  notes: Note[] | null
  onAdd: (body: string) => void
  onDelete?: (note: Note) => void
}) {
  const [body, setBody] = useState("")
  const [error, setError] = useState<string>()

  function handleSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault()
    const trimmed = body.trim()
    if (!trimmed) {
      setError("Write something before adding the note.")
      return
    }
    onAdd(trimmed)
    setBody("")
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor="client-note">New note</FieldLabel>
              <Textarea
                id="client-note"
                placeholder="What happened? Calls, decisions, next steps…"
                className="min-h-24"
                value={body}
                aria-invalid={!!error}
                onChange={(event) => {
                  setBody(event.target.value)
                  if (error) setError(undefined)
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                    event.preventDefault()
                    handleSubmit()
                  }
                }}
              />
              <FieldError>{error}</FieldError>
            </Field>
            <div className="flex justify-end">
              <Button type="submit" disabled={notes === null}>
                Add note
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        {notes === null
          ? Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          : null}

        {notes?.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No notes yet. Add the first one above.
          </p>
        ) : null}

        {notes?.map((note) => (
          <Card key={note.id} size="sm">
            <CardHeader>
              <CardDescription>
                <time dateTime={note.createdAt}>
                  {formatDateTime(note.createdAt)}
                </time>
              </CardDescription>
              {onDelete ? (
                <CardAction>
                  <DeleteNoteButton onConfirm={() => onDelete(note)} />
                </CardAction>
              ) : null}
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap">{note.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
