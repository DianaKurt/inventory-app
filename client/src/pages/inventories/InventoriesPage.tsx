import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  alpha,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import { useNavigate } from 'react-router-dom'
import InventoriesTable from './ui/InventoriesTable'
import { useTranslation } from 'react-i18next'

export default function InventoriesPage() {
  const navigate = useNavigate()
  const { t } = useTranslation('common')

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        py: 8,
        background: `
                  radial-gradient(circle at 12% 0%, ${alpha(theme.palette.primary.main, 0.12)}, transparent 45%),
                  radial-gradient(circle at 88% 0%, ${alpha(theme.palette.secondary.main, 0.12)}, transparent 50%),
                  linear-gradient(to bottom, ${alpha(theme.palette.background.default, 1)}, ${alpha(theme.palette.background.default, 0.92)} 50%, ${alpha(theme.palette.background.default, 1)})
                `,
      })}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ md: 'center' }}
          spacing={4}
          sx={{ mb: 6 }}
        >
          <Stack direction="row" spacing={2.5} alignItems="center">
            <Box
              sx={(theme) => ({
                width: 56,
                height: 56,
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: '#fff',
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              })}
            >
              <Inventory2RoundedIcon fontSize="medium" />
            </Box>

            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, letterSpacing: 0.3 }}
              >
              {t('inventories.pageTitle')}
              </Typography>

              <Typography
                sx={{ mt: 0.5 }}
                color="text.secondary"
              >
              {t('inventories.pageSubtitle')}
              </Typography>
            </Box>
          </Stack>

          <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          size="large"
          onClick={() => navigate('/inventories/new')}
          sx={(theme) => ({
            borderRadius: 999,
            px: 3,
            py: 1.25,
            textTransform: 'none',
            fontWeight: 800,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
            transition: 'all .2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 16px 40px rgba(0,0,0,0.16)',
            },
            })}
            >
              {t('inventories.createInventory')}
              </Button>
        </Stack>

        {/* Table Card */}
        <Paper
          elevation={0}
          sx={(theme) => ({
            p: 4,
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.05)',
          })}
        >
          <InventoriesTable />
        </Paper>
      </Container>
    </Box>
  )
}