import {
  Container,
  Typography,
  Grid,
  Box,
  Paper,
  Stack,
  alpha,
} from '@mui/material'
import TagCloudSection from './ui/TagCloudSection'
import LatestInventoriesTable from './ui/LatestInventoriesTable'
import TopInventoriesTable from './ui/TopInventoriesTable'
import { useTranslation } from 'react-i18next'

export default function HomePage() {
   const { t } = useTranslation('common')
  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        py: { xs: 3, sm: 4 }, 
        background: `
                  radial-gradient(circle at 12% 0%, ${alpha(theme.palette.primary.main, 0.12)}, transparent 45%),
                  radial-gradient(circle at 88% 0%, ${alpha(theme.palette.secondary.main, 0.12)}, transparent 50%),
                  linear-gradient(to bottom, ${alpha(theme.palette.background.default, 1)}, ${alpha(theme.palette.background.default, 0.92)} 50%, ${alpha(theme.palette.background.default, 1)})
                `,
      })}
    >
      <Container maxWidth="lg">
        {/* Hero */}
        <Stack spacing={0.5} sx={{ mb: { xs: 2.5, sm: 3 } }}>
          <Typography
            variant="h4" 
            sx={{ fontWeight: 800, letterSpacing: 0.2, lineHeight: 1.15 }}
          >
            {t('home.dashboardTitle')}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ maxWidth: 560 }}
          >
            {t('home.dashboardSubtitle')}

          </Typography>
        </Stack>

        {/* Tags Section */}
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 2, sm: 2.5 },
            mb: { xs: 2.5, sm: 3 }, 
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.92), 
            boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
          })}
        >
          <TagCloudSection />
        </Paper>

        {/* Tables */}
        <Grid container spacing={{ xs: 2, sm: 2.5 }}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={(theme) => ({
                p: { xs: 2, sm: 2.5 }, 
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.92),
                boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
                transition: 'transform .18s ease, box-shadow .18s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.06)',
                },
              })}
            >
              <LatestInventoriesTable />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={(theme) => ({
                p: { xs: 2, sm: 2.5 },
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
                backgroundColor: alpha(theme.palette.background.paper, 0.92),
                boxShadow: '0 12px 30px rgba(0,0,0,0.04)',
                transition: 'transform .18s ease, box-shadow .18s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.06)',
                },
              })}
            >
              <TopInventoriesTable />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}