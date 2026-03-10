import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { state } = useAuth()

  if (state.status === 'loading') return <div>Loading...</div>
  if (state.status !== 'authed') return <Navigate to="/auth/sign-in" replace />

  return <>{children}</>
}
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { state } = useAuth()

  if (state.status === 'loading') return <div>Loading...</div>
  if (state.status !== 'authed') return <Navigate to="/auth/sign-in" replace />
  if (state.user.role !== 'ADMIN') return <Navigate to="/" replace />

  return <>{children}</>
}