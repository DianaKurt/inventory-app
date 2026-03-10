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
        p: { xs: 2.5, md: 3 },
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: alpha(theme.palette.background.paper, 0.92),
        boxShadow: '0 12px 28px rgba(0,0,0,0.05)',
      })}
    >
      <Stack spacing={1.5}>
        <Typography variant="h5" fontWeight={800}>
          {inventory.title}
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          flexWrap="wrap"
          useFlexGap
          sx={{ opacity: 0.85 }}
        >
          <Typography variant="body2">
            <b>{t('table.category')}:</b> {inventory.category}
          </Typography>

          <Typography variant="body2">
            <b>{t('table.items')}:</b> {inventory.itemsCount}
          </Typography>

          <Typography variant="body2">
            <b>{t('table.owner')}:</b> {inventory.ownerName}
          </Typography>

          <Typography variant="body2">
            <b>{t('table.updated')}:</b> {inventory.updatedAt}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}