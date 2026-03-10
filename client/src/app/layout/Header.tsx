import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  alpha,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Box,
} from '@mui/material'

import GlobalSearchInput from '@/features/fulltext-search/ui/GlobalSearchInput'
import LanguageToggle from '@/features/preferences/ui/LanguageToggle'
import ThemeToggle from '@/features/preferences/ui/ThemeToggle'

import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'

import { useAuth } from '@/app/providers/AuthProvider'
import { useTranslation } from 'react-i18next'

export default function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useTranslation('common')


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={(theme) => ({
        backdropFilter: 'blur(16px)',
        background: alpha(theme.palette.background.default, 0.75),
        borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
        color: theme.palette.text.primary,
      })}
    >
      <Toolbar
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          width: '100%',
          py: 1.5,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* Logo */}
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <Box
            sx={(theme) => ({
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: '#fff',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            })}
          >
            <Inventory2RoundedIcon fontSize="small" />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: 0.4,
              fontSize: { xs: 16, sm: 20 },
            }}
          >
          {t('app.title')}
          </Typography>
        </Stack>

        {/* Search */}
        <Stack
          sx={{
            flexGrow: 1,
            mx: { xs: 0, sm: 3 },
            width: { xs: '100%', sm: 'auto' },
            maxWidth: { xs: '100%', sm: 520 },
            order: { xs: 3, sm: 0 },
          }}
        >
          <GlobalSearchInput />
        </Stack>

        {/* Navigation */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <NavButton to="/" label={t('nav.home')} />
          <NavButton to="/inventories" label={t('nav.inventories')} />

          <LanguageToggle />
          <ThemeToggle />

          {!user && (
            <Button
              component={NavLink}
              to="/auth/sign-in"
              variant="contained"
              startIcon={<LoginRoundedIcon />}
              sx={(theme) => ({
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                px: 3.5,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                transition: 'all .2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 14px 35px rgba(0,0,0,0.18)',
                },
              })}
            >
              {t('nav.signIn')}
            </Button>
          )}

          {user && (
            <>
              <IconButton
                onClick={handleOpen}
                sx={{
                  p: 0.5,
                  transition: 'transform .2s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              >
                <Avatar
                  sx={(theme) => ({
                    width: 36,
                    height: 36,
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  })}
                >
                  {user.email?.[0]?.toUpperCase()}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    handleClose()
                    navigate('/user')
                  }}
                >
                  {t('nav.workspace')}
                </MenuItem>

                {user.role === 'ADMIN' && (
                  <MenuItem
                    onClick={() => {
                      handleClose()
                      navigate('/admin')
                    }}
                  >
                    {t('nav.admin')}
                  </MenuItem>
                )}

                <Divider />

                <MenuItem
                  onClick={() => {
                    handleClose()
                    logout()
                  }}
                  sx={{ color: 'error.main', fontWeight: 600 }}
                >
                  {t('nav.logout')}
                </MenuItem>
              </Menu>
            </>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

/* Nav button */
function NavButton({ to, label }: { to: string; label: string }) {
  return (
    <Button
      component={NavLink}
      to={to}
      sx={({ isActive }: any) => ({
        position: 'relative',
        fontWeight: isActive ? 700 : 500,
        textTransform: 'none',
        borderRadius: 2,
        px: 2.5,
        transition: 'all .2s ease',
        color: isActive ? 'primary.main' : 'text.primary',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        '&::after': isActive
          ? {
              content: '""',
              position: 'absolute',
              bottom: 4,
              left: '20%',
              width: '60%',
              height: 3,
              borderRadius: 2,
              background: 'linear-gradient(90deg, #1976d2, #9c27b0)',
            }
          : {},
      })}
    >
      {label}
    </Button>
  )
}