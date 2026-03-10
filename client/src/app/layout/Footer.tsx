import { Box, Typography, Divider } from '@mui/material'

export default function Footer() {
  return (
    <Box sx={{ mt: 6 }}>
      <Divider />

      <Box
        sx={{
          py: 3,
          textAlign: 'center',
          color: 'text.secondary',
          fontSize: 14,
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} 
           Inventory App. All rights reserved. By Diana S
        </Typography>
      </Box>
    </Box>
  )
}