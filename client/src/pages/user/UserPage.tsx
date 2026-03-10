import {
  Container,
  Stack,
  Typography,
  Box,
  Paper,
  alpha,
  Divider,
} from '@mui/material'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'

import OwnedInventoriesTable from './ui/OwnedInventoriesTable'
import WriteAccessInventoriesTable from './ui/WriteAccessInventoriesTable'
import { useTranslation } from 'react-i18next'

export default function UserPage() {
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
        <Stack spacing={3}>
          <Stack spacing={0.4}>
            <Typography variant="h5" fontWeight={800}>
              {t('workspace.title')}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t('workspace.subtitle')}
            </Typography>
          </Stack>

          {/* Owned Section */}
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: 2,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(8px)',
              transition: 'all .2s ease',
              '&:hover': {
                borderColor: alpha(theme.palette.primary.main, 0.35),
                boxShadow: '0 12px 35px rgba(0,0,0,0.05)',
              },
            })}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box
                  sx={(theme) => ({
                    width: 28,
                    height: 28,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(theme.palette.primary.main, 0.12),
                    color: theme.palette.primary.main,
                  })}
                >
                  <Inventory2RoundedIcon fontSize="small" />
                </Box>

                <Typography variant="subtitle2" fontWeight={700}>
                  {t('workspace.owned')}
                </Typography>
              </Stack>

              <Divider sx={{ opacity: 0.6 }} />

              <OwnedInventoriesTable />
            </Stack>
          </Paper>

          {/* Shared Section */}
          <Paper
            elevation={0}
            sx={(theme) => ({
              p: 2,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(8px)',
              transition: 'all .2s ease',
              '&:hover': {
                borderColor: alpha(theme.palette.secondary.main, 0.35),
                boxShadow: '0 12px 35px rgba(0,0,0,0.05)',
              },
            })}
          >
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={1} alignItems="center">
                <EditRoundedIcon fontSize="small" />
                <Typography variant="subtitle2" fontWeight={700}>
                  {t('workspace.shared')}
                </Typography>
              </Stack>

              <Divider sx={{ opacity: 0.6 }} />

              <WriteAccessInventoriesTable />
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  )
}