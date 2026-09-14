import { useMemo, useState } from 'react'
import type { CrewMember, ShootBook } from '../data/types'
import { ContactButton, FieldValue, Section } from '../components/common'
import { hostLabel, type HostIdentity } from '../lib/store'

export function CrewTab({ book, host }: { book: ShootBook; host: HostIdentity }) {
  const [q, setQ] = useState('')

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const match = (m: CrewMember) =>
      !needle ||
      [m.role, m.dept, m.basis, m.name.status === 'locked' ? m.name.value : '']
        .join(' ')
        .toLowerCase()
        .includes(needle)

    const map = new Map<string, CrewMember[]>()
    for (const m of book.crew) {
      if (!match(m)) continue
      const list = map.get(m.dept)
      if (list) list.push(m)
      else map.set(m.dept, [m])
    }
    return [...map.entries()]
  }, [book.crew, q])

  const collected = book.crew.filter((m) => m.phone.status === 'locked').length
  const shown = groups.reduce((n, [, list]) => n + list.length, 0)

  return (
    <>
      <h1 className="screen-title">CREW — {book.crew.length} SEATS</h1>

      <div className="search">
        <input
          type="search"
          inputMode="search"
          placeholder="Search role, department or name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search crew"
        />
      </div>

      <Section>
        <div className="figs">
          <div className="fig">
            <div className="fig-val mono">{collected} / {book.crew.length}</div>
            <div className="fig-lab">Contacts collected</div>
          </div>
          <div className="fig">
            <div className="fig-val mono">{book.crew.length - collected}</div>
            <div className="fig-lab">Still to chase</div>
          </div>
        </div>
        <p className="note">
          Every dashed button below is a contact nobody has sent yet. This list is the collection tracker — when a
          number lands, a producer enters it in /admin and the button starts dialling.
        </p>
      </Section>

      {groups.map(([dept, list]) => (
        <Section head={`${dept} — ${list.length}`} key={dept}>
          <div className="stack">
            {list.map((m) => (
              <div className="card" key={m.id}>
                <div className="rowline">
                  <strong className="lede">{m.role}</strong>
                  <span className="tiny mono">{m.id.toUpperCase()}</span>
                </div>
                <FieldValue field={m.name} prefix="NAME" />
                <p className="note">{m.basis}</p>
                <div className="btn-grid btn-grid-2" style={{ marginTop: 10 }}>
                  <ContactButton field={m.phone} kind="tel" label="CALL" name={m.role} />
                  <ContactButton field={m.phone} kind="sms" label="SMS" name={m.role} />
                  <ContactButton field={m.phone} kind="whatsapp" label="WHATSAPP" name={m.role} />
                  <ContactButton field={m.email} kind="mailto" label="EMAIL" name={m.role} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      ))}

      {shown === 0 ? (
        <Section>
          <p className="note">No seat matches “{q}”.</p>
        </Section>
      ) : null}

      <Section head="TALENT — NOT ONE OF THE 29">
        <div className="card">
          <div className="rowline">
            <strong className="lede">{hostLabel(host, book.talent.label)}</strong>
            <span className="badge badge-post">{host.revealed && host.name.trim() ? 'NAME ON' : 'EMBARGO'}</span>
          </div>
          <p className="note">{book.talent.embargoLine}</p>
          <div className="btn-grid btn-grid-2" style={{ marginTop: 10 }}>
            <ContactButton field={book.talent.phone} kind="tel" label="CALL" name={book.talent.label} />
            <ContactButton field={book.talent.agency} kind="mailto" label="REPRESENTATION" name={book.talent.label} />
          </div>
        </div>
      </Section>
    </>
  )
}
