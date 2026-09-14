import type { SafetyNote, ShootBook } from '../data/types'
import { EmergencyButton, Figures, FieldValue, Section, StatusBadge } from '../components/common'

export function SafetyTab({ book }: { book: ShootBook }) {
  const s = book.safety
  return (
    <>
      <h1 className="screen-title">SAFETY</h1>

      <Section head="EMERGENCY">
        <div className="btn-grid btn-grid-2">
          {book.emergency.map((e) => <EmergencyButton key={e.id} e={e} />)}
        </div>
      </Section>

      <Section head="RECEIVING HOSPITAL — PER DAY">
        <p className="note" style={{ marginTop: 0 }}>
          One named hospital per shoot day, with a drive time measured on the scout in a unit vehicle at call-time
          traffic. Not estimated, not looked up on the day.
        </p>
        <div className="stack" style={{ marginTop: 12 }}>
          {s.hospitals.map((h) => (
            <div className="card" key={h.dayId}>
              <div className="tiny">{h.dayLabel}</div>
              <div className="stack" style={{ marginTop: 8 }}>
                <FieldValue field={h.hospital} />
                <FieldValue field={h.driveTime} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section head="DRONE">
        <div className="card card-red">
          <div className="rowline">
            <span className="card-red-head">{s.drone.heading}</span>
            <StatusBadge kind="gate">BLOCKING</StatusBadge>
          </div>
          <div className="mono" style={{ marginTop: 8, fontWeight: 800 }}>{s.drone.regulation}</div>
          <ul className="stack-tight" style={{ margin: '12px 0 0', paddingLeft: 18 }}>
            {s.drone.lines.map((l) => <li key={l}><strong>{l}</strong></li>)}
          </ul>
          <p className="lede" style={{ marginTop: 14 }}>{s.drone.verdict}</p>
        </div>
      </Section>

      <Section head="US EMBASSY — CONSULAR SERVICES">
        <div className="card">
          <div className="rowline">
            <strong className="lede">{s.embassy.heading}</strong>
            <span className="badge badge-gate">{s.embassy.movedLine}</span>
          </div>
          <p className="lede" style={{ marginTop: 10 }}>{s.embassy.address}</p>
          <div className="btn-grid" style={{ marginTop: 12 }}>
            {s.embassy.numbers.map((n) => (
              <a className="btn" key={n.value} href={`tel:${n.value.replace(/[^\d+]/g, '')}`}>
                <span className="mono">{n.value}</span>
                <span className="tiny">{n.label}</span>
              </a>
            ))}
          </div>
          <div className="card card-red" style={{ marginTop: 14 }}>
            <div className="card-red-head">SUPERSEDED ADDRESS</div>
            <p style={{ marginBottom: 0 }}>{s.embassy.superseded}</p>
          </div>
        </div>
      </Section>

      <NoteCard note={s.altitude} />
      <NoteCard note={s.cold} />
      <NoteCard note={s.rain} />

      <Section head="STANDING PROTOCOLS">
        <div className="stack">
          {s.protocols.map((p) => (
            <div className="card" key={p}>
              <strong className="lede">{p}</strong>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

function NoteCard({ note }: { note: SafetyNote }) {
  return (
    <Section head={note.heading}>
      <ul className="stack-tight" style={{ margin: 0, paddingLeft: 18 }}>
        {note.lines.map((l) => <li key={l}>{l}</li>)}
      </ul>
      {note.figures ? <Figures figures={note.figures} /> : null}
    </Section>
  )
}
