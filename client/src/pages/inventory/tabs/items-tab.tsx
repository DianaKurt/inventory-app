import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Skeleton,
  Alert,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  IconButton,
  Checkbox,
  alpha,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import { useTranslation } from 'react-i18next'

import { apiGet, apiPost } from '@/shared/api/http'

type Item = {
  id: string
  customId: string
  version: number
  createdAt: string
}

export default function ItemsTab() {
  const { inventoryId } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { t } = useTranslation('common')

  const [openCreate, setOpenCreate] = useState(false)
  const [customId, setCustomId] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const selectedIds = useMemo(() => Array.from(selected), [selected])
  const selectedCount = selected.size

  const [confirmDelete, setConfirmDelete] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['items', inventoryId],
    enabled: Boolean(inventoryId),
    queryFn: () => apiGet<Item[]>(`/items?inventoryId=${inventoryId}`),
  })

  const items = useMemo(() => {
    return (data ?? [])
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [data])

  const allSelected = items.length > 0 && selectedCount === items.length
  const someSelected = selectedCount > 0 && selectedCount < items.length

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev)
      const isAll = items.length > 0 && next.size === items.length
      if (isAll) return new Set()
      return new Set(items.map((x) => x.id))
    })
  }

  const clearSelection = () => setSelected(new Set())

  const createItem = useMutation({
    mutationFn: async () => {
      if (!inventoryId) throw new Error('inventoryId is required')

      return apiPost('/items', {
        inventoryId,
        customId: customId.trim(),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['items', inventoryId] })
      setToast(t('itemsTab.itemCreated'))
      setOpenCreate(false)
      setCustomId('')
    },
    onError: (e: any) => {
      setToast(e.message ?? t('itemsTab.failedToCreate'))
    },
  })

  const deleteItems = useMutation({
    mutationFn: async (ids: string[]) => {
      await apiPost('/items/bulk-delete', { ids })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['items', inventoryId] })
      setToast(t('itemsTab.deleted'))
      setConfirmDelete(false)
      clearSelection()
    },
    onError: (e: any) => {
      setToast(e.message ?? t('itemsTab.failedToDelete'))
    },
  })

  const openSelected = () => {
    if (!inventoryId) return
    if (selectedIds.length >= 1) {
      navigate(`/inventories/${inventoryId}/items/${selectedIds[0]}`)
    }
  }

  if (isLoading) {
    return (
      <Box p={{ xs: 2, md: 3 }}>
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={40} width={180} />
          <Skeleton variant="rounded" height={72} />
          <Skeleton variant="rounded" height={220} />
        </Stack>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box p={{ xs: 2, md: 3 }}>
        <Alert severity="error">{t('itemsTab.failedToLoad')}</Alert>
      </Box>
    )
  }

  return (
    <Fade in timeout={200}>
      <Box p={{ xs: 2, md: 3 }}>
        <Stack spacing={2.5}>
          {/* Header */}
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', lg: 'center' }}
            spacing={2}
          >
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={(theme) => ({
                    width: 30,
                    height: 30,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    flexShrink: 0,
                  })}
                >
                  <Inventory2RoundedIcon fontSize="small" />
                </Box>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    lineHeight: 1.2,
                    wordBreak: 'break-word',
                  }}
                >
                  {t('itemsTab.title')}
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 560 }}
              >
                {t('itemsTab.subtitle')}
              </Typography>
            </Stack>

            {/* Actions */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              useFlexGap
              flexWrap="wrap"
              justifyContent={{ xs: 'stretch', sm: 'flex-start', lg: 'flex-end' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ width: { xs: '100%', lg: 'auto' } }}
            >
              <Button
                variant="text"
                disabled={selectedCount === 0}
                onClick={clearSelection}
                startIcon={<ClearAllRoundedIcon />}
                fullWidth={false}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2.5,
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: { xs: 'flex-start', sm: 'center' },
                }}
              >
                {t('actions.clear')} ({selectedCount})
              </Button>

              <Button
                variant="outlined"
                startIcon={<OpenInNewRoundedIcon />}
                disabled={selectedCount === 0}
                onClick={openSelected}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2.5,
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: { xs: 'flex-start', sm: 'center' },
                }}
              >
                {t('actions.open')}
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteRoundedIcon />}
                disabled={selectedCount === 0}
                onClick={() => setConfirmDelete(true)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2.5,
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: { xs: 'flex-start', sm: 'center' },
                }}
              >
                {t('actions.delete')}
              </Button>

              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={() => setOpenCreate(true)}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2.5,
                  boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: { xs: 'flex-start', sm: 'center' },
                }}
              >
                {t('itemsTab.createItem')}
              </Button>
            </Stack>
          </Stack>

          {/* Table / empty */}
          {items.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 6 },
                textAlign: 'center',
                borderRadius: 3,
                border: '1px dashed',
                borderColor: 'divider',
              }}
            >
              <Typography fontWeight={600}>
                {t('itemsTab.emptyTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('itemsTab.emptySubtitle')}
              </Typography>
            </Paper>
          ) : (
            <Paper
              elevation={0}
              sx={(theme) => ({
                borderRadius: 2,
                overflowX: 'auto',
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.95),
              })}
            >
              <Table sx={{ minWidth: 560 }}>
                <TableHead>
                  <TableRow
                    sx={(theme) => ({
                      backgroundColor: alpha(theme.palette.action.hover, 0.4),
                    })}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={allSelected}
                        indeterminate={someSelected}
                        onChange={toggleAll}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t('itemsTab.customId')}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t('itemsTab.version')}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>
                      {t('itemsTab.created')}
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items.map((item) => {
                    const checked = selected.has(item.id)

                    return (
                      <TableRow
                        key={item.id}
                        hover
                        sx={{
                          cursor: 'pointer',
                          transition: 'background-color .15s ease',
                        }}
                        onClick={() =>
                          inventoryId &&
                          navigate(`/inventories/${inventoryId}/items/${item.id}`)
                        }
                      >
                        <TableCell
                          padding="checkbox"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={checked}
                            onChange={() => toggleOne(item.id)}
                          />
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={item.customId}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={`v${item.version}`}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>

                        <TableCell>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Paper>
          )}
        </Stack>

        {/* Create dialog */}
        <Dialog
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>{t('itemsTab.createDialogTitle')}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              label={t('itemsTab.customId')}
              value={customId}
              onChange={(e) => setCustomId(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              px: 3,
              pb: 2,
              gap: 1,
            }}
          >
            <Button
              onClick={() => setOpenCreate(false)}
              sx={{
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {t('actions.cancel')}
            </Button>
            <Button
              variant="contained"
              disabled={createItem.isPending || !customId.trim()}
              onClick={() => createItem.mutate()}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {createItem.isPending ? t('actions.creating') : t('actions.create')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete dialog */}
        <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
          <DialogTitle>{t('itemsTab.deleteTitle')}</DialogTitle>
          <DialogContent>
            <Typography>{t('itemsTab.deleteText')}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t('itemsTab.selectedCount', { count: selectedCount })}
            </Typography>
          </DialogContent>
          <DialogActions
            sx={{
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'stretch', sm: 'center' },
              px: 3,
              pb: 2,
              gap: 1,
            }}
          >
            <Button
              onClick={() => setConfirmDelete(false)}
              sx={{
                textTransform: 'none',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {t('actions.cancel')}
            </Button>
            <Button
              color="error"
              variant="contained"
              disabled={deleteItems.isPending}
              onClick={() => deleteItems.mutate(selectedIds)}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {deleteItems.isPending ? t('actions.deleting') : t('actions.delete')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Toast */}
        <Snackbar
          open={Boolean(toast)}
          autoHideDuration={3000}
          onClose={() => setToast(null)}
          message={toast}
          action={
            <IconButton size="small" color="inherit" onClick={() => setToast(null)}>
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          }
        />
      </Box>
    </Fade>
  )
}