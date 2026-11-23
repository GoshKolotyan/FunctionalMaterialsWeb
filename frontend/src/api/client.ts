import type { Member, NewsPost, Page, Product, Publication, ResearchArea, SiteInfo } from '../types'

const MODE = import.meta.env.VITE_DATA_MODE ?? (import.meta.env.DEV ? 'api' : 'static')
const API_URL = import.meta.env.VITE_API_URL ?? ''

/** Resolve a site-relative asset path (e.g. "images/team/x.jpg") against the deploy base. */
export function assetUrl(path: string): string {
  if (!path || /^(https?:)?\/\//.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

// Each resource is fetched once and cached for the session.
const cache = new Map<string, Promise<unknown>>()

function resource<T>(name: string): Promise<T> {
  const url = MODE === 'static' ? assetUrl(`data/${name}.json`) : `${API_URL}/api/${name}`
  if (!cache.has(url)) {
    const p = fetch(url).then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`)
      return res.json() as Promise<T>
    })
    p.catch(() => cache.delete(url))
    cache.set(url, p)
  }
  return cache.get(url) as Promise<T>
}

export class NotFoundError extends Error {}

async function findOne<T>(items: Promise<T[]>, match: (item: T) => boolean): Promise<T> {
  const found = (await items).find(match)
  if (!found) throw new NotFoundError('Not found')
  return found
}

export const api = {
  site: () => resource<SiteInfo>('site'),
  team: () => resource<Member[]>('team'),
  research: () => resource<ResearchArea[]>('research'),
  publications: () => resource<Publication[]>('publications'),
  products: () => resource<Product[]>('products'),
  news: () => resource<NewsPost[]>('news'),
  newsPost: (slug: string) => findOne(resource<NewsPost[]>('news'), (n) => n.slug === slug),
  page: (slug: string) => findOne(resource<Page[]>('pages'), (p) => p.slug === slug),
}
