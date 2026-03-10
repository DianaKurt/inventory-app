import { useState } from 'react'
import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
  Box,
  alpha,
} from '@mui/material'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import { useNavigate } from 'react-router-dom'
import { useLogin } from '../model/useLogin'

export default function SignInForm() {
  const nav = useNavigate()
  const login = useLogin()

  const [email, setEmail] = useState('admin@local')
  const [password, setPassword] = useState('admin123')

  const error = login.error instanceof Error ? login.error.message : null

  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        borderRadius: 2,
        border: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
        overflow: 'hidden',
        backgroundColor: alpha(theme.palette.background.paper, 0.92),
        backdropFilter: 'blur(10px)',
        boxShadow: '0 18px 50px rgba(0,0,0,0.06)',
      })}
    >
      {/* Header strip */}
      <Box
        sx={(theme) => ({
          px: { xs: 2.5, sm: 3.5 },
          py: { xs: 2, sm: 2.5 },
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.18)}, ${alpha(
            theme.palette.secondary.main,
            0.14,
          )})`,
          borderBottom: `1px solid ${alpha(theme.palette.text.primary, 0.09)}`,
        })}
      >
        <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.15 }}>
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Sign in to continue
        </Typography>
      </Box>

      <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
        <Stack spacing={2.2}>
          {error ? (
            <Alert
              severity="error"
              sx={(theme) => ({
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.error.main, 0.25)}`,
              })}
            >
              {error}
            </Alert>
          ) : null}

          <Stack
            component="form"
            spacing={2}
            onSubmit={(e) => {
              e.preventDefault()
              login.mutate({ email, password }, { onSuccess: () => nav('/user') })
            }}
          >
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              fullWidth
              autoComplete="email"
            />

            <TextField
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              fullWidth
              autoComplete="current-password"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={login.isPending}
              startIcon={<LoginRoundedIcon />}
              sx={(theme) => ({
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 800,
                py: 1.1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                transition: 'transform .18s ease, box-shadow .18s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 16px 34px rgba(0,0,0,0.16)',
                },
              })}
            >
              {login.isPending ? 'Signing in…' : 'Sign in'}
            </Button>
          </Stack>

          <Divider sx={{ opacity: 0.7 }} />

          <Typography variant="body2" color="text.secondary" textAlign="center">
            Don’t have an account?{' '}
            <Button
              variant="text"
              onClick={() => nav('/auth/sign-up')}
              sx={{
                px: 0.5,
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
              }}
            >
              Sign up
            </Button>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}