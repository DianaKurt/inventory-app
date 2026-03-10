import { useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { usePreferencesStore } from '@/features/preferences/model/preferences.store'

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = usePreferencesStore((s) => s.theme)

  const theme = useMemo(
    () =>
      createTheme({
        palette: { mode: themeMode },
        shape: { borderRadius: 12 },
      }),
    [themeMode],
  )

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}