import { useMemo, useState } from 'react'
import type { ShootBook } from '../data/types'
import { shootbook as seed } from '../data/shootbook'
import { getByPath, groupBySection, setByPath, walkFields, type AnyField } from '../lib/fields'
import { Section } from '../components/common'
import { type HostIdentity } from '../lib/store'

const SESSION_KEY = 'p27.admin.unlocked'

export function AdminScreen({
  book,
  setBook,
  resetBook,
  host,
  setHost,
  go,
}: {
  book: ShootBook
  setBook: (b: ShootBook) => void
  resetBook: () => void
  host: HostIdentity
  setHost: (h: HostIdentity) => void
  go: (tab: string) => void
}) {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return window.sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      return false
    }
  })

  if (!unlocked) {
    return <Gate expected={book.meta.adminPassphrase} onUnlock={() => {
      try { window.sessionStorage.setItem(SESSION_KEY, '1') } catch { /* ignore */ }
      setUnlocked(true)
    }} go={go} />
  }

  return <AdminBody book={book} setBook={setBook} resetBook={resetBook} host={host} setHost={setHost} go={go} />
}

function Gate({ expected, onUnlock, go }: { expected: string; onUnlock: () => void; go: (tab: string) => void }) {
  const [value, setValue] = useState('')
  const [wrong, setWrong] = useState(false)
  return (
    <>
      <h1 className="screen-title">ADMIN</h1>
      <Section>
        <p className="lede" style={{ marginTop: 0 }}>
          Producer access. There is no server and no account — this passphrase only keeps the book from being edited
          by whoever picks the iPad up.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (value === expected) onUnlock()
            else setWrong(true)
          }}
        >
          <div className="admin-field">
            <label htmlFor="pass">Passphrase</label>
            <input
              id="pass"
              type="password"
              autoComplete="off"
              value={value}
              onChange={(e) => { setValue(e.target.value); setWrong(false) }}
            />
          </div>
          {wrong ? <p className="note" style={{ color: 'var(--gate)' }}>Not that one.</p> : null}
          <div className="btn-grid btn-grid-2" style={{ marginTop: 12 }}>
            <button type="submit" className="btn btn-solid"><span>UNLOCK</span></button>
            <button type="button" className="btn" onClick={() => go('now')}><span>BACK</span></button>
          </div>
        </form>
      </Section>
    </>
  )
}

