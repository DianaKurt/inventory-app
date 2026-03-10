import { Box, Typography, Button, Stack } from '@mui/material'

type Props = {
  title: string
  selectedCount: number
  onClear: () => void
  actions?: React.ReactNode
}

export default function TableActionToolbar({
  title,
  selectedCount,
  onClear,
  actions,
}: Props) {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 2,
        py: 1.25,
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
      })}
    >
      <Stack spacing={0.2}>
        <Typography fontWeight={800}>{title}</Typography>
        {selectedCount > 0 ? (
          <Typography variant="body2" color="text.secondary">
            Selected: {selectedCount}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Select rows to enable actions
          </Typography>
        )}
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        {selectedCount > 0 && (
          <Button variant="outlined" onClick={onClear}>
            Clear
          </Button>
        )}
        {actions}
      </Stack>
    </Box>
  )
}