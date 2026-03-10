import {
  Stack,
  Typography,
  Paper,
  Button,
  Switch,
  FormControlLabel,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  TextField,
  Divider,
  Alert,
} from '@mui/material'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Panel from '@/shared/ui/Panel/Panel'
import {
  getInventoryAccess,
  updateInventoryVisibility,
  addInventoryAccess,
  removeInventoryAccess,
  type InventoryAccessUser,
} from '@/entities/inventory/api/inventory.api'

export default function AccessTab() {
  const { t } = useTranslation('common')
  const { inventoryId } = useParams()
  const qc = useQueryClient()

  const [openAdd, setOpenAdd] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<InventoryAccessUser | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventory', inventoryId, 'access'],
    enabled: Boolean(inventoryId),
    queryFn: () => getInventoryAccess(inventoryId!),
  })

  const visibilityMutation = useMutation({
    mutationFn: (nextValue: boolean) =>
      updateInventoryVisibility(inventoryId!, nextValue),
    onSuccess: async (_out, nextValue) => {
      await qc.invalidateQueries({ queryKey: ['inventory', inventoryId, 'access'] })
      await qc.invalidateQueries({ queryKey: ['inventory', inventoryId] })
      await qc.invalidateQueries({ queryKey: ['inventory', inventoryId, 'details'] })
      setToast(nextValue ? t('access.nowPublic') : t('access.nowPrivate'))
    },
    onError: (e: any) => {
      setToast(e?.message ?? t('errors.failedToSave'))
    },
  })

  const addMutation = useMutation({
    mutationFn: () => addInventoryAccess(inventoryId!, newEmail.trim()),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['inventory', inventoryId, 'access'] })
      setToast(t('access.granted'))
      setNewEmail('')
      setOpenAdd(false)
    },
    onError: (e: any) => {
      setToast(e?.message ?? t('errors.failedToSave'))
    },
  })

  const removeMutation = useMutation({
    mutationFn: () => removeInventoryAccess(inventoryId!, deleteTarget!.id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['inventory', inventoryId, 'access'] })
      setToast(t('access.removed'))
      setDeleteTarget(null)
    },
    onError: (e: any) => {
      setToast(e?.message ?? t('errors.failedToDelete'))
    },
  })

  if (isLoading) {
    return (
      <Panel>
        <Typography>{t('common.loading')}</Typography>
      </Panel>
    )
  }

  if (isError || !data) {
    return (
      <Panel>
        <Alert severity="error">{t('errors.failedToLoadInventory')}</Alert>
      </Panel>
    )
  }

  const isPublic = data.isPublic
  const users = data.users

  return (
    <Panel>
      <Stack spacing={4}>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700}>
            {t('access.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('access.subtitle')}
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={2}>
            <Typography fontWeight={600}>
              {t('access.visibility')}
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={(e) => visibilityMutation.mutate(e.target.checked)}
                  disabled={visibilityMutation.isPending}
                />
              }
              label={isPublic ? t('access.public') : t('access.private')}
            />

            <Typography variant="body2" color="text.secondary">
              {isPublic
                ? t('access.publicDescription')
                : t('access.privateDescription')}
            </Typography>
          </Stack>
        </Paper>

        {!isPublic && (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography fontWeight={600}>
                  {t('access.users')}
                </Typography>

                <Button
                  startIcon={<PersonAddRoundedIcon />}
                  onClick={() => setOpenAdd(true)}
                  variant="contained"
                  sx={{ borderRadius: 3, textTransform: 'none' }}
                >
                  {t('access.addUser')}
                </Button>
              </Stack>

              <Divider />

              {users.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {t('access.noUsers')}
                </Typography>
              ) : (
                users.map((user) => (
                  <Stack
                    key={user.id}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      transition: 'background 0.15s',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>

                      <Stack>
                        <Typography fontWeight={500}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Stack>
                    </Stack>

                    <IconButton
                      color="error"
                      onClick={() => setDeleteTarget(user)}
                    >
                      <DeleteRoundedIcon />
                    </IconButton>
                  </Stack>
                ))
              )}
            </Stack>
          </Paper>
        )}

        <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
          <DialogTitle>{t('access.addDialogTitle')}</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              label={t('access.userEmail')}
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)}>
              {t('actions.cancel')}
            </Button>
            <Button
              variant="contained"
              disabled={!newEmail.trim() || addMutation.isPending}
              onClick={() => addMutation.mutate()}
            >
              {t('actions.add')}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
        >
          <DialogTitle>{t('access.removeTitle')}</DialogTitle>
          <DialogContent>
            <Typography>{t('access.removeText')}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteTarget(null)}>
              {t('actions.cancel')}
            </Button>
            <Button
              color="error"
              variant="contained"
              onClick={() => removeMutation.mutate()}
              disabled={removeMutation.isPending}
            >
              {t('actions.remove')}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={Boolean(toast)}
          autoHideDuration={3000}
          onClose={() => setToast(null)}
          message={toast}
          action={
            <IconButton
              size="small"
              color="inherit"
              onClick={() => setToast(null)}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          }
        />
      </Stack>
    </Panel>
  )
}