import { Outlet } from 'react-router-dom'
import { Box, Grid } from '@mui/material'

export default function AuthLayout() {
  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      
      {/* left */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: { xs: 3, md: 8 },
          py: 6,
          backgroundColor: 'background.default',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Outlet />
        </Box>
      </Grid>

      {/* right */}
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          display: { xs: 'none', md: 'block' },
          backgroundImage:
  'url(https://images.unsplash.com/photo-1492724441997-5dc865305da7)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </Grid>
  )
}