import { Box, Skeleton, Stack, Typography, Paper, alpha } from '@mui/material'
import { useTranslation } from 'react-i18next'

type InventoryVM = {
  id: string
  title: string
  category: string
  itemsCount: number
  ownerName: string
  updatedAt: string
}

type Props = {
  inventory: InventoryVM | null
  loading?: boolean
  error?: string
}

export default function InventoryHeader({ inventory, loading, error }: Props) {
  const { t } = useTranslation('common')

  if (loading) {
    return (
      <Box>
        <Skeleton height={34} width="55%" />
        <Skeleton height={22} width="35%" />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography color="error">{error}</Typography>
      </Box>
    )
  }

  if (!inventory) return null

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: '0 12px 28px rgba(0,0,0,0.05)',
      })}
    >
      <Stack spacing={1.25}>
        <Typography
          fontWeight={800}
          sx={{
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}
        >
          {inventory.title}
        </Typography>

        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 2 }}
          flexWrap="wrap"
          useFlexGap
          sx={{ opacity: 0.88 }}
        >
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            <b>{t('table.category')}:</b> {inventory.category}
          </Typography>

          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            <b>{t('table.items')}:</b> {inventory.itemsCount}
          </Typography>

          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            <b>{t('table.owner')}:</b> {inventory.ownerName}
          </Typography>

          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            <b>{t('table.updated')}:</b> {inventory.updatedAt}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}