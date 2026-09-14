import type { ReactNode } from 'react'
import type { EmergencyButton as EmergencyButtonData, Field, StatusKind } from '../data/types'

/**
 * The single renderer for every value in the book. A locked value prints. An
 * open one prints a dashed slot naming what is missing and who owns it. There
 * is no code path that invents a value.
 */
export function FieldValue({
  field,
  prefix,
  className,
}: {
  field: Field<string>
  prefix?: string
  className?: string
}) {
  if (field.status === 'locked') {
    return (
      <div className={className}>
        <div className="locked-value">
          {prefix ? <span className="tiny">{prefix} </span> : null}
          {field.value}
        </div>
        {field.note ? <div className="locked-note">{field.note}</div> : null}
      </div>
    )
  }
  return <OpenSlot field={field} className={className} />
}

export function OpenSlot({ field, className }: { field: Field<string>; className?: string }) {
  if (field.status !== 'open') return null
  return (
    <div className={`open-field ${className ?? ''}`}>
      <div className="of-missing">{field.missing}</div>
      <div className="of-owner">
        {field.owner ? `Owner: ${field.owner}` : 'Owner unassigned'}
        {field.due ? ` · ${field.due}` : ''}
      </div>
    </div>
  )
}

/** A contact that dials when it is known and tracks collection when it is not. */
export function ContactButton({
  field,
  kind,
  label,
  name,
}: {
  field: Field<string>
  kind: 'tel' | 'sms' | 'whatsapp' | 'mailto'
  label: string
  name: string
}) {
  if (field.status === 'open') {
    return (
      <button type="button" className="open-field btn-small" disabled aria-label={`${label} for ${name} — not collected`}>
        <span className="of-missing">{label}</span>
        <span className="of-owner">{field.missing} not collected</span>
      </button>
    )
  }
  const raw = field.value
  const digits = raw.replace(/[^\d+]/g, '')
  const href =
    kind === 'tel'
      ? `tel:${digits}`
      : kind === 'sms'
        ? `sms:${digits}`
        : kind === 'whatsapp'
          ? `whatsapp://send?phone=${digits.replace(/\D/g, '')}`
          : `mailto:${raw}`
  return (
    <a className="btn btn-small" href={href}>
      <span>{label}</span>
      <span className="mono">{raw}</span>
    </a>
  )
}

const dial = (n: string) => `tel:${n.replace(/[^\d+]/g, '')}`

/**
 * One-tap emergency. A number that is not collected yet renders dashed and
 * does not pretend to dial — better a visibly missing medic number than a
 * button that does nothing at 06:00.
 */
export function EmergencyButton({ e }: { e: EmergencyButtonData }) {
  const tone = e.tone === 'red' ? 'btn-red' : e.tone === 'amber' ? 'btn-amber' : ''
  if (e.number.status === 'open') {
    return (
      <div>
        <div className="tiny">{e.label}</div>
        <OpenSlot field={e.number} />
        <p className="note">{e.sub}</p>
      </div>
    )
  }
  return (
    <div>
      <a className={`btn ${tone}`} href={dial(e.number.value)}>
        <span>{e.label}</span>
        {/* The label is the number itself for 911 — do not print it twice. */}
        <span className="mono">{e.number.value === e.label ? 'CALL' : e.number.value}</span>
      </a>
      {e.alt && e.alt.status === 'locked' ? (
        <a className={`btn btn-small ${tone}`} href={dial(e.alt.value)} style={{ marginTop: 6 }}>
          <span>ALT</span>
          <span className="mono">{e.alt.value}</span>
        </a>
      ) : null}
      <p className="note">{e.sub}</p>
    </div>
  )
}

export function StatusBadge({ kind, children }: { kind: StatusKind; children?: ReactNode }) {
  return <span className={`badge badge-${kind}`}>{children ?? kind}</span>
}

export function Section({ head, children }: { head?: string; children: ReactNode }) {
  return (
    <section className="section">
      {head ? <h2 className="section-head">{head}</h2> : null}
      {children}
    </section>
  )
}

export function Figures({ figures }: { figures: { label: string; value: string }[] }) {
  return (
    <div className="figs">
      {figures.map((f) => (
        <div className="fig" key={f.label}>
          <div className="fig-val mono">{f.value}</div>
          <div className="fig-lab">{f.label}</div>
        </div>
      ))}
    </div>
  )
}
