import { useEffect } from 'react'
import i18n from 'i18next'
import { usePreferencesStore } from '@/features/preferences/model/preferences.store'

export function I18nSync() {
  const language = usePreferencesStore((s) => s.language)

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language)
    }
  }, [language])

  return null
}