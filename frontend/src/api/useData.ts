import { useEffect, useState } from 'react'

export type DataState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'ready'; data: T }

/** Run an async loader and track its state. `key` re-triggers loading when it changes. */
export function useData<T>(loader: () => Promise<T>, key: string = ''): DataState<T> {
  const [state, setState] = useState<DataState<T>>({ status: 'loading' })

  useEffect(() => {
    let active = true
    setState({ status: 'loading' })
    loader().then(
      (data) => active && setState({ status: 'ready', data }),
      (error: Error) => active && setState({ status: 'error', error }),
    )
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}
