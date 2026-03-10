import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@mui/material'
import type { InventoryId } from '../model/inventory.types'

export default function InventoryLink({
  id,
  children,
}: {
  id: InventoryId
  children: React.ReactNode
}) {
  return (
    <Link component={RouterLink} to={`/inventories/${id}`}>
      {children}
    </Link>
  )
}
