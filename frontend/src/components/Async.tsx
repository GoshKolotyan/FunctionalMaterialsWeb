import type { ReactNode } from 'react'
import { NotFoundError } from '../api/client'
import type { DataState } from '../api/useData'
import { NotFound } from '../pages/NotFound'

/** Render loading / error states, or `children(data)` once loaded. */
export function Async<T>({
  state,
  children,
}: {
  state: DataState<T>
  children: (data: T) => ReactNode
}) {
  if (state.status === 'loading') return <p className="container section muted">Loading…</p>
  if (state.status === 'error') {
    if (state.error instanceof NotFoundError) return <NotFound />
    return <p className="container section error">Could not load content: {state.error.message}</p>
  }
  return <>{children(state.data)}</>
}
