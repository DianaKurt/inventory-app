import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'

type Props = {
  open: boolean
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'OK',
  cancelText = 'Cancel',
  loading = false,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>

      {description ? (
        <DialogContent>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {description}
          </Typography>
        </DialogContent>
      ) : null}

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button onClick={onConfirm} disabled={loading} variant="contained">
          {loading ? <CircularProgress size={18} /> : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
