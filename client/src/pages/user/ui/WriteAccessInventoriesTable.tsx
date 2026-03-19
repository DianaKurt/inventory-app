import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Stack, Typography, Box, alpha } from '@mui/material'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'

import { apiGet } from '@/shared/api/http'
import DataTable from '@/shared/ui/DataTable/DataTable'
import type { DataTableColDef, DataTableSelection } from '@/shared/ui/DataTable/types'
import Panel from '@/shared/ui/Panel/Panel'

type Inventory = {
  id: string
  title: string
  ownerName: string
  category: string | null
  updatedAt: string
}

type Row = {
  id: string
  title: string
  ownerName: string
  category: string
  updatedAt: string
}

export default function WriteAccessInventoriesTable() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const [selection, setSelection] = useState<DataTableSelection>([])

  const { data, isLoading, isError } = useQuery({
    queryKey: ['me', 'inventories', 'write-access'],
    queryFn: () => apiGet<Inventory[]>('/me/inventories/write-access'),
  })

  const rows: Row[] = useMemo(
    () =>
      (data ?? []).map((x) => ({
        id: x.id,
        title: x.title,
        ownerName: x.ownerName,
        category: x.category ?? '—',
        updatedAt: dayjs(x.updatedAt).format('DD.MM.YYYY'),
      })),
    [data],
  )

  const columns: Array<DataTableColDef<Row>> = useMemo(
    () => [
      { field: 'title', headerName: t('table.title'), flex: 1, minWidth: 220 },
      { field: 'ownerName', headerName: t('table.owner'), width: 180 },
      { field: 'category', headerName: t('table.category'), width: 160 },
      { field: 'updatedAt', headerName: t('table.updated'), width: 140 },
    ],
    [t],
  )

  const toolbar = (
    <Box
      sx={(theme) => ({
        p: { xs: 1.25, md: 1.5 },
        mb: 1.5,
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
        background: alpha(theme.palette.background.default, 0.55),
      })}
    >
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={1.5}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', lg: 'center' }}
      >
        <Stack spacing={0.2} sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              fontSize: { xs: '1rem', sm: '1.05rem' },
              wordBreak: 'break-word',
            }}
          >
            {t('workspace.writeAccessInventories')}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t('workspace.writeAccessSubtitle')}
          </Typography>
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          useFlexGap
          flexWrap="wrap"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ width: { xs: '100%', lg: 'auto' } }}
        >
          <Button
            variant="text"
            disabled={selection.length === 0}
            onClick={() => setSelection([])}
            startIcon={<ClearAllRoundedIcon />}
            sx={{
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 700,
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'flex-start', sm: 'center' },
            }}
          >
            {t('actions.clear')} ({selection.length})
          </Button>

          <Button
            variant="contained"
            disabled={selection.length !== 1}
            onClick={() =>
              selection[0] &&
              navigate(`/inventories/${selection[0]}?tab=items`)
            }
            startIcon={<OpenInNewRoundedIcon />}
            sx={(theme) => ({
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 800,
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'flex-start', sm: 'center' },
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
            })}
          >
            {t('actions.open')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )

  return (
    <Panel>
      <Box sx={{ overflowX: 'auto' }}>
        <DataTable<Row>
          rows={rows}
          columns={columns}
          loading={isLoading}
          error={isError ? t('errors.inventoriesLoadFailed') : undefined}
          selectionModel={selection}
          onSelectionModelChange={(m) => setSelection(m)}
          onRowClick={(row) =>
            navigate(`/inventories/${row.id}?tab=items`)
          }
          toolbar={toolbar}
          emptyTitle={t('workspace.noWriteAccessInventories')}
        />
      </Box>
    </Panel>
  )
}