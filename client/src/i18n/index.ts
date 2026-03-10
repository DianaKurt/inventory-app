// src/i18n/index.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import enCommon from './locales/en/common.json'
import enInventory from './locales/en/inventory.json'
import enPages from './locales/en/pages.json'

import ruCommon from './locales/ru/common.json'
import ruInventory from './locales/ru/inventory.json'
import ruPages from './locales/ru/pages.json'

const saved = localStorage.getItem('preferences')
let initialLng = 'en'

try {
  if (saved) {
    const parsed = JSON.parse(saved)
    if (parsed?.state?.language) initialLng = parsed.state.language
  }
} catch {}

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, inventory: enInventory, pages: enPages },
    ru: { common: ruCommon, inventory: ruInventory, pages: ruPages },
  },
  lng: initialLng,
  fallbackLng: 'en',
  ns: ['common', 'inventory', 'pages'],
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

export default i18n