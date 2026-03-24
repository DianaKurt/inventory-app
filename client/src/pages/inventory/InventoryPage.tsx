import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams, useLocation } from 'react-router-dom'
import {
  Container,
  Stack,
  Paper,
  Box,
  alpha,
  Typography,
  Skeleton,
  IconButton,
} from '@mui/material'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import { useState } from 'react'

import { apiGet } from '@/shared/api/http'
import InventoryHeader from './ui/InventoryHeader'
import InventoryTabs from './ui/InventoryTabs'
import { useTranslation } from 'react-i18next'

import ItemsTab from './tabs/items-tab'
import FieldsTab from './tabs/fields-tab'
import DiscussionTab from './tabs/discussion-tab'
import AccessTab from './tabs/access-tab'
import CustomIdTab from './tabs/custom-id-tab'
import SettingsTab from './tabs/settings-tab'
import StatsTab from './tabs/stats-tab'

import SupportTicketDialog from '@/features/support-ticket/ui/SupportTicketDialog'
import { useAuth } from '@/app/providers/AuthProvider'

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

type Inventory = {
  id: string
  title: string
  category: string | null
  itemsCount: number
  ownerName: string
  updatedAt: string
}

function resolveTab(raw: string | null): TabKey {
  const t = (raw ?? 'items') as TabKey
  return (TAB_KEYS as readonly string[]).includes(t) ? t : 'items'
}

export default function InventoryPage() {
  const { t } = useTranslation('common')
  const { inventoryId } = useParams()
  const [sp] = useSearchParams()
  const location = useLocation()
  const { user } = useAuth()

  const [supportOpen, setSupportOpen] = useState(false)

  const tab = resolveTab(sp.get('tab'))

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventory', inventoryId],
    enabled: Boolean(inventoryId),
    queryFn: () => apiGet<Inventory>(`/inventories/${inventoryId}`),
  })

  const disabled = !inventoryId || isLoading || isError

  const content = (() => {
    if (isLoading) {
      return (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={44} />
          <Skeleton variant="rounded" height={120} />
          <Skeleton variant="rounded" height={260} />
        </Stack>
      )
    }

    if (isError || !inventoryId) {
      return (
        <Typography variant="body2" color="error">
          {t('errors.failedToLoadInventory')}
        </Typography>
      )
    }

    switch (tab) {
      case 'items':
        return <ItemsTab />
      case 'fields':
        return <FieldsTab />
      case 'discussion':
        return <DiscussionTab />
      case 'access':
        return <AccessTab />
      case 'custom-id':
        return <CustomIdTab />
      case 'settings':
        return <SettingsTab />
      case 'stats':
        return <StatsTab />
      default:
        return <ItemsTab />
    }
  })()

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          py: { xs: 2, md: 5 },
          backgroundColor: 'background.paper',
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={{ xs: 2, md: 2.5 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={1}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <InventoryHeader
                  inventory={data ? { ...data, category: data.category ?? '—' } : null}
                  loading={isLoading}
                  error={isError ? t('errors.failedToLoadInventory') : undefined}
                />
              </Box>

              <IconButton onClick={() => setSupportOpen(true)} aria-label="Open support ticket">
                <HelpOutlineRoundedIcon />
              </IconButton>
            </Stack>

            <Paper
              elevation={0}
              sx={(theme) => ({
                borderRadius: 4,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                overflow: 'hidden',
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              })}
            >
              <Box
                sx={(theme) => ({
                  px: { xs: 1.5, md: 2 },
                  pt: { xs: 1.5, md: 2 },
                  pb: 1,
                  borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                  backgroundColor: theme.palette.background.paper,
                })}
              >
                <InventoryTabs disabled={disabled} />
              </Box>

              <Box
                sx={{
                  p: { xs: 1.5, md: 2.5 },
                }}
              >
                {content}
              </Box>
            </Paper>
          </Stack>
        </Container>
      </Box>

      <SupportTicketDialog
        open={supportOpen}
        onClose={() => setSupportOpen(false)}
        reportedBy={{
          id: user?.id ?? 'guest',
          name: user?.name ?? user?.email ?? 'Guest',
          email: user?.email ?? 'guest@example.com',
        }}
        inventory={
          data
            ? {
                id: data.id,
                title: data.title,
              }
            : null
        }
        link={window.location.origin + location.pathname + location.search}
      />
    </>
  )
}