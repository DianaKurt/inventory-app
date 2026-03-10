import { useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Tab, Tabs, Box, Paper, alpha } from '@mui/material'
import { useTranslation } from 'react-i18next'

const TAB_KEYS = [
  'items',
  'fields',
  'discussion',
  'access',
  'custom-id',
  'settings',
  'stats',
] as const

type TabKey = (typeof TAB_KEYS)[number]

export default function InventoryTabs({ disabled }: { disabled?: boolean }) {
  const navigate = useNavigate()
  const { inventoryId } = useParams()
  const [sp] = useSearchParams()
  const { t } = useTranslation('inventory')

  const current = (sp.get('tab') ?? 'items') as TabKey

  const value = useMemo<TabKey>(
    () => (TAB_KEYS.includes(current) ? current : 'items'),
    [current],
  )

  const canNavigate = Boolean(inventoryId) && !disabled

  const setTab = (next: TabKey) => {
    if (!inventoryId) return

    const nextParams = new URLSearchParams(sp)
    nextParams.set('tab', next)

    navigate({
      pathname: `/inventories/${inventoryId}`,
      search: `?${nextParams.toString()}`,
    })
  }

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: 1,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
        backdropFilter: 'blur(6px)',
        mb: 1,
      })}
    >
      <Box sx={{ overflowX: 'auto' }}>
        <Tabs
          value={value}
          onChange={(_, next: TabKey) => setTab(next)}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="Inventory tabs"
          sx={(theme) => ({
            minHeight: 40,

            '& .MuiTabs-indicator': {
              display: 'none',
            },

            '& .MuiTab-root': {
              minHeight: 34,
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 999,
              px: 2,
              mr: 1,
              color: theme.palette.text.secondary,
              transition: 'all 120ms ease',
            },

            '& .MuiTab-root:hover': {
              backgroundColor: alpha(theme.palette.action.hover, 0.6),
            },

            '& .MuiTab-root.Mui-selected': {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.action.selected,
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
            },
          })}
        >
          <Tab disabled={!canNavigate} value="items" label={t('tabs.items', 'Items')} />
          <Tab disabled={!canNavigate} value="fields" label={t('tabs.fields', 'Fields')} />
          <Tab disabled={!canNavigate} value="discussion" label={t('tabs.discussion', 'Discussion')} />
          <Tab disabled={!canNavigate} value="access" label={t('tabs.access', 'Access')} />
          <Tab disabled={!canNavigate} value="custom-id" label={t('tabs.customId', 'Custom ID')} />
          <Tab disabled={!canNavigate} value="settings" label={t('tabs.settings', 'Settings')} />
          <Tab disabled={!canNavigate} value="stats" label={t('tabs.stats', 'Stats')} />
        </Tabs>
      </Box>
    </Paper>
  )
}