import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  Chip,
  Skeleton,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  MenuItem,
  Alert,
  Snackbar,
  IconButton,
  alpha,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useTranslation } from 'react-i18next'

import DataTable from '@/shared/ui/DataTable/DataTable'
import type { DataTableColDef, DataTableSelection } from '@/shared/ui/DataTable/types'

import { apiDelete, apiPatch, apiPost } from '@/shared/api/http'
import { getInventoryDetails } from '@/entities/inventory/api/inventory.api'

type ApiFieldType = 'TEXT_SINGLE' | 'TEXT_MULTI' | 'NUMBER' | 'LINK' | 'BOOLEAN'

type ApiField = {
  id: string
  title: string
  description?: string
  type: ApiFieldType
  order: number
  required: boolean
  showInTable: boolean
}

const FIELD_LIMITS: Record<ApiFieldType, number> = {
  TEXT_SINGLE: 3,
  TEXT_MULTI: 3,
  NUMBER: 3,
  LINK: 3,
  BOOLEAN: 3,
}

type Row = {
  id: string
  title: string
  type: string
  visible: string
  required: string
  order: number
}

export default function FieldsTab() {
  const { t } = useTranslation('common')
  const { inventoryId } = useParams()
  const qc = useQueryClient()

  const [toast, setToast] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const [selection, setSelection] = useState<DataTableSelection>([])
  const selectedIds = useMemo(() => selection.map(String), [selection])
  const selectedCount = selectedIds.length

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventory', inventoryId, 'details'],
    enabled: Boolean(inventoryId),
    queryFn: () => getInventoryDetails(inventoryId!),
  })

  const fields: ApiField[] = useMemo(() => {
    const arr = (data?.fields ?? []) as ApiField[]
    return arr.slice().sort((a, b) => a.order - b.order)
  }, [data])

  const counts = useMemo(() => {
    const acc: Record<ApiFieldType, number> = {
      TEXT_SINGLE: 0,
      TEXT_MULTI: 0,
      NUMBER: 0,
      LINK: 0,
      BOOLEAN: 0,
    }
    for (const f of fields) acc[f.type] += 1
    return acc
  }, [fields])

  const rows: Row[] = useMemo(
    () =>
      fields.map((f) => ({
        id: f.id,
        title: f.title,
        type: t(`fields.types.${f.type}`),
        visible: f.showInTable ? t('fields.visible') : t('fields.hidden'),
        required: f.required ? t('fields.required') : t('fields.optional'),
        order: f.order,
      })),
    [fields, t],
  )

  const columns: Array<DataTableColDef<Row>> = useMemo(
    () => [
      { field: 'title', headerName: t('fields.fieldTitle'), flex: 1, minWidth: 240 },
      { field: 'type', headerName: t('fields.type'), width: 150 },
      { field: 'visible', headerName: t('fields.visible'), width: 130 },
      { field: 'required', headerName: t('fields.required'), width: 130 },
      { field: 'order', headerName: t('fields.order'), width: 100, align: 'right' },
    ],
    [t],
  )

  const createField = useMutation({
    mutationFn: async (payload: {
      type: ApiFieldType
      title: string
      description?: string
      required: boolean
      showInTable: boolean
    }) => {
      if (!inventoryId) throw new Error('No inventoryId')
      return apiPost(`/inventories/${inventoryId}/fields`, payload)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['inventory', inventoryId, 'details'] })
      setOpen(false)
      setToast(t('fields.created'))
    },
    onError: (e: any) => setToast(e?.message ?? t('fields.failedToCreate')),
  })

  const deleteSelected = useMutation({
    mutationFn: async () => {
      if (!inventoryId) throw new Error('No inventoryId')
      if (selectedIds.length === 0) return

      await Promise.all(
        selectedIds.map((fieldId) =>
          apiDelete(`/inventories/${inventoryId}/fields/${fieldId}`),
        ),
      )
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['inventory', inventoryId, 'details'] })
      setSelection([])
      setToast(t('fields.deleted'))
    },
    onError: (e: any) => setToast(e?.message ?? t('fields.failedToDelete')),
  })

  const reorder = useMutation({
    mutationFn: async (orderedIds: string[]) => {
      if (!inventoryId) throw new Error('No inventoryId')
      await apiPatch(`/inventories/${inventoryId}/fields/reorder`, { orderedIds })
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['inventory', inventoryId, 'details'] })
      setSelection([])
      setToast(t('fields.orderUpdated'))
    },
    onError: (e: any) => setToast(e?.message ?? t('fields.failedToReorder')),
  })

  const moveOne = (dir: 'up' | 'down') => {
    if (selectedIds.length !== 1) return
    const id = selectedIds[0]
    const idx = fields.findIndex((f) => f.id === id)
    if (idx < 0) return

    const swapIdx = dir === 'up' ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= fields.length) return

    const ordered = fields.map((f) => f.id)
    ;[ordered[idx], ordered[swapIdx]] = [ordered[swapIdx], ordered[idx]]
    reorder.mutate(ordered)
  }

  const toolbar = (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'stretch', lg: 'center' }}
      spacing={2}
      sx={{ mb: 2 }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="h5"
          fontWeight={800}
          sx={{
            fontSize: { xs: '1.2rem', sm: '1.5rem' },
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}
        >
          {t('fields.title')}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {t('fields.subtitle')}
        </Typography>
      </Box>

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
          variant="outlined"
          startIcon={<ArrowUpwardRoundedIcon />}
          disabled={selectedCount !== 1 || reorder.isPending}
          onClick={() => moveOne('up')}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'flex-start', sm: 'center' },
          }}
        >
          {t('fields.up')}
        </Button>

        <Button
          variant="outlined"
          startIcon={<ArrowDownwardRoundedIcon />}
          disabled={selectedCount !== 1 || reorder.isPending}
          onClick={() => moveOne('down')}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'flex-start', sm: 'center' },
          }}
        >
          {t('fields.down')}
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteRoundedIcon />}
          disabled={selectedCount === 0 || deleteSelected.isPending}
          onClick={() => deleteSelected.mutate()}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'flex-start', sm: 'center' },
          }}
        >
          {t('actions.delete')}
          {selectedCount ? ` (${selectedCount})` : ''}
        </Button>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 3,
            textTransform: 'none',
            px: 3,
            fontWeight: 700,
            boxShadow: '0 10px 26px rgba(0,0,0,0.10)',
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'flex-start', sm: 'center' },
          }}
          disabled={!inventoryId}
        >
          {t('fields.addField')}
        </Button>
      </Stack>
    </Stack>
  )

  if (isLoading) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Skeleton height={44} width={220} />
        <Skeleton height={90} sx={{ mt: 2 }} />
        <Skeleton height={220} sx={{ mt: 2 }} />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Alert severity="error">{t('fields.failedToLoad')}</Alert>
      </Box>
    )
  }

  return (
    <Fade in timeout={250}>
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper
          elevation={0}
          sx={(theme) => ({
            mb: 2,
            p: { xs: 1.5, md: 2 },
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
          })}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.2}
            flexWrap="wrap"
            useFlexGap
          >
            {(Object.keys(FIELD_LIMITS) as ApiFieldType[]).map((fieldType) => {
              const used = counts[fieldType]
              const limit = FIELD_LIMITS[fieldType]
              const full = used >= limit

              return (
                <Chip
                  key={fieldType}
                  label={`${t(`fields.types.${fieldType}`)}: ${used}/${limit}`}
                  color={full ? 'error' : 'default'}
                  variant={full ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 600, maxWidth: '100%' }}
                />
              )
            })}
          </Stack>
        </Paper>

        <Box sx={{ overflowX: 'auto' }}>
          <DataTable<Row>
            rows={rows}
            columns={columns}
            loading={false}
            error={undefined}
            selectionModel={selection}
            onSelectionModelChange={setSelection}
            emptyTitle={t('fields.emptyTitle')}
            emptyDescription={t('fields.emptyDescription')}
            toolbar={toolbar}
          />
        </Box>

        <CreateFieldDialog
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={(payload) => createField.mutate(payload)}
          loading={createField.isPending}
          error={
            createField.isError
              ? (createField.error as any)?.message ?? t('fields.failedToCreate')
              : undefined
          }
          counts={counts}
        />

        <Snackbar
          open={Boolean(toast)}
          autoHideDuration={2500}
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

