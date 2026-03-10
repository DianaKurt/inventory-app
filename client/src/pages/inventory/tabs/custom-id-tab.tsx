import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Stack,
  Typography,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  Divider,
  Chip,
  IconButton,
  alpha,
  Box,
} from '@mui/material'
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded'
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import TextFieldsRoundedIcon from '@mui/icons-material/TextFieldsRounded'
import PinRoundedIcon from '@mui/icons-material/PinRounded'
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded'
import { useTranslation } from 'react-i18next'
import Panel from '@/shared/ui/Panel/Panel'
import { apiGet, apiPatch } from '@/shared/api/http'

type Part =
  | { kind: 'text'; value: string }
  | { kind: 'seq'; pad?: number }
  | { kind: 'rand'; len?: number }

type InventoryDetails = {
  id: string
  version: number
  customIdFormat: Part[]
  customIdSeq: number
}

function padLeft(n: number, width: number) {
  const s = String(n)
  return s.length >= width ? s : '0'.repeat(width - s.length) + s
}

function randDigits(len: number) {
  let out = ''
  for (let i = 0; i < len; i++) out += String(Math.floor(Math.random() * 10))
  return out
}

function preview(format: Part[], seq: number) {
  return format
    .map((p) => {
      if (p.kind === 'text') return p.value
      if (p.kind === 'seq') return padLeft(seq, p.pad ?? 4)
      if (p.kind === 'rand') return randDigits(p.len ?? 6)
      return ''
    })
    .join('')
}

