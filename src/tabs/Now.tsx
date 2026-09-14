import { useMemo } from 'react'
import type { ShootBook } from '../data/types'
import { cityWall, clockLabel, countdownTo, dateLabel, daysBetweenKeys, keyInRange, pad, rangeLabel } from '../lib/time'
import { EmergencyButton, FieldValue, Section, StatusBadge } from '../components/common'
import { hostLabel, type HostIdentity } from '../lib/store'

export function NowTab({
  book,
  now,
  host,
  openCount,
  go,
}: {
  book: ShootBook
  now: Date
  host: HostIdentity
  openCount: number
  go: (tab: string) => void
}) {
  const wall = cityWall(now, book.meta.utcOffsetHours)
  const cd = countdownTo(book.production.firstFrame.iso, now)

  const today = useMemo(
    () => book.calendar.find((c) => keyInRange(wall.key, c.start, c.end)),
    [book.calendar, wall.key],
  )
  const next = useMemo(
    () => book.calendar.filter((c) => (c.end ?? c.start) >= wall.key).slice(0, 3),
    [book.calendar, wall.key],
  )

  const boardDay = book.board.days.find((d) => d.date === wall.key)
  const unitsUp = boardDay
    ? book.board.rows
        .map((r) => ({ row: r, cell: r.cells[book.board.days.indexOf(boardDay)] }))
        .filter((x) => x.cell && x.cell.kind !== 'none')
    : []

  return (
    <>
      <h1 className="screen-title">NOW</h1>

      <Section>
        <div className="tiny">
          {dateLabel(wall)} · {clockLabel(wall)} · {book.meta.timezone} (UTC−6, no DST)
        </div>
        <div className="tiny" style={{ marginTop: 14 }}>
          {cd.past ? 'SINCE FIRST FRAME' : 'TO FIRST FRAME'}
        </div>
        <p className="big mono">
          {cd.days}d {pad(cd.hours)}:{pad(cd.minutes)}:{pad(cd.seconds)}
        </p>
        <p className="note">
          First frame {rangeLabel(book.production.firstFrame.iso.slice(0, 10))} 06:30. {book.production.firstFrame.note}
        </p>
        <button type="button" className="btn btn-amber" onClick={() => go('open')} style={{ marginTop: 14 }}>
          <span>{openCount} FIELDS STILL OPEN</span>
          <span className="tiny">Tap for the open list</span>
        </button>
      </Section>

      <Section head="TODAY">
        <div className="card">
          {today ? (
            <>
              <div className="rowline">
                <strong className="lede">{today.title}</strong>
                <StatusBadge kind={today.kind} />
              </div>
              {today.detail ? <p className="note">{today.detail}</p> : null}
            </>
          ) : (
            <>
              <div className="rowline">
                <strong className="lede">Not a scheduled day</strong>
                <span className="tiny">{dateLabel(wall)}</span>
              </div>
              <p className="note">
                Nothing on the prep run falls on today. Next up:{' '}
                {next[0] ? `${next[0].title} — ${rangeLabel(next[0].start, next[0].end)} (${daysBetweenKeys(wall.key, next[0].start)} days)` : 'nothing left on the run.'}
              </p>
            </>
          )}

          {boardDay ? (
            <div style={{ marginTop: 14 }}>
              <div className="tiny">UNITS UP — {boardDay.label} {boardDay.weekday}</div>
              <ul className="stack-tight" style={{ margin: '8px 0 0', paddingLeft: 18 }}>
                {unitsUp.map(({ row, cell }) => (
                  <li key={row.id}>
                    <strong>{row.unit === 'On-camera host' ? hostLabel(host, row.unit) : row.unit}</strong>
                    {' — '}
                    {cell.kind === 'count' ? `${cell.value}${cell.qualifier ? ` ${cell.qualifier}` : ''}` : cell.kind === 'text' ? cell.value : ''}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="btn-grid btn-grid-2" style={{ marginTop: 14 }}>
            <div>
              <div className="tiny">CALL</div>
              <FieldValue field={book.production.call} />
            </div>
            <div>
              <div className="tiny">WRAP</div>
              <FieldValue field={book.production.wrap} />
            </div>
          </div>
        </div>
      </Section>

      <Section head="SHOOTING WINDOWS">
        {book.production.windows.map((w) => (
          <div className={`window-row window-${w.grade}`} key={w.id}>
            <div className="rowline">
              <strong className="mono" style={{ fontSize: 20 }}>{w.span}</strong>
            </div>
            <div style={{ fontWeight: 800, letterSpacing: '0.08em', fontSize: 13 }}>{w.title}</div>
            <p className="note">{w.line}</p>
            {w.warning ? (
              <p className="note" style={{ color: 'var(--gate)', fontWeight: 700 }}>{w.warning}</p>
            ) : null}
          </div>
        ))}
      </Section>

      <Section head="SUN">
        <div className="figs">
          <div className="fig">
            <div className="fig-val mono">{book.production.sun.from.sunrise} → {book.production.sun.to.sunrise}</div>
            <div className="fig-lab">Sunrise, {book.production.sun.from.dateLabel} → {book.production.sun.to.dateLabel}</div>
          </div>
          <div className="fig">
            <div className="fig-val mono">{book.production.sun.from.sunset} → {book.production.sun.to.sunset}</div>
            <div className="fig-lab">Sunset, {book.production.sun.from.dateLabel} → {book.production.sun.to.dateLabel}</div>
          </div>
        </div>
        <ul className="stack-tight" style={{ margin: '14px 0 0', paddingLeft: 18 }}>
          {book.production.sun.drift.map((d) => <li key={d}>{d}</li>)}
        </ul>
        <p className="note"><strong>{book.production.sun.moon}</strong></p>
      </Section>

      <Section head="EMERGENCY">
        <div className="btn-grid btn-grid-2">
          {book.emergency.map((e) => <EmergencyButton key={e.id} e={e} />)}
        </div>
      </Section>

      <Section head={`OPEN GATES — ${book.gates.length} UNRESOLVED, NEWEST FIRST`}>
        <div className="stack">
          {book.gates.map((g) => (
            <div className="card" key={g.id} style={{ borderColor: 'var(--gate)' }}>
              <div className="rowline">
                <strong className="lede">{g.title}</strong>
                <StatusBadge kind="gate">OPEN</StatusBadge>
              </div>
              <p className="note">{g.detail}</p>
              {g.positions ? (
                <div className="filters" style={{ marginTop: 10 }}>
                  {g.positions.map((p) => <span className="badge badge-gate mono" key={p}>{p}</span>)}
                </div>
              ) : null}
              <div className="btn-grid btn-grid-2" style={{ marginTop: 10 }}>
                <FieldValue field={g.owner} prefix="OWNER" />
                <FieldValue field={g.due} prefix="DUE" />
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}
