import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Typography, Stack, Box, alpha } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { apiGet } from '@/shared/api/http'
import DataTable from '@/shared/ui/DataTable/DataTable'
import type { DataTableColDef } from '@/shared/ui/DataTable/types'

type Inventory = {
  id: string
  title: string
  category: string | null
  itemsCount: number
  ownerName: string
  updatedAt: string
}

export default function LatestInventoriesTable() {
  const { t } = useTranslation('common')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventories', 'latest'],
    queryFn: () => apiGet<Inventory[]>('/inventories'),
  })

  const rows = useMemo(() => {
    const list = [...(data ?? [])]
    list.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    return list.slice(0, 5).map((x) => ({
      ...x,
      category: x.category ?? '—',
    }))
  }, [data])

  const columns: Array<DataTableColDef<(typeof rows)[number]>> = useMemo(
    () => [
      { field: 'title', headerName: t('table.title'), flex: 1, minWidth: 200 },
      { field: 'category', headerName: t('table.category'), width: 160 },
      { field: 'itemsCount', headerName: t('table.items'), width: 110 },
      { field: 'updatedAt', headerName: t('table.updated'), width: 180 },
    ],
    [t],
  )

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h6" fontWeight={700}>
          {t('sections.latest.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('sections.latest.subtitle')}
        </Typography>
      </Box>

      <DataTable
        rows={rows}
        columns={columns}
        loading={isLoading}
        error={isError ? t('errors.inventoriesLoadFailed') : undefined}
        emptyTitle={t('states.noInventoriesTitle')}
        emptyDescription={t('states.noInventoriesDescription')}
        sx={{
          '& .MuiDataGrid-row:hover': {
            backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.04),
          },
        }}
      />
    </Stack>
  )
}