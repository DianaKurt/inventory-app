import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@mui/material'
import type { ItemId, InventoryId } from '../model/item.types'

export default function ItemLink({
  inventoryId,
  id,
  children,
}: {
  inventoryId: InventoryId
  id: ItemId
  children: React.ReactNode
}) {
  return (
    <Link component={RouterLink} to={`/inventories/${inventoryId}?tab=items&item=${id}`}>
      {children}
    </Link>
  )
}
