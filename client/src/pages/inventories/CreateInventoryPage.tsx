import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  TextField,
  Button,
  Stack,
  Typography,
  Paper,
  FormControlLabel,
  Switch,
  Alert,
  Divider,
  alpha,
  Box,
} from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { apiPost } from '@/shared/api/http'

export default function CreateInventoryPage() {
  const { t } = useTranslation('common')
  const navigate = useNavigate()
  const qc = useQueryClient()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)

  const [formError, setFormError] = useState<string | null>(null)

  const create = useMutation({
    mutationFn: () =>
      apiPost('/inventories', {
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        isPublic,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['inventories'] })
      navigate('/inventories')
    },
    onError: (err: any) => {
      setFormError(err?.message ?? t('errors.failedToCreateInventory'))
    },
  })

  const handleSubmit = () => {
    setFormError(null)

    if (!title.trim()) {
      setFormError(t('validation.titleRequired'))
      return
    }

    if (!category.trim()) {
      setFormError(t('validation.categoryRequired'))
      return
    }

    create.mutate()
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 8 }}>
      <Paper
        elevation={0}
        sx={(theme) => ({
          p: 4,
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
          background: alpha(theme.palette.background.paper, 0.92),
          boxShadow: '0 18px 50px rgba(0,0,0,0.05)',
        })}
      >
        <Stack spacing={3}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={(theme) => ({
                width: 42,
                height: 42,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                color: '#fff',
              })}
            >
              <Inventory2RoundedIcon fontSize="small" />
            </Box>

            <Box>
              <Typography variant="h5" fontWeight={800}>
                {t('inventories.createPageTitle')}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {t('inventories.createPageSubtitle')}
              </Typography>
            </Box>
          </Stack>

          <Divider />

          {formError && <Alert severity="error">{formError}</Alert>}

          <TextField
            label={t('table.title')}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label={t('table.category')}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label={t('inventories.description')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />

          <FormControlLabel
            control={
              <Switch
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            }
            label={t('inventories.publicInventory')}
          />

          <Stack direction="row" spacing={1.2} justifyContent="flex-end" useFlexGap flexWrap="wrap">
            <Button
              variant="outlined"
              onClick={() => navigate('/inventories')}
              disabled={create.isPending}
              startIcon={<ArrowBackRoundedIcon />}
              sx={(theme) => ({
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 700,
                px: 2.2,
                borderColor: alpha(theme.palette.text.primary, 0.16),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.text.primary, 0.04),
                  transform: 'translateY(-1px)',
                },
              })}
            >
              {t('actions.cancel')}
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={create.isPending}
              startIcon={<AddRoundedIcon />}
              sx={(theme) => ({
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 800,
                px: 2.6,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: '0 14px 30px rgba(0,0,0,0.16)',
                },
              })}
            >
              {create.isPending ? t('actions.creating') : t('actions.create')}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  )
}