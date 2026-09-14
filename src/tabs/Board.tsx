import type { BoardCell, ShootBook } from '../data/types'
import { Section, StatusBadge } from '../components/common'
import { FieldValue } from '../components/common'
import { cityWall, keyInRange, rangeLabel } from '../lib/time'
import { hostLabel, type HostIdentity } from '../lib/store'

export function BoardTab({ book, now, host }: { book: ShootBook; now: Date; host: HostIdentity }) {
  const wall = cityWall(now, book.meta.utcOffsetHours)

  return (
    <>
      <h1 className="screen-title">BOARD — V4 UNIT BOARD</h1>

      <Section head="FOUR SHOOT DAYS">
        <div className="scroll-x">
          <table className="board">
            <thead>
              <tr>
                <th scope="col">Unit</th>
                {book.board.days.map((d) => (
                  <th scope="col" key={d.id}>
                    {d.label}
                    <br />
                    {d.weekday} {Number(d.date.slice(8, 10))} OCT
                  </th>
                ))}
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {book.board.rows.map((r) => (
                <tr key={r.id}>
                  <th scope="row">{r.unit === 'On-camera host' ? hostLabel(host, r.unit) : r.unit}</th>
                  {r.cells.map((c, i) => (
                    <td key={`${r.id}-${i}`}>
                      <Cell cell={c} />
                    </td>
                  ))}
                  <td className="col-total">
                    {r.total}
                    {r.totalNote ? <span className="cell-q">{r.totalNote}</span> : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="note">
          Mon 12 Oct is pre-light, build and load-in — it is not on this board because nothing shoots on it.
        </p>
      </Section>

      <Section head="FLAGS ON THE BOARD">
        <div className="stack">
          {book.board.flags.map((f) => (
            <div className={f.tone === 'gate' ? 'card card-red' : 'card'} key={f.id} style={f.tone === 'weather' ? { borderColor: 'var(--weather)' } : undefined}>
              <div className={f.tone === 'gate' ? 'card-red-head' : 'tiny'}>
                {f.tone === 'gate' ? 'NO RETRY' : 'HOLD THE DAY'}
              </div>
              <p className="lede" style={{ marginTop: 6 }}>{f.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section head="CALL & WRAP">
        <div className="btn-grid btn-grid-2">
          <div>
            <div className="tiny">CALL</div>
            <FieldValue field={book.production.call} />
          </div>
          <div>
            <div className="tiny">WRAP</div>
            <FieldValue field={book.production.wrap} />
          </div>
        </div>
      </Section>

      <Section head="PREP RUN">
        <div className="filters">
          {(['gate', 'shoot', 'prep', 'scout', 'weather', 'post', 'holiday'] as const).map((k) => (
            <StatusBadge kind={k} key={k} />
          ))}
        </div>
        <div className="stack">
          {book.calendar.map((c) => {
            const isToday = keyInRange(wall.key, c.start, c.end)
            const isPast = (c.end ?? c.start) < wall.key
            return (
              <div
                className="card"
                key={c.id}
                style={{
                  borderColor: `var(--${c.kind})`,
                  borderWidth: c.hardGate ? 3 : 2,
                  opacity: isPast ? 0.55 : 1,
                }}
              >
                <div className="rowline">
                  <strong className="mono">{rangeLabel(c.start, c.end)}</strong>
                  <StatusBadge kind={c.kind} />
                </div>
                <div className="lede" style={{ marginTop: 4 }}>
                  {c.title}
                  {isToday ? <span className="badge badge-shoot" style={{ marginLeft: 8 }}>TODAY</span> : null}
                </div>
                {c.detail ? <p className="note">{c.detail}</p> : null}
                {c.kind === 'holiday' ? (
                  <p className="note">{c.statutory ? 'Statutory public holiday.' : 'Observance — not statutory.'}</p>
                ) : null}
              </div>
            )
          })}
        </div>
      </Section>

      <Section head="HARD GATES WITH NO DATE YET">
        <p className="note" style={{ marginTop: 0 }}>
          These gates are real and dated nowhere. They do not appear on the run above because inventing a date for
          them would be worse than leaving them here.
        </p>
        <div className="stack">
          {book.undatedGates.map((g) => (
            <div className="card" key={g.id} style={{ borderColor: 'var(--gate)' }}>
              <div className="rowline">
                <strong className="lede">{g.title}</strong>
                <StatusBadge kind="gate">NO DATE</StatusBadge>
              </div>
              <p className="note">{g.detail}</p>
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

function Cell({ cell }: { cell: BoardCell }) {
  if (cell.kind === 'count') {
    return (
      <>
        <span className="cell-count mono">{cell.value}</span>
        {cell.qualifier ? <span className="cell-q">{cell.qualifier}</span> : null}
      </>
    )
  }
  if (cell.kind === 'text') return <span className="cell-text">{cell.value}</span>
  return <span className="cell-text" aria-label="none">—</span>
}
