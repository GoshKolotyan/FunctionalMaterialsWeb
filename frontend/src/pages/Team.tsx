import { useState } from 'react'
import { api } from '../api/client'
import { useData } from '../api/useData'
import { Async } from '../components/Async'
import { Avatar } from '../components/Avatar'
import { Icon } from '../components/Icon'
import { PageHeader } from '../components/PageHeader'
import { GROUP_LABELS, GROUP_ORDER } from '../team'
import type { Member, MemberGroup } from '../types'

function Interests({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <div className="chips">
      {items.map((t) => (
        <span key={t} className="chip">
          {t}
        </span>
      ))}
    </div>
  )
}

function Links({ m, full = false }: { m: Member; full?: boolean }) {
  if (!m.email && !m.orcid) return null
  return (
    <div className="member-links">
      {m.email && (
        <a href={`mailto:${m.email}`}>
          <Icon name="mail" size={16} /> {full ? m.email : 'Email'}
        </a>
      )}
      {m.orcid && (
        <a href={m.orcid} target="_blank" rel="noreferrer">
          <Icon name="external" size={15} /> ORCID
        </a>
      )}
    </div>
  )
}

function LeadCard({ m }: { m: Member }) {
  return (
    <article className="card lead-card fade-up">
      <Avatar member={m} size="lg" />
      <div>
        <h2>{m.name}</h2>
        <p className="role">{m.role}</p>
        {m.education && <p className="mono muted small">{m.education}</p>}
        {m.bio && <p className="bio">{m.bio}</p>}
        <Interests items={m.interests} />
        <Links m={m} full />
      </div>
    </article>
  )
}

function MemberCard({ m }: { m: Member }) {
  return (
    <article className="card member-card fade-up">
      <Avatar member={m} />
      <h3>{m.name}</h3>
      <p className="role">{m.role}</p>
      {m.bio && <p className="bio">{m.bio}</p>}
      <Interests items={m.interests} />
      <Links m={m} />
    </article>
  )
}

function TeamView({ team }: { team: Member[] }) {
  const [filter, setFilter] = useState<MemberGroup | 'all'>('all')
  const leads = team.filter((m) => m.group === 'pi')
  const groups = GROUP_ORDER.filter(
    (g) => g !== 'pi' && g !== 'alumni' && team.some((m) => m.group === g),
  )
  const alumni = team.filter((m) => m.group === 'alumni')
  const shown = filter === 'all' ? groups : groups.filter((g) => g === filter)

  return (
    <>
      {leads.map((m) => (
        <LeadCard key={m.id} m={m} />
      ))}

      {groups.length > 1 && (
        <div className="pills" role="tablist" aria-label="Filter by group">
          {(['all', ...groups] as const).map((g) => (
            <button
              key={g}
              role="tab"
              aria-selected={filter === g}
              className={`pill ${filter === g ? 'pill-active' : ''}`}
              onClick={() => setFilter(g)}
            >
              {g === 'all' ? 'All' : GROUP_LABELS[g]}
            </button>
          ))}
        </div>
      )}

      {shown.map((g) => (
        <section key={g} className="team-group">
          <h2 className="rule-heading">{GROUP_LABELS[g]}</h2>
          <div className="member-grid">
            {team
              .filter((m) => m.group === g)
              .map((m) => (
                <MemberCard key={m.id} m={m} />
              ))}
          </div>
        </section>
      ))}

      {alumni.length > 0 && filter === 'all' && (
        <section className="team-group">
          <h2 className="rule-heading rule-muted">Alumni</h2>
          <div className="alumni-grid">
            {alumni.map((m) => (
              <div key={m.id} className="card alumni-card">
                <strong>{m.name}</strong>
                <span className="muted">{m.role}</span>
                {m.education && <span className="mono muted small">{m.education}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export function Team() {
  const state = useData(api.team)
  return (
    <>
      <PageHeader
        eyebrow="People"
        title="Our team"
        lead="Physicists, chemists and materials scientists working on AI-driven discovery of functional materials."
      />
      <div className="container section">
        <Async state={state}>{(team) => <TeamView team={team} />}</Async>
      </div>
    </>
  )
}
