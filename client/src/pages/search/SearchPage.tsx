import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Container,
  Stack,
  Typography,
  Paper,
  Chip,
  alpha,
  Skeleton,
} from '@mui/material'
import { apiGet } from '@/shared/api/http'

import SearchFilters from './ui/SearchFilters'
import SearchResultsTable, { type SearchResponse } from './ui/SearchResultsTable'
import { useTranslation } from 'react-i18next'

export default function SearchPage() {
  const [params] = useSearchParams()

  const q = (params.get('q') ?? '').trim()
  const type = params.get('type') ?? 'all'
  const category = params.get('category') ?? ''
  const sort = params.get('sort') ?? 'updated'

  const { t } = useTranslation('common')

  const qs = useMemo(() => {
    const p = new URLSearchParams()
    if (q) p.set('q', q)
    if (type !== 'all') p.set('type', type)
    if (category) p.set('category', category)
    if (sort !== 'updated') p.set('sort', sort)
    return p.toString()
  }, [q, type, category, sort])

  const { data, isLoading, isError } = useQuery<SearchResponse>({
    queryKey: ['search', q, type, category, sort],
    enabled: q.length > 0,
    queryFn: () => apiGet<SearchResponse>(`/search?${qs}`),
    staleTime: 10_000,
  })

  const inventories = data?.inventories ?? []
  const items = data?.items ?? []

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        py: { xs: 3, md: 5 },
        background: `
          radial-gradient(circle at 12% 0%, ${alpha(theme.palette.primary.main, 0.12)}, transparent 45%),
          radial-gradient(circle at 88% 0%, ${alpha(theme.palette.secondary.main, 0.12)}, transparent 50%),
          linear-gradient(to bottom, ${alpha(theme.palette.background.default, 1)}, ${alpha(theme.palette.background.default, 0.92)} 50%, ${alpha(theme.palette.background.default, 1)})
        `,
      })}
    >
      <Container maxWidth="lg">
        <Stack spacing={2.5}>
          {/* Header */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
          >
            <Stack spacing={0.3}>
              <Typography variant="h5" fontWeight={750}>
                {t('search.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              {t('search.subtitle')}
              </Typography>
            </Stack>

            <Stack direction="row" 
            spacing={1} alignItems="center" 
            flexWrap="wrap">
              {q ? (
                <Chip
                label={t('search.chipQuery', { q })}
                variant="outlined"
                sx={{ borderRadius: 999, fontWeight: 600 }}
                />
              ) : (
              <Chip
              label={t('search.chipHint')}
              variant="outlined"
              sx={{ borderRadius: 999 }}
              />
              )}
              </Stack>
          </Stack>

          {/* Filters */}
          <SearchFilters />

          {/* Content card */}
          <Paper
            elevation={0}
            sx={(theme) => ({
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(10px)',
            })}
          >
            <Box sx={{ p: { xs: 2, md: 3 } }}>
              {!q ? (
                <Stack spacing={1.2}>
                  <Typography variant="h6" fontWeight={700}>
                    {t('search.startTitle')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('search.startSubtitle')}
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ pt: 0.5 }}>
                    {['laptop', 'invoice', '2026', 'XD_'].map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        variant="outlined"
                        sx={{ borderRadius: 999 }}
                      />
                    ))}
                  </Stack>
                </Stack>
              ) : isLoading ? (
                <Stack spacing={2}>
                  <Skeleton variant="rounded" height={36} />
                  <Skeleton variant="rounded" height={260} />
                  <Skeleton variant="rounded" height={260} />
                </Stack>
              ) : isError ? (
                <Stack spacing={1}>
                  <Typography variant="h6" fontWeight={700}>
                    {t('errors.failedToLoadResults')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('errors.tryAgainOrCheckServer')}
                  </Typography>
                </Stack>
              ) : (
                <SearchResultsTable query={q} inventories={inventories} items={items} />
              )}
            </Box>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}