type ToastFn = (message: string) => void

export const toast: {
  success: ToastFn
  error: ToastFn
  info: ToastFn
} = {
  success: (m) => console.log('[toast:success]', m),
  error: (m) => console.error('[toast:error]', m),
  info: (m) => console.log('[toast:info]', m),
}
