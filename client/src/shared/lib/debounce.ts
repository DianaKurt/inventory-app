export function debounce<T extends (...args: any[]) => void>(fn: T, delayMs: number) {
  let timer: number | undefined

  return (...args: Parameters<T>) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(() => fn(...args), delayMs)
  }
}
