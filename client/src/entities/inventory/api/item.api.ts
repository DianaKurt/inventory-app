import { apiGet, apiPost } from '@/shared/api/http'

export type ItemLikesDto = {
  itemId: string
  count: number
  likedByMe: boolean
}

export function getItemLikes(itemId: string) {
  return apiGet<ItemLikesDto>(`/items/${encodeURIComponent(itemId)}/likes`)
}

export function toggleItemLike(itemId: string) {
  return apiPost<ItemLikesDto>(`/items/${encodeURIComponent(itemId)}/likes/toggle`)
}