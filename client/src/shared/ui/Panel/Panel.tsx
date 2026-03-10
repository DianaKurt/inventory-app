import { Paper } from '@mui/material'
import type { PropsWithChildren } from 'react'

export default function Panel({ children }: PropsWithChildren) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: 'background.paper',
      }}
    >
      {children}
    </Paper>
  )
}