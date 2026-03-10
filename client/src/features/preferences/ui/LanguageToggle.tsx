import { IconButton } from '@mui/material'
import LanguageIcon from '@mui/icons-material/Language'
import i18n from 'i18next'
import { usePreferencesStore } from '../model/preferences.store'

export default function LanguageToggle() {
  const language = usePreferencesStore((s) => s.language)
  const setLanguage = usePreferencesStore((s) => s.setLanguage)

  const toggle = () => {
    const newLang = language === 'en' ? 'ru' : 'en'
    setLanguage(newLang)
    i18n.changeLanguage(newLang)
  }

  return (
    <IconButton color="inherit" onClick={toggle}>
      <LanguageIcon />
    </IconButton>
  )
}
