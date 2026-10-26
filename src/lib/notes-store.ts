"use client"

/**
 * The single data-access boundary for client notes.
 *
 * Mirrors `clients-store`: notes persist to localStorage today, and a real
 * backend can replace the functions below without touching pages.
 */

import { useMemo, useSyncExternalStore } from "react"

import type { Note } from "@/lib/notes"

const STORAGE_KEY = "clients-manager:notes:v1"

type Listener = () => void

const listeners = new Set<Listener>()
let cache: Note[] | null = null

function read(): Note[] {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    cache = raw ? (JSON.parse(raw) as Note[]) : []
  } catch {
    cache = []
  }
  return cache
}

function write(notes: Note[]) {
  cache = notes
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch {
    // Storage full or blocked (e.g. private mode): keep the in-memory copy.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  // Keep other tabs in sync.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return
    cache = null
    listener()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `n-${Date.now().toString(36)}`
}

export function addNote(clientId: string, body: string): Note {
  const note: Note = {
    id: newId(),
    clientId,
    body,
    createdAt: new Date().toISOString(),
  }
  write([note, ...read()])
  return note
}

export function deleteNote(id: string) {
  write(read().filter((note) => note.id !== id))
}

const getServerSnapshot = () => null

/** A client's notes, newest first, or `null` until loaded in the browser. */
export function useClientNotes(clientId: string): Note[] | null {
  const notes = useSyncExternalStore(subscribe, read, getServerSnapshot)
  return useMemo(
    () =>
      notes
        ?.filter((note) => note.clientId === clientId)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)) ?? null,
    [notes, clientId]
  )
}
