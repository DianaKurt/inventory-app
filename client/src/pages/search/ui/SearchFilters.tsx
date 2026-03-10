import {
  Button,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  alpha,
  Box,
} from '@mui/material'
import TuneRoundedIcon from '@mui/icons-material/TuneRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'
import Inventory2RoundedIcon from '@mui/icons-material/Inventory2Rounded'
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import AppsRoundedIcon from '@mui/icons-material/AppsRounded'
import { useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Panel from '@/shared/ui/Panel/Panel'

const CATEGORIES = ['Equipment', 'Furniture', 'Book', 'Other']

export default function SearchFilters() {
  const { t } = useTranslation('common')
  const [sp, setSp] = useSearchParams()

  const [q, setQ] = useState(sp.get('q') ?? '')
  const [type, setType] = useState(sp.get('type') ?? 'all')
  const [category, setCategory] = useState(sp.get('category') ?? '')
  const [sort, setSort] = useState(sp.get('sort') ?? 'updated')

  useEffect(() => {
    setQ(sp.get('q') ?? '')
    setType(sp.get('type') ?? 'all')
    setCategory(sp.get('category') ?? '')
    setSort(sp.get('sort') ?? 'updated')
  }, [sp])

  const apply = () => {
    const next = new URLSearchParams(sp)

    if (q.trim()) next.set('q', q.trim())
    else next.delete('q')

    if (type !== 'all') next.set('type', type)
    else next.delete('type')

    if (category) next.set('category', category)
    else next.delete('category')

    if (sort !== 'updated') next.set('sort', sort)
    else next.delete('sort')

    setSp(next)
  }

  const reset = () => {
    setQ('')
    setType('all')
    setCategory('')
    setSort('updated')
    setSp(new URLSearchParams())
  }

  return (
    <Panel>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <TextField
            label={t('search.search')}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && apply()}
            fullWidth
          />

          <TextField
            select
            label={t('table.category')}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">{t('search.all')}</MenuItem>
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c}>
                {t(`categories.${c}`, c)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label={t('search.sort')}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="updated">{t('search.sortUpdated')}</MenuItem>
            <MenuItem value="created">{t('search.sortCreated')}</MenuItem>
            <MenuItem value="title">{t('search.sortTitle')}</MenuItem>
          </TextField>
        </Stack>

        <ToggleButtonGroup
          value={type}
          exclusive
          onChange={(_, v) => v && setType(v)}
          size="small"
          sx={(theme) => ({
            flexWrap: 'wrap',
            gap: 1,
            '& .MuiToggleButtonGroup-grouped': {
              border: `1px solid ${alpha(theme.palette.text.primary, 0.1)} !important`,
              borderRadius: '999px !important',
              px: 1.4,
              textTransform: 'none',
              fontWeight: 700,
            },
          })}
        >
          <ToggleButton value="all">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AppsRoundedIcon fontSize="small" />
              {t('search.all')}
            </Box>
          </ToggleButton>

          <ToggleButton value="inventories">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Inventory2RoundedIcon fontSize="small" />
              {t('nav.inventories')}
            </Box>
          </ToggleButton>

          <ToggleButton value="items">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ListAltRoundedIcon fontSize="small" />
              {t('table.items')}
            </Box>
          </ToggleButton>
        </ToggleButtonGroup>

        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
          <Button
            variant="contained"
            onClick={apply}
            startIcon={<TuneRoundedIcon />}
            sx={(theme) => ({
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 800,
              px: 2.4,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 14px 30px rgba(0,0,0,0.16)',
              },
            })}
          >
            {t('search.applyFilters')}
          </Button>

          <Button
            variant="outlined"
            onClick={reset}
            startIcon={<RestartAltRoundedIcon />}
            sx={(theme) => ({
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 700,
              px: 2,
              borderColor: alpha(theme.palette.text.primary, 0.16),
              '&:hover': {
                backgroundColor: alpha(theme.palette.text.primary, 0.04),
                transform: 'translateY(-1px)',
              },
            })}
          >
            {t('search.reset')}
          </Button>
        </Stack>
      </Stack>
    </Panel>
  )
}