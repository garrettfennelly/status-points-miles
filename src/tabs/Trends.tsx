import { useMemo, useState } from 'react'
import type { ShootBook, Tier, Trend } from '../data/types'
import { FieldValue, Section, StatusBadge } from '../components/common'

const TIERS: { key: string; label: string; match: (t: Trend) => boolean }[] = [
  { key: 'all', label: 'All', match: () => true },
  { key: 't1', label: 'Tier 1', match: (t) => t.tier === 1 },
  { key: 't2', label: 'Tier 2', match: (t) => t.tier === 2 },
  { key: 't3', label: 'Tier 3', match: (t) => t.tier === 3 },
  { key: 'untiered', label: 'Untiered', match: (t) => t.tier === 'untiered' },
  { key: 'backup', label: 'Backup', match: (t) => t.tier === 'backup' },
]

const FILM: { key: string; label: string; match: (t: Trend) => boolean }[] = [
  { key: 'all', label: 'All', match: () => true },
  { key: 'film', label: 'Film', match: (t) => t.film === 'film' },
  { key: 'recco', label: 'RECCO', match: (t) => t.film === 'RECCO' },
  { key: 'none', label: 'No film', match: (t) => t.film === null },
]

export function TrendsTab({ book }: { book: ShootBook }) {
  const [tier, setTier] = useState('all')
  const [film, setFilm] = useState('all')
  const [req, setReq] = useState('all')

  const requirements = useMemo(() => {
    const set = new Set<string>()
    for (const t of book.trends) for (const p of t.physical) set.add(p)
    return ['all', ...[...set].sort()]
  }, [book.trends])

  const shown = book.trends.filter((t) => {
    const tierOk = TIERS.find((x) => x.key === tier)?.match(t) ?? true
    const filmOk = FILM.find((x) => x.key === film)?.match(t) ?? true
    const reqOk = req === 'all' || t.physical.includes(req)
    return tierOk && filmOk && reqOk
  })

  const mementos = shown.reduce((n, t) => n + t.mementos, 0)

  return (
    <>
      <h1 className="screen-title">TRENDS — 21 + BACKUPS</h1>

      <Section>
        <div className="card" style={{ borderColor: 'var(--weather)' }}>
          <div className="tiny" style={{ color: 'var(--weather)' }}>NAMES ARE STILL MOVING</div>
          <p className="lede" style={{ marginTop: 6 }}>{book.trendNotes.banner}</p>
          <FieldValue field={book.trendNotes.altNameList} />
        </div>
      </Section>

      <Section head="FILTER BY TIER">
        <div className="filters">
          {TIERS.map((t) => (
            <button key={t.key} type="button" className="chip" aria-pressed={tier === t.key} onClick={() => setTier(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
        <h3 className="section-head">FILTER BY FILM STATUS</h3>
        <div className="filters">
          {FILM.map((t) => (
            <button key={t.key} type="button" className="chip" aria-pressed={film === t.key} onClick={() => setFilm(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
        <h3 className="section-head">FILTER BY PHYSICAL REQUIREMENT</h3>
        <div className="filters">
          {requirements.map((r) => (
            <button key={r} type="button" className="chip" aria-pressed={req === r} onClick={() => setReq(r)}>
              {r === 'all' ? 'All' : r}
            </button>
          ))}
        </div>
        <p className="note">
          Showing <strong>{shown.length}</strong> of {book.trends.length} · {mementos} mementos in view
        </p>
      </Section>

      <Section head="HERO CAMPAIGN IMAGE">
        <div className="card card-red">
          <div className="rowline">
            <span className="card-red-head">{book.heroCampaign.title}</span>
            <StatusBadge kind="gate">AT RISK</StatusBadge>
          </div>
          <ul className="stack-tight" style={{ margin: '10px 0 0', paddingLeft: 18 }}>
            {book.heroCampaign.lines.map((l) => <li key={l}>{l}</li>)}
          </ul>
          <div className="stack" style={{ marginTop: 12 }}>
            <FieldValue field={book.heroCampaign.shotIdea} />
            <FieldValue field={book.heroCampaign.crowdBudget} />
          </div>
        </div>
      </Section>

      <Section head="THE BOARD">
        <div className="stack">
          {shown.map((t) => <TrendCard key={t.number} t={t} />)}
          {shown.length === 0 ? <p className="note">Nothing matches those three filters together.</p> : null}
        </div>
      </Section>
    </>
  )
}

function tierLabel(tier: Tier): string {
  if (tier === 'untiered') return 'UNTIERED'
  if (tier === 'backup') return 'BACKUP'
  return `TIER ${tier}`
}

function TrendCard({ t }: { t: Trend }) {
  return (
    <div className="card">
      <div className="rowline">
        <div>
          {/* The tier number travels with the name, always. */}
          <div className="mono" style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.12em' }}>T{t.number}</div>
          <div className="lede" style={{ fontSize: 22, fontWeight: 800, marginTop: 2 }}>{t.name}</div>
          {t.altName ? <div className="note" style={{ marginTop: 0 }}>alt: {t.altName}</div> : null}
        </div>
        <span className={`badge ${t.tier === 'backup' || t.tier === 'untiered' ? 'badge-holiday' : 'badge-shoot'}`}>
          {tierLabel(t.tier)}
        </span>
      </div>

      <div className="filters" style={{ marginTop: 12 }}>
        <span className="badge badge-holiday">{t.category}</span>
        {t.partnership ? <span className="badge badge-post">PARTNERSHIP</span> : null}
        {t.film ? <span className="badge badge-scout">{t.film === 'film' ? 'FILM' : 'RECCO'}</span> : <span className="badge badge-holiday">NO FILM</span>}
        {t.multipin ? <span className="badge badge-prep">MULTIPIN</span> : null}
        <span className="badge badge-holiday mono">{t.mementos} MEMENTOS</span>
      </div>

      <div style={{ marginTop: 12 }}>
        <div className="tiny" style={{ color: 'var(--open-ink)' }}>PHYSICAL REQUIREMENTS — NOT YET BID</div>
        <div className="filters" style={{ marginTop: 6 }}>
          {t.physical.map((p) => <span className="badge badge-open" key={p}>{p}</span>)}
        </div>
      </div>

      {t.note ? <p className="note">{t.note}</p> : null}
    </div>
  )
}
