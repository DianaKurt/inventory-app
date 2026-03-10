import { useMutation } from '@tanstack/react-query'
import type { LoginDto } from '@/features/auth/model/auth.types'
import { useAuth } from '@/app/providers/AuthProvider'

export function useLogin() {
  const { login, refreshMe } = useAuth()

  return useMutation({
    mutationFn: (dto: LoginDto) => login(dto),
    onSuccess: async () => {
      await refreshMe() 
    },
  })
}