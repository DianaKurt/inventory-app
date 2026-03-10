 import {
  Stack,
  Typography,
  Paper,
  Grid,
  Skeleton,
  Box,
  Divider,
} from '@mui/material'
import Panel from '@/shared/ui/Panel/Panel'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/shared/api/http'
import { useTranslation } from 'react-i18next'

type InventoryStats = {
  id: string
  itemsCount: number
  fieldsCount: number
  updatedAt: string
}

function StatCard({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 0.15s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
        },
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography variant="h4" fontWeight={700}>
        {value}
      </Typography>
    </Paper>
  )
}

export default function StatsTab() {
  const { t } = useTranslation('common')
  const { inventoryId } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['inventory-stats', inventoryId],
    enabled: Boolean(inventoryId),
    queryFn: async () => {
      const inv = await apiGet<any>(
        `/inventories/${inventoryId}`
      )

      return {
        id: inv.id,
        itemsCount: inv.itemsCount ?? 0,
        fieldsCount: inv.fields?.length ?? 0,
        updatedAt: inv.updatedAt,
      } as InventoryStats
    },
  })

  if (isLoading) {
    return (
      <Panel>
        <Stack spacing={3}>
          <Skeleton height={30} width={200} />
          <Skeleton height={120} />
        </Stack>
      </Panel>
    )
  }

  if (!data) return null

  return (
    <Panel>
      <Stack spacing={4}>
        <Typography variant="h6" fontWeight={700}>
          {t('stats.title')}
        </Typography>

        {/* Main stats */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <StatCard
              label={t('stats.items')}
              value={data.itemsCount}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <StatCard
              label={t('stats.fields')}
              value={data.fieldsCount}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <StatCard
              label={t('stats.lastUpdated')}
              value={new Date(
                data.updatedAt
              ).toLocaleDateString()}
            />
          </Grid>
        </Grid>

        <Divider />

        {/* Activity */}
        <Stack spacing={2}>
          <Typography fontWeight={600}>
            {t('stats.activity')}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-end">
              {[4, 7, 2, 9, 5, 6, 3].map((val, i) => (
                <Box
                  key={i}
                  sx={{
                    flex: 1,
                    height: val * 8,
                    backgroundColor: 'primary.main',
                    borderRadius: 1,
                    opacity: 0.8,
                  }}
                />
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Panel>
  )
}