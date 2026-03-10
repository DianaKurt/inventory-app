import { Box, TextField, Typography } from '@mui/material'

type Props = {
  value: string
  onChange: (next: string) => void
  label?: string
  placeholder?: string
}

export default function MarkdownEditor({
  value,
  onChange,
  label = 'Markdown',
  placeholder = 'Write text...',
}: Props) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        multiline
        minRows={6}
        fullWidth
      />
    </Box>
  )
}
