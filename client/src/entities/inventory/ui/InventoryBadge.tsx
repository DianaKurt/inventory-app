import { Chip } from '@mui/material'

export default function InventoryBadge({ label }: { label: string }) {
  return <Chip size="small" label={label} />
}
