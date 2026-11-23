import { api, assetUrl } from '../api/client'
import { useData } from '../api/useData'
import { Async } from '../components/Async'
import { PageHeader } from '../components/PageHeader'
import type { Product } from '../types'

const HUES = ['hue-0', 'hue-1', 'hue-2', 'hue-3']

function ProductCard({ p, index }: { p: Product; index: number }) {
  return (
    <article className="card research-card">
      <div className={`research-media ${HUES[index % HUES.length]}`}>
        {p.image ? (
          <img src={assetUrl(p.image)} alt="" loading="lazy" />
        ) : (
          <span className="research-num">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>
      <div className="research-body">
        <h3>{p.title}</h3>
        {p.summary && <p>{p.summary}</p>}
        {p.url && (
          <a href={p.url} target="_blank" rel="noreferrer" className="link-arrow">
            Learn more →
          </a>
        )}
      </div>
    </article>
  )
}

function ProductList({ items }: { items: Product[] }) {
  if (items.length === 0) {
    return (
      <div className="card empty-state">
        <h3>Coming soon</h3>
        <p className="muted">Products developed by the group will be listed here.</p>
      </div>
    )
  }
  return (
    <div className="research-grid">
      {items.map((p, i) => (
        <ProductCard key={p.id} p={p} index={i} />
      ))}
    </div>
  )
}

export function Products() {
  const state = useData(api.products)
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Our products"
        lead="Materials, devices and tools developed by the group."
      />
      <div className="container section">
        <Async state={state}>{(items) => <ProductList items={items} />}</Async>
      </div>
    </>
  )
}
