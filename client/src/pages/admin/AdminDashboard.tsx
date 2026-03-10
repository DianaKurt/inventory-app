import { Box, Container, Paper, Stack, Typography, alpha } from '@mui/material'
import { useTranslation } from 'react-i18next'

import AdminStatsSection from './ui/AdminStatsSection'
import UsersTable from './ui/UsersTable'

export default function AdminDashboard() {
  const { t } = useTranslation('common')

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        py: { xs: 4, sm: 5 },
        background: `
          radial-gradient(circle at 12% 0%, ${alpha(theme.palette.primary.main, 0.12)}, transparent 45%),
          radial-gradient(circle at 88% 0%, ${alpha(theme.palette.secondary.main, 0.12)}, transparent 50%),
          linear-gradient(
            to bottom,
            ${alpha(theme.palette.background.default, 1)},
            ${alpha(theme.palette.background.default, 0.92)} 50%,
            ${alpha(theme.palette.background.default, 1)}
          )
        `,
      })}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          {/* Header */}
          <Stack spacing={0.8}>
            <Typography variant="h5" fontWeight={800}>
              {t('admin.title')}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 620 }}
            >
              {t('admin.subtitle')}
            </Typography>
          </Stack>

          {/* Stats */}
          <AdminStatsSection />

          {/* Users table card */}
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: { xs: 2, sm: 3 },
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
              background: alpha(theme.palette.background.paper, 0.88),
              backdropFilter: 'blur(10px)',
              boxShadow: '0 18px 60px rgba(0,0,0,0.06)',
            })}
          >
            <UsersTable />
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}