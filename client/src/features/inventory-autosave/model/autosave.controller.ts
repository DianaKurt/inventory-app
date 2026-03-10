import type { AutosaveController, AutosaveStatus } from './autosave.types'

export function createAutosaveController(delayMs = 600): AutosaveController {
  let status: AutosaveStatus = 'idle'
  let timer: ReturnType<typeof setTimeout> | null = null
  let disposed = false

  const controller: AutosaveController = {
    get status() {
      return status
    },

    saveSoon(fn) {
      if (disposed) return
      if (timer) clearTimeout(timer)

      status = 'saving'
      timer = setTimeout(async () => {
        try {
          await fn()
          status = 'saved'
        } catch {
          status = 'error'
        }
      }, delayMs)
    },

    dispose() {
      disposed = true
      if (timer) clearTimeout(timer)
      timer = null
      status = 'idle'
    },
  }

  return controller
}
