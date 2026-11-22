import { useMemo, useState } from 'react'
import { api } from '../api/client'
import { useData } from '../api/useData'
import { Async } from '../components/Async'
import { Icon } from '../components/Icon'
import { PageHeader } from '../components/PageHeader'
import { PublicationItem } from '../components/PublicationItem'
import { memberSurnames } from '../team'
import type { Member, Publication } from '../types'

function PublicationsView({ pubs, team }: { pubs: Publication[]; team: Member[] }) {
  const [query, setQuery] = useState('')
  const [year, setYear] = useState<number | 'all'>('all')
  const highlight = useMemo(() => memberSurnames(team), [team])
  const years = [...new Set(pubs.map((p) => p.year))].sort((a, b) => b - a)

  const q = query.trim().toLowerCase()
  const filtered = pubs.filter(
    (p) =>
      (year === 'all' || p.year === year) &&
      (!q || `${p.title} ${p.authors} ${p.venue}`.toLowerCase().includes(q)),
  )
  const shownYears = years.filter((y) => filtered.some((p) => p.year === y))

  return (
    <div className="pubs-layout">
      <aside className="pubs-sidebar">
        <label className="search">
          <Icon name="search" size={18} />
          <input
            type="search"
            placeholder="Search publications…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <p className="sidebar-label">Filter by year</p>
        <div className="year-filter">
          {(['all', ...years] as const).map((y) => (
            <button
              key={y}
              className={`year-btn ${year === y ? 'year-btn-active' : ''}`}
              onClick={() => setYear(y)}
            >
              {y === 'all' ? 'All years' : y}
            </button>
          ))}
        </div>
      </aside>
      <div>
        {shownYears.length === 0 && <p className="muted">No publications match your search.</p>}
        {shownYears.map((y) => (
          <section key={y} className="pub-year">
            <h2 className="year rule-heading">{y}</h2>
            <ul className="pubs">
              {filtered
                .filter((p) => p.year === y)
                .map((p) => (
                  <PublicationItem key={p.id} p={p} highlight={highlight} />
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}

export function Publications() {
  const both = useData(() => Promise.all([api.publications(), api.team()]))
  return (
    <>
      <PageHeader
        eyebrow="Research output"
        title="Publications"
        lead="Peer-reviewed papers from the project. Team members are highlighted."
      />
      <div className="container section">
        <Async state={both}>{([p, t]) => <PublicationsView pubs={p} team={t} />}</Async>
      </div>
    </>
  )
}
