import { Box, Typography } from '@mui/material'

type Props = {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: Props) {
  return (
    <Box sx={{ p: 4, textAlign: 'center', opacity: 0.8 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {description ? <Typography variant="body2">{description}</Typography> : null}
    </Box>
  )
}

