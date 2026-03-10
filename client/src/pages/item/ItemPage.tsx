import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Alert,
  Box,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
  Button,
} from '@mui/material'
import { alpha } from '@mui/material/styles'

import { apiGet } from '@/shared/api/http'
import ItemForm from './ui/ItemForm'
import { useTranslation } from 'react-i18next'
import ItemLikes from './ui/ItemLikes'

type ApiFieldType = 'TEXT_SINGLE' | 'TEXT_MULTI' | 'NUMBER' | 'LINK' | 'BOOLEAN'

type Field = {
  id: string
  title: string
  description?: string
  type: ApiFieldType
  order: number
  showInTable: boolean
}

export type ItemDetailsDto = {
  item: {
    id: string
    inventoryId: string
    customId: string
    version: number
    createdAt: string
    updatedAt: string
  }
  fields: Field[]
  valuesByFieldId: Record<
    string,
    {
      textValue: string | null
      numberValue: number | null
      boolValue: boolean | null
      linkValue: string | null
    }
  >
}

export default function ItemPage() {
  const { inventoryId, itemId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['item', itemId],
    enabled: Boolean(itemId),
    queryFn: () => apiGet<ItemDetailsDto>(`/items/${itemId}`),
  })

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Skeleton height={40} width={220} />
        <Skeleton height={80} sx={{ mt: 2 }} />
        <Skeleton height={260} sx={{ mt: 2 }} />
      </Container>
    )
  }

  if (isError || !data) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{t('errors.failedToLoadItem')}</Alert>
      </Container>
    )
  }

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        py: 6,
        background: `linear-gradient(to bottom, ${alpha(
          theme.palette.primary.main,
          0.04,
        )}, transparent 320px)`,
      })}
    >
      <Container maxWidth="md">
        <Stack spacing={2.5}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <Stack spacing={0.4}>
              <Typography variant="h5" fontWeight={850}>
                {t('item.title', { id: data.item.customId })}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {t('item.inventoryLabel')}: {data.item.inventoryId}
              </Typography>
            </Stack>

            <Button
              variant="outlined"
              onClick={() =>
                navigate(`/inventories/${inventoryId ?? data.item.inventoryId}?tab=items`)
              }
              sx={{ textTransform: 'none', borderRadius: 3 }}
            >
              {t('common.back')}
            </Button>
          </Stack>

          {/* Likes */}
          <ItemLikes />

          {/* Form card */}
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(8px)',
            })}
          >
            <ItemForm data={data} />
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}