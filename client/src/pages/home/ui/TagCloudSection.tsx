import { useQuery } from '@tanstack/react-query'
import { Stack, Chip, Typography, Box, alpha } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { apiGet } from '@/shared/api/http'

type Tag = { id: string; name: string }

export default function TagCloudSection() {
  const { t } = useTranslation('common')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tags'],
    queryFn: () => apiGet<Tag[]>('/tags'),
  })

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h6" fontWeight={700}>
          {t('sections.tags.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('sections.tags.subtitle')}
        </Typography>
      </Box>

      {isLoading ? (
        <Typography variant="body2">{t('states.loading')}</Typography>
      ) : isError ? (
        <Typography variant="body2">{t('errors.tagsLoadFailed')}</Typography>
      ) : (
        <Stack direction="row" spacing={1.2} flexWrap="wrap" useFlexGap>
          {(data ?? []).map((tag) => (
            <Chip
              key={tag.id}
              label={tag.name}
              clickable
              sx={(theme) => ({
                borderRadius: 2.5,
                fontWeight: 500,
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
                transition: 'all .2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
                },
              })}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}