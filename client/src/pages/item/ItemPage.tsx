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
      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Skeleton height={40} width={220} />
        <Skeleton height={80} sx={{ mt: 2 }} />
        <Skeleton height={260} sx={{ mt: 2 }} />
      </Container>
    )
  }

  if (isError || !data) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Alert severity="error">{t('errors.failedToLoadItem')}</Alert>
      </Container>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 2, md: 5 },
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={{ xs: 2, md: 2.5 }}>
          {/* Header */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'stretch', sm: 'flex-start' }}
            spacing={1.5}
          >
            <Stack spacing={0.4} sx={{ minWidth: 0 }}>
              <Typography
                variant="h5"
                fontWeight={850}
                sx={{
                  fontSize: { xs: '1.2rem', sm: '1.5rem' },
                  lineHeight: 1.2,
                  wordBreak: 'break-word',
                }}
              >
                {t('item.title', { id: data.item.customId })}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ wordBreak: 'break-word' }}
              >
                {t('item.inventoryLabel')}: {data.item.inventoryId}
              </Typography>
            </Stack>

            <Button
              variant="outlined"
              onClick={() =>
                navigate(`/inventories/${inventoryId ?? data.item.inventoryId}?tab=items`)
              }
              sx={{
                textTransform: 'none',
                borderRadius: 3,
                width: { xs: '100%', sm: 'auto' },
                alignSelf: { xs: 'stretch', sm: 'flex-start' },
              }}
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
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 10px 24px rgba(0,0,0,0.04)',
            })}
          >
            <ItemForm data={data} />
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}