function CreateFieldDialog(props: {
  open: boolean
  onClose: () => void
  onSubmit: (payload: {
    type: ApiFieldType
    title: string
    description?: string
    required: boolean
    showInTable: boolean
  }) => void
  loading: boolean
  error?: string
  counts: Record<ApiFieldType, number>
}) {
  const { t } = useTranslation('common')

  const [type, setType] = useState<ApiFieldType>('TEXT_SINGLE')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [required, setRequired] = useState(false)
  const [showInTable, setShowInTable] = useState(true)

  const limit = FIELD_LIMITS[type]
  const used = props.counts[type]
  const isFull = used >= limit

  const canSubmit = title.trim().length > 0 && !props.loading && !isFull

  return (
    <Dialog open={props.open} onClose={props.onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 750 }}>
        {t('fields.addField')}
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.2} sx={{ mt: 1 }}>
          {props.error ? <Alert severity="error">{props.error}</Alert> : null}

          {isFull ? (
            <Alert severity="warning">
              {t('fields.limitReached')} <b>{t(`fields.types.${type}`)}</b> ({used}/{limit})
            </Alert>
          ) : null}

          <TextField
            select
            label={t('fields.type')}
            value={type}
            onChange={(e) => setType(e.target.value as ApiFieldType)}
            fullWidth
          >
            {(Object.keys(FIELD_LIMITS) as ApiFieldType[]).map((fieldType) => (
              <MenuItem key={fieldType} value={fieldType}>
                {t(`fields.types.${fieldType}`)} ({props.counts[fieldType]}/{FIELD_LIMITS[fieldType]})
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={t('fields.fieldTitle')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />

          <TextField
            label={t('fields.description')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />

          <FormControlLabel
            control={
              <Switch
                checked={showInTable}
                onChange={(e) => setShowInTable(e.target.checked)}
              />
            }
            label={t('fields.showInTable')}
          />

          <FormControlLabel
            control={
              <Switch
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
              />
            }
            label={t('fields.required')}
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 1,
        }}
      >
        <Button
          onClick={props.onClose}
          sx={{
            textTransform: 'none',
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {t('actions.cancel')}
        </Button>

        <Button
          onClick={() =>
            props.onSubmit({
              type,
              title: title.trim(),
              description: description.trim() || undefined,
              required,
              showInTable,
            })
          }
          variant="contained"
          disabled={!canSubmit}
          sx={{
            textTransform: 'none',
            borderRadius: 3,
            px: 3,
            fontWeight: 650,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {props.loading ? t('actions.creating') : t('actions.create')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}