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
import PublicInventoriesTable from './ui/PublicInventoriesTable'

export default function UserPage() {
  const { t } = useTranslation('common')

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 2, sm: 4 },
        backgroundColor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 2, md: 3 }}>
          <Stack spacing={0.4}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                lineHeight: 1.2,
                wordBreak: 'break-word',
              }}
            >
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
              p: { xs: 1.5, md: 2 },
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
              backgroundColor: theme.palette.background.paper,
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
                    flexShrink: 0,
                  })}
                >
                  <Inventory2RoundedIcon fontSize="small" />
                </Box>

                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ wordBreak: 'break-word' }}
                >
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
              p: { xs: 1.5, md: 2 },
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
              backgroundColor: theme.palette.background.paper,
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
                <Typography
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ wordBreak: 'break-word' }}
                >
                  {t('workspace.shared')}
                </Typography>
              </Stack>

              <Divider sx={{ opacity: 0.6 }} />

              <WriteAccessInventoriesTable />
            </Stack>
          </Paper>
          {/* Public Section */}
          <Paper
          elevation={0} sx={(theme) => ({
            p: { xs: 1.5, md: 2 },
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
            backgroundColor: theme.palette.background.paper,
            transition: 'all .2s ease',
            '&:hover': {
              borderColor: alpha(theme.palette.info.main, 0.35),
              boxShadow: '0 12px 35px rgba(0,0,0,0.05)',
            },
            })}
            >
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={(theme) => ({
                    width: 28,
                    height: 28,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: alpha(theme.palette.info.main, 0.12),
                    color: theme.palette.info.main,
                    flexShrink: 0,
                  })}
                  >
                    <Inventory2RoundedIcon fontSize="small" />
                 </Box>
                 <Typography
                 variant="subtitle2"
                 fontWeight={700}
                 sx={{ wordBreak: 'break-word' }}
                 >
                  {t('workspace.publicInventories')}
                 </Typography>
                </Stack>
                <Divider sx={{ opacity: 0.6 }} />
                <PublicInventoriesTable />
              </Stack>
          </Paper>
        
        </Stack>
      </Container>
    </Box>
  )
}
