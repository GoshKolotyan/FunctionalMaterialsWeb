import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useData } from '../api/useData'
import { Async } from '../components/Async'
import { Markdown } from '../components/Markdown'
import { CategoryBadge, NewsCard } from '../components/NewsCard'
import { PageHeader } from '../components/PageHeader'
import { formatDate } from '../format'
import { Social } from '../components/Social'
import type { NewsPost as Post } from '../types'

function NewsList({ items }: { items: Post[] }) {
  const [category, setCategory] = useState('all')
  const site = useData(api.site)
  if (items.length === 0) {
    return (
      <div className="card empty-state">
        <h3>No news here yet</h3>
        <p className="muted">Follow the group on social media for the latest updates.</p>
        <Social info={site.status === 'ready' ? site.data : null} className="social-dark" />
      </div>
    )
  }
  const categories = [...new Set(items.map((n) => n.category))]
  const shown = category === 'all' ? items : items.filter((n) => n.category === category)
  return (
    <>
      {categories.length > 1 && (
        <div className="pills">
          {['all', ...categories].map((c) => (
            <button
              key={c}
              className={`pill ${category === c ? 'pill-active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {c === 'all' ? 'All' : c[0].toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      )}
      <div className="news-grid">
        {shown.map((n) => (
          <NewsCard key={n.id} n={n} />
        ))}
      </div>
    </>
  )
}

export function News() {
  const state = useData(api.news)
  return (
    <>
      <PageHeader eyebrow="Updates" title="News" lead="Papers, awards, events and life in the lab." />
      <div className="container section">
        <Async state={state}>{(items) => <NewsList items={items} />}</Async>
      </div>
    </>
  )
}

export function NewsPost() {
  const { slug = '' } = useParams()
  const state = useData(() => api.newsPost(slug), slug)
  return (
    <Async state={state}>
      {(n) => (
        <article>
          <PageHeader eyebrow={formatDate(n.date)} title={n.title} lead={n.summary} />
          <div className="container section narrow">
            <CategoryBadge category={n.category} />
            <div className="card card-prose post-body">
              <Markdown>{n.body}</Markdown>
            </div>
            <Link to="/news" className="link-arrow">
              ← All news
            </Link>
          </div>
        </article>
      )}
    </Async>
  )
}
