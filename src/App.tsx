import { useEffect, useState } from 'react'
import './styles/app.css'
import { NowTab } from './tabs/Now'
import { CrewTab } from './tabs/Crew'
import { GroundTab } from './tabs/Ground'
import { BoardTab } from './tabs/Board'
import { TrendsTab } from './tabs/Trends'
import { SafetyTab } from './tabs/Safety'
import { OpenFieldsScreen } from './tabs/OpenFields'
import { AdminScreen } from './admin/Admin'
import { loadTheme, saveTheme, useBook, useHost, useNow, useOpenCount, useRoute, type ThemeChoice } from './lib/store'
import { cityWall, dateLabel, prefersDarkNow } from './lib/time'

const TABS = [
  { id: 'now', label: 'NOW' },
  { id: 'crew', label: 'CREW' },
  { id: 'ground', label: 'GROUND' },
  { id: 'board', label: 'BOARD' },
  { id: 'trends', label: 'TRENDS' },
  { id: 'safety', label: 'SAFETY' },
]

export default function App() {
  const [book, setBook, resetBook] = useBook()
  const [host, setHost] = useHost()
  const [route, go] = useRoute()
  const now = useNow(1000)
  const openCount = useOpenCount(book)
  const [theme, setTheme] = useState<ThemeChoice>(loadTheme)

  // Manual override wins. On auto, dark runs 17:00 → 07:00 device time.
  const dark = theme === 'auto' ? prefersDarkNow(now) : theme === 'dark'

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  const cycleTheme = () => {
    const next: ThemeChoice = theme === 'auto' ? 'light' : theme === 'light' ? 'dark' : 'auto'
    setTheme(next)
    saveTheme(next)
  }

  const wall = cityWall(now, book.meta.utcOffsetHours)

  return (
    <div className="app">
      <header className="masthead">
        <div>
          <div className="masthead-title">{book.meta.title}</div>
          <div className="masthead-sub">{book.meta.subtitle}</div>
        </div>
        <div className="masthead-spacer" />
        <button type="button" className="theme-toggle" onClick={cycleTheme} aria-label={`Theme: ${theme}`}>
          {theme === 'auto' ? `AUTO · ${dark ? 'DARK' : 'LIGHT'}` : theme.toUpperCase()}
        </button>
      </header>

      <main>
        {route.admin ? (
          <AdminScreen book={book} setBook={setBook} resetBook={resetBook} host={host} setHost={setHost} go={go} />
        ) : route.tab === 'open' ? (
          <OpenFieldsScreen book={book} go={go} />
        ) : route.tab === 'crew' ? (
          <CrewTab book={book} host={host} />
        ) : route.tab === 'ground' ? (
          <GroundTab book={book} />
        ) : route.tab === 'board' ? (
          <BoardTab book={book} now={now} host={host} />
        ) : route.tab === 'trends' ? (
          <TrendsTab book={book} />
        ) : route.tab === 'safety' ? (
          <SafetyTab book={book} />
        ) : (
          <NowTab book={book} now={now} host={host} openCount={openCount} go={go} />
        )}

        <footer className="footer">
          <span>{book.meta.title} {book.meta.version}</span>
          <span>AS OF {book.meta.asOf}</span>
          <span>{openCount} FIELDS OPEN</span>
          <span>{dateLabel(wall)} · CDMX</span>
          <button
            type="button"
            className="theme-toggle"
            style={{ border: 0, padding: 0, minHeight: 0, minWidth: 0, letterSpacing: '0.08em' }}
            onClick={() => go('open')}
          >
            OPEN LIST
          </button>
        </footer>
      </main>

      <nav className="tabbar" aria-label="Sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => go(t.id)}
            aria-label={t.label}
            aria-current={!route.admin && route.tab === t.id ? 'page' : undefined}
          >
            <span>{t.label}</span>
            {t.id === 'now' && openCount > 0 ? <span className="tab-count">{openCount} OPEN</span> : null}
          </button>
        ))}
      </nav>
    </div>
  )
}
