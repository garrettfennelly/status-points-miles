/**
 * PREDICTS 27 SHOOT BOOK — data model.
 *
 * Rule of the book: a value is either LOCKED or OPEN. There is no third state
 * and there are no placeholders. An OPEN field renders as a dashed slot that
 * names what is missing and who owns it, and it counts towards the "still open"
 * figure on NOW. Never convert an OPEN field to a LOCKED one by guessing.
 */

export type Field<T> =
  | { status: 'locked'; value: T; note?: string }
  | { status: 'open'; missing: string; owner: string | null; due?: string | null }

export const locked = <T,>(value: T, note?: string): Field<T> =>
  note === undefined ? { status: 'locked', value } : { status: 'locked', value, note }

export const open = <T,>(
  missing: string,
  owner: string | null = null,
  due: string | null = null,
): Field<T> => ({ status: 'open', missing, owner, due })

export type StatusKind =
  | 'gate'
  | 'shoot'
  | 'prep'
  | 'scout'
  | 'weather'
  | 'post'
  | 'holiday'

/** ---------------------------------------------------------------- NOW */

export interface ShootWindow {
  id: string
  span: string
  title: string
  grade: 'hero' | 'cover' | 'exposed'
  line: string
  warning?: string
}

export interface SunEndpoint {
  dateLabel: string
  sunrise: string
  sunset: string
}

export interface Gate {
  id: string
  title: string
  detail: string
  positions?: string[]
  owner: Field<string>
  due: Field<string>
}

export interface EmergencyButton {
  id: string
  label: string
  sub: string
  /** Locked numbers dial. Open ones render dashed and do not pretend to dial. */
  number: Field<string>
  alt?: Field<string>
  tone: 'red' | 'amber' | 'plain'
}

/** -------------------------------------------------------------- BOARD */

export interface BoardDay {
  id: string
  label: string
  weekday: string
  date: string
  note?: string
}

export type BoardCell =
  | { kind: 'count'; value: number; qualifier?: string }
  | { kind: 'text'; value: string }
  | { kind: 'none' }

export interface BoardRow {
  id: string
  unit: string
  cells: BoardCell[]
  total: string
  totalNote?: string
}

export interface CalendarEntry {
  id: string
  start: string
  end?: string
  kind: StatusKind
  title: string
  detail?: string
  hardGate?: boolean
  statutory?: boolean
}

export interface UndatedGate {
  id: string
  title: string
  detail: string
  owner: Field<string>
  due: Field<string>
}

/** ------------------------------------------------------------- TRENDS */

export type Tier = 1 | 2 | 3 | 'untiered' | 'backup'
export type FilmStatus = 'film' | 'RECCO' | null

export interface Trend {
  /** Tier number as carried on the board. ALWAYS displayed next to the name. */
  number: string
  name: string
  altName: string | null
  category: string
  partnership: boolean
  tier: Tier
  film: FilmStatus
  multipin: boolean
  mementos: number
  /** Physical requirements. None of these are bid yet. */
  physical: string[]
  note?: string
}

/** --------------------------------------------------------------- CREW */

export interface CrewMember {
  id: string
  dept: string
  role: string
  /** Why this seat is on the crew plan — traceable back to the book. */
  basis: string
  name: Field<string>
  phone: Field<string>
  email: Field<string>
}

/** ------------------------------------------------------------- GROUND */

export interface GroundPlace {
  id: string
  label: string
  name: Field<string>
  coords: Field<string>
  address: Field<string>
  detail?: string
}

export interface MapPlate {
  id: string
  label: string
  caption: string
  /** Bundled image path. Baked at build time — never a tile request. */
  src: Field<string>
}

/** ------------------------------------------------------------- SAFETY */

export interface HospitalDay {
  dayId: string
  dayLabel: string
  hospital: Field<string>
  driveTime: Field<string>
}

export interface SafetyNote {
  id: string
  heading: string
  lines: string[]
  figures?: { label: string; value: string }[]
}

/** --------------------------------------------------------------- ROOT */

export interface ShootBook {
  meta: {
    title: string
    subtitle: string
    version: string
    asOf: string
    timezone: string
    utcOffsetHours: number
    adminPassphrase: string
  }
  production: {
    firstFrame: { iso: string; label: string; note: string }
    location: GroundPlace
    windows: ShootWindow[]
    sun: { from: SunEndpoint; to: SunEndpoint; drift: string[]; moon: string }
    call: Field<string>
    wrap: Field<string>
  }
  gates: Gate[]
  emergency: EmergencyButton[]
  board: {
    days: BoardDay[]
    rows: BoardRow[]
    flags: { id: string; tone: 'gate' | 'weather'; text: string }[]
  }
  calendar: CalendarEntry[]
  undatedGates: UndatedGate[]
  trends: Trend[]
  trendNotes: { altNamesOutstanding: number; altNameList: Field<string>; banner: string }
  heroCampaign: {
    title: string
    lines: string[]
    shotIdea: Field<string>
    crowdBudget: Field<string>
  }
  crew: CrewMember[]
  talent: {
    label: string
    embargoLine: string
    phone: Field<string>
    agency: Field<string>
  }
  ground: {
    places: GroundPlace[]
    plates: MapPlate[]
    deepLinkNote: string
  }
  safety: {
    hospitals: HospitalDay[]
    embassy: {
      heading: string
      movedLine: string
      address: string
      numbers: { label: string; value: string }[]
      superseded: string
    }
    altitude: SafetyNote
    cold: SafetyNote
    rain: SafetyNote
    drone: { heading: string; regulation: string; lines: string[]; verdict: string }
    protocols: string[]
  }
}
