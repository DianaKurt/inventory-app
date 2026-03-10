import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Stack,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import Panel from '@/shared/ui/Panel/Panel'
import { apiGet, apiPost } from '@/shared/api/http'

type PostRow = {
  id: string
  inventoryId: string
  bodyMd: string
  createdAt: string
  authorName: string
}

export default function DiscussionTab() {
  const { t } = useTranslation('common')
  const { inventoryId } = useParams()
  const qc = useQueryClient()

  const [message, setMessage] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', inventoryId],
    enabled: Boolean(inventoryId),
    queryFn: () => apiGet<PostRow[]>(`/posts?inventoryId=${inventoryId}`),
    refetchInterval: 3000,
  })

  const posts = useMemo(() => data ?? [], [data])

  const create = useMutation({
    mutationFn: async () => {
      if (!inventoryId) throw new Error('No inventoryId')
      return apiPost('/posts', { inventoryId, bodyMd: message.trim() })
    },
    onSuccess: async () => {
      setMessage('')
      setToast(t('discussion.posted'))
      await qc.invalidateQueries({ queryKey: ['posts', inventoryId] })
    },
    onError: (e: any) => setToast(e?.message ?? t('discussion.failedToPost')),
  })

  return (
    <Panel>
      <Stack spacing={3}>
        <Typography variant="h6" fontWeight={700}>
          {t('discussion.title')}
        </Typography>

        {/* Posts */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            maxHeight: 360,
            overflowY: 'auto',
          }}
        >
          {isLoading ? (
            <Typography color="text.secondary">
              {t('common.loading')}
            </Typography>
          ) : isError ? (
            <Alert severity="error">
              {t('discussion.failedToLoad')}
            </Alert>
          ) : posts.length === 0 ? (
            <Typography color="text.secondary">
              {t('discussion.noPosts')}
            </Typography>
          ) : (
            <Stack spacing={2}>
              {posts.map((p) => (
                <Stack key={p.id} spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography fontWeight={650}>{p.authorName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(p.createdAt).toLocaleString()}
                    </Typography>
                  </Stack>
                  <Typography>{p.bodyMd}</Typography>
                  <Divider />
                </Stack>
              ))}
            </Stack>
          )}
        </Paper>

        {/* Input */}
        <Stack spacing={1.5}>
          <TextField
            label={t('discussion.writeMessage')}
            multiline
            minRows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            disabled={!message.trim() || create.isPending}
            onClick={() => create.mutate()}
            sx={{
              borderRadius: 3,
              textTransform: 'none',
              alignSelf: 'flex-start',
              fontWeight: 600,
            }}
          >
            {create.isPending
              ? t('discussion.posting')
              : t('discussion.post')}
          </Button>
        </Stack>

        <Snackbar
          open={Boolean(toast)}
          autoHideDuration={3000}
          onClose={() => setToast(null)}
        >
          <Alert
            severity="success"
            variant="filled"
            onClose={() => setToast(null)}
          >
            {toast}
          </Alert>
        </Snackbar>
      </Stack>
    </Panel>
  )
}