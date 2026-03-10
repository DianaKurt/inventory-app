import type { DiscussionEventMap } from '../model/discussion.types'

type Handler<K extends keyof DiscussionEventMap> = (payload: DiscussionEventMap[K]) => void

export type RealtimeClient = {
  connect(): void
  disconnect(): void
  on<K extends keyof DiscussionEventMap>(event: K, handler: Handler<K>): () => void
  emit(event: string, payload?: unknown): void
}

export function createMockRealtimeClient(): RealtimeClient {
  const listeners = new Map<string, Set<(p: any) => void>>()

  return {
    connect() {},
    disconnect() { listeners.clear() },

    on(event, handler) {
      const key = String(event)
      const set = listeners.get(key) ?? new Set()
      set.add(handler as any)
      listeners.set(key, set)
      return () => set.delete(handler as any)
    },

    emit(event, payload) {
      const set = listeners.get(event)
      if (!set) return
      for (const fn of set) fn(payload)
    },
  }
}
