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
  Drawer,
} from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'

import GlobalSearchInput from '@/features/fulltext-search/ui/GlobalSearchInput'
import LanguageToggle from '@/features/preferences/ui/LanguageToggle'
import ThemeToggle from '@/features/preferences/ui/ThemeToggle'
import SupportTicketDialog from '@/features/support-ticket/ui/SupportTicketDialog'
import { useAuth } from '@/app/providers/AuthProvider'

export default function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useTranslation('common')

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)

  const open = Boolean(anchorEl)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => setAnchorEl(null)

  const handleOpenSupport = () => {
    setSupportOpen(true)
  }

  const handleCloseSupport = () => {
    setSupportOpen(false)
  }

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={(theme) => ({
          backdropFilter: 'blur(16px)',
          background: alpha(theme.palette.background.default, 0.82),
          borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
          color: theme.palette.text.primary,
        })}
      >
        <Toolbar
          sx={{
            maxWidth: 1200,
            mx: 'auto',
            width: '100%',
            py: 1.25,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%' }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ cursor: 'pointer', minWidth: 0 }}
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
                  flexShrink: 0,
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
                  lineHeight: 1.2,
                  wordBreak: 'break-word',
                }}
              >
                {t('app.title')}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={0.5}
              alignItems="center"
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <IconButton onClick={handleOpenSupport}>
                <HelpOutlineRoundedIcon />
              </IconButton>

              <IconButton onClick={() => setMobileOpen(true)}>
                <MenuRoundedIcon />
              </IconButton>
            </Stack>

            <Stack
              direction="row"
              spacing={1.25}
              alignItems="center"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <NavButton to="/" label={t('nav.home')} />
              <NavButton to="/inventories" label={t('nav.inventories')} />

              <IconButton onClick={handleOpenSupport}>
                <HelpOutlineRoundedIcon />
              </IconButton>

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
                    px: 3,
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
                    onClick={handleOpenMenu}
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

                  <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
                    <MenuItem
                      onClick={() => {
                        handleCloseMenu()
                        navigate('/user')
                      }}
                    >
                      {t('nav.workspace')}
                    </MenuItem>

                    {user.role === 'ADMIN' && (
                      <MenuItem
                        onClick={() => {
                          handleCloseMenu()
                          navigate('/admin')
                        }}
                      >
                        {t('nav.admin')}
                      </MenuItem>
                    )}

                    <Divider />

                    <MenuItem
                      onClick={() => {
                        handleCloseMenu()
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
          </Stack>

          <Box sx={{ width: '100%' }}>
            <Box
              sx={{
                maxWidth: { xs: '100%', md: 520 },
              }}
            >
              <GlobalSearchInput />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Stack spacing={1.5}>
            <Button
              onClick={() => {
                navigate('/')
                setMobileOpen(false)
              }}
              sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
            >
              {t('nav.home')}
            </Button>

            <Button
              onClick={() => {
                navigate('/inventories')
                setMobileOpen(false)
              }}
              sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
            >
              {t('nav.inventories')}
            </Button>

            <Button
              onClick={() => {
                handleOpenSupport()
                setMobileOpen(false)
              }}
              sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
            >
              Help
            </Button>

            <Divider />

            <LanguageToggle />
            <ThemeToggle />

            {!user ? (
              <Button
                component={NavLink}
                to="/auth/sign-in"
                variant="contained"
                startIcon={<LoginRoundedIcon />}
                onClick={() => setMobileOpen(false)}
                sx={{ textTransform: 'none' }}
              >
                {t('nav.signIn')}
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    navigate('/user')
                    setMobileOpen(false)
                  }}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  {t('nav.workspace')}
                </Button>

                {user.role === 'ADMIN' && (
                  <Button
                    onClick={() => {
                      navigate('/admin')
                      setMobileOpen(false)
                    }}
                    sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                  >
                    {t('nav.admin')}
                  </Button>
                )}

                <Button
                  color="error"
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none' }}
                >
                  {t('nav.logout')}
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Drawer>

      <SupportTicketDialog
      open={supportOpen}
      onClose={handleCloseSupport}
      reportedBy={{
        id: user?.id ?? 'guest',
        name: user?.email ?? user?.email ?? 'Guest',
        email: user?.email ?? 'guest@example.com',
      }}
      inventory={null}
      adminEmails={['admin@example.com']}
      />
    </>
  )
}

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