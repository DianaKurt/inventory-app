import { Stack, Button, alpha } from '@mui/material'
import BlockRoundedIcon from '@mui/icons-material/BlockRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import AdminPanelSettingsRoundedIcon from '@mui/icons-material/AdminPanelSettingsRounded'
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ClearAllRoundedIcon from '@mui/icons-material/ClearAllRounded'
import { useTranslation } from 'react-i18next'
import type { DataTableSelection } from '@/shared/ui/DataTable/types'

type Props = {
  selection: DataTableSelection
  onClear: () => void
  onBlock: () => void
  onUnblock: () => void
  onMakeAdmin: () => void
  onRemoveAdmin: () => void
  onDelete: () => void
}

export default function UserActionsToolbar({
  selection,
  onClear,
  onBlock,
  onUnblock,
  onMakeAdmin,
  onRemoveAdmin,
  onDelete,
}: Props) {
  const { t } = useTranslation('common')
  const disabled = selection.length === 0

  return (
    <Stack
      direction="row"
      spacing={1}
      useFlexGap
      flexWrap="wrap"
      sx={{ pb: 1 }}
    >
      <Button
        variant="outlined"
        disabled={disabled}
        onClick={onBlock}
        startIcon={<BlockRoundedIcon />}
        sx={(theme) => ({
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 700,
          px: 2,
          borderColor: alpha(theme.palette.warning.main, 0.35),
          color: theme.palette.warning.dark,
          backgroundColor: alpha(theme.palette.warning.main, 0.06),
          transition: 'all .2s ease',
          '&:hover': {
            borderColor: alpha(theme.palette.warning.main, 0.55),
            backgroundColor: alpha(theme.palette.warning.main, 0.12),
            transform: 'translateY(-1px)',
          },
        })}
      >
        {t('admin.actions.block')}
      </Button>

      <Button
        variant="outlined"
        disabled={disabled}
        onClick={onUnblock}
        startIcon={<CheckCircleRoundedIcon />}
        sx={(theme) => ({
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 700,
          px: 2,
          borderColor: alpha(theme.palette.success.main, 0.35),
          color: theme.palette.success.dark,
          backgroundColor: alpha(theme.palette.success.main, 0.06),
          transition: 'all .2s ease',
          '&:hover': {
            borderColor: alpha(theme.palette.success.main, 0.55),
            backgroundColor: alpha(theme.palette.success.main, 0.12),
            transform: 'translateY(-1px)',
          },
        })}
      >
        {t('admin.actions.unblock')}
      </Button>

      <Button
        variant="outlined"
        disabled={disabled}
        onClick={onMakeAdmin}
        startIcon={<AdminPanelSettingsRoundedIcon />}
        sx={(theme) => ({
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 700,
          px: 2,
          borderColor: alpha(theme.palette.secondary.main, 0.35),
          color: theme.palette.secondary.dark,
          backgroundColor: alpha(theme.palette.secondary.main, 0.06),
          transition: 'all .2s ease',
          '&:hover': {
            borderColor: alpha(theme.palette.secondary.main, 0.55),
            backgroundColor: alpha(theme.palette.secondary.main, 0.12),
            transform: 'translateY(-1px)',
          },
        })}
      >
        {t('admin.actions.makeAdmin')}
      </Button>

      <Button
        variant="outlined"
        disabled={disabled}
        onClick={onRemoveAdmin}
        startIcon={<PersonRemoveRoundedIcon />}
        sx={(theme) => ({
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 700,
          px: 2,
          borderColor: alpha(theme.palette.info.main, 0.35),
          color: theme.palette.info.dark,
          backgroundColor: alpha(theme.palette.info.main, 0.06),
          transition: 'all .2s ease',
          '&:hover': {
            borderColor: alpha(theme.palette.info.main, 0.55),
            backgroundColor: alpha(theme.palette.info.main, 0.12),
            transform: 'translateY(-1px)',
          },
        })}
      >
        {t('admin.actions.removeAdmin')}
      </Button>

      <Button
        variant="outlined"
        color="error"
        disabled={disabled}
        onClick={onDelete}
        startIcon={<DeleteOutlineRoundedIcon />}
        sx={(theme) => ({
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 800,
          px: 2,
          borderWidth: 1.5,
          backgroundColor: alpha(theme.palette.error.main, 0.05),
          transition: 'all .2s ease',
          '&:hover': {
            backgroundColor: alpha(theme.palette.error.main, 0.1),
            transform: 'translateY(-1px)',
          },
        })}
      >
        {t('admin.actions.delete')}
      </Button>

      <Button
        variant="text"
        disabled={disabled}
        onClick={onClear}
        startIcon={<ClearAllRoundedIcon />}
        sx={{
          borderRadius: 999,
          textTransform: 'none',
          fontWeight: 700,
          px: 1.5,
        }}
      >
        {t('actions.clear')}
      </Button>
    </Stack>
  )
}