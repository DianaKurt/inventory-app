import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark'
export type Language = 'en' | 'ru'

interface PreferencesState {
  theme: ThemeMode
  language: Language
  setTheme: (theme: ThemeMode) => void
  setLanguage: (lang: Language) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: 'light',
      language: 'en',
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'preferences', // localStorage
      version: 1,
    },
  ),
)