import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import Panel from '@/shared/ui/Panel/Panel'

type ItemDetails = {
  id: string
  inventoryId: string
  customId: string
  inventory?: { id: string; title: string; category: string | null; isPublic: boolean }
}

export default function ItemHeader({ item }: { item: ItemDetails }) {
  const { t } = useTranslation('common')

  return (
    <Panel>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          {item.inventory?.title ?? `${t('item.inventoryLabel')}: ${item.inventoryId}`}
        </Typography>

        <Typography variant="h6" fontWeight={700}>
          {item.customId}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {t('item.itemId')}: {item.id}
        </Typography>
      </Stack>
    </Panel>
  )
}