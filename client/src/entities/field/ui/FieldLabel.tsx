import { Chip, Tooltip } from '@mui/material'
import TextFieldsOutlinedIcon from '@mui/icons-material/TextFieldsOutlined'
import SubjectOutlinedIcon from '@mui/icons-material/SubjectOutlined'
import NumbersOutlinedIcon from '@mui/icons-material/NumbersOutlined'
import ToggleOnOutlinedIcon from '@mui/icons-material/ToggleOnOutlined'
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined'
import type { FieldType } from '../model/field.types'

type FieldTypeMeta = {
  label: string
  description: string
  color: 'default' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'
  icon: React.ReactElement
}

const FIELD_TYPE_META: Record<FieldType, FieldTypeMeta> = {
  singleLine: {
    label: 'Single line',
    description: 'Short text (e.g., Name, SKU)',
    color: 'info',
    icon: <TextFieldsOutlinedIcon fontSize="small" />,
  },
  multiLine: {
    label: 'Long text',
    description: 'Paragraph / description',
    color: 'secondary',
    icon: <SubjectOutlinedIcon fontSize="small" />,
  },
  number: {
    label: 'Number',
    description: 'Numeric value (e.g., Quantity, Price)',
    color: 'warning',
    icon: <NumbersOutlinedIcon fontSize="small" />,
  },
  boolean: {
    label: 'Yes/No',
    description: 'Toggle on/off',
    color: 'success',
    icon: <ToggleOnOutlinedIcon fontSize="small" />,
  },
  link: {
    label: 'Link',
    description: 'URL or reference',
    color: 'primary',
    icon: <LinkOutlinedIcon fontSize="small" />,
  },
}

export default function FieldLabel({
  type,
  compact = false,
}: {
  type: FieldType
  compact?: boolean
}) {
  const meta = FIELD_TYPE_META[type]

  return (
    <Tooltip arrow title={meta.description}>
      <Chip
        size={compact ? 'small' : 'medium'}
        icon={meta.icon}
        label={meta.label}
        color={meta.color}
        variant="outlined"
        sx={{
          fontWeight: 600,
          borderRadius: 999,
          '& .MuiChip-icon': { ml: 0.75 },
        }}
      />
    </Tooltip>
  )
}