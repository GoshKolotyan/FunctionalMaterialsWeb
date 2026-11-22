import { assetUrl } from '../api/client'
import type { ResearchArea } from '../types'

const HUES = ['hue-0', 'hue-1', 'hue-2', 'hue-3']

export function ResearchCard({ r, index }: { r: ResearchArea; index: number }) {
  return (
    <article className="card research-card">
      <div className={`research-media ${HUES[index % HUES.length]}`}>
        {r.image ? (
          <img src={assetUrl(r.image)} alt="" loading="lazy" />
        ) : (
          <span className="research-num">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>
      <div className="research-body">
        <h3>{r.title}</h3>
        <p>{r.summary}</p>
      </div>
    </article>
  )
}
