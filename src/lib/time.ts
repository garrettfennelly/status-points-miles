/**
 * All "what day is it" logic runs off the DEVICE clock, shifted into
 * America/Mexico_City. Mexico abolished DST in 2022, so central Mexico is a
 * flat UTC-6 all year and a fixed offset is correct — no tz database, no
 * network, no Intl timezone dependency.
 */

const MS_HOUR = 3_600_000
const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export interface Wall {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  weekday: string
  monthShort: string
  key: string
}

/** Device instant expressed as Mexico City wall-clock time. */
export function cityWall(now: Date, offsetHours: number): Wall {
  const s = new Date(now.getTime() + offsetHours * MS_HOUR)
  const year = s.getUTCFullYear()
  const month = s.getUTCMonth() + 1
  const day = s.getUTCDate()
  return {
    year,
    month,
    day,
    hour: s.getUTCHours(),
    minute: s.getUTCMinutes(),
    second: s.getUTCSeconds(),
    weekday: WEEKDAYS[s.getUTCDay()],
    monthShort: MONTHS[s.getUTCMonth()],
    key: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
  }
}

export const pad = (n: number) => String(n).padStart(2, '0')

export function clockLabel(w: Wall) {
  return `${pad(w.hour)}:${pad(w.minute)}`
}

export function dateLabel(w: Wall) {
  return `${w.weekday} ${w.day} ${w.monthShort} ${w.year}`
}

export interface Countdown {
  past: boolean
  days: number
  hours: number
  minutes: number
  seconds: number
  totalMs: number
}

export function countdownTo(targetIso: string, now: Date): Countdown {
  const diff = Date.parse(targetIso) - now.getTime()
  const past = diff <= 0
  const abs = Math.abs(diff)
  return {
    past,
    days: Math.floor(abs / 86_400_000),
    hours: Math.floor(abs / MS_HOUR) % 24,
    minutes: Math.floor(abs / 60_000) % 60,
    seconds: Math.floor(abs / 1000) % 60,
    totalMs: diff,
  }
}

/** Whole days between two YYYY-MM-DD keys, positive when `to` is later. */
export function daysBetweenKeys(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000)
}

export function keyInRange(key: string, start: string, end?: string): boolean {
  return key >= start && key <= (end ?? start)
}

/** Pretty label for a calendar entry, e.g. "MON 28 – WED 30 SEP". */
export function rangeLabel(start: string, end?: string): string {
  const a = keyToWall(start)
  if (!end || end === start) return `${a.weekday} ${a.day} ${a.monthShort}`
  const b = keyToWall(end)
  return a.monthShort === b.monthShort
    ? `${a.weekday} ${a.day} – ${b.weekday} ${b.day} ${b.monthShort}`
    : `${a.weekday} ${a.day} ${a.monthShort} – ${b.weekday} ${b.day} ${b.monthShort}`
}

export function keyToWall(key: string): Wall {
  return cityWall(new Date(`${key}T12:00:00Z`), 0)
}

/** Dark by default between 17:00 and 07:00 device time. */
export function prefersDarkNow(now: Date): boolean {
  const h = now.getHours()
  return h >= 17 || h < 7
}
