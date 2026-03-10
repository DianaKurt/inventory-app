export type AutosaveStatus = 'idle' | 'saving' | 'saved' | 'error'

export type AutosaveController = {
  status: AutosaveStatus
  saveSoon: (fn: () => Promise<void>) => void
  dispose: () => void
}
