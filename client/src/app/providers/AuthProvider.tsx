import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { PublicUser } from '@/entities/user/api/auth.api'
import { apiLogin, apiLogout, apiMe } from '@/entities/user/api/auth.api'

type AuthState =
  | { status: 'loading'; user: null }
  | { status: 'guest'; user: null }
  | { status: 'authed'; user: PublicUser }

type AuthContextValue = {
  state: AuthState
  user: PublicUser | null
  isAuthed: boolean
  login: (params: { email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
  refreshMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', user: null })

  async function refreshMe() {
    try {
      const user = await apiMe()
      setState({ status: 'authed', user })
    } catch {
      setState({ status: 'guest', user: null })
    }
  }

  async function login(params: { email: string; password: string }) {
    const user = await apiLogin(params)
    setState({ status: 'authed', user })
  }

  async function logout() {
    try {
      await apiLogout()
    } finally {
      setState({ status: 'guest', user: null })
    }
  }

  useEffect(() => {
    refreshMe()
  }, [])

  const value = useMemo<AuthContextValue>(() => {
    return {
      state,
      user: state.status === 'authed' ? state.user : null,
      isAuthed: state.status === 'authed',
      login,
      logout,
      refreshMe,
    }
  }, [state])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}