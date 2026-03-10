import { useMutation } from '@tanstack/react-query'
import type { RegisterDto } from './auth.types'
import { useAuth } from '@/app/providers/AuthProvider'
import { apiRegister } from '@/entities/user/api/auth.api'

export function useRegister() {
  const { refreshMe } = useAuth()

  return useMutation({
    mutationFn: (dto: RegisterDto) => apiRegister(dto),
    onSuccess: async () => {
      await refreshMe()
    },
  })
}