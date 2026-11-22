import { Link } from 'react-router-dom'
import { formatDate } from '../format'
import type { NewsPost } from '../types'

export function CategoryBadge({ category }: { category: string }) {
  return <span className={`badge badge-${category}`}>{category}</span>
}

export function NewsCard({ n }: { n: NewsPost }) {
  return (
    <Link to={`/news/${n.slug}`} className="card card-link news-card">
      <div className="news-card-top">
        <CategoryBadge category={n.category} />
        <time className="date">{formatDate(n.date)}</time>
      </div>
      <h3>{n.title}</h3>
      {n.summary && <p>{n.summary}</p>}
      <span className="link-arrow">Read more →</span>
    </Link>
  )
}
