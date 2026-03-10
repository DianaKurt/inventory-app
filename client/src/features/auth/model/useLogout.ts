import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiLogout } from '@/entities/user/api/auth.api'

export function useLogout() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => apiLogout(),
    onSuccess: () => {
      qc.removeQueries({ queryKey: ['me'] })
    },
  })
}