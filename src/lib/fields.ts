import type { Field } from '../data/types'

export type AnyField = Field<string> | Field<number>

export function isField(v: unknown): v is AnyField {
  if (typeof v !== 'object' || v === null) return false
  const s = (v as { status?: unknown }).status
  return s === 'locked' || s === 'open'
}

export interface FieldEntry {
  path: string[]
  key: string
  field: AnyField
  /** Human label: what the producer is looking at in /admin. */
  label: string
}

/** Depth-first walk yielding every Field<T> leaf in the book, in book order. */
export function walkFields(root: unknown, path: string[] = [], out: FieldEntry[] = []): FieldEntry[] {
  if (isField(root)) {
    out.push({
      path,
      key: path.join('.'),
      field: root,
      label: root.status === 'open' ? root.missing : humanisePath(path),
    })
    return out
  }
  if (Array.isArray(root)) {
    root.forEach((v, i) => walkFields(v, [...path, String(i)], out))
    return out
  }
  if (typeof root === 'object' && root !== null) {
    for (const [k, v] of Object.entries(root)) walkFields(v, [...path, k], out)
  }
  return out
}

function humanisePath(path: string[]): string {
  const tail = path.slice(-2).filter((p) => !/^\d+$/.test(p))
  const word = tail[tail.length - 1] ?? path[path.length - 1]
  return word.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())
}

export function countOpen(root: unknown): number {
  return walkFields(root).filter((e) => e.field.status === 'open').length
}

export function getByPath<T = unknown>(root: unknown, path: string[]): T | undefined {
  let cur: unknown = root
  for (const seg of path) {
    if (cur === null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[seg]
  }
  return cur as T
}

/** Immutable set — returns a new root with `path` replaced. */
export function setByPath<R>(root: R, path: string[], value: unknown): R {
  if (path.length === 0) return value as R
  const [head, ...rest] = path
  if (Array.isArray(root)) {
    const copy = root.slice()
    const i = Number(head)
    copy[i] = setByPath(copy[i], rest, value)
    return copy as unknown as R
  }
  const src = root as Record<string, unknown>
  return { ...src, [head]: setByPath(src[head], rest, value) } as R
}

/** Group entries by their top-level section for the admin screen. */
export function groupBySection(entries: FieldEntry[]): { section: string; entries: FieldEntry[] }[] {
  const map = new Map<string, FieldEntry[]>()
  for (const e of entries) {
    const section = e.path[0] ?? 'root'
    const list = map.get(section)
    if (list) list.push(e)
    else map.set(section, [e])
  }
  return [...map.entries()].map(([section, list]) => ({ section, entries: list }))
}
