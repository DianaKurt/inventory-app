import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Panel from '@/shared/ui/Panel/Panel'

type ItemDetails = {
  id: string
  inventoryId: string
  customId: string
  inventory?: {
    id: string
    title: string
    category: string | null
    isPublic: boolean
  }
}

export default function ItemHeader({ item }: { item: ItemDetails }) {
  const { t } = useTranslation('common')

  return (
    <Panel>
      <Stack spacing={0.5}>
        {/* Inventory */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            wordBreak: 'break-word',
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
          }}
        >
          {item.inventory?.title ??
            `${t('item.inventoryLabel')}: ${item.inventoryId}`}
        </Typography>

        {/* Main title */}
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{
            fontSize: { xs: '1rem', sm: '1.25rem' },
            lineHeight: 1.2,
            wordBreak: 'break-word',
          }}
        >
          {item.customId}
        </Typography>

        {/* Item ID */}
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            wordBreak: 'break-all',
            fontSize: { xs: '0.7rem', sm: '0.75rem' },
          }}
        >
          {t('item.itemId')}: {item.id}
        </Typography>
      </Stack>
    </Panel>
  )
}