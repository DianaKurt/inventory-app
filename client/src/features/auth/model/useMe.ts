import { useQuery } from '@tanstack/react-query'
import { apiMe } from '@/entities/user/api/auth.api'

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => apiMe(),
    retry: false,
  })
}