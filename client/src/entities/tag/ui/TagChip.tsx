import Chip from '@mui/material/Chip'
import type { Tag } from '../model/tag.types'

type Props = {
  tag: Tag
  onDelete?: (tag: Tag) => void
  size?: 'small' | 'medium'
}

export default function TagChip({ tag, onDelete, size = 'small' }: Props) {
  return (
    <Chip
      label={tag.name}
      size={size}
      onDelete={onDelete ? () => onDelete(tag) : undefined}
    />
  )
}
