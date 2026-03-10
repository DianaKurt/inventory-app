import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import type { ConflictInfo } from '../model/conflict.types'

export type ConflictDialogProps = {
  open: boolean
  conflict: ConflictInfo | null
  onClose: () => void
}

export default function ConflictDialog({ open, conflict, onClose }: ConflictDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Conflict</DialogTitle>
      <DialogContent dividers>
        <Typography>{conflict?.message ?? 'Conflict detected.'}</Typography>
        {conflict?.serverVersion != null && conflict?.localVersion != null ? (
          <Typography sx={{ mt: 1, opacity: 0.8 }} variant="body2">
            Server: v{conflict.serverVersion} • Local: v{conflict.localVersion}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>OK</Button>
      </DialogActions>
    </Dialog>
  )
}
