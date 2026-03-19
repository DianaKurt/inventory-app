import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Stack,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  alpha,
  Box,
  Skeleton,
} from '@mui/material'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import PublishedWithChangesRoundedIcon from '@mui/icons-material/PublishedWithChangesRounded'
import Panel from '@/shared/ui/Panel/Panel'
import { apiDelete, apiGet, apiPatch } from '@/shared/api/http'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type InventoryDetails = {
  id: string
  title: string
  description: string
  category: string
  isPublic: boolean
  version: number
}

export default function SettingsTab() {
  const { t } = useTranslation('common')

  const { inventoryId } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [toast, setToast] = useState<{
    msg: string
    kind: 'success' | 'error' | 'info'
  } | null>(null)

  const [openDelete, setOpenDelete] = useState(false)
  const [conflictOpen, setConflictOpen] = useState(false)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['inventory', inventoryId, 'details'],
    enabled: Boolean(inventoryId),
    queryFn: () => apiGet<InventoryDetails>(`/inventories/${inventoryId}`),
  })

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [version, setVersion] = useState(1)

  useEffect(() => {
    if (!data) return
    setTitle(data.title ?? '')
    setDescription(data.description ?? '')
    setCategory(data.category ?? '')
    setIsPublic(Boolean(data.isPublic))
    setVersion(data.version)
  }, [data?.id, data?.version])

  const isValid = title.trim().length > 0 && category.trim().length > 0

  const dirty = useMemo(() => {
    if (!data) return false

    return (
      title !== (data.title ?? '') ||
      description !== (data.description ?? '') ||
      category !== (data.category ?? '') ||
      isPublic !== Boolean(data.isPublic)
    )
  }, [data, title, description, category, isPublic])

  const save = useMutation({
    mutationFn: async () => {
      if (!inventoryId) throw new Error('No inventoryId')

      return apiPatch(`/inventories/${inventoryId}`, {
        version,
        title: title.trim(),
        description,
        category: category.trim(),
        isPublic,
      })
    },

    onSuccess: async (out: any) => {
      if (out?.version) setVersion(out.version)

      await qc.invalidateQueries({ queryKey: ['inventory', inventoryId] })
      await qc.invalidateQueries({ queryKey: ['inventory', inventoryId, 'details'] })

      setToast({
        msg: t('settings.saved'),
        kind: 'success',
      })
    },

    onError: (e: any) => {
      if (e?.status === 409) {
        setConflictOpen(true)

        setToast({
          msg: t('settings.conflict'),
          kind: 'info',
        })
        return
      }

      setToast({
        msg: e?.message ?? t('settings.failedToSave'),
        kind: 'error',
      })
    },
  })

  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    if (!dirty) return
    if (!isValid) return
    if (save.isPending) return

    if (debounceRef.current) window.clearTimeout(debounceRef.current)

    debounceRef.current = window.setTimeout(() => {
      if (dirty && !save.isPending) save.mutate()
    }, 1000)

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [dirty, isValid, title, description, category, isPublic])

  const del = useMutation({
    mutationFn: async () => {
      if (!inventoryId) throw new Error('No inventoryId')
      await apiDelete(`/inventories/${inventoryId}`)
    },

    onSuccess: async () => {
      setOpenDelete(false)

      setToast({
        msg: t('settings.deleted'),
        kind: 'success',
      })

      await qc.invalidateQueries({ queryKey: ['inventories'] })
      navigate('/inventories')
    },

    onError: (e: any) =>
      setToast({
        msg: e?.message ?? t('settings.failedToDelete'),
        kind: 'error',
      }),
  })

  const handleReload = async () => {
    setConflictOpen(false)
    await refetch()

    setToast({
      msg: t('settings.reloaded'),
      kind: 'success',
    })
  }

  const handleOverwrite = async () => {
    setConflictOpen(false)

    const fresh = await refetch()
    const serverVersion = fresh.data?.version

    if (!serverVersion) {
      setToast({
        msg: t('settings.reloadFailed'),
        kind: 'error',
      })
      return
    }

    setVersion(serverVersion)

    await apiPatch(`/inventories/${inventoryId}`, {
      version: serverVersion,
      title: title.trim(),
      description,
      category: category.trim(),
      isPublic,
    })

    await qc.invalidateQueries({ queryKey: ['inventory', inventoryId] })
    await qc.invalidateQueries({ queryKey: ['inventory', inventoryId, 'details'] })

    setToast({
      msg: t('settings.overwritten'),
      kind: 'success',
    })
  }

  if (isLoading) {
    return (
      <Panel>
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={40} width={220} />
          <Skeleton variant="rounded" height={120} />
          <Skeleton variant="rounded" height={240} />
        </Stack>
      </Panel>
    )
  }

  if (isError || !data) {
    return (
      <Panel>
        <Alert severity="error">{t('settings.failedToLoad')}</Alert>
      </Panel>
    )
  }

  return (
    <Panel>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
              lineHeight: 1.2,
              wordBreak: 'break-word',
            }}
          >
            {t('settings.title')}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {t('settings.autosave')}
          </Typography>
        </Stack>

        {/* Main settings */}
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
            boxShadow: '0 14px 36px rgba(0,0,0,0.04)',
          })}
        >
          <Stack spacing={2.5}>
            <TextField
              label={t('settings.inventoryTitle')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!title.trim()}
              fullWidth
            />

            <TextField
              label={t('settings.category')}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              error={!category.trim()}
              fullWidth
            />

            <TextField
              label={t('settings.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              minRows={3}
            />

            <Box
              sx={(theme) => ({
                p: 2,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                backgroundColor: theme.palette.background.default,
              })}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                }
                label={isPublic ? t('settings.public') : t('settings.private')}
                sx={{
                  alignItems: 'flex-start',
                  m: 0,
                }}
              />
            </Box>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.25}
              useFlexGap
              flexWrap="wrap"
              alignItems={{ xs: 'stretch', sm: 'center' }}
            >
              <Button
                variant="contained"
                startIcon={<SaveRoundedIcon />}
                disabled={!isValid || save.isPending}
                onClick={() => save.mutate()}
                sx={(theme) => ({
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 800,
                  px: 3,
                  py: 1,
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: { xs: 'center', sm: 'center' },
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                  '&:hover': {
                    boxShadow: '0 16px 34px rgba(0,0,0,0.16)',
                  },
                })}
              >
                {save.isPending
                  ? t('settings.saving')
                  : dirty
                    ? t('settings.saveNow')
                    : t('settings.saved')}
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* Danger zone */}
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            border: `1px solid ${alpha(theme.palette.error.main, 0.28)}`,
            background:
              theme.palette.mode === 'light'
                ? `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.05)}, ${alpha(theme.palette.warning.main, 0.04)})`
                : alpha(theme.palette.error.main, 0.07),
            boxShadow: '0 10px 26px rgba(0,0,0,0.03)',
          })}
        >
          <Stack spacing={2}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ minWidth: 0 }}
            >
              <WarningAmberRoundedIcon color="error" fontSize="small" />
              <Typography
                fontWeight={800}
                color="error.main"
                sx={{
                  wordBreak: 'break-word',
                }}
              >
                {t('settings.dangerZone')}
              </Typography>
            </Stack>

            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteForeverRoundedIcon />}
              onClick={() => setOpenDelete(true)}
              sx={{
                borderRadius: 999,
                textTransform: 'none',
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
                width: { xs: '100%', sm: 'auto' },
                fontWeight: 800,
                px: 3,
                py: 1,
              }}
            >
              {t('settings.deleteInventory')}
            </Button>
          </Stack>
        </Paper>

        {/* Delete dialog */}
        <Dialog open={openDelete} onClose={() => setOpenDelete(false)} fullWidth maxWidth="xs">
          <DialogTitle>{t('settings.deleteTitle')}</DialogTitle>

          <DialogContent>
            <Typography>{t('settings.deleteText')}</Typography>
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
              onClick={() => setOpenDelete(false)}
              sx={{
                textTransform: 'none',
                borderRadius: 999,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {t('actions.cancel')}
            </Button>

            <Button
              color="error"
              variant="contained"
              disabled={del.isPending}
              onClick={() => del.mutate()}
              sx={{
                textTransform: 'none',
                borderRadius: 999,
                fontWeight: 700,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {del.isPending ? t('settings.deleting') : t('actions.delete')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Conflict dialog */}
        <Dialog open={conflictOpen} onClose={() => setConflictOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle>{t('settings.conflictTitle')}</DialogTitle>

          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              {t('settings.conflictText')}
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
              onClick={handleReload}
              startIcon={<RefreshRoundedIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 999,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {t('settings.reload')}
            </Button>

            <Button
              variant="contained"
              onClick={handleOverwrite}
              startIcon={<PublishedWithChangesRoundedIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 999,
                fontWeight: 700,
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {t('settings.overwrite')}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Toast */}
        <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast(null)}>
          <Alert severity={toast?.kind ?? 'success'} variant="filled" onClose={() => setToast(null)}>
            {toast?.msg}
          </Alert>
        </Snackbar>
      </Stack>
    </Panel>
  )
}