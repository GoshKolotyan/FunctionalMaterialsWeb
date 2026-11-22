import { Fragment } from 'react'
import { isMember } from '../team'
import type { Publication } from '../types'
import { Icon } from './Icon'

function pubLink(p: Publication) {
  return p.doi ? `https://doi.org/${p.doi}` : p.url
}

/** "A. Example, B. Outside" → highlight authors whose surname belongs to the team. */
function Authors({ authors, highlight }: { authors: string; highlight: Set<string> }) {
  // Authors are comma-separated: "Kaviani S., Asatryan A."
  const list = authors.split(',').map((a) => a.trim()).filter(Boolean)
  return (
    <div className="authors">
      {list.map((a, i) => (
        <Fragment key={i}>
          {isMember(a, highlight) ? <strong>{a}</strong> : a}
          {i < list.length - 1 && ', '}
        </Fragment>
      ))}
    </div>
  )
}

export function PublicationItem({ p, highlight }: { p: Publication; highlight: Set<string> }) {
  const link = pubLink(p)
  return (
    <li className="pub card">
      <div className="pub-title">{p.title}</div>
      <Authors authors={p.authors} highlight={highlight} />
      <div className="pub-meta">
        {p.venue && <span className="venue">{p.venue}</span>}
        <span className="pub-links">
          {p.doi && <span className="chip chip-mono">doi:{p.doi}</span>}
          {link && (
            <a href={link} target="_blank" rel="noreferrer" className="link-arrow">
              View <Icon name="arrow" size={14} />
            </a>
          )}
        </span>
      </div>
    </li>
  )
}
