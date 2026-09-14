import { useCallback, useEffect, useMemo, useState } from 'react'
import { shootbook as seed } from '../data/shootbook'
import type { ShootBook } from '../data/types'
import { countOpen, isField } from './fields'

const BOOK_KEY = 'p27.book.v1'
/**
 * EMBARGO. The host's identity is kept in its own storage key, is never part of
 * the seed file, and is never written into a book export. It exists only on the
 * device where a producer typed it, after the announcement clears.
 */
const HOST_KEY = 'p27.host.v1'
const THEME_KEY = 'p27.theme.v1'

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    /* private mode / quota — the book still works, edits just do not persist */
  }
}

function safeRemove(key: string) {
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

/**
 * Deep-merge a stored book over the seed. The seed is always the base so that a
 * newer build can add sections without a producer's saved edits wiping them.
 */
function merge<T>(base: T, patch: unknown): T {
  if (patch === undefined || patch === null) return base
  // A Field is atomic. Key-merging a saved locked value over an open seed field
  // would leave the old `missing`/`owner`/`due` hanging off a locked value.
  if (isField(base) && isField(patch)) return patch as T
  if (Array.isArray(base)) {
    if (!Array.isArray(patch)) return base
    // Arrays are replaced wholesale, element-merged where both sides line up.
    return patch.map((p, i) => (i < base.length ? merge((base as unknown[])[i], p) : p)) as unknown as T
  }
  if (typeof base === 'object' && base !== null && typeof patch === 'object') {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const [k, v] of Object.entries(patch as Record<string, unknown>)) {
      out[k] = k in out ? merge(out[k], v) : v
    }
    return out as T
  }
  return patch as T
}

export function loadBook(): ShootBook {
  const raw = safeGet(BOOK_KEY)
  if (!raw) return seed
  try {
    return merge(seed, JSON.parse(raw))
  } catch {
    return seed
  }
}

export function saveBook(book: ShootBook) {
  safeSet(BOOK_KEY, JSON.stringify(book))
  window.dispatchEvent(new CustomEvent('p27:book'))
}

export function resetBook() {
  safeRemove(BOOK_KEY)
  window.dispatchEvent(new CustomEvent('p27:book'))
}

export function useBook(): [ShootBook, (next: ShootBook) => void, () => void] {
  const [book, setBook] = useState<ShootBook>(loadBook)

  useEffect(() => {
    const sync = () => setBook(loadBook())
    window.addEventListener('p27:book', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('p27:book', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const update = useCallback((next: ShootBook) => {
    setBook(next)
    saveBook(next)
  }, [])

  const reset = useCallback(() => {
    resetBook()
    setBook(seed)
  }, [])

  return [book, update, reset]
}

/** ------------------------------------------------------------ EMBARGO */

export interface HostIdentity {
  revealed: boolean
  name: string
}

const HOST_DEFAULT: HostIdentity = { revealed: false, name: '' }

export function loadHost(): HostIdentity {
  const raw = safeGet(HOST_KEY)
  if (!raw) return HOST_DEFAULT
  try {
    const parsed = JSON.parse(raw) as Partial<HostIdentity>
    return { revealed: parsed.revealed === true, name: typeof parsed.name === 'string' ? parsed.name : '' }
  } catch {
    return HOST_DEFAULT
  }
}

export function saveHost(next: HostIdentity) {
  safeSet(HOST_KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent('p27:host'))
}

export function useHost(): [HostIdentity, (next: HostIdentity) => void] {
  const [host, setHost] = useState<HostIdentity>(loadHost)
  useEffect(() => {
    const sync = () => setHost(loadHost())
    window.addEventListener('p27:host', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('p27:host', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  const update = useCallback((next: HostIdentity) => {
    setHost(next)
    saveHost(next)
  }, [])
  return [host, update]
}

/**
 * The only place the host is ever named. Default OFF: the toggle is off and the
 * name is empty in a fresh install, so the book reads "On-camera host".
 */
export function hostLabel(host: HostIdentity, fallback: string): string {
  return host.revealed && host.name.trim() ? host.name.trim() : fallback
}

/** -------------------------------------------------------------- THEME */

export type ThemeChoice = 'auto' | 'light' | 'dark'

export function loadTheme(): ThemeChoice {
  const raw = safeGet(THEME_KEY)
  return raw === 'light' || raw === 'dark' || raw === 'auto' ? raw : 'auto'
}

export function saveTheme(choice: ThemeChoice) {
  safeSet(THEME_KEY, choice)
}

/** ------------------------------------------------------------- CLOCK */

/** One shared ticking clock so every countdown on screen agrees. */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs)
    const onVisible = () => setNow(new Date())
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [intervalMs])
  return now
}

/** -------------------------------------------------------- HASH ROUTER */

export type Route = { tab: string; admin: boolean }

function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  if (raw === 'admin') return { tab: 'now', admin: true }
  return { tab: raw || 'now', admin: false }
}

export function useRoute(): [Route, (to: string) => void] {
  const [route, setRoute] = useState<Route>(parseHash)
  useEffect(() => {
    const sync = () => setRoute(parseHash())
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])
  const go = useCallback((to: string) => {
    window.location.hash = `#/${to}`
    window.scrollTo(0, 0)
  }, [])
  return [route, go]
}

export function useOpenCount(book: ShootBook): number {
  return useMemo(() => countOpen(book), [book])
}
