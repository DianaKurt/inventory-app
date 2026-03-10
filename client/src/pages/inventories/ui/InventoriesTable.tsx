import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Stack, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Box, alpha } from '@mui/material'
import { useTranslation } from 'react-i18next'

import DataTable from '@/shared/ui/DataTable/DataTable'
import type { DataTableColDef, DataTableSelection } from '@/shared/ui/DataTable/types'
import { apiGet, apiPost } from '@/shared/api/http'
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'

type Inventory = {
  id: string
  title: string
  category: string | null
  itemsCount: number
  ownerName: string
  updatedAt: string
}

type InventoryRow = {
  id: string
  title: string
  category: string
  itemsCount: number
  ownerName: string
  updatedAt: string
}

export default function InventoriesTable() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [selection, setSelection] = useState<DataTableSelection>([])
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventories'],
    queryFn: () => apiGet<Inventory[]>('/inventories'),
  })

  const rows: InventoryRow[] = useMemo(() => {
    return (data ?? []).map((x) => ({
      id: x.id,
      title: x.title,
      category: x.category ?? '—',
      itemsCount: x.itemsCount,
      ownerName: x.ownerName,
      updatedAt: x.updatedAt,
    }))
  }, [data])

  const columns: Array<DataTableColDef<InventoryRow>> = useMemo(
    () => [
      { field: 'title', headerName: t('table.title'), flex: 1, minWidth: 220 },
      { field: 'category', headerName: t('table.category'), width: 160 },
      { field: 'itemsCount', headerName: t('table.items'), width: 110 },
      { field: 'ownerName', headerName: t('table.owner'), width: 180 },
      { field: 'updatedAt', headerName: t('table.updated'), width: 180 },
    ],
    [t],
  )

  const bulkDelete = useMutation({
    mutationFn: (ids: string[]) => apiPost('/inventories/bulk-delete', { ids }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventories'] })
      setSelection([])
      setConfirmDelete(false)
    },
  })

  const toolbar = (
  <Box
    sx={(theme) => ({
      p: 1.5,
      mb: 1.5,
      borderRadius: 3,
      border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
      background: alpha(theme.palette.background.default, 0.55),
    })}
  >
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', sm: 'center' }}
    >
      <Stack spacing={0.2}>
        <Typography fontWeight={800}>{t('inventories.toolbarTitle')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('inventories.toolbarSubtitle')}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="flex-end">
        <Button
          variant="text"
          disabled={selection.length === 0}
          onClick={() => setSelection([])}
          startIcon={<ClearAllRoundedIcon />}
          sx={{
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 700,
            px: 1.5,
          }}
        >
          {t('actions.clear')} ({selection.length})
        </Button>

        <Button
          variant="outlined"
          disabled={selection.length !== 1}
          onClick={() => selection[0] && navigate(`/inventories/${selection[0]}?tab=items`)}
          startIcon={<OpenInNewRoundedIcon />}
          sx={(theme) => ({
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 700,
            px: 2,
            borderColor: alpha(theme.palette.info.main, 0.35),
            color: theme.palette.info.dark,
            backgroundColor: alpha(theme.palette.info.main, 0.06),
            '&:hover': {
              borderColor: alpha(theme.palette.info.main, 0.55),
              backgroundColor: alpha(theme.palette.info.main, 0.12),
              transform: 'translateY(-1px)',
            },
          })}
        >
          {t('actions.open')}
        </Button>

        <Button
          color="error"
          variant="outlined"
          disabled={selection.length === 0 || bulkDelete.isPending}
          onClick={() => setConfirmDelete(true)}
          startIcon={<DeleteOutlineRoundedIcon />}
          sx={(theme) => ({
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 800,
            px: 2,
            borderWidth: 1.5,
            backgroundColor: alpha(theme.palette.error.main, 0.05),
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.1),
              transform: 'translateY(-1px)',
            },
          })}
        >
          {bulkDelete.isPending ? t('actions.deleting') : t('actions.delete')}
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate('/inventories/new')}
          startIcon={<AddRoundedIcon />}
          sx={(theme) => ({
            borderRadius: 999,
            textTransform: 'none',
            fontWeight: 800,
            px: 2.4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: '0 14px 30px rgba(0,0,0,0.16)',
            },
          })}
        >
          {t('actions.create')}
        </Button>
      </Stack>
    </Stack>

    <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
      <DialogTitle>{t('inventories.confirmDeleteTitle')}</DialogTitle>
      <DialogContent>
        <Typography>{t('inventories.confirmDeleteText')}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {t('inventories.selectedCount', { count: selection.length })}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setConfirmDelete(false)}>
          {t('actions.cancel')}
        </Button>
        <Button
          color="error"
          variant="contained"
          disabled={bulkDelete.isPending}
          onClick={() => bulkDelete.mutate(selection as string[])}
        >
          {bulkDelete.isPending ? t('actions.deleting') : t('actions.delete')}
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
)

  return (
    <DataTable<InventoryRow>
      rows={rows}
      columns={columns}
      loading={isLoading}
      error={isError ? t('errors.inventoriesLoadFailed') : undefined}
      selectionModel={selection}
      onSelectionModelChange={(m) => setSelection(m)}
      onRowClick={(row) => navigate(`/inventories/${row.id}?tab=items`)}
      toolbar={toolbar}
      emptyTitle={t('states.noInventoriesTitle')}
      emptyDescription={t('states.noInventoriesDescription')}
    />
  )
}