function AdminBody({
  book,
  setBook,
  resetBook,
  host,
  setHost,
  go,
}: {
  book: ShootBook
  setBook: (b: ShootBook) => void
  resetBook: () => void
  host: HostIdentity
  setHost: (h: HostIdentity) => void
  go: (tab: string) => void
}) {
  const [raw, setRaw] = useState('')
  const [message, setMessage] = useState<string | null>(null)

  const groups = useMemo(() => groupBySection(walkFields(book)), [book])
  const openCount = useMemo(() => walkFields(book).filter((e) => e.field.status === 'open').length, [book])

  const setField = (path: string[], next: AnyField) => setBook(setByPath(book, path, next))

  const exportJson = () => {
    // The host's name is deliberately NOT part of this file. It stays on the
    // device it was typed into.
    const text = JSON.stringify(book, null, 2)
    try {
      const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `predicts27-shootbook-${book.meta.version}-${book.meta.asOf}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setMessage('Exported.')
    } catch {
      setMessage('Download blocked — use COPY JSON instead.')
    }
  }

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(book, null, 2))
      setMessage('JSON copied to the clipboard.')
    } catch {
      setMessage('Clipboard blocked — paste from the raw box below.')
    }
  }

  const importText = (text: string) => {
    try {
      const parsed = JSON.parse(text) as ShootBook
      if (!parsed || typeof parsed !== 'object' || !('meta' in parsed)) throw new Error('not a shoot book')
      setBook(parsed)
      setMessage('Imported and saved.')
    } catch (err) {
      setMessage(`Import failed: ${(err as Error).message}`)
    }
  }

  return (
    <>
      <h1 className="screen-title">ADMIN — {openCount} FIELDS OPEN</h1>

      <Section>
        <div className="btn-grid btn-grid-2">
          <button type="button" className="btn btn-solid" onClick={exportJson}><span>EXPORT JSON</span></button>
          <button type="button" className="btn" onClick={copyJson}><span>COPY JSON</span></button>
          <label className="btn" style={{ cursor: 'pointer' }}>
            <span>IMPORT JSON</span>
            <input
              type="file"
              accept="application/json,.json"
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) importText(await file.text())
                e.target.value = ''
              }}
            />
          </label>
          <button type="button" className="btn" onClick={() => go('now')}><span>BACK TO BOOK</span></button>
        </div>
        {message ? <p className="note"><strong>{message}</strong></p> : null}
      </Section>

      <Section head="EMBARGO — ON-CAMERA HOST">
        <p className="note" style={{ marginTop: 0 }}>
          The host's name is not in this build and never will be. Switch this on only after the announcement has
          cleared. The name is stored on this device alone — it is not in the seed file and it is not written into an
          export, so it cannot travel to the other fourteen iPads by accident.
        </p>
        <div className="admin-field">
          <label htmlFor="reveal">Name visible in the book</label>
          <div className="btn-grid btn-grid-2" style={{ marginTop: 8 }}>
            <button
              id="reveal"
              type="button"
              className={host.revealed ? 'btn btn-solid' : 'btn'}
              onClick={() => setHost({ ...host, revealed: !host.revealed })}
            >
              <span>{host.revealed ? 'NAME ON' : 'NAME OFF (DEFAULT)'}</span>
            </button>
            <button type="button" className="btn" onClick={() => setHost({ revealed: false, name: '' })}>
              <span>CLEAR NAME</span>
            </button>
          </div>
        </div>
        <div className="admin-field">
          <label htmlFor="hostname">Host name — this device only</label>
          <input
            id="hostname"
            type="text"
            autoComplete="off"
            value={host.name}
            placeholder="Leave empty to keep reading “On-camera host”"
            onChange={(e) => setHost({ ...host, name: e.target.value })}
          />
        </div>
      </Section>

      <Section head="BOOK STAMP">
        <div className="admin-field">
          <label htmlFor="version">Version — printed in every footer</label>
          <input
            id="version"
            value={book.meta.version}
            onChange={(e) => setBook({ ...book, meta: { ...book.meta, version: e.target.value } })}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="asof">As of — printed in every footer</label>
          <input
            id="asof"
            value={book.meta.asOf}
            onChange={(e) => setBook({ ...book, meta: { ...book.meta, asOf: e.target.value } })}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="pass2">Admin passphrase</label>
          <input
            id="pass2"
            value={book.meta.adminPassphrase}
            onChange={(e) => setBook({ ...book, meta: { ...book.meta, adminPassphrase: e.target.value } })}
          />
        </div>
      </Section>

      {groups.map((g) => (
        <Section head={`${g.section.toUpperCase()} — ${g.entries.length} FIELDS`} key={g.section}>
          {g.entries.map((e) => (
            <FieldEditor key={e.key} path={e.path} field={e.field} label={e.label} onChange={setField} />
          ))}
        </Section>
      ))}

      <Section head="RAW JSON">
        <p className="note" style={{ marginTop: 0 }}>
          Everything the field editors do not reach — trend rows, board cells, safety copy, the prep run. Paste a whole
          book here and apply it.
        </p>
        <div className="admin-field">
          <label htmlFor="raw">Book JSON</label>
          <textarea
            id="raw"
            value={raw}
            placeholder="Press LOAD CURRENT, edit, then APPLY"
            onChange={(e) => setRaw(e.target.value)}
          />
        </div>
        <div className="btn-grid btn-grid-2">
          <button type="button" className="btn" onClick={() => setRaw(JSON.stringify(book, null, 2))}>
            <span>LOAD CURRENT</span>
          </button>
          <button type="button" className="btn btn-solid" onClick={() => importText(raw)}>
            <span>APPLY</span>
          </button>
        </div>
      </Section>

      <Section head="RESET">
        <button
          type="button"
          className="btn btn-red"
          onClick={() => {
            if (window.confirm('Discard every local edit and return to the shipped book?')) {
              resetBook()
              setMessage('Reset to the shipped book.')
            }
          }}
        >
          <span>DISCARD LOCAL EDITS</span>
        </button>
        <p className="note">
          This clears this device's saved edits only. Other iPads keep theirs — reissue by exporting here and importing
          there.
        </p>
      </Section>
    </>
  )
}

function FieldEditor({
  path,
  field,
  label,
  onChange,
}: {
  path: string[]
  field: AnyField
  label: string
  onChange: (path: string[], next: AnyField) => void
}) {
  const key = path.join('.')
  const seedField = getByPath<AnyField>(seed, path)
  const fallback =
    seedField && seedField.status === 'open'
      ? seedField
      : { status: 'open' as const, missing: label, owner: null, due: null }

  const value = field.status === 'locked' ? String(field.value) : ''

  const commit = (next: string) => {
    if (next.trim() === '') onChange(path, { ...fallback })
    else onChange(path, { status: 'locked', value: next })
  }

  return (
    <div className="admin-field">
      <label htmlFor={key}>
        {label} {field.status === 'open' ? <span className="pill-open">OPEN</span> : null}
      </label>
      <div className="admin-path mono">{key}</div>
      <input
        id={key}
        value={value}
        placeholder={field.status === 'open' ? `${fallback.missing} — leave empty to keep it dashed` : ''}
        onChange={(e) => commit(e.target.value)}
      />
      {field.status === 'open' ? (
        <div className="btn-grid btn-grid-2" style={{ marginTop: 8 }}>
          <input
            aria-label={`${label} owner`}
            value={field.owner ?? ''}
            placeholder="Owner"
            onChange={(e) => onChange(path, { ...field, owner: e.target.value || null })}
          />
          <input
            aria-label={`${label} due`}
            value={field.due ?? ''}
            placeholder="Due"
            onChange={(e) => onChange(path, { ...field, due: e.target.value || null })}
          />
        </div>
      ) : null}
    </div>
  )
}
