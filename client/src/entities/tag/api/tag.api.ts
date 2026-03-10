import { apiGet } from '@/shared/api/http'
import type { Tag, TagList } from '../model/tag.types'

export async function fetchTags(query?: string): Promise<TagList> {
  const qs = query ? `?query=${encodeURIComponent(query)}` : ''
  return apiGet<TagList>(`/tags${qs}`)
}

export async function fetchAllTags(): Promise<TagList> {
  return apiGet<TagList>('/tags')
}

export type TagsByNamesResponse = TagList
export async function fetchTagsByNames(names: string[]): Promise<TagsByNamesResponse> {
  const qs = `?names=${encodeURIComponent(names.join(','))}`
  return apiGet<TagList>(`/tags/by-names${qs}`)
}
