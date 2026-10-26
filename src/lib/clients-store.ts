"use client"

/**
 * The single data-access boundary for clients.
 *
 * Phase 1 persists to localStorage so CRUD works on Vercel previews without a
 * database. To move to a real backend, re-implement the functions below and
 * keep their signatures; pages and components only talk to this module.
 */

import { useSyncExternalStore } from "react"

import { clientsSeed } from "@/data/clients.seed"
import type { Client, ClientInput } from "@/lib/clients"

const STORAGE_KEY = "clients-manager:clients:v1"

type Listener = () => void

const listeners = new Set<Listener>()
let cache: Client[] | null = null

function read(): Client[] {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    cache = raw ? (JSON.parse(raw) as Client[]) : null
  } catch {
    cache = null
  }
  if (!cache) {
    // First visit: seed without notifying, since read() runs during render.
    cache = clientsSeed
    persist(cache)
  }
  return cache
}

function persist(clients: Client[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
  } catch {
    // Storage full or blocked (e.g. private mode): keep the in-memory copy.
  }
}

function write(clients: Client[]) {
  cache = clients
  persist(clients)
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
    : `c-${Date.now().toString(36)}`
}

export function listClients(): Client[] {
  return read()
}

export function getClient(id: string): Client | undefined {
  return read().find((client) => client.id === id)
}

export function createClient(input: ClientInput): Client {
  const client: Client = { id: newId(), ...input }
  write([client, ...read()])
  return client
}

export function updateClient(id: string, input: ClientInput): Client | undefined {
  let updated: Client | undefined
  write(
    read().map((client) => {
      if (client.id !== id) return client
      updated = { ...client, ...input, id }
      return updated
    })
  )
  return updated
}

export function deleteClient(id: string) {
  write(read().filter((client) => client.id !== id))
}

export function resetClients() {
  write(clientsSeed)
}

const getServerSnapshot = () => null

/** All clients, or `null` until loaded in the browser. */
export function useClients(): Client[] | null {
  return useSyncExternalStore(subscribe, read, getServerSnapshot)
}

/** One client: `null` while loading, `undefined` if not found. */
export function useClient(id: string): Client | null | undefined {
  const clients = useClients()
  if (!clients) return null
  return clients.find((client) => client.id === id)
}
