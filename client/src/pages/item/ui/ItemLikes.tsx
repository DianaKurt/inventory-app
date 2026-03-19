import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded'
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'
import { Alert, Button, Stack, Typography } from '@mui/material'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Panel from '@/shared/ui/Panel/Panel'
import { getItemLikes, toggleItemLike } from '@/entities/inventory/api/item.api'

export default function ItemLikes() {
  const { t } = useTranslation('common')
  const { itemId } = useParams()
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['item', itemId, 'likes'],
    enabled: Boolean(itemId),
    queryFn: () => getItemLikes(itemId!),
  })

  const toggleMutation = useMutation({
    mutationFn: () => toggleItemLike(itemId!),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['item', itemId, 'likes'] })
    },
  })

  if (isLoading) {
    return (
      <Panel>
        <Stack spacing={0.5}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
          >
            {t('item.engagement')}
          </Typography>

          <Typography variant="body1">
            {t('common.loading')}
          </Typography>
        </Stack>
      </Panel>
    )
  }

  if (isError || !data) {
    return (
      <Panel>
        <Alert severity="error">{t('item.likesFailed')}</Alert>
      </Panel>
    )
  }

  return (
    <Panel>
      <Stack spacing={1}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
        >
          {t('item.engagement')}
        </Typography>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <Button
            variant={data.likedByMe ? 'contained' : 'outlined'}
            startIcon={
              data.likedByMe ? <FavoriteRoundedIcon /> : <FavoriteBorderRoundedIcon />
            }
            onClick={() => toggleMutation.mutate()}
            disabled={toggleMutation.isPending}
            sx={{
              textTransform: 'none',
              borderRadius: 3,
              width: { xs: '100%', sm: 'auto' },
              justifyContent: { xs: 'center', sm: 'center' },
            }}
          >
            {toggleMutation.isPending
              ? t('item.likesUpdating')
              : data.likedByMe
                ? t('item.unlike')
                : t('item.like')}
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ wordBreak: 'break-word' }}
          >
            {t('item.likesCount', { count: data.count })}
          </Typography>
        </Stack>
      </Stack>
    </Panel>
  )
}