import { useQuery } from '@tanstack/react-query'
import {
  Grid,
  Paper,
  Typography,
  Stack,
  Box,
  alpha,
  Skeleton,
} from '@mui/material'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded'
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded'
import { useTranslation } from 'react-i18next'

import { apiGet } from '@/shared/api/http'

type Stats = {
  usersCount: number
  adminsCount: number
  inventoriesCount: number
  itemsCount: number
  tagsCount: number
}

export default function AdminStatsSection() {
  const { t } = useTranslation('common')

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => apiGet<Stats>('/admin/stats'),
  })

  const cards = [
    {
      label: t('admin.stats.users'),
      value: data?.usersCount,
      icon: <PeopleAltRoundedIcon fontSize="small" />,
    },
    {
      label: t('admin.stats.admins'),
      value: data?.adminsCount,
      icon: <AdminPanelSettingsRoundedIcon fontSize="small" />,
    },
    {
      label: t('admin.stats.inventories'),
      value: data?.inventoriesCount,
      icon: <Inventory2RoundedIcon fontSize="small" />,
    },
    {
      label: t('admin.stats.items'),
      value: data?.itemsCount,
      icon: <CategoryRoundedIcon fontSize="small" />,
    },
    {
      label: t('admin.stats.tags'),
      value: data?.tagsCount,
      icon: <LocalOfferRoundedIcon fontSize="small" />,
    },
  ]

  return (
    <Grid container spacing={2}>
      {cards.map((c) => (
        <Grid item xs={6} sm={4} md={2.4} key={c.label}>
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: 2.5,
              borderRadius: 3,
              height: 110,
              display: 'flex',
              alignItems: 'center',
              border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
              background: alpha(theme.palette.background.paper, 0.9),
              transition: 'all .2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.06)',
              },
            })}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={(theme) => ({
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                })}
              >
                {c.icon}
              </Box>

              <Stack spacing={0.3}>
                <Typography variant="caption" color="text.secondary">
                  {c.label}
                </Typography>

                {isLoading ? (
                  <Skeleton width={40} height={28} />
                ) : (
                  <Typography variant="h6" fontWeight={700}>
                    {c.value ?? 0}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  )
}