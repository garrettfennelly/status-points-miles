import { useState } from 'react'
import type { Field, GroundPlace, MapPlate, ShootBook } from '../data/types'
import { FieldValue, OpenSlot, Section } from '../components/common'

export function GroundTab({ book }: { book: ShootBook }) {
  return (
    <>
      <h1 className="screen-title">GROUND</h1>

      <Section head="MAP PLATES">
        <p className="note" style={{ marginTop: 0 }}>{book.ground.deepLinkNote}</p>
        <div className="stack" style={{ marginTop: 14 }}>
          {book.ground.plates.map((p) => <Plate key={p.id} plate={p} />)}
        </div>
      </Section>

      {book.ground.places.map((p) => (
        <Section head={p.label} key={p.id}>
          <div className="card">
            <FieldValue field={p.name} />
            {p.detail ? <p className="note">{p.detail}</p> : null}

            <div style={{ marginTop: 12 }}>
              <div className="tiny">COORDINATES</div>
              <CoordRow coords={p.coords} />
            </div>

            <div style={{ marginTop: 12 }}>
              <div className="tiny">ADDRESS</div>
              <FieldValue field={p.address} />
            </div>

            <MapLinks place={p} />
          </div>
        </Section>
      ))}
    </>
  )
}

function CoordRow({ coords }: { coords: Field<string> }) {
  const [copied, setCopied] = useState(false)
  if (coords.status === 'open') return <OpenSlot field={coords} />

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coords.value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button type="button" className="btn" onClick={copy}>
      <span className="mono">{coords.value}</span>
      <span className="tiny">{copied ? 'COPIED' : 'COPY'}</span>
    </button>
  )
}

/**
 * Deep links only. They hand off to the OS — no tile is ever requested by this
 * app, and the link resolves offline if the region is already downloaded.
 */
function MapLinks({ place }: { place: GroundPlace }) {
  const target =
    place.coords.status === 'locked'
      ? place.coords.value
      : place.address.status === 'locked'
        ? place.address.value
        : null

  if (!target) {
    return (
      <p className="note">
        No coordinates and no address yet — nothing to hand to the OS. The buttons appear the moment either one is
        entered.
      </p>
    )
  }

  const q = encodeURIComponent(target)
  return (
    <div className="btn-grid btn-grid-2" style={{ marginTop: 12 }}>
      <a className="btn btn-small" href={`maps://?q=${q}`}>
        <span>APPLE MAPS</span>
        <span className="tiny">OS HANDOFF</span>
      </a>
      <a className="btn btn-small" href={`geo:0,0?q=${q}`}>
        <span>GOOGLE MAPS</span>
        <span className="tiny">OS HANDOFF</span>
      </a>
    </div>
  )
}

function Plate({ plate }: { plate: MapPlate }) {
  return (
    <div>
      <div className="rowline">
        <strong className="tiny">{plate.label}</strong>
      </div>
      {plate.src.status === 'locked' ? (
        <div className="plate">
          {/* Bundled at build time. Zoom is the browser's own pinch-zoom on an
              overflow container — no library, no tiles, no requests. */}
          <img src={plate.src.value} alt={plate.caption} />
        </div>
      ) : (
        <div className="plate-empty">
          <div>
            <div className="of-missing">{plate.src.missing}</div>
            <div className="of-owner">
              {plate.src.owner ? `Owner: ${plate.src.owner}` : 'Owner unassigned'}
              {plate.src.due ? ` · ${plate.src.due}` : ''}
            </div>
          </div>
        </div>
      )}
      <p className="note">{plate.caption}</p>
    </div>
  )
}
