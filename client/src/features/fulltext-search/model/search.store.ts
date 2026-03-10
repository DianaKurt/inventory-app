import type { SearchState } from './search.types'

let query = ''
const subs = new Set<(q: string) => void>()

export const searchStore: SearchState = {
  get query() {
    return query
  },
  setQuery(q: string) {
    query = q
    subs.forEach((fn) => fn(query))
  },
}

export function subscribeSearch(fn: (q: string) => void) {
  subs.add(fn)
  return () => subs.delete(fn)
}
