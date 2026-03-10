import { IconButton } from '@mui/material'
import { DarkMode, LightMode } from '@mui/icons-material'
import { usePreferencesStore } from '../model/preferences.store'

export default function ThemeToggle() {
  const { theme, setTheme } = usePreferencesStore()

  return (
    <IconButton
      color="inherit"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? <DarkMode /> : <LightMode />}
    </IconButton>
  )
}
