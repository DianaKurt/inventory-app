import { useEffect, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'

import { createSupportTicket } from '../api/support-ticket.api'
import type {
  CreateSupportTicketPayload,
  SupportTicketPriority,
} from '../model/support-ticket.types'

type Props = {
  open: boolean
  onClose: () => void
  reportedBy: {
    id: string
    name?: string | null
    email: string
  }
  inventory?: {
    id?: string | null
    title: string
  } | null
  link?: string
}

const PRIORITIES: SupportTicketPriority[] = ['High', 'Average', 'Low']

export default function SupportTicketDialog({
  open,
  onClose,
  reportedBy,
  inventory = null,
  link,
}: Props) {
  const { t } = useTranslation('common')

  const [summary, setSummary] = useState('')
  const [priority, setPriority] = useState<SupportTicketPriority>('Average')
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setSummary('')
    setPriority('Average')
    setLocalError(null)
  }, [open])

  const currentLink = useMemo(() => {
    if (link) return link
    if (typeof window !== 'undefined') return window.location.href
    return ''
  }, [link])

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: CreateSupportTicketPayload = {
        summary: summary.trim(),
        priority,
        reportedBy,
        inventory,
        link: currentLink,
        createdAt: new Date().toISOString(),
      }

      return createSupportTicket(payload)
    },
    onSuccess: () => {
      onClose()
    },
    onError: (e: any) => {
      setLocalError(e?.message ?? t('support.error'))
    },
  })

  const canSubmit =
    summary.trim().length >= 5 &&
    Boolean(reportedBy?.email) &&
    !mutation.isPending

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('support.title')}</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {localError ? <Alert severity="error">{localError}</Alert> : null}

          {mutation.isSuccess ? (
            <Alert severity="success">
              {t('support.success')}
            </Alert>
          ) : null}

          <TextField
            label={t('support.summary')}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={t('support.summaryPlaceholder')}
            multiline
            minRows={4}
            fullWidth
            required
          />

          <TextField
            select
            label={t('support.priority')}
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as SupportTicketPriority)
            }
            fullWidth
          >
            {PRIORITIES.map((value) => (
              <MenuItem key={value} value={value}>
                {value === 'High' && t('support.priorityHigh')}
                {value === 'Average' && t('support.priorityAverage')}
                {value === 'Low' && t('support.priorityLow')}
              </MenuItem>
            ))}
          </TextField>

          <Stack spacing={0.5}>
            <Typography variant="body2" color="text.secondary">
              {t('support.reportedBy')}: {reportedBy.name || reportedBy.email}
            </Typography>

            {inventory?.title ? (
              <Typography variant="body2" color="text.secondary">
                {t('support.inventory')}: {inventory.title}
              </Typography>
            ) : null}

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ wordBreak: 'break-word' }}
            >
              {t('support.link')}: {currentLink}
            </Typography>
          </Stack>
        </Stack>
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
          onClick={onClose}
          sx={{
            textTransform: 'none',
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {t('actions.cancel')}
        </Button>

        <Button
          variant="contained"
          disabled={!canSubmit}
          onClick={() => mutation.mutate()}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          {mutation.isPending ? t('actions.submitting') : t('actions.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}