export default function CustomIdTab() {
  const { t } = useTranslation('common')
  const { inventoryId } = useParams()
  const qc = useQueryClient()

  const [toast, setToast] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['inventory', inventoryId, 'customId'],
    enabled: Boolean(inventoryId),
    queryFn: () => apiGet<InventoryDetails>(`/inventories/${inventoryId}`),
  })

  const [format, setFormat] = useState<Part[]>([])
  const [version, setVersion] = useState<number>(1)

  useEffect(() => {
    if (!data) return
    setFormat((data.customIdFormat ?? []) as Part[])
    setVersion(data.version)
  }, [data?.id, data?.version])

  const example = useMemo(
    () =>
      preview(
        format.length
          ? format
          : [{ kind: 'text', value: 'INV-' }, { kind: 'seq', pad: 4 }],
        data?.customIdSeq ?? 1,
      ),
    [format, data?.customIdSeq],
  )

  const save = useMutation({
    mutationFn: async () => {
      if (!inventoryId) throw new Error('No inventoryId')
      return apiPatch(`/inventories/${inventoryId}/custom-id`, {
        version,
        customIdFormat: format,
      })
    },
    onSuccess: async (out: any) => {
      setToast(t('customId.saved'))
      await qc.invalidateQueries({ queryKey: ['inventory', inventoryId] })
      await qc.invalidateQueries({ queryKey: ['inventory', inventoryId, 'customId'] })
      if (out?.version) setVersion(out.version)
    },
    onError: (e: any) => {
      if (e?.status === 409) setToast(t('customId.conflict'))
      else setToast(e?.message ?? t('errors.failedToSave'))
    },
  })

  const addText = () => setFormat((p) => [...p, { kind: 'text', value: 'INV-' }])
  const addSeq = () => setFormat((p) => [...p, { kind: 'seq', pad: 4 }])
  const addRand = () => setFormat((p) => [...p, { kind: 'rand', len: 6 }])

  const move = (idx: number, dir: -1 | 1) => {
    setFormat((prev) => {
      const next = [...prev]
      const j = idx + dir
      if (j < 0 || j >= next.length) return prev
      ;[next[idx], next[j]] = [next[j], next[idx]]
      return next
    })
  }

  const remove = (idx: number) => setFormat((prev) => prev.filter((_, i) => i !== idx))

  if (isLoading) {
    return (
      <Panel>
        <Typography>{t('common.loading')}</Typography>
      </Panel>
    )
  }

  if (isError || !data) {
    return (
      <Panel>
        <Alert severity="error">{t('errors.failedToLoad')}</Alert>
      </Panel>
    )
  }

  return (
    <Panel>
      <Stack spacing={3}>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={800}>
            {t('customId.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('customId.subtitle')}
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={(theme) => ({
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor: alpha(theme.palette.background.paper, 0.92),
            boxShadow: '0 14px 36px rgba(0,0,0,0.04)',
          })}
        >
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                variant="outlined"
                startIcon={<TextFieldsRoundedIcon />}
                onClick={addText}
                sx={(theme) => ({
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2,
                  borderColor: alpha(theme.palette.primary.main, 0.22),
                  backgroundColor: alpha(theme.palette.primary.main, 0.03),
                  '&:hover': {
                    borderColor: alpha(theme.palette.primary.main, 0.4),
                    backgroundColor: alpha(theme.palette.primary.main, 0.07),
                  },
                })}
              >
                {t('customId.addText')}
              </Button>

              <Button
                variant="outlined"
                startIcon={<PinRoundedIcon />}
                onClick={addSeq}
                sx={(theme) => ({
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2,
                  borderColor: alpha(theme.palette.secondary.main, 0.22),
                  backgroundColor: alpha(theme.palette.secondary.main, 0.03),
                  '&:hover': {
                    borderColor: alpha(theme.palette.secondary.main, 0.4),
                    backgroundColor: alpha(theme.palette.secondary.main, 0.07),
                  },
                })}
              >
                {t('customId.addSeq')}
              </Button>

              <Button
                variant="outlined"
                startIcon={<NumbersRoundedIcon />}
                onClick={addRand}
                sx={(theme) => ({
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 2,
                  borderColor: alpha(theme.palette.success.main, 0.22),
                  backgroundColor: alpha(theme.palette.success.main, 0.03),
                  '&:hover': {
                    borderColor: alpha(theme.palette.success.main, 0.4),
                    backgroundColor: alpha(theme.palette.success.main, 0.07),
                  },
                })}
              >
                {t('customId.addRandom')}
              </Button>
            </Stack>

            <Divider />

            <Stack spacing={1.2}>
              {format.length === 0 ? (
                <Alert severity="info">{t('customId.emptyFormat')}</Alert>
              ) : (
                format.map((p, idx) => (
                  <Paper
                    key={idx}
                    elevation={0}
                    sx={(theme) => ({
                      p: 2,
                      borderRadius: 3,
                      border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                      backgroundColor: alpha(theme.palette.background.default, 0.55),
                      transition: 'transform .16s ease, box-shadow .16s ease',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 8px 18px rgba(0,0,0,0.04)',
                      },
                    })}
                  >
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      spacing={1.5}
                      alignItems={{ sm: 'center' }}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                        <Chip
                          label={p.kind}
                          variant="outlined"
                          sx={{ borderRadius: 999, fontWeight: 700 }}
                        />

                        {p.kind === 'text' && (
                          <TextField
                            size="small"
                            label={t('customId.value')}
                            value={p.value}
                            onChange={(e) =>
                              setFormat((prev) =>
                                prev.map((x, i) =>
                                  i === idx ? { kind: 'text', value: e.target.value } : x,
                                ),
                              )
                            }
                          />
                        )}

                        {p.kind === 'seq' && (
                          <TextField
                            size="small"
                            label={t('customId.pad')}
                            type="number"
                            value={p.pad ?? 4}
                            onChange={(e) =>
                              setFormat((prev) =>
                                prev.map((x, i) =>
                                  i === idx
                                    ? { kind: 'seq', pad: Number(e.target.value) || 0 }
                                    : x,
                                ),
                              )
                            }
                            sx={{ width: 110 }}
                          />
                        )}

                        {p.kind === 'rand' && (
                          <TextField
                            size="small"
                            label={t('customId.len')}
                            type="number"
                            value={p.len ?? 6}
                            onChange={(e) =>
                              setFormat((prev) =>
                                prev.map((x, i) =>
                                  i === idx
                                    ? { kind: 'rand', len: Number(e.target.value) || 0 }
                                    : x,
                                ),
                              )
                            }
                            sx={{ width: 110 }}
                          />
                        )}
                      </Stack>

                      <Stack direction="row" spacing={0.75}>
                        <IconButton
                          onClick={() => move(idx, -1)}
                          sx={(theme) => ({
                            borderRadius: 2.5,
                            border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                            },
                          })}
                        >
                          <ArrowUpwardRoundedIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          onClick={() => move(idx, 1)}
                          sx={(theme) => ({
                            borderRadius: 2.5,
                            border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                            backgroundColor: alpha(theme.palette.background.paper, 0.9),
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover,
                            },
                          })}
                        >
                          <ArrowDownwardRoundedIcon fontSize="small" />
                        </IconButton>

                        <IconButton
                          color="error"
                          onClick={() => remove(idx)}
                          sx={(theme) => ({
                            borderRadius: 2.5,
                            border: `1px solid ${alpha(theme.palette.error.main, 0.18)}`,
                            backgroundColor: alpha(theme.palette.error.main, 0.04),
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                            },
                          })}
                        >
                          <DeleteRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Paper>
                ))
              )}
            </Stack>

            <Divider />

            <Box
              sx={(theme) => ({
                p: 2,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.06)}, ${alpha(
                  theme.palette.secondary.main,
                  0.05,
                )})`,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
              })}
            >
              <Stack spacing={1}>
                <Typography fontWeight={700}>
                  {t('customId.preview')}
                </Typography>
                <Chip
                  label={example}
                  variant="filled"
                  sx={(theme) => ({
                    alignSelf: 'flex-start',
                    borderRadius: 999,
                    fontWeight: 700,
                    px: 0.75,
                    backgroundColor: alpha(theme.palette.background.paper, 0.95),
                  })}
                />
              </Stack>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              disabled={save.isPending || format.length === 0}
              onClick={() => save.mutate()}
              sx={(theme) => ({
                borderRadius: 999,
                textTransform: 'none',
                alignSelf: 'flex-start',
                fontWeight: 800,
                px: 3,
                py: 1,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
                '&:hover': {
                  boxShadow: '0 16px 34px rgba(0,0,0,0.16)',
                },
              })}
            >
              {save.isPending ? t('actions.saving') : t('actions.save')}
            </Button>
          </Stack>
        </Paper>

        <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast(null)}>
          <Alert severity="success" variant="filled" onClose={() => setToast(null)}>
            {toast}
          </Alert>
        </Snackbar>
      </Stack>
    </Panel>
  )
}