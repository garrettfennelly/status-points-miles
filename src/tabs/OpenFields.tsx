import { useMemo } from 'react'
import type { ShootBook } from '../data/types'
import { groupBySection, walkFields } from '../lib/fields'
import { Section } from '../components/common'

const SECTION_LABELS: Record<string, string> = {
  production: 'PRODUCTION',
  gates: 'OPEN GATES',
  emergency: 'EMERGENCY',
  undatedGates: 'UNDATED HARD GATES',
  trendNotes: 'TRENDS',
  heroCampaign: 'HERO CAMPAIGN IMAGE',
  crew: 'CREW',
  talent: 'TALENT',
  ground: 'GROUND',
  safety: 'SAFETY',
}

/** The collection tracker: every dashed slot in the book, in one list. */
export function OpenFieldsScreen({ book, go }: { book: ShootBook; go: (tab: string) => void }) {
  const groups = useMemo(
    () =>
      groupBySection(walkFields(book).filter((e) => e.field.status === 'open'))
        .map((g) => ({ ...g, label: SECTION_LABELS[g.section] ?? g.section.toUpperCase() })),
    [book],
  )
  const total = groups.reduce((n, g) => n + g.entries.length, 0)

  return (
    <>
      <h1 className="screen-title">STILL OPEN — {total} FIELDS</h1>
      <Section>
        <p className="lede" style={{ marginTop: 0 }}>
          Nothing here is guessed and nothing here is filled in with something plausible. Each line is a field
          somebody owes the book.
        </p>
        <button type="button" className="btn btn-solid" onClick={() => go('now')}>
          <span>BACK TO NOW</span>
          <span className="tiny">↩</span>
        </button>
      </Section>

      {groups.map((g) => (
        <Section head={`${g.label} — ${g.entries.length}`} key={g.section}>
          <div className="stack-tight">
            {g.entries.map((e) => {
              if (e.field.status !== 'open') return null
              return (
                <div className="card-flat" key={e.key}>
                  <div className="rowline">
                    <strong>{e.field.missing}</strong>
                    <span className="pill-open">{e.field.owner ?? 'NO OWNER'}</span>
                  </div>
                  <div className="admin-path mono">{e.key}</div>
                  {e.field.due ? <div className="note" style={{ marginTop: 2 }}>Due: {e.field.due}</div> : null}
                </div>
              )
            })}
          </div>
        </Section>
      ))}
    </>
  )
}
