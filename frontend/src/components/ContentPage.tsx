import type { ReactNode } from 'react'
import { api } from '../api/client'
import { useData } from '../api/useData'
import { Async } from './Async'
import { Markdown } from './Markdown'
import { PageHeader } from './PageHeader'

/** A page whose title, lead and Markdown body come from the `pages` collection. */
export function ContentPage({ slug, eyebrow, children }: { slug: string; eyebrow?: string; children?: ReactNode }) {
  const state = useData(() => api.page(slug), slug)
  return (
    <Async state={state}>
      {(page) => (
        <>
          <PageHeader eyebrow={eyebrow} title={page.title} lead={page.lead} />
          {children}
          {page.body && (
            <div className="container section">
              <div className="card card-prose fade-up">
                <Markdown>{page.body}</Markdown>
              </div>
            </div>
          )}
        </>
      )}
    </Async>
  )
}
