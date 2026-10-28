export type Note = {
  id: string
  clientId: string
  body: string
  /** ISO timestamp of when the note was added. */
  createdAt: string
}
